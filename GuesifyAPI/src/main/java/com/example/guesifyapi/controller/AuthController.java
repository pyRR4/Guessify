package com.example.guesifyapi.controller;

import com.example.guesifyapi.service.contract.SpotifyAuthService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
@Slf4j
public class AuthController {

    private final SpotifyAuthService spotifyAuthService;

    @GetMapping("/login")
    public ResponseEntity<Void> login() {
        URI redirectUri = spotifyAuthService.getAuthorizationUri();

        log.info(redirectUri.toString());

        return ResponseEntity.status(302).location(redirectUri).build();
    }

    @GetMapping("/callback")
    public ResponseEntity<String> callback(@RequestParam String code) {
        log.info("callback called");
        String accessToken = spotifyAuthService.handleCallback(code);
        // TODO: pobierz dane użytkownika i zapisz go w sesji lub bazie
        return ResponseEntity.ok("Access Token: " + accessToken);
    }
}
