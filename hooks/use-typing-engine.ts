import { useState, useCallback, useEffect, useRef } from 'react';
import { faker } from '@faker-js/faker';

export type GameState = 'start' | 'run' | 'finish';

const generateWords = (count: number) => {
  return faker.word.words(count).toLowerCase();
};

const isKeyboardCodeAllowed = (code: string) => {
  return (
    code.startsWith("Key") ||
    code.startsWith("Digit") ||
    code === "Backspace" ||
    code === "Space" ||
    code === "Minus" ||
    code === "Equal" ||
    code === "BracketLeft" ||
    code === "BracketRight" ||
    code === "Semicolon" ||
    code === "Quote" ||
    code === "Comma" ||
    code === "Period" ||
    code === "Slash"
  );
};

export const useTypingEngine = (duration: number = 30) => {
  const [state, setState] = useState<GameState>('start');
  const [words, setWords] = useState<string>('');
  const [typed, setTyped] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(duration);
  const [errors, setErrors] = useState(0);
  const [isError, setIsError] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const totalTyped = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateWords = useCallback(() => {
    const newWords = generateWords(15);
    setWords(newWords);
    setTyped('');
  }, []);

  const restart = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setState('start');
    setTimeLeft(duration);
    setErrors(0);
    setIsError(false);
    setLastError(null);
    totalTyped.current = 0;
    updateWords();
  }, [duration, updateWords]);

  const clearError = useCallback(() => {
    setIsError(false);
    setLastError(null);
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) return;
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setState('finish');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    updateWords();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [updateWords]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (state === 'finish') return;
    
    // Explicitly handle Tab for restart
    if (e.key === 'Tab') {
      e.preventDefault();
      restart();
      return;
    }

    if (!isKeyboardCodeAllowed(e.code)) return;

    if (state === 'start' && e.key !== 'Backspace') {
      setState('run');
      startTimer();
    }

    if (e.key === 'Backspace') {
      setTyped((prev) => prev.slice(0, -1));
      if (totalTyped.current > 0) totalTyped.current -= 1;
    } else if (e.key.length === 1) {
      const nextChar = e.key;
      const expectedChar = words[typed.length];
      
      if (nextChar !== expectedChar) {
        setErrors((prev) => prev + 1);
        setIsError(true);
        setLastError(nextChar);
        
        if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
        errorTimeoutRef.current = setTimeout(() => {
          setIsError(false);
          setLastError(null);
        }, 500);
        return;
      }
      
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
      setTyped((prev) => prev + nextChar);
      totalTyped.current += 1;
      setIsError(false);
      setLastError(null);

      // If finished current set of words, generate new ones
      if (typed.length + 1 === words.length) {
        updateWords();
      }
    }
  }, [state, words, typed, startTimer, updateWords, restart]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const calculateWPM = () => {
    const minutes = (duration - timeLeft) / 60 || 1/60;
    const wordsTyped = totalTyped.current / 5; // Standard WPM formula
    return Math.round(wordsTyped / minutes);
  };

  const calculateAccuracy = () => {
    if (totalTyped.current === 0) return 0;
    const corrects = totalTyped.current - errors;
    return Math.max(0, Math.round((corrects / totalTyped.current) * 100));
  };

  return {
    state,
    words,
    typed,
    timeLeft,
    errors,
    isError,
    lastError,
    totalTyped: totalTyped.current,
    restart,
    clearError,
    wpm: calculateWPM(),
    accuracy: calculateAccuracy(),
  };
};
