package com.example.guesifyapi.entity;

import com.example.guesifyapi.entity.enums.GameMode;
import com.example.guesifyapi.entity.enums.SongSource;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "game_rooms"
)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class GameRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @JoinColumn(nullable = false)
    private Long hostId;

    @Column(nullable = false)
    private Integer maxPlayers;

    @Column(nullable = false)
    private Integer players;

    @Column(nullable = false)
    private SongSource songSource;

    @Column(nullable = false)
    private GameMode gameMode;

    @Column(nullable = false)
    private Integer answerTime;

    @Column(nullable = false)
    private Integer roundsNumber;

    @Column(nullable = false)
    private Integer playbackLength;

    @Column
    private String roomPassword;
}
