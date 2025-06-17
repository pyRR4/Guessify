package com.example.guesifyapi.service.contract;

import com.example.guesifyapi.dto.PlayerAnswerDto;

public interface GameSocketService {

    /**
     * Przygotowuje i rozpoczyna grę dla danego pokoju. Inicjalizuje stan dla wszystkich graczy.
     * @param roomCode Kod pokoju gry.
     * @param playlistId ID playlisty Spotify do użycia w grze.
     */
    void startGame(String roomCode, String playlistId);

    /**
     * Przetwarza odpowiedź gracza, oblicza punkty i aktualizuje jego indywidualny postęp w grze.
     * @param roomCode Kod pokoju gry.
     * @param answerDto DTO z odpowiedzią gracza i numerem rundy.
     */
    void submitAnswer(String roomCode, PlayerAnswerDto answerDto);

    /**
     * Wywołuje akcję pominięcia utworu w odtwarzaczu Spotify gracza.
     * @param roomCode Kod pokoju (dla kontekstu/logów).
     * @param accessToken Token dostępowy gracza do API Spotify.
     */
    void skipSongForPlayer(String roomCode, String accessToken);

    /**
     * Wywołuje akcję wstrzymania odtwarzania w odtwarzaczu Spotify gracza.
     * @param roomCode Kod pokoju (dla kontekstu/logów).
     * @param accessToken Token dostępowy gracza do API Spotify.
     */
    void pauseSongForPlayer(String roomCode, String accessToken);
}