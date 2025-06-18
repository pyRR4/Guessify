export const playTrack = async (accessToken: string, trackUri: string) => {
  await fetch('https://api.spotify.com/v1/me/player/play', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uris: [trackUri] }),
  });
};
