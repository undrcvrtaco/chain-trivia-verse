
import React, { useState, useEffect } from 'react';
import ConnectButton from '@/components/ConnectButton';
import QuestionCard from '@/components/QuestionCard';
import UserProfileCard from '@/components/UserProfile';
import ResultsCard from '@/components/ResultsCard';
import ShareModal from '@/components/ShareModal';
import Leaderboard from '@/components/Leaderboard';
import { Question, UserProfile, UserAnswer, TriviaSet, TimeFrame } from '@/types';
import { getTodaysQuestions, getMockUserProfile, getMockLeaderboard, submitAnswers } from '@/services/mockData';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp, Check, Trophy, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatTimeLeft, hasPlayedToday } from '@/utils/dateUtils';
import { CircleCheck, KeyRound, Medal, MessageSquare } from 'lucide-react';

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [triviaSet, setTriviaSet] = useState<TriviaSet | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [userAnswers, setUserAnswers] = useState<Record<number, UserAnswer>>({});
  const [showResults, setShowResults] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [resultsData, setResultsData] = useState<{ correct: number; total: number; streak: number }>({ correct: 0, total: 0, streak: 0 });
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('daily');
  const [leaderboard, setLeaderboard] = useState(getMockLeaderboard());
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const connectWallet = async () => {
    setIsConnecting(true);
    
    // Mock connection process
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock user address - in a real app, this would come from Metal or wallet connection
      const mockAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
      setUserAddress(mockAddress);
      
      const profile = getMockUserProfile(mockAddress);
      setUserProfile(profile);
      setIsConnected(true);
      
      toast.success('Wallet connected successfully!');
    } catch (error) {
      toast.error('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const loadTriviaQuestions = () => {
    // In a real app, this would fetch from the blockchain or API
    const questions = getTodaysQuestions();
    setTriviaSet(questions);
  };

  useEffect(() => {
    if (isConnected) {
      loadTriviaQuestions();
      
      // Check if user has already played today
      if (userProfile && hasPlayedToday(userProfile.lastPlayed)) {
        toast.info("You've already completed today's trivia!");
        setQuizComplete(true);
      }
    }
  }, [isConnected, userProfile]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleSelectOption = (optionIndex: number) => {
    if (!triviaSet) return;
    const currentQuestion = triviaSet.questions[currentQuestionIndex];
    
    setSelectedOptions({
      ...selectedOptions,
      [currentQuestion.id]: optionIndex,
    });
  };

  const handleNextQuestion = () => {
    if (!triviaSet) return;
    const currentQuestion = triviaSet.questions[currentQuestionIndex];
    const isCorrect = selectedOptions[currentQuestion.id] === currentQuestion.correctAnswer;
    
    setUserAnswers({
      ...userAnswers,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        selectedOption: selectedOptions[currentQuestion.id],
        isCorrect,
        timestamp: Date.now(),
      },
    });
    
    if (currentQuestionIndex < triviaSet.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = async () => {
    if (!userAddress || !triviaSet) return;
    
    try {
      const result = await submitAnswers(
        userAddress,
        Object.entries(selectedOptions).reduce((acc, [key, value]) => {
          acc[parseInt(key)] = value;
          return acc;
        }, {} as Record<number, number>)
      );
      
      setResultsData({
        correct: result.correct,
        total: result.total,
        streak: result.streak,
      });
      
      if (result.badges?.includes('perfect_score')) {
        toast.success('🏆 Perfect Score Badge Earned!');
      }
      
      setShowResults(true);
      setQuizComplete(true);
      
      // Update user profile with new stats
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          currentStreak: result.streak,
          bestStreak: Math.max(userProfile.bestStreak, result.streak),
          totalCorrect: userProfile.totalCorrect + result.correct,
          totalAnswered: userProfile.totalAnswered + result.total,
          lastPlayed: new Date().toISOString().split('T')[0],
        });
      }
    } catch (error) {
      toast.error('Failed to submit answers');
    }
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const handleTimeFrameChange = (tf: TimeFrame) => {
    setTimeFrame(tf);
    // In a real app, this would fetch leaderboard data for the selected time frame
  };

  const currentQuestion = triviaSet?.questions[currentQuestionIndex];
  const isLastQuestion = triviaSet && currentQuestionIndex === triviaSet.questions.length - 1;
  const hasSelectedOption = currentQuestion ? selectedOptions[currentQuestion.id] !== undefined : false;

  const toggleLeaderboard = () => {
    setShowLeaderboard(!showLeaderboard);
  };

  return (
    <div className="min-h-screen bg-white">
      {!showLeaderboard ? (
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="py-4">
            <h1 className="text-5xl font-bold mb-2">Chain Trivia</h1>
            <h2 className="text-xl text-gray-700 mb-6">
              The daily trivia game for degens, nerds, and crypto curious.
            </h2>
            
            {!isConnected ? (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CircleCheck className="feature-icon" />
                    <span>3 questions</span>
                  </div>
                  <div className="flex items-center">
                    <Medal className="feature-icon" />
                    <span>Onchain scores</span>
                  </div>
                  <div className="flex items-center">
                    <Trophy className="feature-icon" />
                    <span>Bragging rights</span>
                  </div>
                </div>
                
                <div className="mt-8">
                  <p className="mb-4 text-gray-700">
                    Login with your wallet and test your Web3 knowledge now.
                  </p>
                  <div className="space-y-4">
                    <ConnectButton onConnect={connectWallet} isConnecting={isConnecting} />
                    
                    <Button
                      variant="outline"
                      className="w-full md:w-auto border-gray-300 text-gray-700"
                      onClick={toggleLeaderboard}
                    >
                      Explore Leaderboard
                    </Button>
                  </div>
                </div>
                
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <KeyRound className="mx-auto mb-2" size={28} />
                    <h3 className="font-semibold mb-1">Web3 Login</h3>
                    <p className="text-sm text-gray-500">ENS, Lens, Farcasterrer supported</p>
                  </div>
                  
                  <div className="text-center">
                    <Trophy className="mx-auto mb-2" size={28} />
                    <h3 className="font-semibold mb-1">NFT Badges</h3>
                    <p className="text-sm text-gray-500">Earn POAP Style collectibles</p>
                  </div>
                  
                  <div className="text-center">
                    <MessageSquare className="mx-auto mb-2" size={28} />
                    <h3 className="font-semibold mb-1">Social Trivia</h3>
                    <p className="text-sm text-gray-500">Challenge friends via XMTP</p>
                  </div>
                </div>
              </div>
            ) : quizComplete ? (
              <div>
                {showResults && (
                  <ResultsCard 
                    correct={resultsData.correct}
                    total={resultsData.total}
                    streak={resultsData.streak}
                    answers={userAnswers}
                    onShare={handleShare}
                    onDismiss={() => setShowResults(false)}
                  />
                )}
                
                {!showResults && userProfile && (
                  <div className="bg-white rounded-3xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Today's Trivia Complete!</h2>
                    <div className="text-center py-4">
                      <p className="mb-4">You've already completed today's trivia challenge.</p>
                      <p className="text-sm text-gray-500">
                        Next trivia available in {formatTimeLeft(new Date().toISOString().split('T')[0])}
                      </p>
                      
                      <div className="mt-6">
                        <Button 
                          onClick={toggleLeaderboard}
                          className="bg-primary hover:bg-primary/90"
                        >
                          View Leaderboard
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : quizStarted && currentQuestion ? (
              <div className="w-full max-w-lg mx-auto">
                <QuestionCard
                  question={currentQuestion}
                  selectedOption={selectedOptions[currentQuestion.id] ?? null}
                  onSelectOption={handleSelectOption}
                  showAnswer={false}
                  isCurrentQuestion={true}
                />
                
                <div className="mt-6 flex justify-end">
                  <Button
                    disabled={!hasSelectedOption}
                    onClick={handleNextQuestion}
                    size="lg"
                    className="bg-primary hover:bg-primary/90"
                  >
                    {isLastQuestion ? 'Submit Quiz' : 'Next Question'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-lg mx-auto">
                <div className="bg-white rounded-3xl shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Daily Trivia Challenge</h2>
                  <p className="text-gray-600 mb-6">
                    Answer today's 3 questions to maintain your streak!
                  </p>
                  <div className="flex justify-center">
                    <Button 
                      size="lg" 
                      onClick={handleStartQuiz} 
                      className="bg-primary hover:bg-primary/90"
                    >
                      Start Today's Quiz
                    </Button>
                  </div>
                </div>
                
                {userProfile && (
                  <div className="mt-6">
                    <UserProfileCard profile={userProfile} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              className="mr-2"
              onClick={toggleLeaderboard}
            >
              ← Back
            </Button>
            <h2 className="text-3xl font-bold">Leaderboard</h2>
          </div>
          
          <Leaderboard 
            entries={leaderboard}
            timeFrame={timeFrame}
            onTimeFrameChange={handleTimeFrameChange}
          />
        </div>
      )}
      
      <ShareModal
        open={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        result={resultsData}
      />
    </div>
  );
};

export default Index;
