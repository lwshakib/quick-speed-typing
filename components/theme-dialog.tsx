"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Search, Palette, ChevronDown, ChevronUp } from "lucide-react";
import { THEMES, Theme } from "@/lib/themes";
import { cn } from "@/lib/utils";

interface ThemeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentTheme: string;
  onSelectTheme: (theme: Theme) => void;
}

export function ThemeDialog({
  isOpen,
  onOpenChange,
  currentTheme,
  onSelectTheme,
}: ThemeDialogProps) {
  const [search, setSearch] = useState("");
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [customColors, setCustomColors] = useState({
    background: "#323437",
    main: "#e2b714",
    caret: "#e2b714",
    sub: "#646669",
    text: "#d1d0c5",
    error: "#ca4754",
    errorExtra: "#793e44",
  });

  const filteredThemes = THEMES.filter((theme) =>
    theme.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      setSearch("");
      
      const savedCustom = localStorage.getItem('custom-theme-colors');
      if (savedCustom) {
          setCustomColors(JSON.parse(savedCustom));
      }
    }
  }, [isOpen]);

  const handleCustomColorChange = (key: keyof typeof customColors, value: string) => {
    const newColors = { ...customColors, [key]: value };
    setCustomColors(newColors);
    localStorage.setItem('custom-theme-colors', JSON.stringify(newColors));
    
    if (currentTheme === 'custom') {
        onSelectTheme({
            id: 'custom',
            name: 'custom',
            colors: newColors
        });
    }
  };

  const selectCustom = () => {
    onSelectTheme({
        id: 'custom',
        name: 'custom',
        colors: customColors
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        showCloseButton={false}
        className="sm:max-w-[500px] bg-[#323437] border-none text-[#646669] p-0 overflow-hidden rounded-lg shadow-none focus:outline-none"
        style={{
            backgroundColor: 'var(--background)',
            color: 'var(--sub-color)'
        }}
      >
        <div className="flex flex-col h-full max-h-[90vh]">
          {/* Search Area */}
          <div className="flex items-center gap-3 px-8 pt-6 pb-3">
            <Search size={18} className="shrink-0" style={{ color: 'var(--sub-color)' }} />
            <div className="relative flex-1 flex items-center">
              <input
                ref={inputRef}
                placeholder="search themes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-sm font-mono p-0 h-8"
                style={{ color: 'var(--text-color)' }}
              />
              {search === "" && (
                <div className="absolute left-0 w-[1.5px] h-[1rem] animate-pulse ml-[1px]" style={{ backgroundColor: 'var(--main-color)' }} />
              )}
            </div>
          </div>

          {/* Theme List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-xs pt-1">
            {filteredThemes.map((theme) => {
              const isActive = currentTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    onSelectTheme(theme);
                    onOpenChange(false);
                  }}
                  className={cn(
                    "theme-item flex items-center w-full px-8 transition-colors duration-75 min-h-[32px] relative"
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                        <div className="flex gap-1">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.colors.background, border: '1px solid var(--sub-color)' }} />
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.colors.main }} />
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.colors.text }} />
                        </div>
                        <span className="lowercase">{theme.name}</span>
                    </div>
                    {isActive && <Palette size={12} style={{ color: 'var(--main-color)' }} />}
                  </div>
                </button>
              );
            })}
            {filteredThemes.length === 0 && (
              <div className="px-16 py-10 opacity-50 text-sm lowercase">
                no themes found
              </div>
            )}
          </div>

          {/* Custom Theme Creator (Moved to Bottom & Expands Upwards) */}
          <div className="border-t border-white/5 mt-auto bg-background/50 backdrop-blur-sm flex flex-col-reverse">
              <button 
                onClick={() => setIsCustomOpen(!isCustomOpen)}
                className="w-full px-8 py-4 flex items-center justify-between hover:bg-white/5 transition-colors group"
              >
                  <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-primary to-accent animate-pulse" />
                      <span className="font-bold text-foreground lowercase text-sm">custom theme</span>
                  </div>
                  {isCustomOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              
              {isCustomOpen && (
                  <div className="px-8 py-6 border-b border-white/5 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
                      <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                          {Object.entries(customColors).map(([key, value]) => (
                              <div key={key} className="flex items-center justify-between gap-2">
                                  <span className="text-[10px] uppercase font-black opacity-40">{key.replace(/([A-Z])/g, ' $1')}</span>
                                  <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-mono opacity-60 uppercase">{value}</span>
                                      <input 
                                        type="color" 
                                        value={value} 
                                        onChange={(e) => handleCustomColorChange(key as any, e.target.value)}
                                        className="w-5 h-5 rounded cursor-pointer bg-transparent border-none appearance-none overflow-hidden"
                                      />
                                  </div>
                              </div>
                          ))}
                      </div>
                      <button 
                        onClick={selectCustom}
                        className="w-full mt-2 h-10 bg-primary text-background rounded font-bold lowercase text-sm hover:opacity-90 transition-opacity"
                      >
                          apply custom theme
                      </button>
                  </div>
              )}
          </div>
        </div>

        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
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
          
          .theme-item:hover {
            background-color: var(--text-color) !important;
            color: var(--background) !important;
          }
          .theme-item:hover span {
             color: var(--background) !important;
          }

          input[type="color"]::-webkit-color-swatch-wrapper {
              padding: 0;
          }
          input[type="color"]::-webkit-color-swatch {
              border: none;
              border-radius: 4px;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}
