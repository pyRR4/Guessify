package com.example.guesifyapi.repository;

import com.example.guesifyapi.entity.Game;
import com.example.guesifyapi.entity.GameSong;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GameSongRepository extends JpaRepository<GameSong, Long> {
    Optional<GameSong> findByGameAndRoundNumber(Game game, int roundNumber);
}
