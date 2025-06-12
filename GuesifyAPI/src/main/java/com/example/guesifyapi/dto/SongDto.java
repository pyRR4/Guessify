package com.example.guesifyapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class SongDto {
    private String id;
    private String title;
    private List<String> artistNames;
}
