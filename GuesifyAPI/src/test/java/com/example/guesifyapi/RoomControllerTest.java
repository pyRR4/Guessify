package com.example.guesifyapi;

import com.example.guesifyapi.controller.RoomController;
import com.example.guesifyapi.entity.GameRoom;
import com.example.guesifyapi.entity.RoomPlayer;
import com.example.guesifyapi.entity.User;
import com.example.guesifyapi.repository.GameRoomRepository;
import com.example.guesifyapi.repository.RoomPlayerRepository;
import com.example.guesifyapi.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

import java.util.Collections;
import java.util.HashSet;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RoomController.class)
@Import(RoomControllerTest.MockConfig.class)
class RoomControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private GameRoomRepository gameRoomRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoomPlayerRepository roomPlayerRepository;

    private final String testRoomCode = "ROOM01";

    private GameRoom testRoom;
    private User testUser;

    @TestConfiguration
    static class MockConfig {
        @Bean
        public GameRoomRepository gameRoomRepository() {
            return Mockito.mock(GameRoomRepository.class);
        }

        @Bean
        public UserRepository userRepository() {
            return Mockito.mock(UserRepository.class);
        }

        @Bean
        public RoomPlayerRepository roomPlayerRepository() {
            return Mockito.mock(RoomPlayerRepository.class);
        }
    }

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("TestUser");

        testRoom = new GameRoom();
        testRoom.setId(100L);
        testRoom.setRoomCode(testRoomCode);
        testRoom.setPlayers(new HashSet<>());
        testRoom.setHost(testUser);
        testRoom.setMaxPlayers(10);
        testRoom.setGameMode(com.example.guesifyapi.entity.enums.GameMode.GUESS_THE_TITLE);
        testRoom.setSongSource(com.example.guesifyapi.entity.enums.SongSource.SPOTIFY);
        testRoom.setAnswerTimeSeconds(15.0);
        testRoom.setRoundsNumber(5);
        testRoom.setPlaybackLength(10.0);

        Mockito.when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        Mockito.when(gameRoomRepository.save(any(GameRoom.class))).thenReturn(testRoom);
        Mockito.when(gameRoomRepository.findByRoomCode(eq(testRoomCode))).thenReturn(Optional.of(testRoom));
    }


    @Test
    void createRoom_shouldReturnNewRoom() throws Exception {
        String requestJson = """
    {
      "hostId": 1,
      "maxPlayers": 5,
      "songSource": "SPOTIFY",
      "gameMode": "GUESS_THE_TITLE",
      "answerTimeSeconds": 15.0,
      "roundsNumber": 5,
      "playbackLength": 10.0,
      "roomPasswordHash": null
    }
    """;

        mockMvc.perform(post("/api/rooms")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.roomCode").value(testRoomCode))
                .andExpect(jsonPath("$.id").value(100))
                .andExpect(jsonPath("$.host.username").value("TestUser"));
    }

    @Test
    void joinRoom_shouldAddUserToRoom() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("userId", 1L);

        mockMvc.perform(post("/api/rooms/" + testRoomCode + "/join")
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("User joined the room"));
    }

    @Test
    void joinRoom_shouldReturnUnauthorizedIfNotLoggedIn() throws Exception {
        mockMvc.perform(post("/api/rooms/" + testRoomCode + "/join")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("User not logged in"));
    }
}
