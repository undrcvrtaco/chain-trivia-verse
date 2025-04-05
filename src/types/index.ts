
export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface TriviaSet {
  date: string;
  questions: Question[];
}

export interface UserAnswer {
  questionId: number;
  selectedOption: number;
  isCorrect: boolean;
  timestamp: number;
}

export interface UserProfile {
  address: string;
  ensName?: string;
  lensHandle?: string;
  farcasterName?: string;
  currentStreak: number;
  bestStreak: number;
  totalCorrect: number;
  totalAnswered: number;
  lastPlayed?: string;
}

export interface LeaderboardEntry {
  address: string;
  displayName?: string;
  score: number;
  streak: number;
}

export type TimeFrame = 'daily' | 'weekly' | 'allTime';
