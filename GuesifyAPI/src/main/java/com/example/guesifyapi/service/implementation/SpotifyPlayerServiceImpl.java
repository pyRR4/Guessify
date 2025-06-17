package com.example.guesifyapi.service.implementation;

import com.example.guesifyapi.service.contract.SpotifyPlayerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class SpotifyPlayerServiceImpl implements SpotifyPlayerService {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String SPOTIFY_API_URL = "https://api.spotify.com/v1";

    private HttpHeaders createAuthHeaders(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    @Override
    public void replaceQueueAndPause(List<String> songUris, String accessToken) {
        String playUrl = SPOTIFY_API_URL + "/me/player/play";
        HttpHeaders headers = createAuthHeaders(accessToken);

        Map<String, List<String>> requestBody = Map.of("uris", songUris);
        HttpEntity<Map<String, List<String>>> playRequest = new HttpEntity<>(requestBody, headers);

        try {
            restTemplate.put(playUrl, playRequest);
            log.info("Successfully replaced player queue.");
        } catch (HttpClientErrorException e) {
            log.error("Error replacing queue: {}", e.getResponseBodyAsString());
        }

        try {
            Thread.sleep(500); // 500 ms opóźnienia
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        pausePlayback(accessToken);
    }

    @Override
    public void pausePlayback(String accessToken) {
        String url = SPOTIFY_API_URL + "/me/player/pause";
        HttpEntity<Void> request = new HttpEntity<>(createAuthHeaders(accessToken));
        restTemplate.put(url, request);
    }

    @Override
    public void skipToNext(String accessToken) {
        String url = SPOTIFY_API_URL + "/me/player/next";
        HttpEntity<Void> request = new HttpEntity<>(createAuthHeaders(accessToken));
        restTemplate.postForEntity(url, request, Void.class);
    }

    @Override
    public void startPlayback(String accessToken) {
        String url = SPOTIFY_API_URL + "/me/player/play";
        HttpEntity<Void> request = new HttpEntity<>(createAuthHeaders(accessToken));
        restTemplate.put(url, request);
    }
}