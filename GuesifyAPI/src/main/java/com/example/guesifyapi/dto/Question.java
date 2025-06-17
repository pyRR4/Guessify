package com.example.guesifyapi.dto;

import lombok.Data;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionDto {
    private int id;
    private String song;
    private String correct;
    private List<String> options;
    private String audioUrl;
}
