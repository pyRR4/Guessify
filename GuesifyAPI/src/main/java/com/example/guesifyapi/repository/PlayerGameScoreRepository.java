package com.example.guesifyapi.repository;

import com.example.guesifyapi.entity.Game;
import com.example.guesifyapi.entity.PlayerGameScore;
import com.example.guesifyapi.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PlayerGameScoreRepository extends JpaRepository<PlayerGameScore, Long> {
    List<PlayerGameScore> findByGame_GameRoom_RoomCodeOrderByTotalScoreDesc(String roomCode);
    Optional<PlayerGameScore> findByGameAndPlayer(Game game, User player);
    List<PlayerGameScore> findAllByGame(Game game);
}