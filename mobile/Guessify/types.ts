export type CreateRoomPayload = {
  hostId: number;
  maxPlayers: number;
  songSource: string;
  gameMode: string;
  answerTimeSeconds: number;
  roundsNumber: number;
  playbackLength: number;
  roomPasswordHash: string;
};

export type CreateRoomResponse = {
  id: number;
  roomCode: string;
  host: {
    id: number;
    username: string;
    avatarUrl?: string;
  };
  maxPlayers: number;
  songSource: string;
  gameMode: string;
  answerTimeSeconds: number;
  roundsNumber: number;
  playbackLength: number;
  roomPasswordHash: string;
};
