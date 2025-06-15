package com.example.guesifyapi.service.contract;

import com.example.guesifyapi.dto.PlayerScoreDto;

public interface GameSocketService {
    void startGame(String roomCode);
    void submitScore(String roomCode, PlayerScoreDto scoreDto);
}
