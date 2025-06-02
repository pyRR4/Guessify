package com.example.guesifyapi.repository;

import com.example.guesifyapi.entity.PlayerGameScore;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlayerGameScoreRepository extends JpaRepository<PlayerGameScore, Long> {
}
