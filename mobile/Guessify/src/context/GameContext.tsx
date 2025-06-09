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

type Question = {
  id: number;
  song: string;
  correct: string;
  options: string[];
  audioUrl: string;
};

type GameState = 'lobby' | 'round' | 'results' | 'leaderboard';

type GameOptions = {
  sourceOfSongs: 'Spotify' | 'Host' | 'Players';
  gameGoal: 'Guess the Title' | 'Guess the Author' | 'Guess the User';
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
  submitAnswer: (answer: string) => void;
  finishRound: () => void;
  startNextRound: () => void;
  setPlaylist: (questions: Question[]) => void;
  setGameOptions: (options: GameOptions) => void;
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
    sourceOfSongs: 'Spotify',
    gameGoal: 'Guess the Title',
    timeToAnswer: 15,
    numberOfRounds: 5,
    playbackLength: 15,
  });

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

  const startGame = () => {
    const mockPlaylist = generateMockPlaylist(gameOptions);
    setPlaylistAndStart(mockPlaylist);
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
        submitAnswer,
        finishRound,
        startNextRound,
        setPlaylist: setPlaylistAndStart,
        setGameOptions,
        startGame,
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
