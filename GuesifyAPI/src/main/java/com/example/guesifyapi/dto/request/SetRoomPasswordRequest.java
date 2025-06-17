package com.example.guesifyapi.dto.request;

import lombok.Data;

@Data
public class SetRoomPasswordRequest {
    private String passwordHash;
}
