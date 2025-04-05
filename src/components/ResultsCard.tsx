
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { UserAnswer } from '@/types';
import { formatTimeLeft } from '@/utils/dateUtils';

interface ResultsCardProps {
  correct: number;
  total: number;
  streak: number;
  answers: Record<number, UserAnswer>;
  onShare?: () => void;
  onDismiss: () => void;
}

const ResultsCard: React.FC<ResultsCardProps> = ({ 
  correct, 
  total, 
  streak, 
  answers,
  onShare,
  onDismiss
}) => {
  const percentage = Math.round((correct / total) * 100);
  const nextTriviaTime = formatTimeLeft(new Date().toISOString().split('T')[0]);
  const isPerfectScore = correct === total;

  return (
    <div className="w-full max-w-lg bg-white rounded-3xl shadow p-6 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">
          {isPerfectScore ? 'Perfect Score!' : 'Quiz Complete!'}
        </h2>
      </div>
      
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-4xl font-bold">
            {correct}/{total}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {isPerfectScore 
              ? 'Amazing job! You got all questions right!' 
              : `You answered ${percentage}% of questions correctly.`}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Score</span>
            <span className="font-semibold">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>

        <div className="flex items-center justify-center space-x-3 p-3 rounded-lg">
          <div className="flex-1 text-center">
            <div className="text-3xl font-bold text-primary">{streak}</div>
            <div className="text-xs text-gray-500">Day Streak</div>
          </div>
          {isPerfectScore && (
            <div className="flex-1 text-center">
              <div className="w-12 h-12 mx-auto rounded-full border-4 border-green-500 flex items-center justify-center">
                <Check className="w-6 h-6 text-green-500" />
              </div>
              <div className="text-xs text-green-500 mt-1">Perfect Score Badge</div>
            </div>
          )}
        </div>

        <div className="text-center text-sm text-gray-500">
          Next trivia in <span className="font-semibold">{nextTriviaTime}</span>
        </div>
      </div>
      
      <div className="flex justify-between gap-4 mt-6">
        <Button 
          variant="outline" 
          className="flex-1 border-gray-300 text-gray-700"
          onClick={onShare}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share Result
        </Button>
        <Button 
          className="flex-1 bg-primary hover:bg-primary/90"
          onClick={onDismiss}
        >
          Done
        </Button>
      </div>
    </div>
  );
};

export default ResultsCard;
