
import { TriviaSet, UserProfile, LeaderboardEntry } from "@/types";
import { getCurrentDate } from "@/utils/dateUtils";

// Mock trivia questions
export const getTodaysQuestions = (): TriviaSet => {
  return {
    date: getCurrentDate(),
    questions: [
      {
        id: 1,
        question: "Which consensus mechanism does Ethereum use after 'The Merge'?",
        options: ["Proof of Work", "Proof of Stake", "Delegated Proof of Stake", "Proof of Authority"],
        correctAnswer: 1,
        explanation: "Ethereum transitioned from Proof of Work to Proof of Stake after 'The Merge' in September 2022."
      },
      {
        id: 2,
        question: "Who published the Bitcoin whitepaper?",
        options: ["Vitalik Buterin", "Satoshi Nakamoto", "Charles Hoskinson", "Gavin Wood"],
        correctAnswer: 1,
        explanation: "Satoshi Nakamoto published the Bitcoin whitepaper in 2008, though their real identity remains unknown."
      },
      {
        id: 3,
        question: "What is the main purpose of ENS (Ethereum Name Service)?",
        options: [
          "Layer 2 scaling solution", 
          "Human-readable names for Ethereum addresses", 
          "Token staking protocol", 
          "Smart contract security auditing"
        ],
        correctAnswer: 1,
        explanation: "ENS provides human-readable names (like 'name.eth') that map to Ethereum addresses, contracts, and other resources."
      }
    ]
  };
};

// Mock user profile
export const getMockUserProfile = (address: string): UserProfile => {
  return {
    address,
    ensName: address === "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" ? "vitalik.eth" : undefined,
    currentStreak: 3,
    bestStreak: 7,
    totalCorrect: 15,
    totalAnswered: 21,
    lastPlayed: getCurrentDate()
  };
};

// Mock leaderboard data
export const getMockLeaderboard = (): LeaderboardEntry[] => {
  return [
    { address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", displayName: "vitalik.eth", score: 42, streak: 14 },
    { address: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B", displayName: "satoshi.eth", score: 39, streak: 13 },
    { address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", displayName: "0x71C7...976F", score: 36, streak: 12 },
    { address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", displayName: "chainlover.eth", score: 32, streak: 8 },
    { address: "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec", displayName: "crypto_wizard.lens", score: 29, streak: 6 },
    { address: "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097", displayName: "0xdF3e...7097", score: 28, streak: 5 },
    { address: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14", displayName: "eth_enthusiast.eth", score: 24, streak: 8 },
    { address: "0x0A098Eda01Ce92ff4A4CCb7A4fFFb5A43EBC70DC", displayName: "blockchain_guru", score: 21, streak: 7 }
  ];
};

// Mock function to submit answers
export const submitAnswers = async (address: string, answers: Record<number, number>): Promise<{ 
  correct: number, 
  total: number,
  streak: number,
  badges?: string[]
}> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock API response
  const mockCorrect = Object.keys(answers).length;
  const mockStreak = 4; // Incremented from the mock profile
  const mockBadges = mockCorrect === 3 ? ["perfect_score"] : undefined;
  
  return {
    correct: mockCorrect,
    total: 3,
    streak: mockStreak,
    badges: mockBadges
  };
};
