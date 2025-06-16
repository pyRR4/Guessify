package com.example.guesifyapi.service.implementation;

import com.example.guesifyapi.dto.LeaderboardEntryDto;
import com.example.guesifyapi.dto.PlayerScoreDto;
import com.example.guesifyapi.entity.Game;
import com.example.guesifyapi.entity.PlayerGameScore;
import com.example.guesifyapi.entity.User;
import com.example.guesifyapi.entity.enums.GameStatus;
import com.example.guesifyapi.repository.GameRepository;
import com.example.guesifyapi.repository.PlayerGameScoreRepository;
import com.example.guesifyapi.repository.UserRepository;
import com.example.guesifyapi.service.contract.GameService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GameServiceImpl implements GameService {

    private final PlayerGameScoreRepository playerGameScoreRepository;

    @Override
    public List<LeaderboardEntryDto> getLeaderboard(String roomCode) {
        List<PlayerGameScore> scores = playerGameScoreRepository.findByGame_GameRoom_RoomCodeOrderByTotalScoreDesc(roomCode);

        return scores.stream()
                .map(score -> new LeaderboardEntryDto(
                        score.getPlayer().getUsername(),
                        score.getTotalScore()
                ))
                .collect(Collectors.toList());
    }
}
