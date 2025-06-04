import { CreateRoomPayload, CreateRoomResponse } from '../types';

export const createRoom = async (data: CreateRoomPayload): Promise<CreateRoomResponse> => {
  // TODO: Replace this with actual API call
  console.log('Sending to backend:', data);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ roomId: 'abc123', roomCode: 'ROOM42' });
    }, 1000);
  });
};