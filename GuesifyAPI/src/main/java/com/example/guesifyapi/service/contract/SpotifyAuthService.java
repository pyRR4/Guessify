package com.example.guesifyapi.service.contract;

import com.example.guesifyapi.entity.User;

import java.net.URI;

public interface SpotifyAuthService {
    String getAccessToken();
    URI getAuthorizationUri();
    User handleCallback(String code);
}
