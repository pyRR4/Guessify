package com.example.guesifyapi.service.contract;

import java.net.URI;

public interface SpotifyAuthService {
    String getAccessToken();
    URI getAuthorizationUri();
    String handleCallback(String code);
}
