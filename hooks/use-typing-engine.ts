import { useState, useCallback, useEffect, useRef } from 'react';
import { faker } from '@faker-js/faker';

export type GameMode = 'time' | 'words' | 'quote' | 'zen';
export type GameState = 'start' | 'run' | 'finish';

interface HistoryPoint {
  time: number;
  wpm: number;
  raw: number;
  errors: number;
}

interface TypingOptions {
  mode?: GameMode;
  amount?: number; // duration if time, count if words
  includeNumbers?: boolean;
  includePunctuation?: boolean;
  language?: string;
  disabled?: boolean;
}

const QUOTES = [
  "the only way to do great work is to love what you do.",
  "stay hungry, stay foolish.",
  "innovation distinguishes between a leader and a follower.",
  "your time is limited, so don't waste it living someone else's life.",
  "design is not just what it looks like and feels like. design is how it works.",
  "be the change that you wish to see in the world.",
  "in the end, it's not the years in your life that count. it's the life in your years.",
  "life is what happens when you're busy making other plans.",
];

const generateWords = (count: number, includeNumbers: boolean, includePunctuation: boolean, language: string) => {
  try {
    let wordsArray = faker.word.words(count).toLowerCase().split(" ");
    
    if (includeNumbers) {
      for (let i = 0; i < wordsArray.length; i++) {
          if (Math.random() > 0.8) {
              wordsArray[i] = Math.floor(Math.random() * 1000).toString();
          }
      }
    }

    if (includePunctuation) {
      const punctuations = [".", ",", "!", "?", ";", ":"];
      for (let i = 0; i < wordsArray.length; i++) {
          if (Math.random() > 0.8) {
              const pChar = punctuations[Math.floor(Math.random() * punctuations.length)];
              wordsArray[i] += pChar;
          }
      }
    }

    return wordsArray.join(" ");
  } catch (e) {
    return "error generating words";
  }
};

export const useTypingEngine = (options: TypingOptions = {}) => {
  const { 
    mode = 'time', 
    amount = 30, 
    includeNumbers = false, 
    includePunctuation = false,
    language = 'english',
    disabled = false
  } = options;
  
  const [state, setState] = useState<GameState>('start');
  const [words, setWords] = useState<string>('');
  const [typed, setTyped] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(amount);
  const [errors, setErrors] = useState(0);
  const [totalTypedCount, setTotalTypedCount] = useState(0);
  const [isError, setIsError] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [testDuration, setTestDuration] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const secondCounterRef = useRef(0);
  const errorsInLastSecondRef = useRef(0);
  const charsInLastSecondRef = useRef(0);

  const updateWords = useCallback(() => {
    let newWords = "";
    if (mode === 'time' || mode === 'words' || mode === 'zen') {
        const count = mode === 'time' ? 50 : amount;
        newWords = generateWords(count, includeNumbers, includePunctuation, language);
    } else if (mode === 'quote') {
        newWords = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    }
    setWords(newWords);
    setTyped('');
  }, [mode, amount, includeNumbers, includePunctuation, language]);

  const restart = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    startTimeRef.current = null;
    secondCounterRef.current = 0;
    errorsInLastSecondRef.current = 0;
    charsInLastSecondRef.current = 0;
    setState('start');
    setTimeLeft(amount);
    setErrors(0);
    setTotalTypedCount(0);
    setIsError(false);
    setLastError(null);
    setHistory([]);
    setTestDuration(0);
    updateWords();
  }, [amount, updateWords]);

  const calculateWPM = (correctChars: number, seconds: number) => {
    if (seconds <= 0) return 0;
    const minutes = seconds / 60;
    const wordsTyped = correctChars / 5;
    return Math.round(wordsTyped / minutes);
  };

  const calculateRawWPM = (totalChars: number, seconds: number) => {
    if (seconds <= 0) return 0;
    const minutes = seconds / 60;
    const wordsTyped = totalChars / 5;
    return Math.round(wordsTyped / minutes);
  };

  const finish = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setState('finish');
    if (startTimeRef.current) {
        setTestDuration(Math.round((Date.now() - startTimeRef.current) / 1000));
    }
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) return;
    startTimeRef.current = Date.now();
    secondCounterRef.current = 0;
    
    timerRef.current = setInterval(() => {
      secondCounterRef.current += 1;
      
      const elapsed = (Date.now() - (startTimeRef.current || 0)) / 1000;
      const currentWpm = calculateWPM(totalTypedCount - errors, elapsed);
      const currentRaw = calculateRawWPM(totalTypedCount, elapsed);
      // Burst is instantaneous raw WPM for the last second
      const currentBurst = calculateRawWPM(charsInLastSecondRef.current, 1);
      
      setHistory(prev => [...prev, {
        time: secondCounterRef.current,
        wpm: currentWpm,
        raw: currentRaw,
        burst: currentBurst,
        errors: errorsInLastSecondRef.current
      }]);
      
      errorsInLastSecondRef.current = 0;
      charsInLastSecondRef.current = 0;

      if (mode === 'time') {
        setTimeLeft((prev) => {
          if (prev <= 1) {
              finish();
              return 0;
          }
          return prev - 1;
        });
      } else {
        setTestDuration(prev => prev + 1);
      }
    }, 1000);
  }, [mode, finish, totalTypedCount, errors]);

  useEffect(() => {
    updateWords();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [updateWords]);

  useEffect(() => {
    if (state === 'start') {
        setTimeLeft(amount);
    }
  }, [amount, mode, state]);

  useEffect(() => {
    if (mode === 'words') {
        const currentTypedWords = typed.trim().split(/\s+/).filter(Boolean);
        const remaining = Math.max(0, amount - currentTypedWords.length);
        setTimeLeft(remaining);
        
        if (remaining === 0 && typed.endsWith(" ")) {
            finish();
        }
    }
  }, [typed, mode, amount, finish]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (state === 'finish' || disabled) return;
    
    // Ignore if typing in an input, textarea or contenteditable
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      (e.target as HTMLElement).isContentEditable
    ) {
      return;
    }
    
    if (e.key === 'Tab') {
      e.preventDefault();
      restart();
      return;
    }

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

    if (!isKeyboardCodeAllowed(e.code)) return;

    if (state === 'start' && e.key !== 'Backspace') {
      setState('run');
      startTimer();
    }

    if (e.key === 'Backspace') {
      setTyped((prev) => prev.slice(0, -1));
      setTotalTypedCount(prev => Math.max(0, prev - 1));
    } else if (e.key.length === 1) {
      const nextChar = e.key;
      const expectedChar = words[typed.length];
      
      charsInLastSecondRef.current += 1;
      if (nextChar !== expectedChar) {
        setErrors((prev) => prev + 1);
        errorsInLastSecondRef.current += 1;
        setIsError(true);
        setLastError(nextChar);
        
        if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
        errorTimeoutRef.current = setTimeout(() => {
          setIsError(false);
          setLastError(null);
        }, 500);
      } else {
        setIsError(false);
        setLastError(null);
      }
      
      setTyped((prev) => {
        const newVal = prev + nextChar;
        if (newVal.length >= words.length - 20 && mode === 'time') {
            const extra = generateWords(20, includeNumbers, includePunctuation, language);
            setWords(w => w + " " + extra);
        }
        return newVal;
      });
      setTotalTypedCount(prev => prev + 1);

      if (mode === 'quote' && typed.length + 1 >= words.length) {
          finish();
      }
    }
  }, [state, words, typed, startTimer, mode, language, includeNumbers, includePunctuation, restart, finish, amount, disabled]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const finalElapsedTime = startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 : 0;
  
  const wpm = calculateWPM(totalTypedCount - errors, testDuration || finalElapsedTime || (1/60));
  const rawWpm = calculateRawWPM(totalTypedCount, testDuration || finalElapsedTime || (1/60));
  const accuracy = totalTypedCount === 0 ? 0 : Math.max(0, Math.round(((totalTypedCount - errors) / totalTypedCount) * 100));

  // Consistency calculation: simple standard deviation based consistency
  const calculateConsistency = () => {
    if (history.length < 2) return 100;
    const wpms = history.map(h => h.wpm);
    const avg = wpms.reduce((a, b) => a + b, 0) / wpms.length;
    const variance = wpms.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / wpms.length;
    const stdDev = Math.sqrt(variance);
    // Rough estimate: consistency is relative to how much you deviate from average
    const cons = Math.max(0, Math.min(100, Math.round(100 - (stdDev / (avg || 1) * 100))));
    return cons;
  };

  return {
    state,
    words,
    typed,
    timeLeft,
    errors,
    isError,
    lastError,
    totalTyped: totalTypedCount,
    restart,
    wpm,
    rawWpm,
    accuracy,
    history,
    testDuration: testDuration || Math.round(finalElapsedTime),
    consistency: calculateConsistency(),
    charStats: {
        correct: totalTypedCount - errors,
        incorrect: errors,
        extra: 0, // Placeholder
        missed: 0 // Placeholder
    }
  };
};
