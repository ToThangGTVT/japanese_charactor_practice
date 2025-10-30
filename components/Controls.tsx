import React from 'react';
import type { KanaSet, TimerDuration } from '../types';

interface ControlsProps {
  selectedSets: Set<KanaSet>;
  onSetToggle: (set: KanaSet) => void;
  onReset: () => void;
  timerDuration: TimerDuration;
  onTimerDurationChange: (duration: TimerDuration) => void;
}

const Controls: React.FC<ControlsProps> = ({ 
  selectedSets, 
  onSetToggle, 
  onReset,
  timerDuration,
  onTimerDurationChange 
}) => {
  const getButtonClasses = (set: KanaSet) => {
    const base = "w-full py-2 px-4 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800";
    if (selectedSets.has(set)) {
      return `${base} bg-indigo-600 text-white shadow-md hover:bg-indigo-700 focus:ring-indigo-500`;
    }
    return `${base} bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500 focus:ring-slate-400`;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => onSetToggle('hiragana')} className={getButtonClasses('hiragana')}>
          Hiragana (あ)
        </button>
        <button onClick={() => onSetToggle('katakana')} className={getButtonClasses('katakana')}>
          Katakana (ア)
        </button>
      </div>
      <div className="flex items-center justify-between p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
        <label htmlFor="timer-select" className="font-medium text-slate-700 dark:text-slate-300 px-2">
          Thời gian:
        </label>
        <select
          id="timer-select"
          value={timerDuration}
          onChange={(e) => onTimerDurationChange(Number(e.target.value) as TimerDuration)}
          className="bg-white dark:bg-slate-600 border-slate-300 dark:border-slate-500 rounded-md py-1 text-sm font-semibold focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value={3}>3 giây</option>
          <option value={5}>5 giây</option>
          <option value={10}>10 giây</option>
          <option value={999}>Vô hạn</option>
        </select>
      </div>
       <button 
        onClick={onReset} 
        className="w-full py-2 px-4 rounded-lg font-semibold transition-all duration-200 bg-rose-500 text-white hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
      >
        Chơi Lại
      </button>
    </div>
  );
};

export default Controls;
