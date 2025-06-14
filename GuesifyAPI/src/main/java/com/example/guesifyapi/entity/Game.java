package com.example.guesifyapi.entity;

import com.example.guesifyapi.entity.enums.GameStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(
        name = "games"
)
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(
            name = "game_room_id",
            foreignKey = @ForeignKey(name = "fk_game_game_room")
    )
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private GameRoom gameRoom;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "game_status"
    )
    private GameStatus gameStatus;

    @Column(
            name = "start_time",
            nullable = false
    )
    private LocalDateTime startTime;

    @Column(
            name = "end_time"
    )
    private LocalDateTime endTime;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(
            name = "winner_id",
            foreignKey = @ForeignKey(name = "fk_game_winner")
    )
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private User winner;

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GameSong> songs;

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PlayerGameScore> scores;
}
