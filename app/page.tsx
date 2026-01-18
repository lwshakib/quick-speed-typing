'use client';

import { AuthModal } from "@/components/auth-modal";
import { UserMenu } from "@/components/user-menu";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Kbd } from "@/components/ui/kbd";
import { saveTypingHistory } from "@/lib/actions";
import { useSession } from "@/lib/auth-client";
import { useTypingEngine } from "@/hooks/use-typing-engine";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Zap, Target, AlertTriangle, CloudUpload } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import Link from "next/link";

export default function Home() {
  const {
    state,
    words,
    typed,
    timeLeft,
    errors,
    isError,
    lastError,
    restart,
    wpm,
    accuracy,
  } = useTypingEngine(30);

  const { data: session } = useSession();
  const [isMounted, setIsMounted] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const lastFinishRef = useRef<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle auto-saving when finished and logged in
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
    try {
      await saveTypingHistory({
        wpm,
        accuracy,
        errors,
        duration: 30, // Default duration used in hook
      });
      setHasSaved(true);
      toast.success("Progress saved to profile!");
    } catch (error) {
      console.error("Failed to save:", error);
      toast.error("Failed to save progress");
    }
  };

  const handleAuthSuccess = () => {
    // Save progress after sign in if finished
    if (state === 'finish' && !hasSaved) {
      handleSave();
    }
  };

  if (!isMounted) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-[#d4d4d4] font-mono p-4 sm:p-6 transition-colors duration-300">
      <header className="fixed top-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-center z-50 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md">
        <Logo iconSize={28} textSize="1.25rem" />
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          {session ? (
            <UserMenu />
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full"
              onClick={() => setShowAuthModal(true)}
            >
              Sign In
            </Button>
          )}
        </div>
      </header>

      <main className="w-full max-w-4xl flex flex-col items-center gap-8 sm:gap-12 mt-20 sm:mt-16">

        {/* Game State Tracking */}
        <AnimatePresence mode="wait">
          {state !== "finish" ? (
            <motion.div
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col gap-8"
            >
              <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4 px-2">
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                  <span className="text-muted-foreground text-xs sm:text-sm uppercase tracking-widest font-medium">Time Remaining</span>
                  <span className={`text-3xl sm:text-4xl font-bold ${timeLeft < 10 ? 'text-destructive' : 'text-foreground'}`}>
                    {timeLeft}s
                  </span>
                </div>
                <div className="flex gap-8">
                   <div className="flex flex-col items-center sm:items-end text-center sm:text-right">
                    <span className="text-muted-foreground text-xs sm:text-sm uppercase tracking-widest font-medium">Accuracy</span>
                    <span className="text-xl sm:text-2xl font-semibold text-foreground">{accuracy}%</span>
                  </div>
                </div>
              </div>

              {/* Typing Area */}
              <motion.div 
                animate={isError ? { x: [-10, 10, -10, 10, 0] } : { x: 0 }}
                transition={{ duration: 0.1, repeat: 0 }}
                className="relative text-xl sm:text-2xl md:text-3xl leading-relaxed tracking-wide min-h-[160px] p-4 sm:p-8"
              >
                {/* Background Words */}
                <div className="absolute inset-4 sm:inset-8 text-muted-foreground/30 pointer-events-none select-none break-words">
                  {words}
                </div>
                
                {/* Typed Overlay */}
                <div className="relative z-10 break-words">
                  {typed.split("").map((char, index) => {
                    const isCorrect = char === words[index];
                    return (
                      <span
                        key={index}
                        className={`${
                          isCorrect ? "text-foreground" : "text-destructive"
                        } transition-colors duration-100`}
                      >
                        {char}
                      </span>
                    );
                  })}
                  
                  {/* Caret */}
                  <span className="relative inline-flex flex-col items-center">
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="inline-block w-[2px] h-[1.2em] bg-primary align-middle ml-[2px]"
                    />
                    
                    {/* Error Display Under Cursor */}
                    <AnimatePresence>
                      {lastError && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5, y: -5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.5, y: 5 }}
                          className="absolute top-full mt-1 text-destructive font-bold text-sm whitespace-nowrap z-50 capitalize"
                        >
                          {lastError === " " ? "␣" : lastError}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </span>
                </div>
              </motion.div>

              <div className="flex justify-center flex-col items-center gap-4">
                <Button
                  variant="secondary"
                  onClick={restart}
                  className="group flex items-center gap-2 px-8 py-6 rounded-xl hover:bg-secondary/80 transition-all border border-border shadow-sm"
                >
                  <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                  <span className="font-semibold text-base">Restart Test</span>
                </Button>
                <div className="text-muted-foreground text-xs flex items-center gap-1.5 opacity-60">
                   <Kbd>Tab</Kbd>
                   <span>to restart</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {/* WPM Result */}
              <Card className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl overflow-hidden relative border-border/50 shadow-2xl bg-card transition-all hover:scale-[1.02]">
                <CardContent className="flex flex-col items-center p-0">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Zap className="w-12 h-12 sm:w-20 sm:h-20" />
                  </div>
                  <span className="text-muted-foreground uppercase tracking-widest text-[10px] sm:text-xs mb-2 font-bold opacity-70">WPM</span>
                  <span className="text-5xl sm:text-7xl font-black text-foreground tabular-nums tracking-tighter">{wpm}</span>
                </CardContent>
              </Card>

              {/* Accuracy Result */}
              <Card className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl overflow-hidden relative border-border/50 shadow-2xl bg-card transition-all hover:scale-[1.02]">
                <CardContent className="flex flex-col items-center p-0">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Target className="w-12 h-12 sm:w-20 sm:h-20" />
                  </div>
                  <span className="text-muted-foreground uppercase tracking-widest text-[10px] sm:text-xs mb-2 font-bold opacity-70">Accuracy</span>
                  <span className={`text-5xl sm:text-7xl font-black tabular-nums tracking-tighter ${accuracy > 90 ? 'text-green-500' : 'text-foreground'}`}>{accuracy}%</span>
                </CardContent>
              </Card>

              {/* Errors Result */}
              <Card className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl overflow-hidden relative border-border/50 shadow-2xl bg-card transition-all hover:scale-[1.02]">
                <CardContent className="flex flex-col items-center p-0">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <AlertTriangle className="w-12 h-12 sm:w-20 sm:h-20" />
                  </div>
                  <span className="text-muted-foreground uppercase tracking-widest text-[10px] sm:text-xs mb-2 font-bold opacity-70">Errors</span>
                  <span className="text-5xl sm:text-7xl font-black text-destructive tabular-nums tracking-tighter">{errors}</span>
                </CardContent>
              </Card>

              <div className="md:col-span-3 flex flex-col sm:flex-row justify-center items-center gap-4 mt-4 sm:mt-8">
                <Button
                  size="lg"
                  onClick={restart}
                  className="w-full sm:w-auto px-8 sm:px-12 py-6 sm:py-7 rounded-2xl font-bold hover:scale-105 transition-all shadow-2xl shadow-primary/20 text-base sm:text-lg"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Try Again
                </Button>

                {!session && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setShowAuthModal(true)}
                    className="w-full sm:w-auto px-8 sm:px-12 py-6 sm:py-7 rounded-2xl font-bold hover:scale-105 transition-all text-base sm:text-lg border-primary/20 hover:bg-primary/5"
                  >
                    <CloudUpload className="w-5 h-5 mr-2" />
                    Sign in to save
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer/Tips */}
        <div className="mt-8 text-muted-foreground text-sm max-w-lg text-center leading-relaxed font-medium">
          Focus on precision over speed. Speed naturally follows accuracy. 
          Use the <Kbd className="text-xs">Backspace</Kbd> key to correct mistakes.
        </div>
      </main>
      
      {/* Decorative Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-yellow-500/5 blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-red-500/[0.02] blur-[150px] pointer-events-none -z-10" />
      <AuthModal 
        isOpen={showAuthModal} 
        onOpenChange={setShowAuthModal} 
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
