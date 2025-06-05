import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';

// Define types
type Question = {
  id: number;
  song: string;
  correct: string;
  options: string[];
  audioUrl: any;
};

type Player = {
  id: string;
  name: string;
  score: number;
};

type GameState = 'round' | 'results' | 'leaderboard';

type GameContextType = {
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
  currentRound: number;
  players: Player[];
  question: Question | null;
  selectedAnswer: string | null;
  submitAnswer: (answer: string) => void;
  finishRound: () => void;
  startNextRound: () => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);


const mockQuestions: Question[] = [
  {
    id: 1,
    song: 'Imagine',
    correct: 'John Lennon',
    options: ['John Lennon', 'Elton John', 'Paul McCartney', 'George Harrison'],
    audioUrl: require('../assets/sample1.mp3'),
  },
  {
    id: 2,
    song: 'Billie Jean',
    correct: 'Michael Jackson',
    options: ['Prince', 'Michael Jackson', 'Stevie Wonder', 'Lionel Richie'],
    audioUrl: require('../assets/sample2.mp3'),
  },
];

const mockPlayers: Player[] = [
  { id: '1', name: 'Alice', score: 0 },
  { id: '2', name: 'Bob', score: 0 },
  { id: '3', name: 'You', score: 0 },
];

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<GameState>('round');
  const [currentRound, setCurrentRound] = useState(0);
  const [question, setQuestion] = useState<Question | null>(mockQuestions[0]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>(mockPlayers);

  const submitAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    // Mock scoring
    if (question && answer === question.correct) {
      setPlayers((prev) =>
        prev.map((p) =>
          p.name === 'You' ? { ...p, score: p.score + 100 } : p
        )
      );
    }
  };

  const finishRound = () => {
    setGameState('results');
  };

  const startNextRound = () => {
    const next = currentRound + 1;
    if (next < mockQuestions.length) {
      setCurrentRound(next);
      setQuestion(mockQuestions[next]);
      setSelectedAnswer(null);
      setGameState('round');
    } else {
      setGameState('leaderboard');
    }
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        setGameState,
        currentRound,
        players,
        question,
        selectedAnswer,
        submitAnswer,
        finishRound,
        startNextRound,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// Hook for using the context
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
