package com.example.guesifyapi.service.contract;

import com.example.guesifyapi.entity.Song;

import java.util.List;

public interface SpotifyTrackService {
    List<Song> getRandomSongsFromPlaylist(String playlistId, int numberOfSongs);
}
