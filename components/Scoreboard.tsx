
import React from 'react';

interface ScoreboardProps {
  score: {
    correct: number;
    total: number;
  };
}

const Scoreboard: React.FC<ScoreboardProps> = ({ score }) => {
  const accuracy = score.total > 0 ? ((score.correct / score.total) * 100).toFixed(1) : '0.0';

  return (
    <div className="flex justify-around bg-slate-100 dark:bg-slate-700 p-4 rounded-xl text-center shadow-inner">
      <div>
        <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Đúng</span>
        <p className="text-2xl font-bold text-green-500">{score.correct}</p>
      </div>
      <div>
        <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Tổng</span>
        <p className="text-2xl font-bold text-slate-700 dark:text-slate-200">{score.total}</p>
      </div>
      <div>
        <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Chính xác</span>
        <p className="text-2xl font-bold text-indigo-500 dark:text-indigo-400">{accuracy}%</p>
      </div>
    </div>
  );
};

export default Scoreboard;
