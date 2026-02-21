"use client";

// Import core React hooks for state, persistence (ref), and initialization (effect)
import { useState, useEffect, useRef } from "react";
// Import the base Dialog component from the UI library
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
// Import a set of utility icons for the theme interface
import { Search, Palette, ChevronDown, ChevronUp } from "lucide-react";
// Import predefined themes and type definitions
import { THEMES, Theme } from "@/lib/themes";
// Import utility for conditional className application
import { cn } from "@/lib/utils";

interface ThemeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentTheme: string;
  onSelectTheme: (theme: Theme) => void;
}

/**
 * ThemeDialog: A comprehensive modal for browsing, searching, and creating custom application themes.
 * It uses the brand's aesthetic of lowercase text and monospace fonts.
 */
export function ThemeDialog({
  isOpen,
  onOpenChange,
  currentTheme,
  onSelectTheme,
}: ThemeDialogProps) {
  // Local state for search filtering and visualization mode
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<'light' | 'dark'>('dark');
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Local state for the "Custom" theme creator, initialized with default "Monkeytype" colors
  const [customColors, setCustomColors] = useState({
    background: "#323437",
    main: "#e2b714",
    caret: "#e2b714",
    sub: "#646669",
    text: "#d1d0c5",
    error: "#ca4754",
    errorExtra: "#793e44",
  });

  // Derived state: Filtered themes based on search term and light/dark toggle
  const filteredThemes = THEMES.filter((theme) =>
    theme.name.toLowerCase().includes(search.toLowerCase()) &&
    theme.type === mode
  );

  // Handle side effects when the modal opens (focus, state sync)
  useEffect(() => {
    if (isOpen) {
      // Small timeout to ensure the dialog transition is ready before focusing the input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      setSearch("");

      // Automatically switch the mode toggle to match the user's current theme
      const current = THEMES.find(t => t.id === currentTheme);
      if (current) setMode(current.type);
      
      // Load any previously saved custom theme colors from local storage
      const savedCustom = localStorage.getItem('custom-theme-colors');
      if (savedCustom) {
          setCustomColors(JSON.parse(savedCustom));
      }
    }
  }, [isOpen, currentTheme]);

  /**
   * Update a specific color in the custom theme and persist it.
   */
  const handleCustomColorChange = (key: keyof typeof customColors, value: string) => {
    const newColors = { ...customColors, [key]: value };
    setCustomColors(newColors);
    localStorage.setItem('custom-theme-colors', JSON.stringify(newColors));
    
    // If the user already has 'custom' selected, apply the change immediately for live feedback
    if (currentTheme === 'custom') {
            onSelectTheme({
                id: 'custom',
                name: 'custom',
                type: 'dark', // Custom themes default to dark variable mapping logic
                colors: newColors
            });
    }
  };

  /**
   * Finalize the custom theme selection and close the modal.
   */
  const selectCustom = () => {
    onSelectTheme({
        id: 'custom',
        name: 'custom',
        type: 'dark',
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
          {/* HEADER: Contains category toggles and search input */}
          <div className="flex flex-col gap-4 px-8 pt-6 pb-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Palette size={18} style={{ color: 'var(--sub-color)' }} />
                    <span className="text-sm font-bold lowercase opacity-50">themes</span>
                </div>
                {/* Light/Dark mode switcher for filtering the theme library */}
                <div className="flex bg-muted/30 p-1 rounded-lg border border-border/50">
                    <button 
                        onClick={() => setMode('light')}
                        className={cn(
                            "px-4 py-1.5 text-[10px] uppercase font-bold rounded-md transition-all",
                            mode === 'light' ? "bg-primary text-primary-foreground shadow-sm" : "opacity-40 hover:opacity-100"
                        )}
                    >
                        light
                    </button>
                    <button 
                        onClick={() => setMode('dark')}
                        className={cn(
                            "px-4 py-1.5 text-[10px] uppercase font-bold rounded-md transition-all",
                            mode === 'dark' ? "bg-primary text-primary-foreground shadow-sm" : "opacity-40 hover:opacity-100"
                        )}
                    >
                        dark
                    </button>
                </div>
            </div>
            
            {/* Monospaced search bar with a typing-indicator cursor effect */}
            <div className="flex items-center gap-3">
                <Search size={18} className="shrink-0" style={{ color: 'var(--sub-color)' }} />
                <div className="relative flex-1 flex items-center">
                <input
                    ref={inputRef}
                    placeholder={`search ${mode} themes...`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-sm font-mono p-0 h-8"
                    style={{ color: 'var(--text-color)' }}
                />
                {/* Visual cursor shim for the typing theme effect */}
                {search === "" && (
                    <div className="absolute left-0 w-[1.5px] h-[1rem] animate-pulse ml-[1px]" style={{ backgroundColor: 'var(--main-color)' }} />
                )}
                </div>
            </div>
          </div>

          {/* LIST: Vertically scrollable area for theme selection */}
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
                        {/* Visual preview dots representing the theme's core palette */}
                        <div className="flex gap-1">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.colors.background, border: '1px solid var(--sub-color)' }} />
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.colors.main }} />
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.colors.text }} />
                        </div>
                        <span className="lowercase">{theme.name}</span>
                    </div>
                    {/* Tick icon to indicate current selection */}
                    {isActive && <Palette size={12} style={{ color: 'var(--main-color)' }} />}
                  </div>
                </button>
              );
            })}
            {/* Empty state for search misses */}
            {filteredThemes.length === 0 && (
              <div className="px-16 py-10 opacity-50 text-sm lowercase">
                no themes found
              </div>
            )}
          </div>

          {/* FOOTER: Expandable Custom Theme Creator */}
          <div className="border-t border-white/5 mt-auto bg-background/50 backdrop-blur-sm flex flex-col-reverse">
              {/* Toggle button for the custom color editor */}
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
              
              {/* Detailed color picker grid */}
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

        {/* Local CSS for specialized scrollbar and hover behaviors */}
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
          
          /* Hover effect translates the background color and text color for clear feedback */
          .theme-item:hover {
            background-color: var(--text-color) !important;
            color: var(--background) !important;
          }
          .theme-item:hover span {
             color: var(--background) !important;
          }

          /* Styling the native browser color picker swatch */
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
