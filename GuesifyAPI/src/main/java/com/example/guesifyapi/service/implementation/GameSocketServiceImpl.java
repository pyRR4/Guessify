package com.example.guesifyapi.service.implementation;

import com.example.guesifyapi.dto.PlayerAnswerDto;
import com.example.guesifyapi.dto.PlayerScoreDto;
import com.example.guesifyapi.entity.*;
import com.example.guesifyapi.entity.enums.GameStatus;
import com.example.guesifyapi.repository.*;
import com.example.guesifyapi.service.contract.GameSocketService;
import com.example.guesifyapi.service.contract.SpotifyAuthService;
import com.example.guesifyapi.service.contract.SpotifyPlayerService;
import com.example.guesifyapi.service.contract.SpotifyTrackService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GameSocketServiceImpl implements GameSocketService {

    private final SimpMessagingTemplate messagingTemplate;
    private final GameSongRepository gameSongRepository;
    private final GameRepository gameRepository;
    private final UserRepository userRepository;
    private final SpotifyAuthService spotifyAuthService;
    private final PlayerGameScoreRepository playerGameScoreRepository;
    private final SpotifyTrackService spotifyTrackService;
    private final SpotifyPlayerService spotifyPlayerService;
    private final PlayerRoundAnswerRepository playerRoundAnswerRepository;

    /**
     * Logika rozpoczynająca grę.
     * Zmienia status gry i powiadamia graczy przez WebSocket.
     */
    public void startGame(String roomCode, String playlistId) {
        log.info("Service: Starting game for room: {}", roomCode);

        // Znajdź grę lub rzuć wyjątek
        Game game = gameRepository.findByGameRoomCode(roomCode)
                .orElseThrow(() -> new IllegalArgumentException("Game not found for code: " + roomCode));

        // Walidacja statusu gry
        if (game.getGameStatus() != GameStatus.STARTING) {
            log.warn("Service: Attempted to start a game in room {} that is not in STARTING state. Current status: {}", roomCode, game.getGameStatus());
            return; // Zakończ, jeśli status jest nieprawidłowy
        }

        List<Song> randomSongs = spotifyTrackService.getRandomSongsFromPlaylist(playlistId, 10);

        List<GameSong> gameSongs = new ArrayList<>();
        for (int i = 0; i < randomSongs.size(); i++) {
            Song song = randomSongs.get(i);
            int roundNumber = i + 1; // Rundy numerujemy od 1
            GameSong gameSong = new GameSong(null, game, song, roundNumber);
            gameSongs.add(gameSong);
        }
        gameSongRepository.saveAll(gameSongs);
        game.setSongs(gameSongs);

        // 2. Przygotuj kolejkę na Spotify
        String accessToken = spotifyAuthService.getAccessToken(); // Potrzebujesz metody do uzyskania tokenu użytkownika

        List<String> songUris = randomSongs.stream()
                .map(song -> "spotify:track:" + song.getSpotifyTrackID())
                .collect(Collectors.toList());

        spotifyPlayerService.replaceQueueAndPause(songUris, accessToken);
        spotifyPlayerService.pausePlayback(accessToken);

        List<PlayerGameScore> initialScores = new ArrayList<>();
        for (RoomPlayer player : game.getGameRoom().getPlayers()) {
            PlayerGameScore newScore = new PlayerGameScore(game, player.getUser(), 0);
            newScore.setCurrentRoundNumber(1); // Każdy gracz zaczyna od rundy 1
            initialScores.add(newScore);
        }
        playerGameScoreRepository.saveAll(initialScores);
        log.info("Initialized score records for {} players in room {}.", initialScores.size(), roomCode);

        // Aktualizacja stanu gry
        game.setGameStatus(GameStatus.IN_PROGRESS);
        game.setStartTime(LocalDateTime.now());
        gameRepository.save(game);
        log.info("Service: Changed game status in room {} to IN_PROGRESS", roomCode);

        // Wysłanie wiadomości do graczy
        messagingTemplate.convertAndSend("/topic/game/" + roomCode, Map.of("type", "GAME_STARTED"));
        log.info("Service: Broadcasted GAME_STARTED to /topic/game/{}", roomCode);
    }

    public void submitAnswer(String roomCode, PlayerAnswerDto answerDto) {
        Game game = gameRepository.findByGameRoomCode(roomCode).orElseThrow(/*...*/);
        User player = userRepository.findById(answerDto.getUserId()).orElseThrow(/*...*/);

        PlayerGameScore playerScore = playerGameScoreRepository.findByGameAndPlayer(game, player)
                .orElseThrow(() -> new IllegalStateException("Player score record not found."));

        if (playerScore.getCurrentRoundNumber() != answerDto.getRoundNumber()) {
            log.warn("Player {} tried to submit answer for round {} but is on round {}",
                    player.getUsername(), answerDto.getRoundNumber(), playerScore.getCurrentRoundNumber());
            return; // Ignoruj zapytanie
        }

        GameSong currentGameSong = gameSongRepository.findByGameAndRoundNumber(game, answerDto.getRoundNumber())
                .orElseThrow(() -> new IllegalStateException("Song for round not found."));

        boolean isCorrect = currentGameSong.getSong().getTitle().equalsIgnoreCase(answerDto.getSubmittedAnswer());
        int pointsAwarded = 0;
        if (isCorrect) {
            pointsAwarded = 100;
            long timeBonus = Math.max(0, (15000 - answerDto.getTimeTakenMs()) / 100);
            pointsAwarded += timeBonus;
        }

        PlayerRoundAnswer roundAnswer = new PlayerRoundAnswer();
        roundAnswer.setPlayerGameScore(playerScore);
        roundAnswer.setGameSong(currentGameSong);
        roundAnswer.setSubmittedAnswer(answerDto.getSubmittedAnswer());
        roundAnswer.setCorrect(isCorrect);
        roundAnswer.setPointsAwarded(pointsAwarded);
        roundAnswer.setTimeTakenMs(answerDto.getTimeTakenMs());
        playerRoundAnswerRepository.save(roundAnswer);

        playerScore.setTotalScore(playerScore.getTotalScore() + pointsAwarded);
        playerScore.setCurrentRoundNumber(playerScore.getCurrentRoundNumber() + 1);
        playerGameScoreRepository.save(playerScore);

        checkAndFinishGame(game);
    }


    private void checkAndFinishGame(Game game) {
        long totalPlayers = game.getGameRoom().getPlayers().size();
        int totalRounds = game.getSongs().size();

        // Policz, ilu graczy ukończyło wszystkie rundy
        long playersFinished = playerGameScoreRepository.findAllByGame(game).stream()
                .filter(score -> score.getCurrentRoundNumber() > totalRounds)
                .count();

        if (playersFinished >= totalPlayers) {
            log.info("All players have finished the game in room {}. Finishing game.", game.getGameRoom().getRoomCode());
            game.setGameStatus(GameStatus.FINISHED);
            game.setEndTime(LocalDateTime.now());
            gameRepository.save(game);
            messagingTemplate.convertAndSend("/topic/game/" + game.getGameRoom().getRoomCode(), Map.of("type", "GAME_FINISHED"));
        }
    }

    public void skipSongForPlayer(String roomCode, String accessToken) {
        spotifyPlayerService.skipToNext(accessToken);
    }

    public void pauseSongForPlayer(String roomCode, String accessToken) {
        spotifyPlayerService.pausePlayback(accessToken);
    }
}
