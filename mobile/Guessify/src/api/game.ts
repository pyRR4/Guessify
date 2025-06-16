export const startGame = async (roomId: string) => {
    const res = await fetch(`${API_URL}/api/game/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId }),
    });
  
    if (!res.ok) {
      throw new Error('Failed to start game');
    }
  
    return res.json();
  };
  