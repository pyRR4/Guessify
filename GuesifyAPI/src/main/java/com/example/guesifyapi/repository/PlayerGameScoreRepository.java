package com.example.guesifyapi.repository;

import com.example.guesifyapi.entity.Game;
import com.example.guesifyapi.entity.PlayerGameScore;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PlayerGameScoreRepository extends JpaRepository<PlayerGameScore, Long> {
    List<PlayerGameScore> findByGameRoomCode(String roomCode);
    
    /**
     * Zlicza, ile wyników zostało zapisanych dla danej instancji gry.
     * @param game Encja gry.
     * @return Liczba zapisanych wyników.
     */
    long countByGame(Game game);
}