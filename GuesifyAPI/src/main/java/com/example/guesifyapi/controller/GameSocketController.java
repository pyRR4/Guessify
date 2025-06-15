package com.example.guesifyapi.controller;

import com.example.guesifyapi.dto.LeaderboardEntryDto;
import com.example.guesifyapi.dto.PlayerScoreDto;
import com.example.guesifyapi.service.contract.GameService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/game")
public class GameSocketController {

    private final GameService gameService;

    /**
     * Odbiera żądanie rozpoczęcia gry i deleguje je do serwisu.
     */
    @MessageMapping("/game/start/{roomCode}")
    public void startGame(@DestinationVariable String roomCode) {
        log.info("Controller: Received request to start game for room: {}", roomCode);
        gameService.startGame(roomCode);
    }

    /**
     * Odbiera wynik gracza i deleguje logikę zapisu do serwisu.
     */
    @MessageMapping("/game/submit-score/{roomCode}")
    public void submitScore(@DestinationVariable String roomCode, @Payload PlayerScoreDto scoreDto) {
        log.info("Controller: Received score from player (ID: {}) in room {}", scoreDto.getUserId(), roomCode);
        gameService.submitScore(roomCode, scoreDto);
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<LeaderboardEntryDto>> getLeaderboard(@RequestParam String roomCode) {
        List<LeaderboardEntryDto> leaderboard = gameService.getLeaderboard(roomCode);
        return ResponseEntity.ok(leaderboard);
    }
}
