import React, { useState, useEffect } from 'react';
import type { KanaStats } from '../types';
import { HIRAGANA, KATAKANA } from '../constants';

interface StatisticsProps {
  onResetStats: () => void;
}

const getMasteryColor = (correct: number, total: number): string => {
  if (total === 0) return 'bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-400';
  const accuracy = correct / total;
  if (accuracy >= 0.9) return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
  if (accuracy >= 0.7) return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
  return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
};

const KanaGrid: React.FC<{ title: string, kanaSet: typeof HIRAGANA, stats: KanaStats }> = ({ title, kanaSet, stats }) => (
  <div>
    <h3 className="text-xl font-bold mb-3 text-slate-700 dark:text-slate-300">{title}</h3>
    <div className="grid grid-cols-5 gap-2 text-center">
      {kanaSet.map(({ kana }) => {
        const kanaStat = stats[kana] || { correct: 0, total: 0 };
        const accuracy = kanaStat.total > 0 ? `${Math.round((kanaStat.correct / kanaStat.total) * 100)}%` : '-';
        return (
          <div key={kana} className={`p-2 rounded-lg ${getMasteryColor(kanaStat.correct, kanaStat.total)}`}>
            <div lang="ja" className="text-2xl font-bold">{kana}</div>
            <div className="text-xs">{accuracy}</div>
          </div>
        );
      })}
    </div>
  </div>
);

const Statistics: React.FC<StatisticsProps> = ({ onResetStats }) => {
  const [stats, setStats] = useState<KanaStats>({});
  
  useEffect(() => {
    try {
      const storedStats = localStorage.getItem('kana-stats');
      if (storedStats) {
        setStats(JSON.parse(storedStats));
      }
    } catch (error) {
      console.error("Failed to parse stats from localStorage", error);
    }
  }, []);

  // FIX: Explicitly cast the result of `Object.values(stats)` to ensure TypeScript
  // correctly infers the type of `curr` within the reduce function. This resolves
  // the 'property does not exist on type unknown' errors.
  const overall = (Object.values(stats) as Array<{ correct: number; total: number }>).reduce(
    (acc, curr) => {
      acc.correct += curr.correct;
      acc.total += curr.total;
      return acc;
    },
    { correct: 0, total: 0 }
  );

  const overallAccuracy = overall.total > 0 ? ((overall.correct / overall.total) * 100).toFixed(1) : '0.0';

  const handleReset = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tất cả thống kê? Hành động này không thể hoàn tác.')) {
      onResetStats();
      setStats({});
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
      <h2 className="text-2xl font-bold text-center text-indigo-600 dark:text-indigo-400">Thống kê tiến độ</h2>
      
      <div className="flex justify-around bg-slate-100 dark:bg-slate-700 p-4 rounded-xl text-center shadow-inner">
        <div>
          <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Tổng đã trả lời</span>
          <p className="text-2xl font-bold text-slate-700 dark:text-slate-200">{overall.total}</p>
        </div>
        <div>
          <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Chính xác chung</span>
          <p className="text-2xl font-bold text-indigo-500 dark:text-indigo-400">{overallAccuracy}%</p>
        </div>
      </div>

      <div className="space-y-6">
        <KanaGrid title="Hiragana" kanaSet={HIRAGANA} stats={stats} />
        <KanaGrid title="Katakana" kanaSet={KATAKANA} stats={stats} />
      </div>

      <button
        onClick={handleReset}
        className="w-full mt-4 py-2 px-4 rounded-lg font-semibold transition-all duration-200 bg-rose-500 text-white hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
      >
        Xóa toàn bộ thống kê
      </button>
    </div>
  );
};

export default Statistics;
