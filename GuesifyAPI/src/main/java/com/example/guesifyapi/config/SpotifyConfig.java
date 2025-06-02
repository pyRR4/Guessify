package com.example.guesifyapi.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "spotify")
@Getter
@Setter
public class SpotifyConfig {
    private String clientId;
    private String clientSecret;
    private String tokenUrl;
    private String apiUrl;
}
