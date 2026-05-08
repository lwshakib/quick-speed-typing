'use client';

import { NotificationDrawer } from '@/components/notifications/notification-drawer';
import { ThemeDialog } from '@/components/dialogs/theme-dialog';
import { LanguageDialog } from '@/components/dialogs/language-dialog';
import { useUiStore } from '@/hooks/use-ui-store';
import { useSession } from '@/lib/auth-client';
import { Theme } from '@/lib/themes';

export function GlobalModals() {
  const { data: session } = useSession();
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    isThemeOpen,
    setIsThemeOpen,
    isLangOpen,
    setIsLangOpen,
    currentTheme,
    applyTheme,
  } = useUiStore();

  return (
    <>
      <NotificationDrawer isOpen={isNotificationsOpen} onOpenChange={setIsNotificationsOpen} />
      <ThemeDialog
        isOpen={isThemeOpen}
        onOpenChange={setIsThemeOpen}
        currentTheme={currentTheme.id}
        onSelectTheme={(theme: Theme) => applyTheme(theme, session)}
      />
      <LanguageDialog
        isOpen={isLangOpen}
        onOpenChange={setIsLangOpen}
        currentLanguage="english"
        onSelectLanguage={(lang: string) => {
          window.dispatchEvent(new CustomEvent('language-changed', { detail: lang }));
          setIsLangOpen(false);
        }}
      />
    </>
  );
}
