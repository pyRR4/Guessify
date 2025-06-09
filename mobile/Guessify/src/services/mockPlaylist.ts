import { Question, GameOptions } from '../context/GameContext'; // adjust path

export const generateMockPlaylist = (gameOptions: GameOptions): Question[] => {
  const playlist: Question[] = [];

  const songPool = [
    { song: 'Imagine', correct: 'John Lennon', author: 'John Lennon', user: 'Alice' },
    { song: 'Billie Jean', correct: 'Michael Jackson', author: 'Michael Jackson', user: 'Bob' },
    { song: 'Bohemian Rhapsody', correct: 'Queen', author: 'Queen', user: 'Charlie' },
    { song: 'Like a Prayer', correct: 'Madonna', author: 'Madonna', user: 'Dave' },
    { song: 'Smells Like Teen Spirit', correct: 'Nirvana', author: 'Nirvana', user: 'Eve' },
  ];

  const optionsPool = [
    'John Lennon',
    'Michael Jackson',
    'Queen',
    'Madonna',
    'Nirvana',
    'Prince',
    'Elton John',
    'Adele',
    'Beyonce',
    'Taylor Swift',
  ];

  for (let i = 0; i < gameOptions.numberOfRounds; i++) {
    const songData = songPool[i % songPool.length];

    let correctAnswer = '';
    let options: string[] = [];

    switch (gameOptions.gameGoal) {
      case 'Guess the Title':
        correctAnswer = songData.song;
        options = songPool
          .map((s) => s.song)
          .filter((title) => title !== correctAnswer)
          .slice(0, 3);
        options.push(correctAnswer);
        break;

      case 'Guess the Author':
        correctAnswer = songData.author;
        options = optionsPool
          .filter((author) => author !== correctAnswer)
          .slice(0, 3);
        options.push(correctAnswer);
        break;

      case 'Guess the User':
        correctAnswer = songData.user;
        options = ['Alice', 'Bob', 'Charlie', 'Dave', 'Eve']
          .filter((user) => user !== correctAnswer)
          .slice(0, 3);
        options.push(correctAnswer);
        break;

      default:
        break;
    }

    options = shuffleArray(options);

    const question: Question = {
      id: i + 1,
      song: songData.song,
      correct: correctAnswer,
      options,
      audioUrl: 'https://example.com/audio/sample.mp3', // mock audio URL
    };

    playlist.push(question);
  }

  return playlist;
};


const shuffleArray = (array: any[]) => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};
