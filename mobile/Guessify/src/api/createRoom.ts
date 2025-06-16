import { CreateRoomPayload, CreateRoomResponse } from '../types';
import { API_URL } from '@env';

export const createRoom = async (
  data: CreateRoomPayload
): Promise<CreateRoomResponse> => {
  const res = await fetch(`${API_URL}/api/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Room creation failed: ${error}`);
  }

  return res.json();
};
