package com.example.guesifyapi.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "songs"
)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Song {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "spotify_track_id", nullable = false, unique = true)
    private String spotifyTrackID;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String artist;

    @Column(name = "album_cover_url")
    private String albumCoverUrl;

    @Column(name = "song_url", nullable = false)
    private String songUrl;
}
