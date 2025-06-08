package com.example.guesifyapi.repository;

import com.example.guesifyapi.entity.GameSong;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameSongRepository extends JpaRepository<GameSong, Long> {
}
