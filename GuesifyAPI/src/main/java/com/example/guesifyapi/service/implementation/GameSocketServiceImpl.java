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

        // 1. Pobierz grę
        Game game = gameRepository.findByGameRoomCode(roomCode)
                .orElseThrow(() -> new IllegalArgumentException("Game not found for code: " + roomCode));

        if (game.getGameStatus() != GameStatus.STARTING) {
            log.warn("Service: Attempted to start a game in room {} that is not in STARTING state. Current status: {}", roomCode, game.getGameStatus());
            return;
        }

        // 2. Wylosuj piosenki
        List<Song> randomSongs = spotifyTrackService.getRandomSongsFromPlaylist(playlistId, 10);
        List<GameSong> gameSongs = new ArrayList<>();
        for (int i = 0; i < randomSongs.size(); i++) {
            gameSongs.add(new GameSong(null, game, randomSongs.get(i), i + 1));
        }
        gameSongRepository.saveAll(gameSongs);
        game.setSongs(gameSongs);

        // 3. Inicjalizacja wyników graczy
        List<PlayerGameScore> initialScores = new ArrayList<>();
        for (RoomPlayer player : game.getGameRoom().getPlayers()) {
            PlayerGameScore score = new PlayerGameScore(game, player.getUser(), 0);
            score.setCurrentRoundNumber(1);
            initialScores.add(score);
        }
        playerGameScoreRepository.saveAll(initialScores);
        log.info("Initialized score records for {} players in room {}.", initialScores.size(), roomCode);

        // 4. Ustaw status gry i zapisz
        game.setGameStatus(GameStatus.IN_PROGRESS);
        game.setStartTime(LocalDateTime.now());
        gameRepository.save(game);

        // 5. Wyślij pierwszą piosenkę do odtworzenia
        GameSong firstRound = gameSongs.get(0);
        String trackUri = "spotify:track:" + firstRound.getSong().getSpotifyTrackID();

        messagingTemplate.convertAndSend("/topic/game/" + roomCode, Map.of(
                "type", "ROUND_START",
                "roundNumber", 1,
                "trackUri", trackUri
        ));

        log.info("Broadcasted ROUND_START for room {} with track {}", roomCode, trackUri);
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

        /*
        long totalPlayers = game.getGameRoom().getPlayers().size();
        int round = answerDto.getRoundNumber();

        long finishedCurrentRound = playerGameScoreRepository.findAllByGame(game).stream()
            .filter(score -> score.getCurrentRoundNumber() > round)
            .count();

        if (finishedCurrentRound == totalPlayers) {
            GameSong nextSong = gameSongRepository.findByGameAndRoundNumber(game, round + 1)
                .orElse(null);

            if (nextSong != null) {
                messagingTemplate.convertAndSend(
                    "/topic/game/" + game.getGameRoom().getRoomCode(),
                    Map.of(
                        "type", "ROUND_START",
                        "roundNumber", round + 1,
                        "trackUri", "spotify:track:" + nextSong.getSong().getSpotifyTrackID()
                    )
                );
            }
        }*/

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
