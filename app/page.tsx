'use client';

// Import UI components and dialogs
import { TestDurationDialog } from '@/components/test-duration-dialog';
import { Kbd } from '@/components/ui/kbd';
// Import server actions and authentication client
import { saveTypingHistory } from '@/lib/actions';
import { useSession } from '@/lib/auth-client';
// Import custom hooks for typing logic and UI state
import { useTypingEngine, GameMode } from '@/hooks/use-typing-engine';
// Import animation libraries
import { motion, AnimatePresence } from 'framer-motion';
// Import icons from Lucide
import {
  RefreshCw,
  Settings,
  Globe,
  Quote as QuoteIcon,
  Hash,
  Clock,
  ChevronRight,
  History,
  Zap,
} from 'lucide-react';
// Import React hooks
import { useState, useEffect, useRef } from 'react';
// Import feedback and utility components
import { toast } from 'sonner';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/hooks/use-ui-store';
// Import charting library for results visualization
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function Home() {
  // State for typing test configuration
  const [duration, setDuration] = useState(60); // Default duration in seconds
  const [wordCount, setWordCount] = useState(25); // Default word count for 'words' mode
  const [mode, setMode] = useState<GameMode>('time'); // Available modes: 'time', 'words', 'quote', 'zen'
  const [language, setLanguage] = useState('english'); // Currently selected language

  // Destructure UI-related state and actions from the global UI store
  const {
    isFocusMode,
    setIsFocusMode,
    showUi,
    setShowUi,
    isNotificationsOpen,
    isThemeOpen,
    isLangOpen,
    setIsLangOpen,
    restartCount,
  } = useUiStore();

  const [isCustomDurationOpen, setIsCustomDurationOpen] = useState(false); // Controls the custom duration/word count dialog

  // Configuration for extra character types in the test
  const [config, setConfig] = useState({
    punctuation: false,
    numbers: false,
  });

  // Calculate the target 'amount' based on the active game mode
  const amount = mode === 'time' ? duration : wordCount;

  // Retrieve the current user session
  const { data: session } = useSession();
  const [isMounted, setIsMounted] = useState(false); // Used to ensure client-side rendering
  const [hasSaved, setHasSaved] = useState(false); // Prevents duplicate saving of results

  // Initialize the typing engine with the current configuration
  const {
    state,
    words,
    typed,
    timeLeft,
    errors,
    restart,
    wpm,
    rawWpm,
    accuracy,
    history,
    testDuration,
    consistency,
    charStats,
    pause,
  } = useTypingEngine({
    mode,
    amount,
    includeNumbers: config.numbers,
    includePunctuation: config.punctuation,
    language,
    // Disable engine interactions when any modal or dialog is open
    disabled: isLangOpen || isThemeOpen || isNotificationsOpen || isCustomDurationOpen,
  });

  // Refs and state for handling UI focus and automatic pausing
  const lastFinishRef = useRef<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const mouseMoveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Setup event listeners for mouse movement and keyboard interaction
  useEffect(() => {
    const handleMouseMove = () => {
      setIsMouseMoving(true);
      // Pause the test if the mouse starts moving (prevents cheating/distractions)
      if (state === 'run') {
        pause();
      }

      // Auto-hide UI after 2 seconds of mouse inactivity
      if (mouseMoveTimeoutRef.current) clearTimeout(mouseMoveTimeoutRef.current);
      mouseMoveTimeoutRef.current = setTimeout(() => {
        setIsMouseMoving(false);
      }, 2000);
    };

    const handleKeyDown = () => {
      // Typing activity hides the mouse-related UI immediately
      setIsMouseMoving(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('blur', pause); // Pause the game if the window loses focus

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('blur', pause);
      if (mouseMoveTimeoutRef.current) clearTimeout(mouseMoveTimeoutRef.current);
    };
  }, [state, pause]);

  // Synchronize focus mode with the typing state and mouse movement
  useEffect(() => {
    const focus = state === 'run' && !isMouseMoving;
    setIsFocusMode(focus);
    setShowUi(!focus);
  }, [state, isMouseMoving, setIsFocusMode, setShowUi]);

  // Set mounted state on component mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Monitor restart requests from the global store (e.g., from the header)
  useEffect(() => {
    if (restartCount > 0) {
      restart();
    }
  }, [restartCount, restart]);

  // Function to save the typing test results to the database
  const handleSave = async () => {
    if (hasSaved) return; // Prevent multiple saves for the same test

    // Validate that the test meets the minimum criteria for saving
    if (testDuration < 2 || charStats.correct < 5) {
      console.log('Test too short, not saving.');
      return;
    }

    try {
      // Call the server action to save typing performance history
      await saveTypingHistory({
        wpm,
        rawWpm,
        accuracy,
        errors,
        duration: testDuration,
        consistency,
        mode,
        amount,
        language,
        correctChars: charStats.correct,
        errorChars: charStats.incorrect,
        extraChars: charStats.extra,
        missedChars: charStats.missed,
        isCompleted: true,
      });
      setHasSaved(true);
      toast.success('Progress saved!');
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  // Handle automatic saving of results when the test finishes
  useEffect(() => {
    const isFinished = state === 'finish';
    if (isFinished && !lastFinishRef.current) {
      setHasSaved(false);
      if (session) {
        handleSave();
      }
    }
    lastFinishRef.current = isFinished;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, session]);

  // Prepare current typing data for rendering
  const wordsArray = words.split(' ');
  const currentWordIndex = typed.split(' ').length - 1;

  // Automatically scroll the typing container to keep the active word in view
  useEffect(() => {
    if (scrollRef.current) {
      const activeWord = scrollRef.current.querySelector('.word.active');
      if (activeWord) {
        const containerRect = scrollRef.current.getBoundingClientRect();
        const activeRect = activeWord.getBoundingClientRect();

        // If the active word is below the visible threshold, scroll it into view
        if (activeRect.top > containerRect.top + 45) {
          activeWord.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  }, [currentWordIndex]);

  // Listen for language change events dispatched from custom UI components
  useEffect(() => {
    const handleLanguageChange = (e: CustomEvent<string>) => {
      if (e.detail) setLanguage(e.detail);
    };
    window.addEventListener('language-changed', handleLanguageChange as EventListener);
    return () =>
      window.removeEventListener('language-changed', handleLanguageChange as EventListener);
  }, []);

  // Do not render anything until the component has mounted on the client
  if (!isMounted) return null;

  // Options for time and word count limits
  const timeOptions = [15, 30, 60, 120];
  const wordOptions = [10, 25, 50, 100];
  const amounts = mode === 'time' ? timeOptions : wordOptions;

  return (
    <div
      className="flex min-h-[calc(100vh-280px)] w-full flex-1 flex-col items-center justify-center"
      style={{
        // Hide cursor during active typing (focus mode)
        cursor: isFocusMode ? 'none' : 'default',
      }}
    >
      <main className="flex w-full max-w-[1440px] flex-col items-center gap-12 px-8">
        <div className="flex w-full flex-1 flex-col items-center justify-center">
          {/* Render the typing interface if the test is not finished */}
          {state !== 'finish' ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative flex w-full max-w-[1000px] flex-col items-center gap-8"
            >
              {/* Fade out settings UI when typing starts */}
              <motion.div
                animate={{
                  opacity: showUi ? 1 : 0,
                  pointerEvents: showUi ? 'auto' : 'none',
                }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                {/* Configuration Bar for punctuation, numbers, and modes */}
                <div className="mb-6 flex w-full justify-center sm:mb-10">
                  <div
                    className="bg-muted flex w-full flex-wrap items-center justify-center gap-y-3 rounded-xl p-2 text-[10px] font-bold transition-all duration-300 select-none sm:w-fit sm:gap-y-0 sm:text-xs"
                    style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
                  >
                    <AnimatePresence mode="popLayout">
                      {/* Punctuation and Numbers toggles (only for time/words modes) */}
                      {(mode === 'time' || mode === 'words') && (
                        <motion.div
                          initial={{ opacity: 0, x: -20, filter: 'blur(8px)' }}
                          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                          exit={{ opacity: 0, x: -10, filter: 'blur(8px)' }}
                          transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 30,
                            opacity: { duration: 0.2 },
                          }}
                          className="border-background/20 flex items-center gap-3 px-2 pr-3 whitespace-nowrap sm:gap-4 sm:border-r sm:pr-4"
                        >
                          <button
                            onClick={() =>
                              setConfig((prev) => ({ ...prev, punctuation: !prev.punctuation }))
                            }
                            className={cn(
                              'hover:text-foreground flex items-center gap-1.5 transition-all duration-200 hover:scale-105 active:scale-95',
                              config.punctuation && 'text-primary',
                            )}
                          >
                            <span className="font-black opacity-50">@</span> punctuation
                          </button>
                          <button
                            onClick={() =>
                              setConfig((prev) => ({ ...prev, numbers: !prev.numbers }))
                            }
                            className={cn(
                              'hover:text-foreground flex items-center gap-1.5 transition-all duration-200 hover:scale-105 active:scale-95',
                              config.numbers && 'text-primary',
                            )}
                          >
                            <span className="font-black opacity-50">#</span> numbers
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Mode Selection Buttons */}
                    <div
                      className={cn(
                        'flex items-center gap-3 px-3 whitespace-nowrap transition-all duration-500 sm:gap-4 sm:px-4',
                        mode !== 'zen' && 'border-background/20 sm:border-r',
                      )}
                    >
                      {(['time', 'words', 'quote', 'zen'] as const).map((m) => (
                        <button
                          key={m}
                          onClick={() => {
                            setMode(m);
                            restart();
                          }}
                          className={cn(
                            'hover:text-foreground flex items-center gap-1.5 capitalize transition-all duration-200 hover:scale-110 active:scale-90',
                            mode === m && 'text-primary',
                          )}
                        >
                          <span className="hidden md:inline">
                            {/* Dynamic icons based on the mode */}
                            {m === 'time' && <Clock size={12} />}
                            {m === 'words' && <Hash size={12} />}
                            {m === 'quote' && <QuoteIcon size={12} />}
                            {m === 'zen' && <Zap size={12} />}
                          </span>
                          {m}
                        </button>
                      ))}
                    </div>

                    <AnimatePresence mode="popLayout">
                      {/* Sub-options for Duration or Word Count */}
                      {mode !== 'zen' && (
                        <motion.div
                          initial={{ opacity: 0, x: 20, filter: 'blur(8px)' }}
                          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                          exit={{ opacity: 0, x: -10, filter: 'blur(8px)' }}
                          transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 30,
                            opacity: { duration: 0.2 },
                          }}
                          className="flex items-center gap-3 px-2 pl-3 whitespace-nowrap sm:gap-4 sm:pl-4"
                        >
                          {/* Predefined amount buttons */}
                          {amounts.map((t) => (
                            <button
                              key={t}
                              onClick={() => {
                                if (mode === 'time') setDuration(t);
                                else if (mode === 'words') setWordCount(t);
                                restart();
                              }}
                              className={cn(
                                'hover:text-foreground transition-all duration-200 hover:scale-110 active:scale-90',
                                amount === t && 'text-primary',
                              )}
                            >
                              {t}
                            </button>
                          ))}
                          {/* Button to open custom duration dialog */}
                          <button
                            onClick={() => setIsCustomDurationOpen(true)}
                            className="hover:text-foreground ml-1 transition-all duration-300 hover:scale-110 hover:rotate-90 active:scale-90"
                          >
                            <Settings size={12} />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Current Language Indicator */}
                <div className="flex w-full justify-center">
                  <div
                    className="group mb-[-1.5rem] flex cursor-pointer items-center gap-2 text-xs opacity-50 transition-opacity hover:opacity-100"
                    onClick={() => setIsLangOpen(true)}
                  >
                    <Globe size={14} className="group-hover:text-primary transition-colors" />
                    <span className="capitalize">{language}</span>
                  </div>
                </div>
              </motion.div>

              {/* The Typing Container itself, with dynamic language-specific classes */}
              <div
                lang={
                  language === 'bengali'
                    ? 'bn'
                    : language === 'hindi'
                      ? 'hi'
                      : language === 'arabic'
                        ? 'ar'
                        : language.includes('chinese')
                          ? 'zh'
                          : language === 'japanese'
                            ? 'ja'
                            : language === 'korean'
                              ? 'ko'
                              : 'en'
                }
                dir={language === 'arabic' ? 'rtl' : 'ltr'} // Arabic script requires Right-To-Left direction
                className={cn(
                  'perspective-1000 relative min-h-[140px] w-full text-left text-2xl leading-relaxed focus:outline-none md:text-3xl',
                  // Apply specific fonts for localized scripts
                  language === 'bengali'
                    ? 'font-bengali'
                    : language === 'hindi'
                      ? 'font-hindi'
                      : language === 'arabic'
                        ? 'font-arabic'
                        : language === 'japanese' || language === 'chinese' || language === 'korean'
                          ? 'font-cjk'
                          : 'font-mono tracking-wide',
                )}
              >
                {/* Real-time Timer or Stopwatch Display during testing */}
                {state === 'run' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-primary absolute top-[-3.5rem] left-0 text-3xl font-bold tabular-nums transition-colors duration-300"
                  >
                    {/* Show elapsed time in Zen mode, countdown otherwise */}
                    {mode === 'zen' ? (
                      <span>
                        {Math.floor(testDuration / 60)}:
                        {(testDuration % 60).toString().padStart(2, '0')}
                      </span>
                    ) : (
                      timeLeft
                    )}
                  </motion.div>
                )}

                <div
                  ref={scrollRef}
                  className="pointer-events-none relative flex h-auto max-h-[160px] min-h-[120px] w-full flex-wrap content-start justify-start overflow-hidden transition-all duration-300 select-none"
                >
                  {/* Map through the words to be typed */}
                  {wordsArray.map((targetWord: string, wIdx: number) => {
                    const typedWords = typed.split(' ');
                    const currentTypedWord = typedWords[wIdx] || '';
                    const isActive = wIdx === currentWordIndex;
                    const isFinished = wIdx < currentWordIndex;

                    const targetChars = targetWord.split('');
                    const typedChars = currentTypedWord.split('');
                    const charsToRender: {
                      char: string;
                      state: string;
                      isExtra: boolean;
                      isCurrent: boolean;
                    }[] = [];

                    // Analyze each character in the current word
                    for (let i = 0; i < targetChars.length; i++) {
                      const targetChar = targetChars[i];
                      const typedChar = typedChars[i];
                      charsToRender.push({
                        char: targetChar,
                        // Mark character as correct, incorrect, or yet to be typed
                        state: !typedChar
                          ? 'untyped'
                          : typedChar === targetChar
                            ? 'correct'
                            : 'incorrect',
                        isExtra: false,
                        isCurrent: isActive && i === typedChars.length,
                      });
                    }

                    // Handle extra characters typed beyond the word length
                    if (typedChars.length > targetChars.length) {
                      for (let i = targetChars.length; i < typedChars.length; i++) {
                        charsToRender.push({
                          char: typedChars[i],
                          state: 'incorrect',
                          isExtra: true,
                          isCurrent: isActive && i + 1 === typedChars.length,
                        });
                      }
                    }

                    // Flag words with errors for specific styling
                    const hasError = isFinished && currentTypedWord !== targetWord;

                    return (
                      <div
                        key={wIdx}
                        className={cn(
                          'word relative mx-[0.25em] my-[0.1em] transition-all duration-300',
                          isActive ? 'active scale-105 opacity-100' : 'scale-100 opacity-40',
                          hasError && 'border-destructive border-b-2',
                        )}
                      >
                        {/* Zero-width space to ensure height when word is empty, supporting accurate cursor positioning */}
                        <span className="absolute opacity-0">{'\u200B'}</span>

                        {/* Render each individual character */}
                        {charsToRender.map((item, cIdx) => (
                          <span
                            key={cIdx}
                            className={cn(
                              'char relative transition-colors duration-150',
                              // localized fonts might require subtle rendering adjustments
                              language === 'bengali' ||
                                language === 'hindi' ||
                                language === 'arabic'
                                ? 'inline'
                                : 'inline-block',
                              item.state === 'correct' && 'text-foreground',
                              item.state === 'incorrect' &&
                                (item.isExtra ? 'text-destructive opacity-60' : 'text-destructive'),
                              item.state === 'untyped' && 'text-secondary',
                            )}
                          >
                            {/* Visual Caret (the blinking line indicating current position) */}
                            {item.isCurrent && (
                              <motion.div
                                layoutId="caret"
                                className="bg-primary absolute top-[10%] left-[-1px] z-10 h-[80%] w-[2.5px] rounded-full"
                                transition={{ type: 'spring', stiffness: 450, damping: 40 }}
                                style={{ boxShadow: '0 0 10px var(--primary)' }}
                              />
                            )}
                            {item.char}
                          </span>
                        ))}
                        {/* Caret position if the current word is fully typed but not submitted */}
                        {isActive && currentTypedWord.length === targetWord.length && (
                          <motion.div
                            layoutId="caret"
                            className="bg-primary absolute top-[10%] right-[-2px] z-10 h-[80%] w-[2.5px] rounded-full"
                            transition={{ type: 'spring', stiffness: 450, damping: 40 }}
                            style={{ boxShadow: '0 0 10px var(--primary)' }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reset Button and keyboard shortcut indicators */}
              <motion.div
                animate={{
                  opacity: showUi ? 1 : 0.4,
                  scale: showUi ? 1 : 0.9,
                  pointerEvents: 'auto',
                }}
                className="mt-8 flex flex-col items-center gap-4"
              >
                {/* Manually trigger a test restart */}
                <button
                  onClick={restart}
                  className="text-secondary hover:text-foreground p-4 transition-all duration-200 duration-700 ease-in-out hover:scale-110 hover:rotate-[360deg] active:scale-95"
                  title="Restart Test"
                >
                  <RefreshCw size={26} />
                </button>

                <AnimatePresence>
                  {/* Display finish keyboard shortcut during Zen mode */}
                  {mode === 'zen' && state === 'run' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 0.5, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="text-secondary flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase"
                    >
                      <Kbd className="bg-muted min-w-fit border-none px-1.5 py-0.5 text-[10px] font-black">
                        shift
                      </Kbd>
                      <span className="opacity-50">+</span>
                      <Kbd className="bg-muted min-w-fit border-none px-1.5 py-0.5 text-[10px] font-black">
                        enter
                      </Kbd>
                      <span className="opacity-50">to finish</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ) : (
            /* Results Screen: Displayed when the typing test is completed */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex w-full max-w-[1250px] flex-col gap-6 select-none"
            >
              {/* Main Result Area featuring WPM and Accuracy stats alongside a performance graph */}
              <div className="flex w-full flex-col items-center gap-6 text-center md:flex-row md:items-start md:gap-10 md:text-left">
                {/* Result Summary Labels (Left side on desktop) */}
                <div className="border-secondary/5 flex min-w-full flex-row justify-center gap-8 border-b pb-6 md:min-w-[120px] md:flex-col md:justify-start md:gap-6 md:border-r md:border-b-0 md:pr-10 md:pb-0">
                  <div className="group flex flex-col">
                    <span className="text-secondary/60 group-hover:text-secondary text-sm font-medium lowercase transition-colors md:text-lg">
                      wpm
                    </span>
                    <span className="text-primary text-[3rem] leading-[0.7] font-bold tracking-tighter tabular-nums drop-shadow-sm md:text-[3.5rem]">
                      {wpm}
                    </span>
                  </div>
                  <div className="group mt-0 flex flex-col md:mt-2">
                    <span className="text-secondary/60 group-hover:text-secondary text-sm font-medium lowercase transition-colors md:text-lg">
                      acc
                    </span>
                    <span className="text-primary text-[3rem] leading-[0.7] font-bold tracking-tighter tabular-nums drop-shadow-sm md:text-[3.5rem]">
                      {accuracy}%
                    </span>
                  </div>
                </div>

                {/* Dynamic Performance Chart (Middle/Right side) */}
                <div className="relative h-[200px] w-full flex-1 md:h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="rgba(255,255,255,0.03)"
                      />
                      {/* Horizontal axis representing time or progress */}
                      <XAxis
                        dataKey="time"
                        hide={false}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--sub-color)', fontSize: 10, opacity: 0.4 }}
                      />
                      {/* Vertical axis representing speed in WPM */}
                      <YAxis
                        domain={[0, 'auto']}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--sub-color)', fontSize: 10, opacity: 0.4 }}
                        label={{
                          value: 'wpm',
                          angle: -90,
                          position: 'insideLeft',
                          fill: 'var(--sub-color)',
                          fontSize: 10,
                          opacity: 0.4,
                          offset: 10,
                        }}
                      />
                      {/* Tooltip for detailed per-second data points */}
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--background)',
                          border: '1px solid var(--sub-color)',
                          borderRadius: '4px',
                          fontSize: '11px',
                          color: 'var(--text-color)',
                          opacity: 0.9,
                          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                        }}
                        itemStyle={{ padding: '2px 0' }}
                        cursor={{ stroke: 'var(--sub-color)', strokeWidth: 1 }}
                      />
                      {/* Visualization for Raw WPM (Dashed line) */}
                      <Line
                        type="monotone"
                        dataKey="raw"
                        stroke="var(--main-color)"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                        animationDuration={1000}
                        opacity={0.7}
                      />
                      {/* Visualization for Adjusted/Burst WPM (Solid line) */}
                      <Line
                        type="monotone"
                        dataKey="burst"
                        stroke="var(--sub-color)"
                        strokeWidth={2}
                        dot={{ fill: 'var(--sub-color)', r: 0 }}
                        activeDot={{ r: 4, fill: 'var(--sub-color)' }}
                        animationDuration={1000}
                        opacity={0.5}
                      />
                      {/* Error Markers visualization (renders 'x' for errors) */}
                      {history.some((h) => h.errors > 0) && (
                        <Line
                          type="monotone"
                          dataKey="errors"
                          stroke="transparent"
                          dot={(props: { cx?: number; payload?: { errors: number } }) => {
                            const { cx, payload } = props;
                            if (payload && payload.errors > 0 && typeof cx === 'number') {
                              return (
                                <g key={`error-dot-${cx}`}>
                                  <text
                                    x={cx}
                                    y={20}
                                    fill="var(--error-color)"
                                    fontSize="14"
                                    textAnchor="middle"
                                    fontWeight="bold"
                                    style={{ opacity: 0.7 }}
                                  >
                                    x
                                  </text>
                                </g>
                              );
                            }
                            return <></>;
                          }}
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                  {/* Legend for the performance graph */}
                  <div className="text-secondary/30 absolute right-0 bottom-[-15px] left-0 flex justify-center gap-6 text-[9px] font-bold tracking-widest uppercase md:gap-8 md:text-[10px]">
                    <div className="hover:text-secondary/50 hidden cursor-help items-center gap-1.5 transition-colors sm:flex">
                      <History size={11} /> scale
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-primary opacity-60">--</span> raw
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-secondary opacity-60">—</span> burst
                    </div>
                    <div className="text-destructive/40 flex items-center gap-1.5">
                      <span className="font-bold">x</span> errors
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Detailed breakdown of typing statistics */}
              <div className="text-secondary/50 mt-6 grid w-full grid-cols-2 items-start justify-between gap-y-6 px-4 sm:grid-cols-3 md:flex md:flex-wrap">
                {/* Test type details (mode, duration, language) */}
                <div className="flex min-w-[100px] flex-col gap-1 md:min-w-[120px]">
                  <span className="text-[10px] font-medium lowercase opacity-70 md:text-sm">
                    test type
                  </span>
                  <div className="text-primary mt-1 flex flex-col text-sm leading-tight font-bold md:text-lg">
                    <span className="capitalize">
                      {mode} {mode !== 'quote' ? amount : ''}
                    </span>
                    <span className="text-[10px] capitalize opacity-70 md:text-xs">{language}</span>
                    {(config.punctuation || config.numbers) && (
                      <span className="text-xs capitalize opacity-70">
                        {[config.punctuation && 'punctuation', config.numbers && 'numbers']
                          .filter(Boolean)
                          .join(' ')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Additional info labels */}
                <div className="flex min-w-[100px] flex-col gap-1">
                  <span className="text-[10px] font-medium lowercase opacity-70 md:text-sm">
                    info
                  </span>
                  <div className="text-primary mt-1 flex flex-col text-sm leading-tight font-bold md:text-lg">
                    <span>{mode === 'zen' ? 'zen mode' : 'standard'}</span>
                    <span className="text-[10px] opacity-70 md:text-xs">no tags</span>
                  </div>
                </div>

                {/* Raw WPM statistic */}
                <div className="flex min-w-[80px] flex-col gap-1">
                  <span className="text-[10px] font-medium lowercase opacity-70 md:text-sm">
                    raw
                  </span>
                  <span className="text-primary mt-1 text-2xl font-bold md:text-3xl">{rawWpm}</span>
                </div>

                {/* Per-character breakdown (correct/incorrect/extra/missed) */}
                <div className="flex min-w-[120px] flex-col gap-1 md:min-w-[150px]">
                  <span className="text-[10px] font-medium lowercase opacity-70 md:text-sm">
                    characters
                  </span>
                  <div className="text-primary mt-1 text-xl font-bold tracking-tighter md:text-3xl">
                    {charStats.correct}/{charStats.incorrect}/{charStats.extra}/{charStats.missed}
                  </div>
                </div>

                {/* Consistency score based on WPM variance */}
                <div className="flex min-w-[100px] flex-col gap-1">
                  <span className="text-[10px] font-medium lowercase opacity-70 md:text-sm">
                    consistency
                  </span>
                  <span className="text-primary mt-1 text-2xl font-bold md:text-3xl">
                    {consistency}%
                  </span>
                </div>

                {/* Actual test duration in seconds */}
                <div className="flex min-w-[100px] flex-col items-start gap-1 md:min-w-[120px] md:items-end">
                  <span className="text-[10px] font-medium lowercase opacity-70 md:text-sm">
                    time
                  </span>
                  <div className="mt-1 flex flex-col items-start md:items-end">
                    <span className="text-primary text-2xl leading-none font-bold md:text-3xl">
                      {testDuration}s
                    </span>
                  </div>
                </div>
              </div>

              {/* Result Screen Controls: Restart or proceed to next test */}
              <div className="mt-8 flex flex-wrap justify-center gap-2 md:gap-4">
                {/* Button to quickly trigger the next test configuration */}
                <button
                  onClick={restart}
                  className="text-secondary/60 hover:text-foreground group flex flex-col items-center gap-2 p-3 transition-all duration-200 hover:scale-110 active:scale-95 md:p-4"
                  title="Next Test"
                >
                  <ChevronRight
                    size={24}
                    className="transition-transform group-hover:translate-x-1"
                  />
                  <span className="text-[10px] font-bold uppercase opacity-0 transition-opacity group-hover:opacity-100">
                    next test
                  </span>
                </button>
                {/* Button to restart the exact same test configuration */}
                <button
                  onClick={restart}
                  className="text-secondary/60 hover:text-foreground group flex flex-col items-center gap-2 p-3 transition-all duration-200 hover:scale-110 active:scale-95 md:p-4"
                  title="Restart Test"
                >
                  <RefreshCw
                    size={24}
                    className="transition-transform duration-500 group-hover:rotate-180"
                  />
                  <span className="text-[10px] font-bold uppercase opacity-0 transition-opacity group-hover:opacity-100">
                    restart
                  </span>
                </button>
              </div>

              {/* Prompt for unauthenticated users to save their progress */}
              {!session && (
                <div className="mt-2 text-center">
                  <Link
                    href="/sign-in"
                    className="text-secondary/40 hover:text-secondary/80 text-[10px] font-medium transition-colors md:text-xs"
                  >
                    Sign in to save your result
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Global Keyboard Shortcuts display for quick accessibility */}
        <motion.div
          animate={{
            opacity: showUi && state !== 'finish' ? 0.6 : 0,
            pointerEvents: showUi && state !== 'finish' ? 'auto' : 'none',
          }}
          transition={{ duration: 0.5 }}
          className="mt-12 mb-8 hidden w-full flex-col items-center gap-3 text-[10px] font-bold transition-opacity duration-500 select-none hover:opacity-100 sm:flex sm:text-xs"
        >
          <div className="flex items-center gap-6">
            {/* Reset via Tab key */}
            <div className="flex items-center gap-2">
              <Kbd className="bg-muted text-secondary min-w-[30px] border-none p-1 px-2.5">tab</Kbd>
              <span className="ml-1 uppercase">- restart test</span>
            </div>
            {/* Reset via Alt + Enter key combination */}
            <div className="flex items-center gap-2">
              <Kbd className="bg-muted text-secondary min-w-[30px] border-none p-1 px-2.5">alt</Kbd>
              <span className="opacity-50">+</span>
              <Kbd className="bg-muted text-secondary min-w-[50px] border-none p-1 px-2.5">
                enter
              </Kbd>
              <span className="ml-1 uppercase">- restart test</span>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Dialog for setting custom time/word limits */}
      <TestDurationDialog
        isOpen={isCustomDurationOpen}
        onOpenChange={setIsCustomDurationOpen}
        onSetDuration={(s) => {
          if (mode === 'time') setDuration(s);
          else setWordCount(s);
          restart();
        }}
        currentDuration={amount}
      />
    </div>
  );
}
