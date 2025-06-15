package com.example.guesifyapi.service.implementation;

import com.example.guesifyapi.dto.PlayerScoreDto;
import com.example.guesifyapi.entity.Game;
import com.example.guesifyapi.entity.PlayerGameScore;
import com.example.guesifyapi.entity.User;
import com.example.guesifyapi.entity.enums.GameStatus;
import com.example.guesifyapi.repository.GameRepository;
import com.example.guesifyapi.repository.PlayerGameScoreRepository;
import com.example.guesifyapi.repository.UserRepository;
import com.example.guesifyapi.service.contract.GameSocketService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class GameSocketServiceImpl implements GameSocketService {

    private final SimpMessagingTemplate messagingTemplate;
    private final GameRepository gameRepository;
    private final UserRepository userRepository;
    private final PlayerGameScoreRepository playerGameScoreRepository;

    /**
     * Logika rozpoczynająca grę.
     * Zmienia status gry i powiadamia graczy przez WebSocket.
     */
    public void startGame(String roomCode) {
        log.info("Service: Starting game for room: {}", roomCode);

        // Znajdź grę lub rzuć wyjątek
        Game game = gameRepository.findByGameRoomCode(roomCode)
                .orElseThrow(() -> new IllegalArgumentException("Game not found for code: " + roomCode));

        // Walidacja statusu gry
        if (game.getGameStatus() != GameStatus.STARTING) {
            log.warn("Service: Attempted to start a game in room {} that is not in STARTING state. Current status: {}", roomCode, game.getGameStatus());
            return; // Zakończ, jeśli status jest nieprawidłowy
        }

        // Aktualizacja stanu gry
        game.setGameStatus(GameStatus.IN_PROGRESS);
        game.setStartTime(LocalDateTime.now());
        gameRepository.save(game);
        log.info("Service: Changed game status in room {} to IN_PROGRESS", roomCode);

        // Wysłanie wiadomości do graczy
        messagingTemplate.convertAndSend("/topic/game/" + roomCode, Map.of("type", "GAME_STARTED"));
        log.info("Service: Broadcasted GAME_STARTED to /topic/game/{}", roomCode);
    }

    /**
     * Logika zapisywania wyniku gracza.
     * Jeśli wszyscy gracze prześlą wynik, kończy grę i powiadamia graczy.
     */
    public void submitScore(String roomCode, PlayerScoreDto scoreDto) {
        log.info("Service: Received score from player (ID: {}) in room {}: {} points", scoreDto.getUserId(), roomCode, scoreDto.getScore());

        Game game = gameRepository.findByGameRoomCode(roomCode)
                .orElseThrow(() -> new IllegalArgumentException("Game not found for code: " + roomCode));

        User player = userRepository.findById(scoreDto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + scoreDto.getUserId()));

        // Zapisz nowy wynik
        PlayerGameScore newScore = new PlayerGameScore(game, player, scoreDto.getScore());
        playerGameScoreRepository.save(newScore);
        log.info("Service: Saved score for player '{}' in game '{}'.", player.getUsername(), game.getGameRoom().getRoomCode());

        // Sprawdź, czy wszyscy gracze przesłali wyniki
        long totalPlayers = game.getGameRoom().getPlayers().size();
        long scoresSubmitted = playerGameScoreRepository.countByGame(game);
        log.info("Service: Room {}: Submitted {} of {} scores.", roomCode, scoresSubmitted, totalPlayers);

        if (scoresSubmitted >= totalPlayers) {
            log.info("Service: All players in room {} have submitted their scores. Finishing the game.", roomCode);

            // Zakończ grę
            game.setGameStatus(GameStatus.FINISHED);
            game.setEndTime(LocalDateTime.now());
            gameRepository.save(game);

            // Powiadom graczy
            messagingTemplate.convertAndSend("/topic/game/" + roomCode, Map.of("type", "ALL_SCORES_SUBMITTED"));
            log.info("Service: Broadcasted ALL_SCORES_SUBMITTED to /topic/game/{}", roomCode);
        }
    }
}
