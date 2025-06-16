package com.example.guesifyapi.controller;

import com.example.guesifyapi.dto.PlayerScoreDto;
import com.example.guesifyapi.service.contract.GameSocketService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/game")
public class GameSocketController {

    private final GameSocketService gameSocketService;

    /**
     * Odbiera żądanie rozpoczęcia gry i deleguje je do serwisu.
     */
    @MessageMapping("/game/start/{roomCode}")
    public void startGame(@DestinationVariable String roomCode) {
        log.info("Controller: Received request to start game for room: {}", roomCode);
        gameSocketService.startGame(roomCode);
    }

    /**
     * Odbiera wynik gracza i deleguje logikę zapisu do serwisu.
     */
    @MessageMapping("/game/submit-score/{roomCode}")
    public void submitScore(@DestinationVariable String roomCode, @Payload PlayerScoreDto scoreDto) {
        log.info("Controller: Received score from player (ID: {}) in room {}", scoreDto.getUserId(), roomCode);
        gameSocketService.submitScore(roomCode, scoreDto);
    }
}
