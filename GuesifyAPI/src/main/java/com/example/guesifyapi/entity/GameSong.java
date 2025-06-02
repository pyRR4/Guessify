package com.example.guesifyapi.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(
        name = "game_songs"
)
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class GameSong {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(
            name = "game_id",
            foreignKey = @ForeignKey(name = "fk_game_song_game"),
            nullable = false
    )
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Game game;

    @ManyToOne
    @JoinColumn(
            name = "song_id",
            foreignKey = @ForeignKey(name = "fk_game_song_song"),
            nullable = false
    )
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Song song;

    @Column(
            name = "round_number",
            nullable = false
    )
    private Integer roundNumber;
}
