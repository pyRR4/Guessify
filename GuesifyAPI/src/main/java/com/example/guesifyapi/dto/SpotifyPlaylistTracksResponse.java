package com.example.guesifyapi.dto;

import lombok.Data;

import java.util.List;

@Data
public class SpotifyPlaylistTracksResponse {
    private List<SpotifyPlaylistItem> items;
    private String next;
}
