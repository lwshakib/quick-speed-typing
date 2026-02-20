"use client";

import { useEffect } from "react";
import { THEMES, Theme } from "@/lib/themes";

export function CustomThemeManager() {
  useEffect(() => {
    const applyTheme = (theme: Theme) => {
      const root = document.documentElement;
      root.style.setProperty("--background", theme.colors.background);
      root.style.setProperty("--main-color", theme.colors.main);
      root.style.setProperty("--caret-color", theme.colors.caret);
      root.style.setProperty("--sub-color", theme.colors.sub);
      root.style.setProperty("--text-color", theme.colors.text);
      root.style.setProperty("--error-color", theme.colors.error);
      root.style.setProperty("--error-extra-color", theme.colors.errorExtra);

      root.style.setProperty("--foreground", theme.colors.text);
      root.style.setProperty("--primary", theme.colors.main);
      root.style.setProperty("--secondary", theme.colors.sub);
      root.style.setProperty("--muted-foreground", theme.colors.sub);
      root.style.setProperty("--accent", theme.colors.main);
      root.style.setProperty("--ring", theme.colors.main);
      root.style.setProperty("--destructive", theme.colors.error);
      
      // Also update some Shadcn specific variables that might not be mapped correctly in globals.css
      root.style.setProperty("--primary-foreground", theme.colors.background);
      root.style.setProperty("--secondary-foreground", theme.colors.text);
      root.style.setProperty("--accent-foreground", theme.colors.background);
    };

    const savedThemeId = localStorage.getItem("typing-theme");
    if (savedThemeId) {
      if (savedThemeId === "custom") {
        const savedCustom = localStorage.getItem("custom-theme-colors");
        if (savedCustom) {
          applyTheme({
            id: "custom",
            name: "custom",
            colors: JSON.parse(savedCustom),
          });
        }
      } else {
        const theme = THEMES.find((t) => t.id === savedThemeId);
        if (theme) {
          applyTheme(theme);
        }
      }
    }
    
    // Listen for theme changes in other tabs or within the app
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "typing-theme") {
        // Re-apply theme
        window.location.reload(); // Simple way to ensure everything is in sync
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return null;
}
