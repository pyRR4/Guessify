package com.example.guesifyapi.service.implementation;

import com.example.guesifyapi.config.SpotifyConfig;
import com.example.guesifyapi.service.contract.SpotifyAuthService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.Base64;
import java.util.Map;
import java.util.Random;

@Service
@Slf4j
public class SpotifyAuthServiceImpl implements SpotifyAuthService {

    private final SpotifyConfig config;
    private final RestTemplate restTemplate;


    public SpotifyAuthServiceImpl(SpotifyConfig config) {
        this.config = config;
        this.restTemplate = new RestTemplate();
    }


    @Override
    public String getAccessToken() {
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "client_credentials");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, createHeaders());

        ResponseEntity<Map> response = restTemplate.postForEntity(config.getTokenUrl(), request, Map.class);
        return response.getBody().get("access_token").toString();
    }

    @Override
    public URI getAuthorizationUri() {
        String state = generateState(16);

        UriComponentsBuilder builder = UriComponentsBuilder
                .fromUriString(config.getAuthUrl())
                .queryParam("client_id", config.getClientId())
                .queryParam("response_type", "code")
                .queryParam("redirect_uri", config.getRedirectUri())
                .queryParam("state", state)
                .queryParam("scope", "user-read-private user-read-email user-read-recently-played playlist-read-private");

        URI uri = builder.build().toUri();

        log.info(uri.toString());

        return uri;
    }

    @Override
    public String handleCallback(String code) {
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("code", code);
        body.add("redirect_uri", config.getRedirectUri());

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, createHeaders());
        ResponseEntity<Map> response = restTemplate.postForEntity(config.getTokenUrl(), request, Map.class);

        return response.getBody().get("access_token").toString();
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        String credentials = config.getClientId() + ":" + config.getClientSecret();
        String base64Credentials = Base64.getEncoder().encodeToString(credentials.getBytes());
        headers.set("Authorization", "Basic " + base64Credentials);

        return headers;
    }

    private String generateState(int length) {
        int leftLimit = 48;
        int rightLimit = 122;
        Random random = new Random();

        return random.ints(leftLimit, rightLimit + 1)
                .filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97))
                .limit(length)
                .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                .toString();
    }
}
