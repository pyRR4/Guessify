// api/room.ts
export const getPlayersInRoom = async (roomId: string): Promise<string[]> => {
  console.log(`Fetching players for room: ${roomId}`);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(['PLAYER 1', 'PLAYER 2', 'PLAYER 3']); // Mock danych
    }, 500);
  });
};
