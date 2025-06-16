package com.example.guesifyapi.controller;

import com.example.guesifyapi.dto.LeaderboardEntryDto;
import com.example.guesifyapi.service.contract.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/game")
@RequiredArgsConstructor
public class GameController {

    private final GameService gameService;

    @GetMapping("/leaderboard")
    public ResponseEntity<List<LeaderboardEntryDto>> getLeaderboard(@RequestParam String roomCode) {
        List<LeaderboardEntryDto> leaderboard = gameService.getLeaderboard(roomCode);
        return ResponseEntity.ok(leaderboard);
    }
}
