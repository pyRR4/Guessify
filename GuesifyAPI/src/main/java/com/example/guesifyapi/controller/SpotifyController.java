package com.example.guesifyapi.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/api/spotify")
@Slf4j
public class SpotifyController {

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Pobiera listę utworów z podanej playlisty Spotify.
     *
     * @param id ID playlisty Spotify
     * @param access_token Access token użytkownika uzyskany z autoryzacji Spotify (OAuth)
     * @return Lista uproszczonych informacji o utworach (tytuł, wykonawca, link (niestety null))
     *
     */
    @GetMapping("/playlist")
    public ResponseEntity<?> getPlaylistTracks(@RequestParam String id, @RequestParam String access_token) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + access_token);

        HttpEntity<Void> request = new HttpEntity<>(headers);
        String url = "https://api.spotify.com/v1/playlists/" + id + "/tracks";

        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, request, Map.class);
        List<Map<String, Object>> items = (List<Map<String, Object>>) response.getBody().get("items");

        List<Map<String, String>> simplifiedTracks = new ArrayList<>();
        for (Map<String, Object> item : items) {
            Map<String, Object> track = (Map<String, Object>) item.get("track");
            String name = (String) track.get("name");
            String previewUrl = (String) track.get("preview_url");
            List<Map<String, String>> artists = (List<Map<String, String>>) track.get("artists");
            String artistName = artists.get(0).get("name");

            Map<String, String> song = new HashMap<>();
            song.put("title", name);
            song.put("artist", artistName);
            song.put("preview_url", previewUrl);
            simplifiedTracks.add(song);
        }

        return ResponseEntity.ok(simplifiedTracks);
    }

    /**
     * Pobiera listę playlist aktualnie zalogowanego użytkownika Spotify.
     *
     * @param access_token Access token użytkownika uzyskany z autoryzacji Spotify (OAuth)
     * @return Lista uproszczonych informacji o playlistach (id, nazwa)
     *
     */
    @GetMapping("/playlists")
    public ResponseEntity<?> getUserPlaylists(@RequestParam String access_token) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + access_token);

        HttpEntity<Void> request = new HttpEntity<>(headers);
        String url = "https://api.spotify.com/v1/me/playlists";

        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, request, Map.class);

        List<Map<String, Object>> items = (List<Map<String, Object>>) response.getBody().get("items");

        List<Map<String, String>> simplifiedPlaylists = new ArrayList<>();
        for (Map<String, Object> item : items) {
            Map<String, String> simplified = new HashMap<>();
            simplified.put("id", (String) item.get("id"));
            simplified.put("name", (String) item.get("name"));
            simplifiedPlaylists.add(simplified);
        }

        return ResponseEntity.ok(simplifiedPlaylists);
    }

    @GetMapping("/players-songs")
    public ResponseEntity<?> getSongsFromAllPlayers(@RequestParam String roomCode) {
        Optional<GameRoom> optionalRoom = gameRoomRepository.findByRoomCode(roomCode);
        if (optionalRoom.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found");
        }

        Set<RoomPlayer> players = optionalRoom.get().getPlayers();

        List<Map<String, String>> allSongs = new ArrayList<>();

        for (RoomPlayer rp : players) {
            User user = rp.getUser();
            String token = user.getAccessToken(); // zakładamy, że masz to zapisane

            // 1. Pobierz playlisty
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + token);
            HttpEntity<Void> request = new HttpEntity<>(headers);

            ResponseEntity<Map> playlistResp = restTemplate.exchange(
                    "https://api.spotify.com/v1/me/playlists", HttpMethod.GET, request, Map.class);
            List<Map<String, Object>> playlists = (List<Map<String, Object>>) playlistResp.getBody().get("items");

            for (Map<String, Object> playlist : playlists) {
                String playlistId = (String) playlist.get("id");

                ResponseEntity<Map> tracksResp = restTemplate.exchange(
                        "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks", HttpMethod.GET, request, Map.class);
                List<Map<String, Object>> items = (List<Map<String, Object>>) tracksResp.getBody().get("items");

                for (Map<String, Object> item : items) {
                    Map<String, Object> track = (Map<String, Object>) item.get("track");
                    String name = (String) track.get("name");
                    String previewUrl = (String) track.get("preview_url");
                    List<Map<String, String>> artists = (List<Map<String, String>>) track.get("artists");
                    String artistName = artists.get(0).get("name");

                    if (previewUrl != null) {
                        Map<String, String> song = new HashMap<>();
                        song.put("title", name);
                        song.put("artist", artistName);
                        song.put("preview_url", previewUrl);
                        allSongs.add(song);
                    }
                }
            }
        }

        // Shuffle and limit
        Collections.shuffle(allSongs);
        return ResponseEntity.ok(allSongs);
    }

}
