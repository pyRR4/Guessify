package com.example.guesifyapi.entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(
        name = "user_game_scores"
)
public class PlayerGameScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn
    private Game game;

    @ManyToOne
    @JoinColumn
    private User player;

    @Column
    private Integer totalScore;

    @OneToMany(mappedBy = "")
    private List<PlayerRoundAnswer> roundAnswers;
}
