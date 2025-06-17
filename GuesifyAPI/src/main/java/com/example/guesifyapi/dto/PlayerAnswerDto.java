package com.example.guesifyapi.dto;

import lombok.Data;

@Data
public class PlayerAnswerDto {
    private Long userId;
    private int roundNumber;
    private String submittedAnswer;
    private Long timeTakenMs;
}