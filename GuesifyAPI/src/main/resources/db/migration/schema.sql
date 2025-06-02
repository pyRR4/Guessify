--liquibase formatted sql
--changeset igor:1-create-schema

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    spotify_account_id VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')
);

CREATE TABLE songs (
   id BIGSERIAL PRIMARY KEY,
   spotify_track_id VARCHAR(255) NOT NULL UNIQUE,
   title VARCHAR(255) NOT NULL,
   artist VARCHAR(255) NOT NULL,
   album_cover_url VARCHAR(255),
   song_url VARCHAR(1024) NOT NULL
);

CREATE TABLE game_rooms (
    id BIGSERIAL PRIMARY KEY,
    room_code VARCHAR(10) UNIQUE NOT NULL,
    host_id BIGINT NOT NULL,
    max_players INTEGER NOT NULL,
    song_source VARCHAR(255) NOT NULL,
    game_mode VARCHAR(255) NOT NULL,
    answer_time_seconds REAL NOT NULL,
    rounds_number INTEGER NOT NULL,
    playback_length_seconds REAL NOT NULL,
    room_password_hash VARCHAR(255),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'),

    CONSTRAINT fk_gameroom_host FOREIGN KEY (host_id) REFERENCES users (id) ON DELETE RESTRICT
);

CREATE TABLE room_players (
    id BIGSERIAL PRIMARY KEY,
    gameroom_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    joined_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'),

    CONSTRAINT fk_lobbyplayer_gameroom FOREIGN KEY (gameroom_id) REFERENCES game_rooms (id) ON DELETE CASCADE,
    CONSTRAINT fk_lobbyplayer_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE games (
    id BIGSERIAL PRIMARY KEY,
    game_room_id BIGINT NOT NULL,
    number_of_rounds INTEGER NOT NULL,
    host_id BIGINT NOT NULL,
    game_status VARCHAR(255) NOT NULL,
    start_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    end_time TIMESTAMP WITHOUT TIME ZONE,
    winner_id BIGINT,
    CONSTRAINT fk_game_host FOREIGN KEY (host_id) REFERENCES users (id) ON DELETE RESTRICT,
    CONSTRAINT fk_game_winner FOREIGN KEY (winner_id) REFERENCES users (id) ON DELETE SET NULL
);

CREATE TABLE game_songs (
    id BIGSERIAL PRIMARY KEY,
    game_id BIGINT NOT NULL,
    song_id BIGINT NOT NULL,
    round_number INTEGER NOT NULL,

    CONSTRAINT fk_gamesong_game FOREIGN KEY (game_id) REFERENCES games (id) ON DELETE CASCADE,
    CONSTRAINT fk_gamesong_song FOREIGN KEY (song_id) REFERENCES songs (id) ON DELETE RESTRICT,

    UNIQUE (game_id, round_number),
    UNIQUE (game_id, song_id)
);

CREATE TABLE player_game_scores (
    id BIGSERIAL PRIMARY KEY,
    game_id BIGINT NOT NULL,
    player_id BIGINT NOT NULL,
    total_score INTEGER DEFAULT 0,

    CONSTRAINT fk_playergamescore_game FOREIGN KEY (game_id) REFERENCES games (id) ON DELETE CASCADE,
    CONSTRAINT fk_playergamescore_player FOREIGN KEY (player_id) REFERENCES users (id) ON DELETE CASCADE,

    UNIQUE (game_id, player_id)
);

CREATE TABLE player_round_answers (
    id BIGSERIAL PRIMARY KEY,
    player_game_score_id BIGINT NOT NULL,
    game_song_id BIGINT NOT NULL,
    submitted_answer VARCHAR(255),
    correct BOOLEAN NOT NULL,
    points_awarded INTEGER,
    time_taken_ms BIGINT,
    answered_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'),

    CONSTRAINT fk_playerroundanswer_playergamescore FOREIGN KEY (player_game_score_id) REFERENCES player_game_scores (id) ON DELETE CASCADE,
    CONSTRAINT fk_playerroundanswer_gamesong FOREIGN KEY (game_song_id) REFERENCES game_songs (id) ON DELETE CASCADE,

    UNIQUE (player_game_score_id, game_song_id) -- Gracz odpowiada tylko raz na daną piosenkę w grze
);