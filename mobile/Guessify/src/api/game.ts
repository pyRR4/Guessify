import { API_URL } from '@env';

export const fetchLeaderboard = async (roomCode: string) => {
  const response = await fetch(`${API_URL}/api/game/leaderboard?roomCode=${roomCode}`);
  if (!response.ok) {
    throw new Error('Failed to fetch leaderboard');
  }
  return await response.json();
};