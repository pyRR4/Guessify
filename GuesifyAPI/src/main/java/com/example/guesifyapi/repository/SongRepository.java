package com.example.guesifyapi.repository;

import com.example.guesifyapi.entity.Song;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SongRepository extends JpaRepository<Song, Long> {
    Optional<Song> findBySpotifyTrackID(String spotifyTrackID);
}
