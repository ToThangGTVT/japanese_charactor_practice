import { useCallback } from 'react';

export type SoundType = 'correct' | 'incorrect';

export function useAudio() {
  const playSound = useCallback((type: SoundType) => {
    try {
      const audioSrc =
        type === 'correct'
          ? '/sounds/correct.mp3'
          : '/sounds/incorrect.mp3';

      const audio = new Audio(audioSrc);
      audio.volume = 1;

      // Phát âm thanh
      audio.play().catch((error) => {
        console.error(`Error playing ${type} sound:`, error);
      });
    } catch (e) {
      console.error('Could not play audio', e);
    }
  }, []);

  return playSound;
}
