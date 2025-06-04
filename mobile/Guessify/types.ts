export type CreateRoomPayload = {
  hostName: string;
  maxPlayers: number;
  songSource: 'SPOTIFY' | 'HOST' | 'PLAYERS';
  gameMode: 'TITLE' | 'AUTHOR' | 'USER';
  answerTimeSeconds: number;
  roundsNumber: number;
  playbackLength: number;
  roomPasswordHash?: string;
};

export type CreateRoomResponse = {
  roomId: string;
  roomCode: string;
};
