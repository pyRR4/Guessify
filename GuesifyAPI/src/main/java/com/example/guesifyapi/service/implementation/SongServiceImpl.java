package com.example.guesifyapi.service.implementation;

import com.example.guesifyapi.entity.Song;
import com.example.guesifyapi.repository.SongRepository;
import com.example.guesifyapi.service.contract.SongService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class SongServiceImpl implements SongService {

    private final SongRepository songRepository;

    @Override
    public Song saveIfNotExist(Song song) {
        return songRepository.findBySpotifyTrackID(song.getSpotifyTrackID())
                .orElseGet(() -> songRepository.save(song));
    }
}
