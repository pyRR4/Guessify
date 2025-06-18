// api/room.ts
import { API_URL } from '@env';

interface Player {
  id: number;
  username: string;
  avatarUrl?: string;
}

export const getPlayersInRoom = async (roomCode: string): Promise<string[]> => {
  const res = await fetch(`${API_URL}/api/rooms/code/${roomCode}/players`, {
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch players');
  }
  const data = await res.json();
  return data.map((player: any) => ({ id: player.id, username: player.username }));
};
