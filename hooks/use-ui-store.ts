import { create } from 'zustand';
import { Theme, THEMES } from '@/lib/themes';
import { updateUserTheme } from '@/lib/actions';

interface UiState {
  showUi: boolean;
  setShowUi: (showUi: boolean) => void;
  isFocusMode: boolean;
  setIsFocusMode: (isFocusMode: boolean) => void;
  
  // Modal states
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isThemeOpen: boolean;
  setIsThemeOpen: (open: boolean) => void;
  isLangOpen: boolean;
  setIsLangOpen: (open: boolean) => void;

  // Theme state
  currentTheme: Theme;
  setCurrentTheme: (theme: Theme) => void;
  applyTheme: (theme: Theme, session: any) => void;

  // Restart trigger
  restartCount: number;
  triggerRestart: () => void;
}

export const useUiStore = create<UiState>((set, get) => ({
  showUi: true,
  setShowUi: (showUi) => set({ showUi }),
  isFocusMode: false,
  setIsFocusMode: (isFocusMode) => set({ isFocusMode }),
  
  isNotificationsOpen: false,
  setIsNotificationsOpen: (open) => set({ isNotificationsOpen: open }),
  isThemeOpen: false,
  setIsThemeOpen: (open) => set({ isThemeOpen: open }),
  isLangOpen: false,
  setIsLangOpen: (open) => set({ isLangOpen: open }),

  currentTheme: THEMES[0],
  setCurrentTheme: (theme) => set({ currentTheme: theme }),
  applyTheme: (theme, session) => {
    set({ currentTheme: theme });
    localStorage.setItem('typing-theme', theme.id);
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: theme }));
    
    if (session) {
      updateUserTheme(theme.id).catch(err => console.error("Failed to sync theme to DB:", err));
    }
  },

  restartCount: 0,
  triggerRestart: () => set((state) => ({ restartCount: state.restartCount + 1 })),
}));
