'use client';

import { Logo } from "@/components/logo";
import { ArrowLeft, Settings as SettingsIcon, Palette, Globe, Keyboard, Bell, Eye, EyeOff, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { THEMES, Theme } from "@/lib/themes";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [currentThemeId, setCurrentThemeId] = useState("serika-dark");
  const [showLiveWpm, setShowLiveWpm] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [quickRestart, setQuickRestart] = useState(true);
  const [smoothCaret, setSmoothCaret] = useState(true);

  useEffect(() => {
    const savedThemeId = localStorage.getItem('typing-theme');
    if (savedThemeId) setCurrentThemeId(savedThemeId);
  }, []);

  const handleThemeChange = (themeId: string) => {
    setCurrentThemeId(themeId);
    localStorage.setItem('typing-theme', themeId);

    if (themeId === 'custom') {
        const savedCustom = localStorage.getItem('custom-theme-colors');
        if (savedCustom) {
            applyThemeStyles({
                id: 'custom',
                name: 'custom',
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

  const applyThemeStyles = (theme: Theme) => {
    const root = document.documentElement;
    root.style.setProperty('--background', theme.colors.background);
    root.style.setProperty('--main-color', theme.colors.main);
    root.style.setProperty('--caret-color', theme.colors.caret);
    root.style.setProperty('--sub-color', theme.colors.sub);
    root.style.setProperty('--text-color', theme.colors.text);
    root.style.setProperty('--error-color', theme.colors.error);
    root.style.setProperty('--error-extra-color', theme.colors.errorExtra);
    
    root.style.setProperty('--foreground', theme.colors.text);
    root.style.setProperty('--primary', theme.colors.main);
    root.style.setProperty('--secondary', theme.colors.sub);
    root.style.setProperty('--muted-foreground', theme.colors.sub);
    root.style.setProperty('--accent', theme.colors.main);
    root.style.setProperty('--ring', theme.colors.main);
    root.style.setProperty('--destructive', theme.colors.error);
  };

  return (
    <div className="min-h-screen bg-background text-secondary font-mono selection:bg-primary/30 selection:text-primary transition-colors duration-300 flex flex-col items-center overflow-x-hidden">
      <header className="w-full max-w-[1250px] px-8 py-8 flex justify-between items-center z-50">
        <Link href="/">
          <Logo iconSize={32} textSize="1.5rem" className="text-foreground hover:opacity-80 transition-opacity" />
        </Link>
      </header>

      <main className="flex-1 w-full max-w-[900px] px-8 py-12 flex flex-col gap-12">
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

        {/* Behavior */}
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

        {/* Appearance */}
        <section className="flex flex-col gap-6">
            <h2 className="text-xl font-bold text-foreground lowercase flex items-center gap-2">
                <Palette size={18} className="text-primary" /> appearance
            </h2>
            <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-4 bg-secondary/5 p-6 rounded-lg border border-secondary/10">
                    <div className="flex flex-col gap-1">
                        <span className="font-bold text-foreground lowercase">theme</span>
                        <span className="text-xs opacity-60">change the overall color scheme of the application.</span>
                    </div>
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

                <SettingRow 
                    title="live wpm" 
                    description="display your words per minute in real-time during the test."
                    enabled={showLiveWpm}
                    onToggle={setShowLiveWpm}
                    icon={showLiveWpm ? <Eye size={16} /> : <EyeOff size={16} />}
                />
            </div>
        </section>

        {/* Sound */}
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

        <div className="mt-8 flex justify-center">
          <Link href="/" className="flex items-center gap-2 text-secondary hover:text-primary transition-colors font-bold group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>back to home</span>
          </Link>
        </div>
      </main>
    </div>
  );
}

interface SettingRowProps {
    title: string;
    description: string;
    enabled: boolean;
    onToggle: (val: boolean) => void;
    icon?: React.ReactNode;
}

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
