package com.example.guesifyapi.repository;

import com.example.guesifyapi.entity.Song;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SongRepository extends JpaRepository<Song, Long> {
}
