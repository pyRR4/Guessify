package com.example.guesifyapi.service.implementation;

import com.example.guesifyapi.config.SpotifyConfig;
import com.example.guesifyapi.service.contract.SpotifyAuthService;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.Map;

@Service
public class SpotifyAuthServiceImpl implements SpotifyAuthService {

    private final SpotifyConfig config;
    private final RestTemplate restTemplate;

    public SpotifyAuthServiceImpl(SpotifyConfig config) {
        this.config = config;
        this.restTemplate = new RestTemplate();
    }


    @Override
    public String getAccessToken() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        String credentials = config.getClientId() + ":" + config.getClientSecret();
        String base64Credentials = Base64.getEncoder().encodeToString(credentials.getBytes());
        headers.set("Authorization", "Basic " + base64Credentials);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "client_credentials");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(config.getTokenUrl(), request, Map.class);
        return response.getBody().get("access_token").toString();
    }
}
