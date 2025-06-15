package com.example.guesifyapi.controller;

import com.example.guesifyapi.dto.PlayerScoreDto;
import com.example.guesifyapi.entity.Game;
import com.example.guesifyapi.entity.PlayerGameScore;
import com.example.guesifyapi.entity.User;
import com.example.guesifyapi.entity.enums.GameStatus;
import com.example.guesifyapi.repository.GameRepository;
import com.example.guesifyapi.repository.PlayerGameScoreRepository;
import com.example.guesifyapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@Slf4j
public class GameSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final PlayerGameScoreRepository playerGameScoreRepository;
    private final GameRepository gameRepository;
    private final UserRepository userRepository;

    @MessageMapping("/game/start/{roomCode}")
    @Transactional
    public void startGame(@DestinationVariable String roomCode) {
        log.info("Received request to start game for room: {}", roomCode);

        Game game = gameRepository.findByGameRoomCode(roomCode)
                .orElseThrow(() -> new IllegalArgumentException("Game not found for code: " + roomCode));

        if (game.getGameStatus() != GameStatus.STARTING) {
            log.warn("Attempted to start a game in room {} that is not in STARTING state. Current status: {}", roomCode, game.getGameStatus());
            return;
        }

        game.setGameStatus(GameStatus.IN_PROGRESS);
        game.setStartTime(LocalDateTime.now());
        gameRepository.save(game);
        log.info("Changed game status in room {} to IN_PROGRESS", roomCode);

        messagingTemplate.convertAndSend("/topic/game/" + roomCode, Map.of("type", "GAME_STARTED"));
        log.info("Broadcasted GAME_STARTED to /topic/game/{}", roomCode);
    }

    @MessageMapping("/game/submit-score/{roomCode}")
    @Transactional
    public void submitScore(@DestinationVariable String roomCode, @Payload PlayerScoreDto scoreDto) {
        log.info("Received score from player (ID: {}) in room {}: {} points", scoreDto.getUserId(), roomCode, scoreDto.getScore());

        Game game = gameRepository.findByGameRoomCode(roomCode)
                .orElseThrow(() -> new IllegalArgumentException("Game not found for code: " + roomCode));

        User player = userRepository.findById(scoreDto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + scoreDto.getUserId()));

        PlayerGameScore newScore = new PlayerGameScore(game, player, scoreDto.getScore());
        playerGameScoreRepository.save(newScore);

        log.info("Saved score for player '{}' in game '{}'.", player.getUsername(), game.getGameRoom().getRoomCode());

        long totalPlayers = game.getGameRoom().getPlayers().size();
        long scoresSubmitted = playerGameScoreRepository.countByGame(game);

        log.info("Room {}: Submitted {} of {} scores.", roomCode, scoresSubmitted, totalPlayers);

        if (scoresSubmitted >= totalPlayers) {
            log.info("All players in room {} have submitted their scores. Finishing the game.", roomCode);

            game.setGameStatus(GameStatus.FINISHED);
            game.setEndTime(LocalDateTime.now());
            gameRepository.save(game);

            messagingTemplate.convertAndSend("/topic/game/" + roomCode, Map.of("type", "ALL_SCORES_SUBMITTED"));
            log.info("Broadcasted ALL_SCORES_SUBMITTED to /topic/game/{}", roomCode);
        }
    }
}
