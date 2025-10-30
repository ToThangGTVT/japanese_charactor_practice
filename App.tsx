
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HIRAGANA, KATAKANA } from './constants';
import type { Kana, KanaSet, KanaStats, TimerDuration } from './types';
import Scoreboard from './components/Scoreboard';
import Controls from './components/Controls';
import QuestionCard from './components/QuestionCard';
import Statistics from './components/Statistics';
import Navigation from './components/Navigation';
import { useAudio } from './useAudio';

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

type View = 'practice' | 'stats';

const App: React.FC = () => {
  const [view, setView] = useState<View>('practice');
  const [selectedSets, setSelectedSets] = useState<Set<KanaSet>>(new Set(['hiragana']));
  const [characterPool, setCharacterPool] = useState<Kana[]>([]);
  
  const [questionQueue, setQuestionQueue] = useState<Kana[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [currentKana, setCurrentKana] = useState<Kana | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const [timerDuration, setTimerDuration] = useState<TimerDuration>(5);
  const [timeLeft, setTimeLeft] = useState<number>(timerDuration);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const playSound = useAudio();

  useEffect(() => {
    let newPool: Kana[] = [];
    if (selectedSets.has('hiragana')) {
      newPool = [...newPool, ...HIRAGANA];
    }
    if (selectedSets.has('katakana')) {
      newPool = [...newPool, ...KATAKANA];
    }
    setCharacterPool(newPool);

    const newQueue = shuffleArray(newPool);
    setQuestionQueue(newQueue);
    setCurrentIndex(0);
  }, [selectedSets]);

  const generateQuestion = useCallback(() => {
    if (questionQueue.length === 0) {
      setCurrentKana(null);
      setOptions([]);
      return;
    }

    const correctKana = questionQueue[currentIndex];
    
    const wrongOptions: string[] = [];
    while (wrongOptions.length < 3 && characterPool.length > 3) {
      const randomKana = characterPool[Math.floor(Math.random() * characterPool.length)];
      if (randomKana.romaji !== correctKana.romaji && !wrongOptions.includes(randomKana.romaji)) {
        wrongOptions.push(randomKana.romaji);
      }
    }

    setCurrentKana(correctKana);
    setOptions(shuffleArray([correctKana.romaji, ...wrongOptions]));
    setAnswered(false);
    setSelectedAnswer(null);
  }, [currentIndex, questionQueue, characterPool]);

  useEffect(() => {
    generateQuestion();
  }, [currentIndex, questionQueue, generateQuestion]);

  const handleNextQuestion = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= questionQueue.length) {
      setQuestionQueue(shuffleArray(characterPool));
      setCurrentIndex(0);
    } else {
      setCurrentIndex(nextIndex);
    }
  }, [currentIndex, questionQueue, characterPool]);

  const handleTimeUp = useCallback(() => {
    if (answered || !currentKana) return;
    
    playSound('incorrect');
    setAnswered(true);
    setSelectedAnswer(null);

    setScore(prev => ({
      total: prev.total + 1,
      correct: prev.correct,
    }));

    try {
      const storedStats = localStorage.getItem('kana-stats');
      const stats: KanaStats = storedStats ? JSON.parse(storedStats) : {};
      const kanaChar = currentKana.kana;
      if (!stats[kanaChar]) {
        stats[kanaChar] = { correct: 0, total: 0 };
      }
      stats[kanaChar].total += 1;
      localStorage.setItem('kana-stats', JSON.stringify(stats));
    } catch (error) {
      console.error("Failed to update stats in localStorage", error);
    }

    setTimeout(() => {
      handleNextQuestion();
    }, 2000);
  }, [answered, currentKana, handleNextQuestion, playSound]);

  useEffect(() => {
    if (answered || timerDuration === 999 || view !== 'practice' || !currentKana) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setTimeLeft(timerDuration);

    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 0.1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        return prevTime - 0.1;
      });
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentKana, answered, timerDuration, view, handleTimeUp]);


  const handleSetToggle = (set: KanaSet) => {
    setSelectedSets(prev => {
      const newSets = new Set(prev);
      if (newSets.has(set)) {
        if (newSets.size > 1) {
          newSets.delete(set);
        }
      } else {
        newSets.add(set);
      }
      return newSets;
    });
    setScore({ correct: 0, total: 0 });
  };

  const handleAnswerSelect = useCallback((romaji: string) => {
    if (answered || !currentKana) return;

    const isCorrect = romaji === currentKana.romaji;
    
    if (isCorrect) {
      playSound('correct');
    } else {
      playSound('incorrect');
    }

    setAnswered(true);
    setSelectedAnswer(romaji);
    
    setScore(prev => ({
      total: prev.total + 1,
      correct: isCorrect ? prev.correct + 1 : prev.correct,
    }));
    
    try {
      const storedStats = localStorage.getItem('kana-stats');
      const stats: KanaStats = storedStats ? JSON.parse(storedStats) : {};
      const kanaChar = currentKana.kana;
      if (!stats[kanaChar]) {
        stats[kanaChar] = { correct: 0, total: 0 };
      }
      stats[kanaChar].total += 1;
      if (isCorrect) {
        stats[kanaChar].correct += 1;
      }
      localStorage.setItem('kana-stats', JSON.stringify(stats));
    } catch (error) {
      console.error("Failed to update stats in localStorage", error);
    }

    setTimeout(() => {
      handleNextQuestion();
    }, 1000);
  }, [answered, currentKana, handleNextQuestion, playSound]);

  const resetGame = () => {
    setScore({ correct: 0, total: 0 });
    if (characterPool.length > 0) {
      setQuestionQueue(shuffleArray(characterPool));
      setCurrentIndex(0);
    }
  };

  const handleResetStats = () => {
    localStorage.removeItem('kana-stats');
    resetGame();
  };

  const progress = timerDuration === 999 ? 100 : (timeLeft / timerDuration) * 100;
  const isTimeUp = answered && selectedAnswer === null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
       <header className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-600 dark:text-indigo-400">Luyện Kana</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          {view === 'practice' 
            ? 'Chọn Romaji đúng cho mỗi ký tự' 
            : 'Xem lại tiến độ học tập của bạn'}
        </p>
      </header>

      <Navigation currentView={view} onViewChange={setView} />

      <div className="w-full max-w-lg mx-auto">
        {view === 'practice' ? (
          <main className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
            <Scoreboard score={score} />
            <Controls 
              selectedSets={selectedSets} 
              onSetToggle={handleSetToggle} 
              onReset={resetGame} 
              timerDuration={timerDuration}
              onTimerDurationChange={setTimerDuration}
            />
            {currentKana ? (
              <QuestionCard
                key={currentIndex}
                currentKana={currentKana}
                options={options}
                answered={answered}
                selectedAnswer={selectedAnswer}
                onAnswerSelect={handleAnswerSelect}
                progress={progress}
                isTimed={timerDuration !== 999}
                isTimeUp={isTimeUp}
              />
            ) : (
              <div className="text-center p-8 rounded-lg bg-slate-50 dark:bg-slate-700">
                <p className="text-lg text-slate-500 dark:text-slate-400">Vui lòng chọn ít nhất một bộ chữ cái để bắt đầu.</p>
              </div>
            )}
          </main>
        ) : (
          <Statistics onResetStats={handleResetStats} />
        )}
        
        <footer className="text-center mt-8">
            <p className="text-sm text-slate-500 dark:text-slate-500">
                Một ứng dụng React & Tailwind CSS
            </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
