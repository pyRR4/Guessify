import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from 'react';
import { generateMockPlaylist } from '../services/mockPlaylist';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '@env';
import { sendToSocket } from '../services/socketService';

type Question = {
  id: number;
  song: string;
  correct: string;
  options: string[];
  audioUrl: string;
};

type GameState = 'lobby' | 'round' | 'results' | 'leaderboard';
export type SongSource = 'SPOTIFY' | 'HOST' | 'PLAYERS';
export type GameGoal = 'GUESS_THE_TITLE' | 'GUESS_THE_ARTIST' | 'GUESS_THE_USER';

export type GameOptions = {
  sourceOfSongs: SongSource;
  gameGoal: GameGoal;
  timeToAnswer: number;
  numberOfRounds: number;
  playbackLength: number;
};

type GameContextType = {
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
  currentRound: number;
  playlist: Question[];
  question: Question | null;
  selectedAnswer: string | null;
  score: number;
  gameOptions: GameOptions;
  roomCode: string;
  isLoading: boolean;
  submitAnswer: (answer: string) => void;
  finishRound: () => void;
  startNextRound: () => void;
  setPlaylist: (questions: Question[]) => void;
  setGameOptions: (options: GameOptions) => void;
  setRoomCode: (code: string) => void;
  startGame: () => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<GameState>('lobby');
  const [currentRound, setCurrentRound] = useState(0);
  const [playlist, setPlaylist] = useState<Question[]>([]);
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [roundStarted, setRoundStarted] = useState(false);
  const [gameOptions, setGameOptions] = useState<GameOptions>({
    sourceOfSongs: 'SPOTIFY',
    gameGoal: 'GUESS_THE_TITLE',
    timeToAnswer: 15,
    numberOfRounds: 5,
    playbackLength: 15,
  });
  const [roomCode, setRoomCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const submitAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    if (question && answer === question.correct) {
      setScore((prev) => prev + 100);
    }
  };

  const finishRound = () => {
    setGameState('results');
  };

  const startNextRound = () => {
    const next = currentRound + 1;
    if (next < Math.min(playlist.length, gameOptions.numberOfRounds)) {
      setCurrentRound(next);
      setQuestion(playlist[next]);
      setSelectedAnswer(null);
      setGameState('round');
      setRoundStarted(false);
    } else {
      setGameState('leaderboard');
      if (user?.id) {
        sendToSocket(`/app/game/submit-score/${roomCode}`, {
          userId: user.id,
          score: score,
        });
      }
    }
  };

  const setPlaylistAndStart = (questions: Question[]) => {
    setPlaylist(questions);
    setCurrentRound(0);
    setScore(0);
    setSelectedAnswer(null);
    setQuestion(questions[0] || null);
    setGameState('round');
    setRoundStarted(false);
  };

  const { user } = useAuth();

  const startGame = async () => {
    try {
      setIsLoading(true);
      const { sourceOfSongs, numberOfRounds } = gameOptions;
  
      let fetchedSongs = [];

      console.log(sourceOfSongs);
  
      if (sourceOfSongs === 'SPOTIFY') {
        const playlistId = '3WBxrkvFSTLRSADvwmLhGf'; // tymczasowo hardkodowane
        const res = await fetch(`${API_URL}/api/spotify/tracks/random-tracks?playlistId=${playlistId}&count=${numberOfRounds}`);
        fetchedSongs = await res.json();
      }
  
      if (sourceOfSongs === 'HOST') {
        const accessToken = user?.accessToken;
        const resPlaylists = await fetch(`${API_URL}/api/spotify/playlists?access_token=${accessToken}`);
        const playlists = await resPlaylists.json();
        console.log('Host playlists:', playlists);
        const allSongs: any[] = [];
  
        for (const p of playlists) {
          const res = await fetch(`${API_URL}/api/spotify/playlist?id=${p.id}&access_token=${accessToken}`);
          const songs = await res.json();
          allSongs.push(...songs);
        }
  
        fetchedSongs = shuffle(allSongs).slice(0, numberOfRounds);
      }
  
      if (sourceOfSongs === 'PLAYERS') {
        const res = await fetch(`${API_URL}/api/spotify/players-songs?roomCode=${roomCode}`);
        const allSongs = await res.json();
        fetchedSongs = shuffle(allSongs).slice(0, numberOfRounds);
      }
  
      
      const questions = fetchedSongs.map((track: any, index: number) => ({
        id: index + 1,
        song: track.title,
        correct: gameOptions.gameGoal === 'GUESS_THE_ARTIST' ? track.artist : gameOptions.gameGoal === 'GUESS_THE_USER' ? track.user : track.title,
        options: shuffle([
          track.title,
          'Wrong 1',
          'Wrong 2',
          'Wrong 3',
        ]),
        audioUrl: track.preview_url,
      }));
      

      setPlaylistAndStart(questions);
    } catch (e) {
      console.error('Game start error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const shuffle = (array: any[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    if (gameState === 'round' && question && !roundStarted) {
      const delay = setTimeout(() => {
        setRoundStarted(true);
      }, 200); 
      return () => clearTimeout(delay);
    }
  }, [gameState, question, roundStarted]);

  useEffect(() => {
    if (gameState === 'round' && roundStarted) {
      const timer = setTimeout(() => {
        finishRound();
      }, gameOptions.timeToAnswer * 1000);
  
      return () => clearTimeout(timer);
    }
  }, [gameState, roundStarted, gameOptions.timeToAnswer]);

  // Loggign for console debugging in devTOols
  useEffect(() => {
    console.log(
      'Round started:',
      roundStarted,
      'GameState:',
      gameState,
      'Question:',
      question?.song
    );
  }, [roundStarted, gameState, question]);


  useEffect(() => {
    setGameState('lobby');
  }, [gameOptions]);

  return (
    <GameContext.Provider
      value={{
        gameState,
        setGameState,
        currentRound,
        playlist,
        question,
        selectedAnswer,
        score,
        gameOptions,
        roomCode,
        isLoading,
        submitAnswer,
        finishRound,
        startNextRound,
        setPlaylist: setPlaylistAndStart,
        setGameOptions,
        startGame,
        setRoomCode,
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
