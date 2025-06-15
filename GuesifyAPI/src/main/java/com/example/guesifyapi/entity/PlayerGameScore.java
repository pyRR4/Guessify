package com.example.guesifyapi.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(
        name = "player_game_scores",
        uniqueConstraints = @UniqueConstraint(columnNames = {"game_id", "player_id"})
)
@Getter
@Setter
@NoArgsConstructor
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
    
    /**
     * @param game Encja gry, do której przypisany jest wynik.
     * @param player Encja gracza, który uzyskał wynik.
     * @param totalScore Uzyskany wynik.
     */
    public PlayerGameScore(Game game, User player, Integer totalScore) {
        this.game = game;
        this.player = player;
        this.totalScore = totalScore;
    }
}