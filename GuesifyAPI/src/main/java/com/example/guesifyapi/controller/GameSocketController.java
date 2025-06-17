package com.example.guesifyapi.controller;

import com.example.guesifyapi.dto.PlayerAnswerDto;
import com.example.guesifyapi.dto.SpotifyActionPayloadDto;
import com.example.guesifyapi.dto.StartGamePayloadDto;
import com.example.guesifyapi.service.contract.GameSocketService;
import com.example.guesifyapi.service.contract.SpotifyPlayerService; // Potrzebny do akcji na playerze
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class GameSocketController {

    private final GameSocketService gameSocketService;
    // Potrzebujemy bezpośredniego dostępu do serwisu playera dla akcji play/pause/skip
    private final SpotifyPlayerService spotifyPlayerService;

    /**
     * Odbiera żądanie rozpoczęcia gry. ID playlisty jest teraz w payloadzie.
     */
    @MessageMapping("/game/start/{roomCode}")
    public void startGame(@DestinationVariable String roomCode, @Payload StartGamePayloadDto payload) {
        log.info("Controller: Received request to start game for room: {} with playlist: {}", roomCode, payload.getPlaylistId());
        gameSocketService.startGame(roomCode, payload.getPlaylistId());
    }

    /**
     * Odbiera odpowiedź gracza i deleguje logikę do serwisu.
     * Zmieniono nazwę endpointu i metody dla spójności.
     */
    @MessageMapping("/game/submit-answer/{roomCode}")
    public void submitAnswer(@DestinationVariable String roomCode, @Payload PlayerAnswerDto answerDto) {
        log.info("Controller: Received answer from player (ID: {}) in room {}", answerDto.getUserId(), roomCode);
        gameSocketService.submitAnswer(roomCode, answerDto);
    }

    // --- NOWE ENDPOINTY DO KONTROLI PLAYERA PRZEZ GRACZA ---

    /**
     * Uruchamia odtwarzanie dla gracza.
     */
    @MessageMapping("/game/play/{roomCode}")
    public void playSong(@DestinationVariable String roomCode, @Payload SpotifyActionPayloadDto payload) {
        log.info("Controller: Received request to PLAY for room {}", roomCode);
        spotifyPlayerService.startPlayback(payload.getAccessToken());
    }

    /**
     * Wstrzymuje odtwarzanie dla gracza.
     */
    @MessageMapping("/game/pause/{roomCode}")
    public void pauseSong(@DestinationVariable String roomCode, @Payload SpotifyActionPayloadDto payload) {
        log.info("Controller: Received request to PAUSE for room {}", roomCode);
        spotifyPlayerService.pausePlayback(payload.getAccessToken());
    }

    /**
     * Pomija utwór dla gracza (przechodzi do następnego w kolejce Spotify).
     */
    @MessageMapping("/game/skip/{roomCode}")
    public void skipSong(@DestinationVariable String roomCode, @Payload SpotifyActionPayloadDto payload) {
        log.info("Controller: Received request to SKIP for room {}", roomCode);
        spotifyPlayerService.skipToNext(payload.getAccessToken());
    }
}