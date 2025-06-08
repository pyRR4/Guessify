package com.example.guesifyapi.entity;

import com.example.guesifyapi.entity.enums.GameMode;
import com.example.guesifyapi.entity.enums.SongSource;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

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

    @Column(name = "room_code", nullable = false, unique = true)
    private String roomCode;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(nullable = false, name = "host_id")
    private User host;

    @Column(name = "max_players", nullable = false)
    private Integer maxPlayers;

    @Enumerated(EnumType.STRING)
    @Column(name = "song_source", nullable = false)
    private SongSource songSource;

    @Enumerated(EnumType.STRING)
    @Column(name = "game_mode", nullable = false)
    private GameMode gameMode;

    @Column(name = "answer_time_seconds", nullable = false)
    private Double answerTimeSeconds;

    @Column(name = "rounds_number", nullable = false)
    private Integer roundsNumber;

    @Column(name = "playback_length_seconds", nullable = false)
    private Double playbackLength;

    @Column(name = "room_password_hash")
    private String roomPasswordHash;

    @OneToMany(mappedBy = "gameroom", cascade = CascadeType.MERGE)
    private Set<RoomPlayer> players;
}
