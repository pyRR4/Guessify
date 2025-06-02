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

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "player_game_score_id", nullable = false)
    private PlayerGameScore playerGameScore;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "game_song_id", nullable = false)
    private GameSong gameSong;

    @Column(name = "submitted_answer", nullable = false)
    private String submittedAnswer;

    @Column(nullable = false)
    private boolean correct;

    @Column(name = "points_awarded", nullable = false)
    private Integer pointsAwarded;

    @Column(name = "time_taken_ms", nullable = false)
    private Long timeTakenMs;

    @Column(name = "answered_at", nullable = false)
    private LocalDateTime answeredAt;
}
