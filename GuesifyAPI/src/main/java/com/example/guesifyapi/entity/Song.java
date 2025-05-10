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
    @Column(nullable = false)
    private Long spotifySongID;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String artist;

    @Column
    private String albumCoverUrl;

    @Column(nullable = false)
    private String songUrl;
}
