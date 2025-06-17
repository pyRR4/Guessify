package com.example.guesifyapi.service.contract;

import java.util.List;

public interface SpotifyPlayerService {
    void replaceQueueAndPause(List<String> songUris, String accessToken);
    void pausePlayback(String accessToken);
    void skipToNext(String accessToken);
    void startPlayback(String accessToken);
}