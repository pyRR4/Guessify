import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Song = {
  title: string;
  artist: string;
  uri: string;
};

type GameContextType = {
  currentSong: Song | null;
  setCurrentSong: (song: Song) => void;
  playDuration: number;
  setPlayDuration: (duration: number) => void;
  score: number;
  setScore: (score: number) => void;
  round: number;
  setRound: (round: number) => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

type GameProviderProps = {
  children: ReactNode;
};

export const GameProvider = ({ children }: GameProviderProps) => {
  const [currentSong, setCurrentSong] = useState<Song | null>({
    title: 'Sample Song',
    artist: 'Sample Artist',
    uri: 'sample.mp3',
  });

  const [playDuration, setPlayDuration] = useState<number>(10000);
  const [score, setScore] = useState<number>(0);
  const [round, setRound] = useState<number>(1);

  return (
    <GameContext.Provider
      value={{
        currentSong,
        setCurrentSong,
        playDuration,
        setPlayDuration,
        score,
        setScore,
        round,
        setRound,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
