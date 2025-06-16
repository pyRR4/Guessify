import { API_URL } from '@env';

export const joinRoom = async (roomCode: string): Promise<void> => {
  const response = await fetch(`${API_URL}/api/rooms/${roomCode}/join`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }
};
