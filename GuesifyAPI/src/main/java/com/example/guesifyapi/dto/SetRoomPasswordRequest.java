package com.example.guesifyapi.dto;

import lombok.Data;

@Data
public class SetRoomPasswordRequest {
    private String passwordHash;
}
