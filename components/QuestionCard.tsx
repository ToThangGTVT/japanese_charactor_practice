
import React from 'react';
import type { Kana } from '../types';

interface QuestionCardProps {
  currentKana: Kana;
  options: string[];
  answered: boolean;
  selectedAnswer: string | null;
  onAnswerSelect: (romaji: string) => void;
  progress: number;
  isTimed: boolean;
  isTimeUp: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  currentKana,
  options,
  answered,
  selectedAnswer,
  onAnswerSelect,
  progress,
  isTimed,
  isTimeUp
}) => {
  const getOptionClasses = (option: string) => {
    const base = "w-full py-4 text-lg font-semibold rounded-lg transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800";
    if (answered) {
      if (option === currentKana.romaji) {
        return `${base} bg-green-500 text-white scale-105 shadow-lg`;
      }
      if (option === selectedAnswer) {
        return `${base} bg-red-500 text-white`;
      }
      return `${base} bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed`;
    }
    return `${base} bg-slate-100 dark:bg-slate-700 hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-700 dark:hover:text-indigo-300 focus:ring-indigo-500`;
  };

  return (
    <div className="space-y-6">
      {isTimed && (
        <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2.5">
          <div
            className="bg-indigo-500 h-2.5 rounded-full"
            style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
          ></div>
        </div>
      )}
      <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-6 flex flex-col items-center justify-center aspect-video relative">
        {isTimeUp && (
           <div className="absolute top-4 text-xl font-bold text-red-500 animate-pulse">Hết Giờ!</div>
        )}
        <span lang="ja" className="text-8xl md:text-9xl font-bold text-slate-800 dark:text-slate-100 select-none">
          {currentKana.kana}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {options.map(option => (
          <button
            key={option}
            onClick={() => onAnswerSelect(option)}
            disabled={answered}
            className={getOptionClasses(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
