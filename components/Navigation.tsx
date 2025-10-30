import React from 'react';

type View = 'practice' | 'stats';

interface NavigationProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const getButtonClasses = (view: View) => {
    const base = "flex-1 py-3 px-4 text-center font-semibold transition-colors duration-200 focus:outline-none focus:z-10";
    if (currentView === view) {
      return `${base} bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-md`;
    }
    return `${base} bg-transparent text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400`;
  };

  return (
    <div className="flex w-full max-w-lg mx-auto rounded-xl bg-slate-200 dark:bg-slate-700 p-1 mb-6">
      <button onClick={() => onViewChange('practice')} className={`${getButtonClasses('practice')} rounded-lg`}>
        Luyện tập
      </button>
      <button onClick={() => onViewChange('stats')} className={`${getButtonClasses('stats')} rounded-lg`}>
        Thống kê
      </button>
    </div>
  );
};

export default Navigation;
