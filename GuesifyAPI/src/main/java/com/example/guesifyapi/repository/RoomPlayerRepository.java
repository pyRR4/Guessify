package com.example.guesifyapi.repository;

import com.example.guesifyapi.entity.RoomPlayer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomPlayerRepository extends JpaRepository<RoomPlayer, Long> {
}
