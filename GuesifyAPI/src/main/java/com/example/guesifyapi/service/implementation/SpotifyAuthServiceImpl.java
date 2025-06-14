package com.example.guesifyapi.service.implementation;

import com.example.guesifyapi.config.SpotifyConfig;
import com.example.guesifyapi.entity.User;
import com.example.guesifyapi.repository.UserRepository;
import com.example.guesifyapi.service.contract.SpotifyAuthService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
@Slf4j
public class SpotifyAuthServiceImpl implements SpotifyAuthService {

    private final SpotifyConfig config;
    private final RestTemplate restTemplate;
    private final UserRepository userRepository;

    public SpotifyAuthServiceImpl(SpotifyConfig config, UserRepository userRepository) {
        this.config = config;
        this.userRepository = userRepository;
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

        return uri;
    }

    @Override
    public User handleCallback(String code) {
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("code", code);
        body.add("redirect_uri", config.getRedirectUri());

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, createHeaders());
        ResponseEntity<Map> response = restTemplate.postForEntity(config.getTokenUrl(), request, Map.class);

        String accessToken = response.getBody().get("access_token").toString();

        Map<String, Object> userInfo = getUserInfo(accessToken);
        String email = (String) userInfo.get("email");
        String displayName = (String) userInfo.get("display_name");
        String spotifyId = (String) userInfo.get("id");

        String avatarUrl = null;
        List<Map<String, String>> images = (List<Map<String, String>>) userInfo.get("images");
        if (images != null && !images.isEmpty()) {
            avatarUrl = images.get(0).get("url");
        }

        User user = userRepository.findBySpotifyAccountID(spotifyId)
                .orElseGet(User::new);

        user.setEmail(email);
        user.setUsername(displayName);
        user.setSpotifyAccountID(spotifyId);
        user.setAvatarUrl(avatarUrl);
        user.setCreatedAt(LocalDateTime.now());
        user.setAccessToken(accessToken);

        userRepository.save(user);

        // 4. TODO: ustawić sesję w kontrolerze

        return user;
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

    private Map<String, Object> getUserInfo(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);

        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(
                "https://api.spotify.com/v1/me",
                HttpMethod.GET,
                entity,
                Map.class
        );
        return response.getBody();
    }

}
