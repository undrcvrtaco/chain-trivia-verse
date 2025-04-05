
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Check, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { formatTimeLeft, hasPlayedToday } from '@/utils/dateUtils';

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
    setSelectedOptions({
      ...selectedOptions,
      [currentQuestion.id]: optionIndex,
    });
  };

  const handleNextQuestion = () => {
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
    
    if (currentQuestionIndex < triviaSet!.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = async () => {
    if (!userAddress) return;
    
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

  return (
    <div className="min-h-screen flex flex-col bg-trivia-background bg-trivia-pattern">
      <header className="py-6 px-4 border-b border-trivia-primary/20">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold trivia-gradient">Chain Trivia</h1>
          {isConnected && userProfile && (
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Trophy className="h-5 w-5 text-trivia-primary mr-1" />
                  <span className="font-bold">{userProfile.currentStreak} day streak</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {userProfile.ensName || `${userProfile.address.slice(0, 6)}...${userProfile.address.slice(-4)}`}
                </div>
              </div>
            </div>
          )}
          {!isConnected && (
            <ConnectButton onConnect={connectWallet} isConnecting={isConnecting} />
          )}
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8 px-4">
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center">
            <Card className="w-full bg-trivia-background/80 border-trivia-primary/30">
              <CardHeader>
                <CardTitle className="text-3xl font-bold mb-2">
                  Welcome to <span className="trivia-gradient">Chain Trivia</span>
                </CardTitle>
                <CardDescription className="text-lg">
                  Test your knowledge with daily crypto questions and earn NFT badges!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-trivia-background/60 p-4 rounded-lg border border-trivia-primary/20">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Check className="h-4 w-4 text-trivia-primary mr-2" />
                      Daily Questions
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Answer 3 new crypto questions every day
                    </p>
                  </div>
                  <div className="bg-trivia-background/60 p-4 rounded-lg border border-trivia-primary/20">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Trophy className="h-4 w-4 text-trivia-secondary mr-2" />
                      Build Streaks
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Maintain your streak by playing daily
                    </p>
                  </div>
                  <div className="bg-trivia-background/60 p-4 rounded-lg border border-trivia-primary/20">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Share2 className="h-4 w-4 text-trivia-accent mr-2" />
                      Share Results
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Compare scores with friends via XMTP
                    </p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <ConnectButton onConnect={connectWallet} isConnecting={isConnecting} />
                </div>
              </CardContent>
            </Card>
          </div>
        ) : quizComplete ? (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 flex flex-col gap-6">
              {userProfile && (
                <UserProfileCard profile={userProfile} />
              )}
              
              {!showResults && (
                <Card className="bg-trivia-background/80 border-trivia-primary/30">
                  <CardHeader>
                    <CardTitle>Today's Trivia Complete!</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <p className="mb-4">You've already completed today's trivia challenge.</p>
                      <p className="text-sm text-muted-foreground">
                        Next trivia available in {formatTimeLeft(new Date().toISOString().split('T')[0])}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="flex-1">
              <Leaderboard 
                entries={leaderboard} 
                timeFrame={timeFrame}
                onTimeFrameChange={handleTimeFrameChange}
              />
            </div>
          </div>
        ) : quizStarted ? (
          <div className="flex flex-col items-center justify-center">
            {showResults ? (
              <ResultsCard 
                correct={resultsData.correct}
                total={resultsData.total}
                streak={resultsData.streak}
                answers={userAnswers}
                onShare={handleShare}
                onDismiss={() => setShowResults(false)}
              />
            ) : currentQuestion ? (
              <div className="w-full max-w-lg">
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
                    className="bg-trivia-primary hover:bg-trivia-primary/90"
                  >
                    {isLastQuestion ? 'Submit Quiz' : 'Next Question'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p>Loading questions...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <Card className="bg-trivia-background/80 border-trivia-primary/30 mb-6">
                <CardHeader>
                  <CardTitle>Daily Trivia Challenge</CardTitle>
                  <CardDescription>
                    Answer today's 3 questions to maintain your streak!
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-center">
                    <Button size="lg" onClick={handleStartQuiz} className="bg-trivia-primary hover:bg-trivia-primary/90">
                      Start Today's Quiz
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {userProfile && (
                <UserProfileCard profile={userProfile} />
              )}
            </div>
            
            <div className="flex-1">
              <Leaderboard 
                entries={leaderboard}
                timeFrame={timeFrame}
                onTimeFrameChange={handleTimeFrameChange}
              />
            </div>
          </div>
        )}
      </main>

      <footer className="py-6 px-4 border-t border-trivia-primary/20">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p className="mb-2">
            Built with <span className="text-trivia-primary">Metal</span> by 0xMetropolis
          </p>
          <div className="flex justify-center items-center space-x-4">
            <a href="#" className="hover:text-trivia-primary transition-colors">About</a>
            <span>|</span>
            <a href="#" className="hover:text-trivia-primary transition-colors">Terms</a>
            <span>|</span>
            <a href="#" className="hover:text-trivia-primary transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
      
      <ShareModal
        open={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        result={resultsData}
      />
    </div>
  );
};

export default Index;
