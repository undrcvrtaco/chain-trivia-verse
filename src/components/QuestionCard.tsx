
import React from 'react';
import { cn } from '@/lib/utils';
import { Question } from '@/types';
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
    <div className={cn(
      "question-card w-full max-w-lg transition-opacity p-6",
      isCurrentQuestion ? "opacity-100 animate-fade-in" : "opacity-0 hidden"
    )}>
      <div className="flex items-center mb-4">
        <div className="rounded-full bg-gray-200 p-2 mr-3">
          <span className="font-bold">?</span>
        </div>
        <h3 className="text-xl font-medium">{question.question}</h3>
      </div>
      
      <div className="space-y-3 mt-6">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => !showAnswer && onSelectOption(index)}
            disabled={showAnswer}
            className={cn(
              "option-button",
              selectedOption === index 
                ? "option-button-selected" 
                : "bg-white border-gray-200 hover:border-gray-300",
              showAnswer && index === question.correctAnswer && "option-button-correct",
              showAnswer && selectedOption === index && selectedOption !== question.correctAnswer && "option-button-incorrect"
            )}
          >
            <span>{option}</span>
            {(showAnswer && index === question.correctAnswer) || (selectedOption === index && !showAnswer) ? (
              <Check className="h-5 w-5" />
            ) : null}
          </button>
        ))}
      </div>

      {showAnswer && question.explanation && (
        <div className="mt-4 text-sm italic text-gray-500">
          {question.explanation}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
