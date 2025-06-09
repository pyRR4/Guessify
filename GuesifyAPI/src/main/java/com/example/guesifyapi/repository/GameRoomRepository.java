package com.example.guesifyapi.repository;

import com.example.guesifyapi.entity.GameRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GameRoomRepository extends JpaRepository<GameRoom, Long> {
    Optional<GameRoom> findByRoomCode(String roomCode);
}
