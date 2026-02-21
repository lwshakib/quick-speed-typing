'use client';

import { TestDurationDialog } from "@/components/test-duration-dialog";
import { Kbd } from "@/components/ui/kbd";
import { saveTypingHistory, getUserTheme } from "@/lib/actions";
import { useSession } from "@/lib/auth-client";
import { useTypingEngine, GameMode } from "@/hooks/use-typing-engine";
import { THEMES, Theme } from "@/lib/themes";
import { motion, AnimatePresence } from "framer-motion";
import { 
    RefreshCw, 
    Keyboard, 
    Trophy, 
    Info, 
    Settings, 
    Bell, 
    User as UserIcon, 
    Globe, 
    Quote as QuoteIcon, 
    Hash, 
    Clock,
    ChevronRight,
    AlertTriangle,
    History,
    MoreHorizontal,
    FastForward,
    Image as ImageIcon,
    Palette,
    Zap
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/hooks/use-ui-store";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Home() {
  const [duration, setDuration] = useState(60);
  const [wordCount, setWordCount] = useState(25);
  const [mode, setMode] = useState<GameMode>('time');
  const [language, setLanguage] = useState("english"); 
  
  const { 
    isFocusMode, 
    setIsFocusMode, 
    showUi, 
    setShowUi,
    isNotificationsOpen,
    isThemeOpen,
    isLangOpen,
    setIsLangOpen,
    currentTheme,
    applyTheme,
    restartCount
  } = useUiStore();

  const [isCustomDurationOpen, setIsCustomDurationOpen] = useState(false);
  
  const [config, setConfig] = useState({
    punctuation: false,
    numbers: false,
  });

  const amount = mode === 'time' ? duration : wordCount;

  const { data: session } = useSession();
  const [isMounted, setIsMounted] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

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
    resume
  } = useTypingEngine({
    mode,
    amount,
    includeNumbers: config.numbers,
    includePunctuation: config.punctuation,
    language,
    disabled: isLangOpen || isThemeOpen || isNotificationsOpen || isCustomDurationOpen,
  });

  const lastFinishRef = useRef<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const mouseMoveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleMouseMove = () => {
      setIsMouseMoving(true);
      if (state === 'run') {
        pause();
      }
      
      if (mouseMoveTimeoutRef.current) clearTimeout(mouseMoveTimeoutRef.current);
      mouseMoveTimeoutRef.current = setTimeout(() => {
        setIsMouseMoving(false);
      }, 2000);
    };

    const handleKeyDown = () => {
      setIsMouseMoving(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('blur', pause);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('blur', pause);
      if (mouseMoveTimeoutRef.current) clearTimeout(mouseMoveTimeoutRef.current);
    };
  }, [state, pause]);

  // Sync focus mode and UI visibility with store
  useEffect(() => {
    const focus = state === 'run' && !isMouseMoving;
    setIsFocusMode(focus);
    setShowUi(!focus);
  }, [state, isMouseMoving]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Listen for restart trigger from header or elsewhere
  useEffect(() => {
    if (restartCount > 0) {
      restart();
    }
  }, [restartCount]);

  useEffect(() => {
    const isFinished = state === 'finish';
    if (isFinished && !lastFinishRef.current) {
      setHasSaved(false);
      if (session) {
        handleSave();
      }
    }
    lastFinishRef.current = isFinished;
  }, [state, session]);

  const handleSave = async () => {
    if (hasSaved) return;
    
    // Minimum threshold for saving test
    // 2 seconds and at least 5 correct characters
    if (testDuration < 2 || charStats.correct < 5) {
      console.log("Test too short, not saving.");
      return;
    }

    try {
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
      toast.success("Progress saved!");
    } catch (error) {
      console.error("Failed to save:", error);
    }
  };

  const wordsArray = words.split(" ");
  const currentWordIndex = typed.split(" ").length - 1;

  useEffect(() => {
    if (scrollRef.current) {
        const activeWord = scrollRef.current.querySelector('.word.active');
        if (activeWord) {
            const containerRect = scrollRef.current.getBoundingClientRect();
            const activeRect = activeWord.getBoundingClientRect();
            
            if (activeRect.top > containerRect.top + 45) {
                activeWord.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }
  }, [currentWordIndex]);

  useEffect(() => {
    const handleLanguageChange = (e: any) => {
        if (e.detail) setLanguage(e.detail);
    };
    window.addEventListener('language-changed', handleLanguageChange as EventListener);
    return () => window.removeEventListener('language-changed', handleLanguageChange as EventListener);
  }, []);

  if (!isMounted) return null;

  const timeOptions = [15, 30, 60, 120];
  const wordOptions = [10, 25, 50, 100];
  const amounts = mode === 'time' ? timeOptions : wordOptions;

  return (
    <div 
        className="w-full flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-280px)]"
        style={{ 
          cursor: isFocusMode ? 'none' : 'default'
        }}
    >

      <main className="w-full max-w-[1440px] px-8 flex flex-col items-center gap-12">
        <div className="flex-1 w-full flex flex-col items-center justify-center">
          {state !== 'finish' ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-[1000px] flex flex-col items-center gap-8 relative"
            >
              <motion.div 
                animate={{ 
                  opacity: showUi ? 1 : 0,
                  pointerEvents: showUi ? 'auto' : 'none',
                }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                {/* Setting Bar */}
                <div className="w-full flex justify-center mb-6 sm:mb-10">
                  <div 
                      className="bg-muted p-2 rounded-xl flex flex-wrap items-center justify-center text-[10px] sm:text-xs font-bold select-none w-full sm:w-fit gap-y-3 sm:gap-y-0 transition-all duration-300"
                      style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
                  >
                    <AnimatePresence mode="popLayout">
                      {(mode === 'time' || mode === 'words') && (
                        <motion.div 
                          initial={{ opacity: 0, x: -20, filter: "blur(8px)" }}
                          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, x: -10, filter: "blur(8px)" }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 300, 
                            damping: 30,
                            opacity: { duration: 0.2 }
                          }}
                          className="flex items-center sm:border-r border-background/20 pr-3 sm:pr-4 gap-3 sm:gap-4 px-2 whitespace-nowrap"
                        >
                          <button 
                            onClick={() => setConfig(prev => ({ ...prev, punctuation: !prev.punctuation }))}
                            className={cn("hover:text-foreground transition-all duration-200 flex items-center gap-1.5 hover:scale-105 active:scale-95", config.punctuation && "text-primary")}
                          >
                            <span className="opacity-50 font-black">@</span> punctuation
                          </button>
                          <button 
                            onClick={() => setConfig(prev => ({ ...prev, numbers: !prev.numbers }))}
                            className={cn("hover:text-foreground transition-all duration-200 flex items-center gap-1.5 hover:scale-105 active:scale-95", config.numbers && "text-primary")}
                          >
                            <span className="opacity-50 font-black">#</span> numbers
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className={cn(
                      "flex items-center px-3 sm:px-4 gap-3 sm:gap-4 whitespace-nowrap transition-all duration-500",
                      mode !== 'zen' && "sm:border-r border-background/20"
                    )}>
                      {(['time', 'words', 'quote', 'zen'] as const).map((m) => (
                        <button 
                          key={m}
                          onClick={() => { setMode(m); restart(); }}
                          className={cn(
                            "hover:text-foreground transition-all duration-200 flex items-center gap-1.5 capitalize hover:scale-110 active:scale-90", 
                            mode === m && "text-primary"
                          )}
                        >
                          <span className="hidden md:inline">
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
                      {mode !== 'zen' && (
                        <motion.div 
                          initial={{ opacity: 0, x: 20, filter: "blur(8px)" }}
                          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, x: 10, filter: "blur(8px)" }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 300, 
                            damping: 30,
                            opacity: { duration: 0.2 }
                          }}
                          className="flex items-center pl-3 sm:pl-4 gap-3 sm:gap-4 px-2 whitespace-nowrap"
                        >
                          {amounts.map((t) => (
                            <button 
                              key={t}
                              onClick={() => { 
                                  if (mode === 'time') setDuration(t); 
                                  else if (mode === 'words') setWordCount(t);
                                  restart(); 
                              }}
                              className={cn(
                                "hover:text-foreground transition-all duration-200 hover:scale-110 active:scale-90", 
                                amount === t && "text-primary"
                              )}
                            >
                              {t}
                            </button>
                          ))}
                          <button 
                            onClick={() => setIsCustomDurationOpen(true)}
                            className="hover:text-foreground transition-all duration-300 hover:rotate-90 hover:scale-110 active:scale-90 ml-1"
                          >
                            <Settings size={12} />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Language indicator */}
                <div className="flex justify-center w-full">
                  <div 
                      className="flex items-center gap-2 text-xs mb-[-1.5rem] opacity-50 hover:opacity-100 transition-opacity cursor-pointer group"
                      onClick={() => setIsLangOpen(true)}
                  >
                    <Globe size={14} className="group-hover:text-primary transition-colors" />
                    <span className="capitalize">{language}</span>
                  </div>
                </div>
              </motion.div>

              {/* Typing Container */}
              <div className="relative text-2xl md:text-3xl leading-relaxed tracking-wide min-h-[140px] focus:outline-none perspective-1000 w-full text-left">
                  {/* Timer Display */}
                  {state === 'run' && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute top-[-3.5rem] left-0 font-bold text-3xl tabular-nums text-primary transition-colors duration-300"
                    >
                      {mode === 'zen' ? (
                        <span>
                          {Math.floor(testDuration / 60)}:{(testDuration % 60).toString().padStart(2, '0')}
                        </span>
                      ) : timeLeft}
                    </motion.div>
                  )}

                  <div 
                      ref={scrollRef}
                      className="flex flex-wrap justify-start content-start overflow-hidden h-auto min-h-[120px] max-h-[160px] w-full select-none pointer-events-none relative transition-all duration-300"
                  >
                    {wordsArray.map((targetWord: string, wIdx: number) => {
                      const typedWords = typed.split(" ");
                      const currentTypedWord = typedWords[wIdx] || "";
                      const isActive = wIdx === currentWordIndex;
                      const isFinished = wIdx < currentWordIndex;
                      
                      const targetChars = targetWord.split("");
                      const typedChars = currentTypedWord.split("");
                      const charsToRender: { char: string; state: string; isExtra: boolean; isCurrent: boolean }[] = [];

                      for (let i = 0; i < targetChars.length; i++) {
                          const targetChar = targetChars[i];
                          const typedChar = typedChars[i];
                          charsToRender.push({
                              char: targetChar,
                              state: !typedChar ? 'untyped' : (typedChar === targetChar ? 'correct' : 'incorrect'),
                              isExtra: false,
                              isCurrent: isActive && i === typedChars.length,
                          });
                      }

                      if (typedChars.length > targetChars.length) {
                          for (let i = targetChars.length; i < typedChars.length; i++) {
                              charsToRender.push({
                                  char: typedChars[i],
                                  state: 'incorrect',
                                  isExtra: true,
                                  isCurrent: isActive && (i + 1 === typedChars.length),
                              });
                          }
                      }

                      const hasError = isFinished && (currentTypedWord !== targetWord);

                      return (
                        <div key={wIdx} className={cn(
                          "word mx-[0.25em] my-[0.1em] relative transition-all duration-300", 
                          isActive ? "active opacity-100 scale-105" : "opacity-40 scale-100",
                          hasError && "border-b-2 border-destructive"
                        )}>
                          {/* Zero-width space to ensure height when word is empty */}
                          <span className="opacity-0 absolute">{"\u200B"}</span>
                          
                          {charsToRender.map((item, cIdx) => (
                            <span 
                              key={cIdx} 
                              className={cn(
                                "char relative inline-block transition-colors duration-150",
                                item.state === 'correct' && "text-foreground",
                                item.state === 'incorrect' && (item.isExtra ? "opacity-60 text-destructive" : "text-destructive"),
                                item.state === 'untyped' && "text-secondary"
                              )}
                            >
                              {item.isCurrent && (
                                  <motion.div 
                                    layoutId="caret"
                                    className="absolute left-[-1px] top-[10%] w-[2.5px] h-[80%] bg-primary rounded-full z-10"
                                    transition={{ type: "spring", stiffness: 450, damping: 40 }}
                                    style={{ boxShadow: "0 0 10px var(--primary)" }}
                                  />
                              )}
                              {item.char}
                            </span>
                          ))}
                          {isActive && currentTypedWord.length === targetWord.length && (
                               <motion.div 
                                  layoutId="caret"
                                  className="absolute right-[-2px] top-[10%] w-[2.5px] h-[80%] bg-primary rounded-full z-10"
                                  transition={{ type: "spring", stiffness: 450, damping: 40 }}
                                  style={{ boxShadow: "0 0 10px var(--primary)" }}
                                />
                          )}
                        </div>
                      );
                    })}
                  </div>
              </div>

              {/* Reset Button */}
              <motion.div 
                animate={{ 
                  opacity: showUi ? 1 : 0.4, 
                  scale: showUi ? 1 : 0.9,
                  pointerEvents: 'auto'
                }}
                className="flex flex-col items-center gap-4 mt-8"
              >
                  <button 
                    onClick={restart} 
                    className="p-4 text-secondary hover:text-foreground transition-all hover:scale-110 active:scale-95 duration-200 hover:rotate-[360deg] duration-700 ease-in-out"
                    title="Restart Test"
                  >
                    <RefreshCw size={26} />
                  </button>

                  <AnimatePresence>
                    {mode === 'zen' && state === 'run' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 0.5, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="text-[10px] uppercase font-bold tracking-widest text-secondary flex items-center gap-2"
                      >
                        <Kbd className="bg-muted border-none text-[10px] py-0.5 px-1.5 min-w-fit font-black">shift</Kbd>
                        <span className="opacity-50">+</span>
                        <Kbd className="bg-muted border-none text-[10px] py-0.5 px-1.5 min-w-fit font-black">enter</Kbd>
                        <span className="opacity-50">to finish</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-[1250px] flex flex-col gap-6 select-none"
            >
               {/* Main Result Area */}
               <div className="flex flex-col md:flex-row gap-6 md:gap-10 w-full items-center md:items-start text-center md:text-left">
                  {/* Result Summary (Left) */}
                  <div className="flex flex-row md:flex-col gap-8 md:gap-6 min-w-full md:min-w-[120px] justify-center md:justify-start border-b md:border-b-0 md:border-r border-secondary/5 pb-6 md:pb-0 md:pr-10">
                     <div className="flex flex-col group">
                        <span className="text-sm md:text-lg font-medium text-secondary/60 group-hover:text-secondary transition-colors lowercase">wpm</span>
                        <span className="text-[3rem] md:text-[3.5rem] font-bold text-primary leading-[0.7] tracking-tighter tabular-nums drop-shadow-sm">{wpm}</span>
                     </div>
                     <div className="flex flex-col group mt-0 md:mt-2">
                        <span className="text-sm md:text-lg font-medium text-secondary/60 group-hover:text-secondary transition-colors lowercase">acc</span>
                        <span className="text-[3rem] md:text-[3.5rem] font-bold text-primary leading-[0.7] tracking-tighter tabular-nums drop-shadow-sm">{accuracy}%</span>
                     </div>
                  </div>

                  {/* Main Graph (Middle/Right) */}
                  <div className="w-full flex-1 h-[200px] md:h-[220px] relative">
                      <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                              <XAxis 
                                  dataKey="time" 
                                  hide={false} 
                                  axisLine={false} 
                                  tickLine={false} 
                                  tick={{ fill: 'var(--sub-color)', fontSize: 10, opacity: 0.4 }} 
                              />
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
                                      offset: 10
                                  }}
                              />
                              <Tooltip 
                                  contentStyle={{ 
                                      backgroundColor: 'var(--background)', 
                                      border: '1px solid var(--sub-color)', 
                                      borderRadius: '4px', 
                                      fontSize: '11px', 
                                      color: 'var(--text-color)',
                                      opacity: 0.9,
                                      boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                                  }}
                                  itemStyle={{ padding: '2px 0' }}
                                  cursor={{ stroke: 'var(--sub-color)', strokeWidth: 1 }}
                              />
                              {/* Raw WPM line (Dashed Yellow) */}
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
                            {/* Burst WPM line (Solid Gray) */}
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
                            {/* Errors dots/crosses at the top */}
                            {history.some(h => h.errors > 0) && (
                                <Line
                                    type="monotone"
                                    dataKey="errors"
                                    stroke="transparent"
                                    dot={(props: any) => {
                                        const { cx, payload } = props;
                                        if (payload.errors > 0) {
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
                    <div className="absolute bottom-[-15px] left-0 right-0 flex justify-center gap-6 md:gap-8 text-[9px] md:text-[10px] uppercase font-bold text-secondary/30 tracking-widest">
                        <div className="hidden sm:flex items-center gap-1.5 hover:text-secondary/50 transition-colors cursor-help"><History size={11} /> scale</div>
                        <div className="flex items-center gap-1.5"><span className="text-primary opacity-60">--</span> raw</div>
                        <div className="flex items-center gap-1.5"><span className="text-secondary opacity-60">—</span> burst</div>
                        <div className="flex items-center gap-1.5 text-destructive/40"><span className="font-bold">x</span> errors</div>
                    </div>
                </div>
             </div>

               {/* Bottom Stats Row */}
               <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap items-start justify-between w-full mt-6 text-secondary/50 px-4 gap-y-6">
                  <div className="flex flex-col gap-1 min-w-[100px] md:min-w-[120px]">
                      <span className="text-[10px] md:text-sm font-medium lowercase opacity-70">test type</span>
                      <div className="flex flex-col text-sm md:text-lg font-bold text-primary leading-tight mt-1">
                          <span className="capitalize">{mode} {mode !== 'quote' ? amount : ''}</span>
                          <span className="text-[10px] md:text-xs opacity-70 capitalize">{language}</span>
                          {(config.punctuation || config.numbers) && (
                              <span className="text-xs opacity-70 capitalize">
                                  {[config.punctuation && 'punctuation', config.numbers && 'numbers'].filter(Boolean).join(' ')}
                              </span>
                          )}
                      </div>
                  </div>
                  
                  <div className="flex flex-col gap-1 min-w-[100px]">
                      <span className="text-[10px] md:text-sm font-medium lowercase opacity-70">info</span>
                      <div className="flex flex-col text-sm md:text-lg font-bold text-primary leading-tight mt-1">
                          <span>{mode === 'zen' ? 'zen mode' : 'standard'}</span>
                          <span className="text-[10px] md:text-xs opacity-70">no tags</span>
                      </div>
                  </div>

                  <div className="flex flex-col gap-1 min-w-[80px]">
                      <span className="text-[10px] md:text-sm font-medium lowercase opacity-70">raw</span>
                      <span className="text-2xl md:text-3xl font-bold text-primary mt-1">{rawWpm}</span>
                  </div>

                  <div className="flex flex-col gap-1 min-w-[120px] md:min-w-[150px]">
                      <span className="text-[10px] md:text-sm font-medium lowercase opacity-70">characters</span>
                      <div className="text-xl md:text-3xl font-bold text-primary tracking-tighter mt-1">
                          {charStats.correct}/{charStats.incorrect}/{charStats.extra}/{charStats.missed}
                      </div>
                  </div>

                  <div className="flex flex-col gap-1 min-w-[100px]">
                      <span className="text-[10px] md:text-sm font-medium lowercase opacity-70">consistency</span>
                      <span className="text-2xl md:text-3xl font-bold text-primary mt-1">{consistency}%</span>
                  </div>

                  <div className="flex flex-col gap-1 items-start md:items-end min-w-[100px] md:min-w-[120px]">
                      <span className="text-[10px] md:text-sm font-medium lowercase opacity-70">time</span>
                      <div className="flex flex-col items-start md:items-end mt-1">
                          <span className="text-2xl md:text-3xl font-bold text-primary leading-none">{testDuration}s</span>
                      </div>
                  </div>
               </div>
               
               {/* Result Controls */}
               <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-8">
                  <button 
                      onClick={restart}
                      className="p-3 md:p-4 text-secondary/60 hover:text-foreground transition-all hover:scale-110 active:scale-95 duration-200 flex flex-col items-center gap-2 group" 
                      title="Next Test"
                  >
                      <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                      <span className="text-[10px] uppercase font-bold opacity-0 group-hover:opacity-100 transition-opacity">next test</span>
                  </button>
                  <button 
                      onClick={restart} 
                      className="p-3 md:p-4 text-secondary/60 hover:text-foreground transition-all hover:scale-110 active:scale-95 duration-200 flex flex-col items-center gap-2 group"
                      title="Restart Test"
                  >
                     <RefreshCw size={24} className="group-hover:rotate-180 transition-transform duration-500" />
                     <span className="text-[10px] uppercase font-bold opacity-0 group-hover:opacity-100 transition-opacity">restart</span>
                  </button>
               </div>

               {!session && (
                 <div className="text-center mt-2">
                    <Link 
                      href="/sign-in" 
                      className="text-secondary/40 hover:text-secondary/80 transition-colors text-[10px] md:text-xs font-medium"
                    >
                      Sign in to save your result
                    </Link>
                 </div>
               )}
            </motion.div>
          )}
        </div>

        {/* Shortcuts */}
        <motion.div 
          animate={{ 
            opacity: showUi && state !== 'finish' ? 0.6 : 0, 
            pointerEvents: showUi && state !== 'finish' ? 'auto' : 'none'
          }}
          transition={{ duration: 0.5 }}
          className="hidden sm:flex w-full flex-col items-center gap-3 text-[10px] sm:text-xs font-bold select-none hover:opacity-100 transition-opacity duration-500 mt-12 mb-8"
        >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                 <Kbd className="bg-muted border-none text-secondary min-w-[30px] p-1 px-2.5">tab</Kbd>
                 <span className="opacity-50">+</span>
                 <Kbd className="bg-muted border-none text-secondary min-w-[50px] p-1 px-2.5">enter</Kbd>
                 <span className="ml-1 uppercase">- restart test</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
                 <div className="flex items-center gap-1 group">
                    <Kbd className="bg-muted border-none text-secondary min-w-[30px] p-0.5 px-2">alt</Kbd>
                    <span className="opacity-50">+</span>
                    <Kbd className="bg-muted border-none text-secondary min-w-[50px] p-0.5 px-2">enter</Kbd>
                    <span className="ml-1 uppercase">- restart test</span>
                 </div>
                 <div className="flex items-center gap-1 group ml-4">
                    <Kbd className="bg-muted border-none text-secondary min-w-[30px] p-0.5 px-2">esc</Kbd>
                    <span className="opacity-50 mx-1">or</span>
                    <Kbd className="bg-muted border-none text-secondary min-w-[30px] p-0.5 px-2">ctrl</Kbd>
                    <span className="opacity-50">+</span>
                    <Kbd className="bg-muted border-none text-secondary min-w-[40px] p-0.5 px-2">shift</Kbd>
                    <span className="opacity-50">+</span>
                    <Kbd className="bg-muted border-none text-secondary min-w-[30px] p-0.5 px-2">p</Kbd>
                    <span className="ml-1 uppercase">- command line</span>
                 </div>
            </div>
        </motion.div>
      </main>

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
