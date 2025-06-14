package com.example.guesifyapi.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "room_players"
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomPlayer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(nullable = false, name = "gameroom_id")
    private GameRoom gameroom;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(nullable = false, name = "user_id")
    private User user;

    @Column(name = "joined_at", nullable = false)
    private LocalDateTime joinedAt;
}
