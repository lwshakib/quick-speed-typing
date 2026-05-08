'use client';

import { useEffect } from 'react';
import { THEMES, Theme } from '@/lib/themes';

export function CustomThemeManager() {
  const applyTheme = (theme: Theme) => {
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

    const isLight = (color: string) => {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 155;
    };

    const lightTheme = isLight(theme.colors.background);

    root.style.setProperty('--muted', lightTheme ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)');
    root.style.setProperty('--border', lightTheme ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)');
    root.style.setProperty('--input', lightTheme ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)');
    root.style.setProperty('--popover', theme.colors.background);
    root.style.setProperty('--card', theme.colors.background);

    root.style.setProperty('--primary-foreground', lightTheme ? '#000000' : '#ffffff');
    root.style.setProperty('--secondary-foreground', theme.colors.text);
    root.style.setProperty('--accent-foreground', theme.colors.background);
    root.style.setProperty('--popover-foreground', theme.colors.text);
    root.style.setProperty('--card-foreground', theme.colors.text);
  };

  useEffect(() => {
    const savedThemeId = localStorage.getItem('typing-theme') || 'default-light';
    let theme = THEMES.find((t) => t.id === savedThemeId);

    if (savedThemeId === 'custom') {
      const savedCustom = localStorage.getItem('custom-theme-colors');
      if (savedCustom) {
        theme = {
          id: 'custom',
          name: 'custom',
          type: 'dark',
          colors: JSON.parse(savedCustom),
        };
      }
    }

    if (theme) {
      applyTheme(theme);
    }

    const handleThemeChange = (e: CustomEvent<Theme>) => {
      if (e.detail) {
        applyTheme(e.detail);
      }
    };

    window.addEventListener('theme-changed', handleThemeChange as EventListener);
    return () => window.removeEventListener('theme-changed', handleThemeChange as EventListener);
  }, []);

  return null;
}
