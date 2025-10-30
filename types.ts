export interface Kana {
  kana: string;
  romaji: string;
}

export type KanaSet = 'hiragana' | 'katakana';

export type KanaStats = Record<string, { correct: number; total: number }>;

export type TimerDuration = 3 | 5 | 10 | 999; // 999 represents unlimited time
