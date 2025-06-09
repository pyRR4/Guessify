package com.example.guesifyapi.controller;

import com.example.guesifyapi.dto.CreateRoomRequest;
import com.example.guesifyapi.entity.GameRoom;
import com.example.guesifyapi.entity.RoomPlayer;
import com.example.guesifyapi.entity.User;
import com.example.guesifyapi.repository.GameRoomRepository;
import com.example.guesifyapi.repository.RoomPlayerRepository;
import com.example.guesifyapi.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final GameRoomRepository gameRoomRepository;

    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody CreateRoomRequest request) {
        Optional<User> optionalHost = userRepository.findById(request.getHostId());
        if (optionalHost.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid host user ID");
        }

        GameRoom room = new GameRoom();
        room.setRoomCode(generateRoomCode());
        room.setHost(optionalHost.get());
        room.setMaxPlayers(request.getMaxPlayers());
        room.setSongSource(request.getSongSource());
        room.setGameMode(request.getGameMode());
        room.setAnswerTimeSeconds(request.getAnswerTimeSeconds());
        room.setRoundsNumber(request.getRoundsNumber());
        room.setPlaybackLength(request.getPlaybackLength());
        room.setRoomPasswordHash(request.getRoomPasswordHash());

        GameRoom saved = gameRoomRepository.save(room);
        return ResponseEntity.ok(saved);
    }


    private String generateRoomCode() {
        return UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }

    private final UserRepository userRepository;
    private final RoomPlayerRepository roomPlayerRepository;

    @PostMapping("/{roomCode}/join")
    public ResponseEntity<?> joinRoom(@PathVariable String roomCode, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not logged in");
        }

        Optional<GameRoom> optionalRoom = gameRoomRepository.findByRoomCode(roomCode);
        if (optionalRoom.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found");
        }

        GameRoom room = optionalRoom.get();
        User user = userRepository.findById(userId).orElseThrow();

        boolean alreadyInRoom = room.getPlayers().stream()
                .anyMatch(rp -> rp.getUser().getId().equals(userId));

        if (alreadyInRoom) {
            return ResponseEntity.ok("User already in the room");
        }

        RoomPlayer roomPlayer = new RoomPlayer();
        roomPlayer.setGameroom(room);
        roomPlayer.setUser(user);

        room.getPlayers().add(roomPlayer);
        gameRoomRepository.save(room);

        return ResponseEntity.ok("User joined the room");
    }

}

