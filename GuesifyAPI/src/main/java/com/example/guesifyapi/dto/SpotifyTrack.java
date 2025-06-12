package com.example.guesifyapi.dto;

import lombok.Data;

import java.util.List;

@Data
public class SpotifyTrack {
    private String id;
    private String name;
    private List<Artist> artists;
}
