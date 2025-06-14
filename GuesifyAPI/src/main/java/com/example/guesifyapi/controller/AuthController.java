package com.example.guesifyapi.controller;

import com.example.guesifyapi.repository.UserRepository;
import com.example.guesifyapi.service.contract.SpotifyAuthService;
import com.example.guesifyapi.entity.User;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
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
    private final UserRepository userRepository;

    @GetMapping("/login")
    public ResponseEntity<Void> login() {
        URI uri = spotifyAuthService.getAuthorizationUri();
        return ResponseEntity.status(HttpStatus.FOUND).location(uri).build();
    }

    @GetMapping("/callback")
    public ResponseEntity<?> callback(@RequestParam String code, HttpSession session) {
        User user = spotifyAuthService.handleCallback(code);
        session.setAttribute("userId", user.getId());
        log.info("User authenticated. Access token: {}", user.getAccessToken());
        return ResponseEntity.ok(user);
    }

    @GetMapping("/me")
    public ResponseEntity<User> me(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return userRepository.findById(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

}

