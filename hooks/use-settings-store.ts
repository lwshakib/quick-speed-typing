import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { updateUserSettings } from '@/lib/actions';

/**
 * Interface defining the user's customizable settings.
 */
export interface Settings {
  quickRestart: boolean;
  smoothCaret: boolean;
  showLiveWpm: boolean;
  soundEnabled: boolean;
  soundVolume: number;
  fontFamily: string;
  fontSize: number;
  caretStyle: 'line' | 'block' | 'underline' | 'pulse';
  timerPosition: 'top' | 'bottom';
  confidenceMode: boolean;
}

interface SettingsState extends Settings {
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K], session: unknown) => void;
  setSettings: (settings: Partial<Settings>, session: unknown) => void;
  initializeSettings: (settings: Partial<Settings>) => void;
}

const DEFAULT_SETTINGS: Settings = {
  quickRestart: true,
  smoothCaret: true,
  showLiveWpm: true,
  soundEnabled: false,
  soundVolume: 0.5,
  fontFamily: 'font-mono',
  fontSize: 32,
  caretStyle: 'line',
  timerPosition: 'top',
  confidenceMode: false,
};

/**
 * Global store for managing user configuration and persistence.
 * Leverages Zustand with middleware for automatic localStorage synchronization.
 */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,

      /**
       * Updates a single setting and syncs to DB if the user is authenticated.
       */
      setSetting: (key, value, session) => {
        set({ [key]: value } as Partial<SettingsState>);

        if (session) {
          updateUserSettings({ [key]: value }).catch((err) =>
            console.error(`Failed to sync setting ${key} to DB:`, err),
          );
        }
      },

      /**
       * Updates multiple settings at once and syncs to DB if authenticated.
       */
      setSettings: (settings, session) => {
        set(settings as Partial<SettingsState>);

        if (session) {
          updateUserSettings(settings).catch((err) =>
            console.error('Failed to sync settings to DB:', err),
          );
        }
      },

      /**
       * Bulk initialize settings (e.g., after fetching from DB on login).
       */
      initializeSettings: (settings) => {
        set(settings as Partial<SettingsState>);
      },
    }),
    {
      name: 'typing-settings',
    },
  ),
);
