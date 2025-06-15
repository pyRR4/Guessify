package com.example.guesifyapi.service.contract;

import com.example.guesifyapi.dto.LeaderboardEntryDto;
import com.example.guesifyapi.dto.PlayerScoreDto;

import java.util.List;

public interface GameService {
    void startGame(String roomCode);
    void submitScore(String roomCode, PlayerScoreDto scoreDto);
    List<LeaderboardEntryDto> getLeaderboard(String roomCode);
}
