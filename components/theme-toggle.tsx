'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { THEMES } from '@/lib/themes';

export function ThemeToggle() {
  const [currentThemeId, setCurrentThemeId] = React.useState<string>('default-light');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('typing-theme') || 'default-light';
    setCurrentThemeId(saved);

    // Listen for theme changes from other components (like ThemeDialog)
    const handleThemeChange = () => {
      setCurrentThemeId(localStorage.getItem('typing-theme') || 'default-light');
    };
    window.addEventListener('theme-changed', handleThemeChange);
    return () => window.removeEventListener('theme-changed', handleThemeChange);
  }, []);

  if (!mounted) {
    return <div className="h-9 w-9" />;
  }

  const currentTheme = THEMES.find((t) => t.id === currentThemeId) || THEMES[0];
  const isDark = currentTheme.type === 'dark';

  const toggleTheme = () => {
    let targetTheme;

    // Find counterpart (e.g., serika-dark -> serika-light)
    const baseName = currentTheme.id.replace('-light', '').replace('-dark', '');
    const counterpartId = isDark ? `${baseName}-light` : `${baseName}-dark`;

    targetTheme = THEMES.find((t) => t.id === counterpartId);

    // Fallback if no direct counterpart exists
    if (!targetTheme) {
      targetTheme = THEMES.find((t) => t.type === (isDark ? 'light' : 'dark'));
    }

    if (targetTheme) {
      localStorage.setItem('typing-theme', targetTheme.id);
      setCurrentThemeId(targetTheme.id);
      // Dispatch custom event so app/page.tsx can update
      window.dispatchEvent(new CustomEvent('theme-changed', { detail: targetTheme }));
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="hover:text-foreground cursor-pointer transition-colors duration-200 hover:scale-110 focus:outline-none active:scale-95"
      aria-label="Toggle theme mode"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? 'moon' : 'sun'}
          initial={{ opacity: 0, scale: 0.5, rotate: isDark ? -90 : 90 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.5, rotate: isDark ? 90 : -90 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center"
        >
          {isDark ? <Moon size={16} /> : <Sun size={16} />}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
