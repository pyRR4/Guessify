package com.example.guesifyapi.entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(
        name = "player_game_scores",
        uniqueConstraints = @UniqueConstraint(columnNames = {"game_id", "player_id"})
)
public class PlayerGameScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "player_id", nullable = false)
    private User player;

    @Column(name = "total_score")
    private Integer totalScore = 0;

    @OneToMany(mappedBy = "playerGameScore")
    private List<PlayerRoundAnswer> roundAnswers;
}
