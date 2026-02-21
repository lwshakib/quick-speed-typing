import { create } from 'zustand';
import { Theme, THEMES } from '@/lib/themes';
import { updateUserTheme } from '@/lib/actions';

/**
 * Interface defining the global UI state and actions for the application.
 */
interface UiState {
  /** Whether standard UI elements like headers and footers are visible */
  showUi: boolean;
  setShowUi: (showUi: boolean) => void;
  
  /** Whether the app is in focus/minimalist mode (no distractions) */
  isFocusMode: boolean;
  setIsFocusMode: (isFocusMode: boolean) => void;
  
  // -- Modal / Sidebar States --
  
  /** State of the notification drawer */
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  
  /** State of the theme selection dialog */
  isThemeOpen: boolean;
  setIsThemeOpen: (open: boolean) => void;
  
  /** State of the language selection dialog */
  isLangOpen: boolean;
  setIsLangOpen: (open: boolean) => void;

  // -- Theme Management --
  
  /** Currently active visual theme */
  currentTheme: Theme;
  setCurrentTheme: (theme: Theme) => void;
  
  /** 
   * Updates the theme locally and optionally syncs it with the database 
   * if a user session is present.
   */
  applyTheme: (theme: Theme, session: any) => void;

  // -- Global Sequence Controls --
  
  /** Counter used to trigger test resets from distant components */
  restartCount: number;
  triggerRestart: () => void;
}

/**
 * Global store for managing application-wide UI states and transitions.
 * Powered by Zustand for lightweight and fast state management.
 */
export const useUiStore = create<UiState>((set, get) => ({
  // Defaults
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

  // Initial theme (usually overridden by local storage on mount)
  currentTheme: THEMES[0],
  setCurrentTheme: (theme) => set({ currentTheme: theme }),
  
  /**
   * Applies a theme across the app, persists to localStorage, 
   * and notifies other systems via a custom event.
   */
  applyTheme: (theme, session) => {
    set({ currentTheme: theme });
    localStorage.setItem('typing-theme', theme.id);
    
    // Notify components that don't use the store directly (e.g., raw CSS/scripts)
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: theme }));
    
    // Persist to user profile if logged in
    if (session) {
      updateUserTheme(theme.id).catch(err => console.error("Failed to sync theme to DB:", err));
    }
  },

  // State for triggering restarts globally (e.g., from header button to engine hook)
  restartCount: 0,
  triggerRestart: () => set((state) => ({ restartCount: state.restartCount + 1 })),
}));
