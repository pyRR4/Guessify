package com.example.guesifyapi.service.implementation;

import com.example.guesifyapi.dto.response.Artist;
import com.example.guesifyapi.dto.SongDto;
import com.example.guesifyapi.dto.response.SpotifyPlaylistTracksResponse;
import com.example.guesifyapi.entity.Song;
import com.example.guesifyapi.repository.SongRepository;
import com.example.guesifyapi.service.contract.SpotifyAuthService;
import com.example.guesifyapi.service.contract.SpotifyTrackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SpotifyTrackServiceImpl implements SpotifyTrackService {

    private final SpotifyAuthService spotifyAuthService;
    private final SongRepository songRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    private static final String SPOTIFY_API_URL = "https://api.spotify.com/v1/";

    @Override
    public List<Song> getRandomSongsFromPlaylist(String playlistId, int numberOfSongs) {
        String accessToken = spotifyAuthService.getAccessToken();
        List<SongDto> allTracks = new ArrayList<>();

        int offset = 0;
        int limit = 100;
        boolean hasMore = true;

        while (hasMore) {
            String url = String.format(SPOTIFY_API_URL + "playlists/%s/tracks?limit=%d&offset=%d",
                    playlistId, limit, offset);

            HttpHeaders headers = new HttpHeaders();
            headers.add("Authorization", "Bearer " + accessToken);
            HttpEntity<Void> request = new HttpEntity<>(headers);

            ResponseEntity<SpotifyPlaylistTracksResponse> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    request,
                    SpotifyPlaylistTracksResponse.class
            );

            SpotifyPlaylistTracksResponse body = response.getBody();

            allTracks.addAll(
                    body.getItems().stream()
                            .map(item -> new SongDto(
                                    item.getTrack().getId(),
                                    item.getTrack().getName(),
                                    item.getTrack().getArtists().stream().map(Artist::getName).toList()
                            ))
                            .toList()
            );

            offset += limit;
            hasMore = body.getNext() != null;
        }

        Collections.shuffle(allTracks);
        List<Song> songsToSave = allTracks.stream()
                .map(dto -> songRepository.findBySpotifyTrackID(dto.getId())
                        .orElseGet(() -> songRepository.save(
                                new Song(
                                        0L,
                                        dto.getId(),
                                        dto.getTitle(),
                                        dto.getArtistNames().get(0)
                                ))))
                .toList();

        return songsToSave.stream().limit(numberOfSongs).toList();
    }
}
