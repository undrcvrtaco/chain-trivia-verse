
import React from 'react';
import { cn } from '@/lib/utils';
import { Question } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { Check } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  selectedOption: number | null;
  onSelectOption: (optionIndex: number) => void;
  showAnswer: boolean;
  isCurrentQuestion: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedOption,
  onSelectOption,
  showAnswer,
  isCurrentQuestion
}) => {
  return (
    <Card className={cn(
      "question-card w-full max-w-lg transition-opacity",
      isCurrentQuestion ? "opacity-100 animate-fade-in" : "opacity-0 hidden"
    )}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <span className="bg-trivia-primary/20 text-trivia-primary px-3 py-1 rounded-full text-sm font-semibold">
            Question {question.id}/3
          </span>
        </div>
        <h3 className="text-xl font-semibold mt-3 text-trivia-light">{question.question}</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !showAnswer && onSelectOption(index)}
              disabled={showAnswer}
              className={cn(
                "w-full text-left p-4 rounded-lg border transition-all",
                "flex items-center justify-between",
                selectedOption === index 
                  ? "border-trivia-primary bg-trivia-primary/10" 
                  : "border-gray-700 bg-gray-800/50 hover:bg-gray-800/80",
                showAnswer && index === question.correctAnswer && "border-green-500 bg-green-500/10",
                showAnswer && selectedOption === index && selectedOption !== question.correctAnswer && "border-red-500 bg-red-500/10"
              )}
            >
              <span>{option}</span>
              {showAnswer && index === question.correctAnswer && (
                <Check className="h-5 w-5 text-green-500" />
              )}
            </button>
          ))}
        </div>
      </CardContent>
      {showAnswer && question.explanation && (
        <CardFooter>
          <CardDescription className="text-sm italic text-gray-400">
            {question.explanation}
          </CardDescription>
        </CardFooter>
      )}
    </Card>
  );
};

export default QuestionCard;
