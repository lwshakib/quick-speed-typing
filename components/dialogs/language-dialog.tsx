'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Search, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const LANGUAGES = [
  'english',
  'spanish',
  'french',
  'german',
  'italian',
  'polish',
  'portuguese',
  'russian',
  'dutch',
  'swedish',
  'norwegian',
  'danish',
  'turkish',
  'vietnamese',
  'thai',
  'nepali',
  'hindi',
  'bengali',
  'arabic',
  'chinese',
  'japanese',
  'korean',
];

interface LanguageDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentLanguage: string;
  onSelectLanguage: (lang: string) => void;
}

export function LanguageDialog({
  isOpen,
  onOpenChange,
  currentLanguage,
  onSelectLanguage,
}: LanguageDialogProps) {
  const [search, setSearch] = useState('');
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setSearch('');
    }
  }

  const inputRef = useRef<HTMLInputElement>(null);

  const filteredLanguages = LANGUAGES.filter((lang) =>
    lang.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="overflow-hidden rounded-lg border-none p-0 shadow-none focus:outline-none sm:max-w-[500px]"
        style={{
          backgroundColor: 'var(--background)',
          color: 'var(--sub-color)',
        }}
      >
        <div className="flex h-full max-h-[85vh] flex-col">
          {/* Search Area */}
          <div className="flex items-center gap-3 px-8 pt-8 pb-3">
            <Search size={18} className="shrink-0" style={{ color: 'var(--sub-color)' }} />
            <div className="relative flex flex-1 items-center">
              <input
                ref={inputRef}
                placeholder="Language..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 w-full border-none bg-transparent p-0 font-mono text-lg placeholder:opacity-50 focus:ring-0 focus:outline-none"
                style={{ color: 'var(--text-color)' }}
              />
              {search === '' && (
                <div
                  className="absolute left-0 ml-[1px] h-[1.1rem] w-[1.5px] animate-pulse"
                  style={{ backgroundColor: 'var(--main-color)' }}
                />
              )}
            </div>
          </div>

          {/* Language List */}
          <div className="custom-scrollbar flex-1 overflow-y-auto pt-1 pb-8 font-mono text-sm">
            {filteredLanguages.map((lang) => {
              const isActive = currentLanguage === lang;
              return (
                <button
                  key={lang}
                  onClick={() => {
                    onSelectLanguage(lang);
                    onOpenChange(false);
                  }}
                  className={cn(
                    'group relative flex min-h-[36px] w-full items-center px-16 transition-colors duration-75',
                    'hover:bg-[var(--text-color)] hover:text-[var(--background)]',
                  )}
                >
                  <div className="flex w-full items-center">
                    {isActive && (
                      <Check
                        size={14}
                        className="absolute left-6 stroke-[3px]"
                        style={{ color: 'var(--sub-color)' }}
                      />
                    )}
                    <span className="lowercase">{lang}</span>
                  </div>
                </button>
              );
            })}
            {filteredLanguages.length === 0 && (
              <div className="px-16 py-10 text-xl lowercase opacity-50">no languages found</div>
            )}
          </div>
        </div>

        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.2);
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}
