package com.example.guesifyapi.entity;


import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "player_round_answers"
)
public class PlayerRoundAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "player_game_score")
    private PlayerGameScore playerGameScore;

    @ManyToOne
    @JoinColumn(name = "game_song")
    private GameSong gameSong;

    @Column()
    private String submittedAnswer;

    @Column
    private boolean correct;

    @Column
    private Integer pointsAwarded;

    @Column
    private Long timeTakenMs;

    @Column
    private LocalDateTime answeredAt;
}
