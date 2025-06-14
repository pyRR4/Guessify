package com.example.guesifyapi.dto;

import com.example.guesifyapi.entity.enums.GameMode;
import com.example.guesifyapi.entity.enums.SongSource;
import lombok.Data;

@Data
public class CreateRoomRequest {
    private Long hostId;
    private Integer maxPlayers;
    private SongSource songSource;
    private GameMode gameMode;
    private Double answerTimeSeconds;
    private Integer roundsNumber;
    private Double playbackLength;
    private String roomPasswordHash;
}
