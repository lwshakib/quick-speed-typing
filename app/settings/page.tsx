'use client';

// Import the branding logo
import { Logo } from "@/components/logo";
// Import a set of utility icons for the settings interface
import { ArrowLeft, Settings as SettingsIcon, Palette, Globe, Keyboard, Bell, Eye, EyeOff, Volume2, VolumeX } from "lucide-react";
// Import Next.js linking for client-side navigation
import Link from "next/link";
// Import animation library for entrance/transition effects
import { motion } from "framer-motion";
// Import the switch toggle component from the UI library
import { Switch } from "@/components/ui/switch";
// Import React hooks for managing local user preferences and lifecycle
import { useState, useEffect } from "react";
// Import theme library and type definitions
import { THEMES, Theme } from "@/lib/themes";
// Import conditional className utility
import { cn } from "@/lib/utils";

/**
 * SettingsPage: The central configuration hub for the user's typing experience.
 * Manages preferences for behavior, appearance (themes), and feedback (sounds).
 */
export default function SettingsPage() {
  // Local state for tracking various user configuration options
  const [currentThemeId, setCurrentThemeId] = useState("default-dark");
  const [showLiveWpm, setShowLiveWpm] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [quickRestart, setQuickRestart] = useState(true);
  const [smoothCaret, setSmoothCaret] = useState(true);

  // Synchronize state with persisted local storage on initial mount
  useEffect(() => {
    const savedThemeId = localStorage.getItem('typing-theme');
    if (savedThemeId) setCurrentThemeId(savedThemeId);
  }, []);

  /**
   * Handle the selection and application of a new visual theme.
   * Supports both predefined system themes and user-created custom palettes.
   */
  const handleThemeChange = (themeId: string) => {
    setCurrentThemeId(themeId);
    localStorage.setItem('typing-theme', themeId);

    if (themeId === 'custom') {
        const savedCustom = localStorage.getItem('custom-theme-colors');
        if (savedCustom) {
            applyThemeStyles({
                id: 'custom',
                name: 'custom',
                type: 'dark',
                colors: JSON.parse(savedCustom)
            });
        }
    } else {
        const theme = THEMES.find(t => t.id === themeId);
        if (theme) {
            applyThemeStyles(theme);
        }
    }
  };

  /**
   * Directly sets CSS variables on the root element to instantly update the UI.
   * This ensures the typing experience matches the user's aesthetic preferences immediately.
   */
  const applyThemeStyles = (theme: Theme) => {
    const root = document.documentElement;
    // Core functional variables
    root.style.setProperty('--background', theme.colors.background);
    root.style.setProperty('--main-color', theme.colors.main);
    root.style.setProperty('--caret-color', theme.colors.caret);
    root.style.setProperty('--sub-color', theme.colors.sub);
    root.style.setProperty('--text-color', theme.colors.text);
    root.style.setProperty('--error-color', theme.colors.error);
    root.style.setProperty('--error-extra-color', theme.colors.errorExtra);
    
    // Shadcn/Tailwind bridge variables
    root.style.setProperty('--foreground', theme.colors.text);
    root.style.setProperty('--primary', theme.colors.main);
    root.style.setProperty('--secondary', theme.colors.sub);
    root.style.setProperty('--muted-foreground', theme.colors.sub);
    root.style.setProperty('--accent', theme.colors.main);
    root.style.setProperty('--ring', theme.colors.main);
    root.style.setProperty('--destructive', theme.colors.error);
  };

  return (
    <main className="flex-1 w-full max-w-[900px] px-8 py-12 flex flex-col gap-12">
      {/* HEADER: Animated page title area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6"
      >
        <div className="flex items-center gap-4 text-primary">
          <SettingsIcon size={32} />
          <h1 className="text-4xl font-bold lowercase tracking-tighter">settings</h1>
        </div>
      </motion.div>

      {/* SECTION: Behavioral Settings (Typing mechanics) */}
      <section className="flex flex-col gap-6">
          <h2 className="text-xl font-bold text-foreground lowercase flex items-center gap-2">
              <Keyboard size={18} className="text-primary" /> behavior
          </h2>
          <div className="grid grid-cols-1 gap-2">
              <SettingRow 
                  title="quick restart" 
                  description="press tab + enter to quickly restart your test."
                  enabled={quickRestart}
                  onToggle={setQuickRestart}
              />
              <SettingRow 
                  title="smooth caret" 
                  description="enable smooth animations for the typing caret."
                  enabled={smoothCaret}
                  onToggle={setSmoothCaret}
              />
          </div>
      </section>

      {/* SECTION: Appearance & Themes (Visual identity) */}
      <section className="flex flex-col gap-6">
          <h2 className="text-xl font-bold text-foreground lowercase flex items-center gap-2">
              <Palette size={18} className="text-primary" /> appearance
          </h2>
          <div className="grid grid-cols-1 gap-4">
              {/* Theme Picker Container */}
              <div className="flex flex-col gap-4 bg-secondary/5 p-6 rounded-lg border border-secondary/10">
                  <div className="flex flex-col gap-1">
                      <span className="font-bold text-foreground lowercase">theme</span>
                      <span className="text-xs opacity-60">change the overall color scheme of the application.</span>
                  </div>
                  {/* Grid of available theme buttons */}
                  <div className="flex flex-wrap gap-2">
                      {THEMES.map(theme => (
                          <button
                              key={theme.id}
                              onClick={() => handleThemeChange(theme.id)}
                              className={cn(
                                  "px-4 py-2 rounded text-xs font-bold transition-all border",
                                  currentThemeId === theme.id 
                                      ? "bg-primary text-background border-primary" 
                                      : "bg-transparent border-secondary/20 hover:border-secondary/50 text-secondary"
                              )}
                          >
                              {theme.name}
                          </button>
                      ))}
                      {/* Special toggle for custom themes */}
                      <button
                          onClick={() => handleThemeChange('custom')}
                          className={cn(
                              "px-4 py-2 rounded text-xs font-bold transition-all border",
                              currentThemeId === 'custom' 
                                  ? "bg-primary text-background border-primary" 
                                  : "bg-transparent border-secondary/20 hover:border-secondary/50 text-secondary"
                          )}
                      >
                          custom
                      </button>
                  </div>
              </div>

              {/* Toggle for real-time speed feedback */}
              <SettingRow 
                  title="live wpm" 
                  description="display your words per minute in real-time during the test."
                  enabled={showLiveWpm}
                  onToggle={setShowLiveWpm}
                  icon={showLiveWpm ? <Eye size={16} /> : <EyeOff size={16} />}
              />
          </div>
      </section>

      {/* SECTION: Audio Feedback (Mechanical/Click sounds) */}
      <section className="flex flex-col gap-6">
          <h2 className="text-xl font-bold text-foreground lowercase flex items-center gap-2">
              <Volume2 size={18} className="text-primary" /> sound
          </h2>
          <div className="grid grid-cols-1 gap-2">
              <SettingRow 
                  title="key sounds" 
                  description="play a subtle sound when a key is pressed."
                  enabled={soundEnabled}
                  onToggle={setSoundEnabled}
                  icon={soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              />
          </div>
      </section>
    </main>
  );
}

/**
 * Interface definition for individual setting rows.
 */
interface SettingRowProps {
    title: string;
    description: string;
    enabled: boolean;
    onToggle: (val: boolean) => void;
    icon?: React.ReactNode;
}

/**
 * Reusable Row Component: Renders a titled setting with description and a switch toggle.
 * Used across multiple sections to ensure UI consistency.
 */
function SettingRow({ title, description, enabled, onToggle, icon }: SettingRowProps) {
    return (
        <div className="flex items-center justify-between bg-secondary/5 p-6 rounded-lg border border-secondary/10 hover:border-secondary/20 transition-colors">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 font-bold text-foreground lowercase">
                    {icon && <span className="text-primary">{icon}</span>}
                    {title}
                </div>
                <div className="text-xs opacity-60">{description}</div>
            </div>
            <Switch 
                checked={enabled} 
                onCheckedChange={onToggle}
            />
        </div>
    );
}
