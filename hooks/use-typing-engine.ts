import { useState, useCallback, useEffect, useRef } from 'react';
import { faker } from '@faker-js/faker';

/** Defines the available game modes */
export type GameMode = 'time' | 'words' | 'quote' | 'zen';

/** Tracks the lifecycle of a typing test */
export type GameState = 'start' | 'run' | 'pause' | 'finish';

/** Represents a snapshot of performance at a specific second */
interface HistoryPoint {
  time: number;
  wpm: number;
  raw: number;
  errors: number;
  burst?: number; // Raw speed in the most recent second
}

/** Configuration for the typing engine */
interface TypingOptions {
  mode?: GameMode;
  amount?: number; // duration if time, count if words
  includeNumbers?: boolean;
  includePunctuation?: boolean;
  language?: string;
  disabled?: boolean;
}

/** Static quotes used for 'quote' mode */
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

/**
 * Utility to generate random words using faker.
 * Optionally injects numbers and punctuation based on configuration.
 */
const generateWords = (count: number, includeNumbers: boolean, includePunctuation: boolean, language: string) => {
  try {
    let wordsArray = faker.word.words(count).toLowerCase().split(" ");
    
    // Inject random numbers (approx 20% chance per word)
    if (includeNumbers) {
      for (let i = 0; i < wordsArray.length; i++) {
          if (Math.random() > 0.8) {
              wordsArray[i] = Math.floor(Math.random() * 1000).toString();
          }
      }
    }

    // Inject random punctuation (approx 20% chance per word)
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

/**
 * The core engine hook that manages all typing logic, statistics, and state.
 * This is designed to be a "pure logic" hook that any UI can consume.
 */
export const useTypingEngine = (options: TypingOptions = {}) => {
  const { 
    mode = 'time', 
    amount = 30, 
    includeNumbers = false, 
    includePunctuation = false,
    language = 'english',
    disabled = false
  } = options;
  
  // -- Core State --
  const [state, setState] = useState<GameState>('start');
  const [words, setWords] = useState<string>('');
  const [typed, setTyped] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(amount);
  const [errors, setErrors] = useState(0);
  const [totalTypedCount, setTotalTypedCount] = useState(0); // Cumulative keystrokes
  const [isError, setIsError] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [testDuration, setTestDuration] = useState(0); // Accurate elapsed time
  
  // -- Refs for high-frequency tracking & Timers --
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const secondCounterRef = useRef(0);
  const errorsInLastSecondRef = useRef(0);
  const charsInLastSecondRef = useRef(0);

  // Keep track of previous options to detect changes and sync state
  const [lastOptions, setLastOptions] = useState({ mode, amount, includeNumbers, includePunctuation, language });

  /** Helper to fetch words based on current mode */
  const getNewWords = useCallback((m: GameMode, a: number, n: boolean, p: boolean, l: string) => {
    if (m === 'zen') return "";
    if (m === 'time' || m === 'words') {
        const count = m === 'time' ? 50 : a;
        return generateWords(count, n, p, l);
    }
    if (m === 'quote') {
        return QUOTES[Math.floor(Math.random() * QUOTES.length)];
    }
    return "";
  }, []);

  /**
   * RE-RENDER SYNC: This block ensures that when mode/settings change,
   * the engine resets immediately during the render phase.
   * This prevents "ghost" content from flicking between mode changes.
   */
  if (
    mode !== lastOptions.mode || 
    amount !== lastOptions.amount || 
    includeNumbers !== lastOptions.includeNumbers ||
    includePunctuation !== lastOptions.includePunctuation ||
    language !== lastOptions.language
  ) {
    setLastOptions({ mode, amount, includeNumbers, includePunctuation, language });
    const nextWords = getNewWords(mode, amount, includeNumbers, includePunctuation, language);
    setWords(nextWords);
    setTyped('');
    setState('start');
    setTimeLeft(amount);
  }

  /** Triggers word generation and resets typing progress */
  const updateWords = useCallback(() => {
    const newWords = getNewWords(mode, amount, includeNumbers, includePunctuation, language);
    setWords(newWords);
    setTyped('');
  }, [mode, amount, includeNumbers, includePunctuation, language, getNewWords]);

  /** Resets the entire engine state for a fresh test */
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

  /** 
   * WPM Formula: ((correct_chars / 5) / (seconds / 60)) 
   * Accounts for standard word length (5 characters).
   */
  const calculateWPM = (correctChars: number, seconds: number) => {
    if (seconds <= 0) return 0;
    const minutes = seconds / 60;
    const wordsTyped = correctChars / 5;
    return Math.round(wordsTyped / minutes);
  };

  /** 
   * Raw WPM Formula: ((total_chars_including_errors / 5) / (seconds / 60)) 
   * Measures pure typing speed regardless of accuracy.
   */
  const calculateRawWPM = (totalChars: number, seconds: number) => {
    if (seconds <= 0) return 0;
    const minutes = seconds / 60;
    const wordsTyped = totalChars / 5;
    return Math.round(wordsTyped / minutes);
  };

  /** Finalizes a test and cleans up timers */
  const finish = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    
    // Capture the exact final duration for precise end-of-test stats
    if (startTimeRef.current) {
        setTestDuration((Date.now() - startTimeRef.current) / 1000);
    }
    
    setState('finish');
  }, []);

  /** Main timer loop that runs every second during a test */
  const startTimer = useCallback(() => {
    if (timerRef.current) return;
    startTimeRef.current = Date.now();
    secondCounterRef.current = 0;
    
    timerRef.current = setInterval(() => {
      secondCounterRef.current += 1;
      
      const elapsed = (Date.now() - (startTimeRef.current || 0)) / 1000;
      
      // Calculate snapshot stats for the history chart
      const currentCorrect = Array.from(typed).filter((char, i) => char === words[i]).length;
      const currentWpm = calculateWPM(currentCorrect, elapsed);
      const currentRaw = calculateRawWPM(totalTypedCount, elapsed);
      const currentBurst = calculateRawWPM(charsInLastSecondRef.current, 1);
      
      setHistory(prev => [...prev, {
        time: secondCounterRef.current,
        wpm: currentWpm,
        raw: currentRaw,
        burst: currentBurst,
        errors: errorsInLastSecondRef.current
      }]);
      
      // Reset second-by-second tracking counters
      errorsInLastSecondRef.current = 0;
      charsInLastSecondRef.current = 0;

      // Countdown logic for Time mode
      if (mode === 'time') {
        setTimeLeft((prev) => {
          if (prev <= 1) {
              finish();
              return 0;
          }
          return prev - 1;
        });
      }
      
      // Live updates for UI
      setTestDuration(elapsed);
    }, 1000);
  }, [mode, finish, totalTypedCount, typed, words]);

  /** Pauses the current test */
  const pause = useCallback(() => {
    if (state !== 'run') return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setState('pause');
  }, [state]);

  /** Resumes a paused test */
  const resume = useCallback(() => {
    if (state !== 'pause') return;
    setState('run');
    startTimer();
  }, [state, startTimer]);

  /** Initial load or manual mode switches */
  useEffect(() => {
    if (!words && mode !== 'zen') {
        updateWords();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [updateWords, words, mode]);

  /** Sync timeLeft with amount when switching modes */
  useEffect(() => {
    if (state === 'start') {
        setTimeLeft(amount);
    }
  }, [amount, mode, state]);

  /** Word count detection for 'words' mode */
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

  /**
   * MAIN INPUT HANDLER
   * Intercepts all global key presses.
   */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (state === 'finish' || disabled) return;
    
    // Safety check: ignore typing while the user is inside an input field
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      (e.target as HTMLElement).isContentEditable
    ) {
      return;
    }
    
    // Shortcut: Tab or Alt+Enter to restart
    if (e.key === 'Tab' || (e.key === 'Enter' && e.altKey)) {
      e.preventDefault();
      restart();
      return;
    }

    /** Validation for typing keys vs utility keys */
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

    if (!isKeyboardCodeAllowed(e.code) && e.key !== 'Enter') return;

    // Start on first key
    if (state === 'start' && e.key !== 'Backspace') {
      setState('run');
      startTimer();
    }

    if (state === 'pause' && e.key !== 'Backspace') {
      resume();
    }

    // Zen Mode: Shift + Enter to finish (because it's infinite by default)
    if (mode === 'zen' && e.key === 'Enter' && e.shiftKey) {
        e.preventDefault();
        finish();
        return;
    }

    // -- Actual Character Processing --
    if (e.key === 'Backspace') {
      setTyped((prev) => prev.slice(0, -1));
      // In professional typing tools, raw wpm includes backspaced characters (keystrokes).
      // Accuracy is focused on the final correct characters.
    } else if (e.key.length === 1 || (mode === 'zen' && e.key === 'Enter')) {
      const nextChar = e.key === 'Enter' ? '\n' : e.key;
      const expectedChar = mode === 'zen' ? nextChar : words[typed.length];
      
      charsInLastSecondRef.current += 1;
      
      // Error Detection
      if (nextChar !== expectedChar) {
        setErrors((prev) => prev + 1);
        errorsInLastSecondRef.current += 1;
        setIsError(true);
        setLastError(nextChar);
        
        // Brief flash of red/error state
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
        // Infinity scroll for Time mode: generate more words if we reach the end
        if (newVal.length >= words.length - 20 && mode === 'time') {
            const extra = generateWords(20, includeNumbers, includePunctuation, language);
            setWords(w => w + " " + extra);
        }
        return newVal;
      });

      // Special handling for Zen mode which reflects input back into the 'target' words
      if (mode === 'zen') {
          setWords(prev => prev + nextChar);
      }

      setTotalTypedCount(prev => prev + 1);

      // Quote mode completion detection
      if (mode === 'quote' && typed.length + 1 >= words.length) {
          finish();
      }
    }
  }, [state, words, typed, startTimer, mode, language, includeNumbers, includePunctuation, restart, finish, amount, disabled]);

  /** Global listener for key events */
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const finalElapsedTime = testDuration || (startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 : 0);
  
  /**
   * Comprehensive performance statistics.
   * Calculates Correct, Incorrect, Extra (typed past word length), and Missed characters.
   */
  const getCharStats = () => {
    let correct = 0;
    let incorrect = 0;
    let extra = 0;
    let missed = 0;

    typed.split("").forEach((char, i) => {
        if (i < words.length) {
            if (char === words[i]) correct++;
            else incorrect++;
        } else {
            extra++;
        }
    });

    // Count chars the user didn't reach
    if (state === 'finish' && mode !== 'zen') {
        if (words.length > typed.length) {
            missed = words.length - typed.length;
        }
    }

    return { correct, incorrect, extra, missed };
  };

  const charStats = getCharStats();
  
  // Real-time Metrics
  const wpm = calculateWPM(charStats.correct, finalElapsedTime || (1/60));
  const rawWpm = calculateRawWPM(totalTypedCount, finalElapsedTime || (1/60));
  const accuracy = totalTypedCount === 0 ? 0 : Math.max(0, Math.round(((totalTypedCount - errors) / totalTypedCount) * 100));

  /** 
   * Consistency calculation based on speed variance over time.
   * High consistency means the typist maintained a steady pace.
   */
  const calculateConsistency = () => {
    if (history.length < 2) return 100;
    const wpms = history.map(h => h.wpm);
    const avg = wpms.reduce((a, b) => a + b, 0) / wpms.length;
    const variance = wpms.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / wpms.length;
    const stdDev = Math.sqrt(variance);
    // Lower relative deviation = higher consistency
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
    pause,
    resume,
    wpm,
    rawWpm,
    accuracy,
    history,
    testDuration: Math.round(finalElapsedTime),
    consistency: calculateConsistency(),
    charStats
  };
};
