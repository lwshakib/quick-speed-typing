'use client';

import { useEffect, useRef } from 'react';
import { useSession } from '@/lib/auth-client';
import { useSettingsStore, Settings } from '@/hooks/use-settings-store';
import { getUserSettings } from '@/lib/actions';

/**
 * SettingsSync: A headless component that manages the synchronization of user
 * preferences between the client-side store and the persistent database.
 */
export function SettingsSync() {
  const { data: session } = useSession();
  const settings = useSettingsStore();
  const hasSynced = useRef(false);

  useEffect(() => {
    // If a user is logged in and we haven't synced yet, fetch settings from DB
    if (session && !hasSynced.current) {
      getUserSettings().then((dbSettings) => {
        if (dbSettings) {
          settings.initializeSettings(dbSettings as Partial<Settings>);
          hasSynced.current = true;
        }
      });
    } else if (!session) {
      // Reset sync flag if user logs out so we can re-sync if a different user logs in
      hasSynced.current = false;
    }
  }, [session, settings]);

  return null;
}
