import { useState, useCallback, useEffect, useRef } from 'react';
import { LOCALIZED_WORDS, LOCALIZED_QUOTES } from '@/lib/languages-data';
import {
  calculateWPM,
  calculateRawWPM,
  calculateAccuracy,
  calculateConsistency,
} from '@/lib/calculations';
import {
  faker,
  fakerES,
  fakerFR,
  fakerRU,
  fakerJA,
  fakerZH_CN,
  fakerKO,
  fakerAR,
  fakerBN_BD,
  fakerNE,
  fakerTR,
  fakerVI,
  fakerTH,
  fakerNL,
  fakerSV,
  fakerNB_NO,
  fakerDA,
  fakerDE,
  fakerIT,
  fakerPL,
  fakerPT_BR,
} from '@faker-js/faker';

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
  confidenceMode?: boolean;
}

/**
 * Languages that do not have upper/lower case distinctions.
 */
const LANGUAGES_WITHOUT_CASING = [
  'japanese',
  'chinese',
  'korean',
  'arabic',
  'hindi',
  'bengali',
  'thai',
  'nepali',
];

/**
 * Maps a language string to a specific Faker instance for localized word generation.
 * Supports prefixes to handle variations like "english 1k" or "spanish 10k".
 */
const getFakerInstance = (lang: string) => {
  const l = lang.toLowerCase();
  if (l.startsWith('spanish')) return fakerES;
  if (l.startsWith('french')) return fakerFR;
  if (l.startsWith('russian')) return fakerRU;
  if (l.startsWith('japanese')) return fakerJA;
  if (l.startsWith('chinese')) return fakerZH_CN;
  if (l.startsWith('korean')) return fakerKO;
  if (l.startsWith('arabic')) return fakerAR;
  if (l.startsWith('bengali')) return fakerBN_BD;
  if (l.startsWith('nepali')) return fakerNE;
  if (l.startsWith('turkish')) return fakerTR;
  if (l.startsWith('vietnamese')) return fakerVI;
  if (l.startsWith('thai')) return fakerTH;
  if (l.startsWith('dutch')) return fakerNL;
  if (l.startsWith('swedish')) return fakerSV;
  if (l.startsWith('norwegian')) return fakerNB_NO;
  if (l.startsWith('danish')) return fakerDA;
  if (l.startsWith('german')) return fakerDE;
  if (l.startsWith('italian')) return fakerIT;
  if (l.startsWith('polish')) return fakerPL;
  if (l.startsWith('portuguese')) return fakerPT_BR;
  // Default to English
  return faker;
};

/**
 * Utility to generate random words.
 * Uses localized word lists for non-latin languages (Bengali, Arabic, etc.)
 * and falls back to localized Faker instances for supported western languages.
 */
const generateWords = (
  count: number,
  includeNumbers: boolean,
  includePunctuation: boolean,
  language: string,
) => {
  try {
    const langKey = language.toLowerCase();
    let wordsArray: string[] = [];

    // Check if we have a high-quality static list for this language
    // This solves the issue of Faker falling back to English for non-Latin locales.
    const customList =
      LOCALIZED_WORDS[langKey] ||
      Object.entries(LOCALIZED_WORDS).find(([k]) => langKey.includes(k))?.[1];

    if (customList) {
      // Pick random words from our high-quality dictionary
      for (let i = 0; i < count; i++) {
        const randomWord = customList[Math.floor(Math.random() * customList.length)];
        wordsArray.push(randomWord);
      }
    } else {
      // Fallback to Faker for supported western languages
      const fakerInstance = getFakerInstance(language);
      wordsArray = fakerInstance.word.words(count).split(' ');

      // Only apply lowercase to languages that have casing
      const hasCasing = !LANGUAGES_WITHOUT_CASING.some((l: string) =>
        language.toLowerCase().includes(l),
      );
      if (hasCasing) {
        wordsArray = wordsArray.map((w: string) => w.toLowerCase());
      }
    }

    // Inject random numbers (approx 15% chance per word)
    if (includeNumbers) {
      for (let i = 0; i < wordsArray.length; i++) {
        if (Math.random() > 0.85) {
          wordsArray[i] = Math.floor(Math.random() * 1000).toString();
        }
      }
    }

    // Inject random punctuation (approx 15% chance per word)
    if (includePunctuation) {
      const punctuations = ['.', ',', '!', '?', ';', ':'];
      for (let i = 0; i < wordsArray.length; i++) {
        if (Math.random() > 0.85) {
          const pChar = punctuations[Math.floor(Math.random() * punctuations.length)];
          wordsArray[i] += pChar;
        }
      }
    }

    return wordsArray.join(' ');
  } catch {
    return 'error generating words';
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
    disabled = false,
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
  const [lastOptions, setLastOptions] = useState({
    mode,
    amount,
    includeNumbers,
    includePunctuation,
    language,
  });

  /** Helper to fetch words based on current mode */
  const getNewWords = useCallback((m: GameMode, a: number, n: boolean, p: boolean, l: string) => {
    if (m === 'zen') return '';
    if (m === 'time' || m === 'words') {
      const count = m === 'time' ? 50 : a;
      return generateWords(count, n, p, l);
    }
    if (m === 'quote') {
      const langQuotes =
        LOCALIZED_QUOTES[l] ||
        Object.entries(LOCALIZED_QUOTES).find(([k]) => l.includes(k))?.[1] ||
        LOCALIZED_QUOTES['english'];
      return langQuotes[Math.floor(Math.random() * langQuotes.length)];
    }
    return '';
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

      setHistory((prev) => [
        ...prev,
        {
          time: secondCounterRef.current,
          wpm: currentWpm,
          raw: currentRaw,
          burst: currentBurst,
          errors: errorsInLastSecondRef.current,
        },
      ]);

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

      if (remaining === 0 && typed.endsWith(' ')) {
        finish();
      }
    }
  }, [typed, mode, amount, finish]);

  /**
   * MAIN INPUT HANDLER
   * Intercepts all global key presses.
   */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
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
          code.startsWith('Key') ||
          code.startsWith('Digit') ||
          code === 'Backspace' ||
          code === 'Space' ||
          code === 'Minus' ||
          code === 'Equal' ||
          code === 'BracketLeft' ||
          code === 'BracketRight' ||
          code === 'Semicolon' ||
          code === 'Quote' ||
          code === 'Comma' ||
          code === 'Period' ||
          code === 'Slash'
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
        if (options.confidenceMode) return; // Ignore backspace in confidence mode
        setTyped((prev: string) => prev.slice(0, -1));
        // In professional typing tools, raw wpm includes backspaced characters (keystrokes).
        // Accuracy is focused on the final correct characters.
      } else if (e.key.length === 1 || (mode === 'zen' && e.key === 'Enter')) {
        const nextChar = e.key === 'Enter' ? '\n' : e.key;
        const expectedChar = mode === 'zen' ? nextChar : words[typed.length];

        charsInLastSecondRef.current += 1;

        // Error Detection
        if (nextChar !== expectedChar) {
          setErrors((prev: number) => prev + 1);
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

        setTyped((prev: string) => {
          const newVal = prev + nextChar;
          // Infinity scroll for Time mode: generate more words if we reach the end
          if (newVal.length >= words.length - 20 && mode === 'time') {
            const extra = generateWords(20, includeNumbers, includePunctuation, language);
            setWords((w: string) => w + ' ' + extra);
          }
          return newVal;
        });

        // Special handling for Zen mode which reflects input back into the 'target' words
        if (mode === 'zen') {
          setWords((prev: string) => prev + nextChar);
        }

        setTotalTypedCount((prev: number) => prev + 1);

        // Quote mode completion detection
        if (mode === 'quote' && typed.length + 1 >= words.length) {
          finish();
        }
      }
    },
    [
      state,
      words,
      typed,
      startTimer,
      mode,
      language,
      includeNumbers,
      includePunctuation,
      restart,
      finish,
      disabled,
      resume,
      options.confidenceMode,
    ],
  );

  /** Global listener for key events */
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const finalElapsedTime =
    testDuration || (startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 : 0);

  /**
   * Comprehensive performance statistics.
   * Calculates Correct, Incorrect, Extra (typed past word length), and Missed characters.
   */
  const getCharStats = () => {
    let correct = 0;
    let incorrect = 0;
    let extra = 0;
    let missed = 0;

    typed.split('').forEach((char: string, i: number) => {
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
  const wpm = calculateWPM(charStats.correct, finalElapsedTime || 1 / 60);
  const rawWpm = calculateRawWPM(totalTypedCount, finalElapsedTime || 1 / 60);
  const accuracy = calculateAccuracy(totalTypedCount, errors);

  const consistency = calculateConsistency(history.map((h) => h.wpm));

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
    consistency,
    charStats,
  };
};
