package com.example.guesifyapi.controller;

import com.example.guesifyapi.dto.SongDto;
import com.example.guesifyapi.entity.Song;
import com.example.guesifyapi.service.contract.SpotifyTrackService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/spotify/tracks")
@AllArgsConstructor
public class SpotifyTrackController {

    private final SpotifyTrackService spotifyTrackService;

    /**
     * Pobiera losowe piosenki z playlisty Spotify i zapisuje je w bazie (jeśli nie istnieją).
     *
     * @param playlistId id playlisty Spotify (np. 37i9dQZF1DXcBWIGoYBM5M)
     * @param count liczba piosenek do pobrania
     * @return lista zapisanych lub istniejących piosenek
     */
    @GetMapping("/random-tracks")
    public ResponseEntity<List<SongDto>> getRandomSongsFromPlaylist(
            @RequestParam String playlistId,
            @RequestParam(defaultValue = "5") int count) {

        List<SongDto> songs = spotifyTrackService.getRandomSongsFromPlaylist(playlistId, count);

        return ResponseEntity.ok(songs);
    }
}
