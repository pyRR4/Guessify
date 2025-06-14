package com.example.guesifyapi.service.contract;

import com.example.guesifyapi.dto.SongDto;

import java.util.List;

public interface SpotifyTrackService {
    List<SongDto> getRandomSongsFromPlaylist(String playlistId, int numberOfSongs);
}
