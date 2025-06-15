package com.example.guesifyapi.repository;

import com.example.guesifyapi.entity.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;

public interface GameRepository extends JpaRepository<Game, Long> {
    
    @Query("SELECT g FROM Game g WHERE g.gameRoom.roomCode = :roomCode")
    Optional<Game> findByGameRoomCode(String roomCode);
}