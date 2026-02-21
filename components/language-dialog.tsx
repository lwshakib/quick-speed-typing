"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  "english",
  "spanish",
  "french",
  "german",
  "italian",
  "polish",
  "portuguese",
  "russian",
  "dutch",
  "swedish",
  "norwegian",
  "danish",
  "turkish",
  "vietnamese",
  "thai",
  "nepali",
  "hindi",
  "bengali",
  "arabic",
  "chinese",
  "japanese",
  "korean",
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
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredLanguages = LANGUAGES.filter((lang) =>
    lang.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
          inputRef.current?.focus();
      }, 100);
      setSearch("");
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        showCloseButton={false} 
        className="sm:max-w-[500px] border-none p-0 overflow-hidden rounded-lg shadow-none focus:outline-none"
        style={{
            backgroundColor: 'var(--background)',
            color: 'var(--sub-color)'
        }}
      >
        <div className="flex flex-col h-full max-h-[85vh]">
          {/* Search Area */}
          <div className="flex items-center gap-3 px-8 pt-8 pb-3">
            <Search size={18} className="shrink-0" style={{ color: 'var(--sub-color)' }} />
            <div className="relative flex-1 flex items-center">
                <input
                  ref={inputRef}
                  placeholder="Language..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent border-none focus:outline-none focus:ring-0 placeholder:opacity-50 text-lg font-mono p-0 h-8"
                  style={{ color: 'var(--text-color)' }}
                />
                {search === "" && (
                    <div className="absolute left-0 w-[1.5px] h-[1.1rem] animate-pulse ml-[1px]" style={{ backgroundColor: 'var(--main-color)' }} />
                )}
            </div>
          </div>
          
          {/* Language List */}
          <div className="flex-1 overflow-y-auto pb-8 custom-scrollbar font-mono text-sm pt-1">
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
                  "flex items-center w-full px-16 group transition-colors duration-75 min-h-[36px] relative",
                  "hover:bg-[var(--text-color)] hover:text-[var(--background)]"
                )}
              >
                <div className="flex items-center w-full">
                    {isActive && (
                        <Check size={14} className="absolute left-6 stroke-[3px]" style={{ color: 'var(--sub-color)' }} />
                    )}
                    <span className="lowercase">{lang}</span>
                </div>
              </button>
            )})}
            {filteredLanguages.length === 0 && (
              <div className="px-16 py-10 opacity-50 text-xl lowercase">
                no languages found
              </div>
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
