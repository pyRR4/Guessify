package com.example.guesifyapi.service.contract;

import com.example.guesifyapi.dto.LeaderboardEntryDto;

import java.util.List;

public interface GameService {
    List<LeaderboardEntryDto> getLeaderboard(String roomCode);
}
