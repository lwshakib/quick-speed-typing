'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Kbd } from '@/components/ui/kbd';


interface TestDurationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSetDuration: (seconds: number) => void;
  currentDuration: number;
}

export function TestDurationDialog({
  isOpen,
  onOpenChange,
  onSetDuration,
  currentDuration,
}: TestDurationDialogProps) {
  const [inputValue, setInputValue] = useState(currentDuration.toString());
  const inputRef = useRef<HTMLInputElement>(null);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  // Sync input value when dialog opens (using state to avoid setState in effect)
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setInputValue(currentDuration.toString());
    }
  }

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [isOpen]);

  const parseDuration = (input: string): number => {
    if (input === '0') return 0;

    // Check for "1h30m" style
    const hMatch = input.match(/(\d+)h/);
    const mMatch = input.match(/(\d+)m/);
    const sMatch = input.match(/(\d+)s/);
    const rawNum = input.match(/^(\d+)$/);

    if (rawNum) return parseInt(rawNum[1]);

    let totalSeconds = 0;
    if (hMatch) totalSeconds += parseInt(hMatch[1]) * 3600;
    if (mMatch) totalSeconds += parseInt(mMatch[1]) * 60;
    if (sMatch) totalSeconds += parseInt(sMatch[1]);

    return totalSeconds || parseInt(input) || 0;
  };

  const formatDisplay = (input: string): string => {
    const seconds = parseDuration(input);
    if (seconds === 0 && input === '0') return 'infinite';
    if (seconds === 0) return '0 seconds';

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    const parts = [];
    if (h > 0) parts.push(`${h} second${h > 1 ? 's' : ''}`); // Wait, looking at image "1h30m" is mentioned.
    // Let's re-read the image text.
    // "You can use 'h' for hours and 'm' for minutes, for example '1h30m'."
    // If I put 15, it says "15 seconds".

    if (h > 0) parts.push(`${h} hour${h > 1 ? 's' : ''}`);
    if (m > 0) parts.push(`${m} minute${m > 1 ? 's' : ''}`);
    if (s > 0) parts.push(`${s} second${s > 1 ? 's' : ''}`);

    return parts.join(' ') || '0 seconds';
  };

  const handleOk = () => {
    const seconds = parseDuration(inputValue);
    onSetDuration(seconds);
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleOk();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="overflow-hidden rounded-xl border-none bg-[#323437] p-8 text-[#646669] shadow-2xl focus:outline-none sm:max-w-[500px]"
        style={{
          backgroundColor: 'var(--background)',
          color: 'var(--sub-color)',
        }}
      >
        <div className="flex flex-col gap-6 font-mono">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold tracking-tight lowercase opacity-40">
              Test duration
            </h2>
            <span className="text-sm lowercase opacity-80">{formatDisplay(inputValue)}</span>
          </div>

          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full rounded-xl border-2 border-white/5 bg-[#2c2e31]/50 px-4 py-3 text-xl font-bold transition-all focus:border-white/20 focus:outline-none"
              style={{
                color: 'var(--main-color)',
                backgroundColor: 'rgba(0,0,0,0.2)',
              }}
            />
            {/* The yellowish selection/cursor/highlight look from image */}
          </div>

          <div className="flex flex-col gap-4 text-xs leading-relaxed opacity-60">
            <p className="lowercase">
              You can use &quot;h&quot; for hours and &quot;m&quot; for minutes, for example &quot;1h30m&quot;.
            </p>

            <div className="flex flex-col gap-1">
              <p className="lowercase">
                You can start an infinite test by inputting 0. Then, to stop the test, use the Bail
                Out feature ({' '}
                <Kbd className="min-w-[30px] border-none bg-white/10 p-0.5 text-inherit">esc</Kbd>{' '}
                or{' '}
                <Kbd className="min-w-[30px] border-none bg-white/10 p-0.5 text-inherit">
                  ctrl/cmd
                </Kbd>{' '}
                +{' '}
                <Kbd className="min-w-[30px] border-none bg-white/10 p-0.5 text-inherit">shift</Kbd>{' '}
                + <Kbd className="min-w-[30px] border-none bg-white/10 p-0.5 text-inherit">p</Kbd>{' '}
                {'>'} Bail Out)
              </p>
            </div>
          </div>

          <button
            onClick={handleOk}
            className="w-full rounded-xl bg-white/5 py-3 text-sm font-bold lowercase transition-colors hover:bg-white/10"
          >
            ok
          </button>
        </div>

        <style jsx>{`
          input::selection {
            background: var(--main-color);
            color: var(--background);
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}
