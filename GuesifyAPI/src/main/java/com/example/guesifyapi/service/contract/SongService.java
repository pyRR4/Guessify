package com.example.guesifyapi.service.contract;

import com.example.guesifyapi.entity.Song;

public interface SongService {
    Song saveIfNotExist(Song song);
}
