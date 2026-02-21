'use client';

import { NotificationDrawer } from "@/components/notification-drawer";
import { ThemeDialog } from "@/components/theme-dialog";
import { LanguageDialog } from "@/components/language-dialog";
import { useUiStore } from "@/hooks/use-ui-store";
import { useSession } from "@/lib/auth-client";
import { Theme } from "@/lib/themes";

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
        applyTheme
    } = useUiStore();

    return (
        <>
            <NotificationDrawer 
                isOpen={isNotificationsOpen} 
                onOpenChange={setIsNotificationsOpen} 
            />
            <ThemeDialog 
                isOpen={isThemeOpen} 
                onOpenChange={setIsThemeOpen}
                currentTheme={currentTheme.id}
                onSelectTheme={(theme: Theme) => applyTheme(theme, session)}
            />
            {/* 
                LanguageDialog is only triggered from Home page for now, 
                so we might need to pass the handlers if we want it global.
                But usually it's better to keep it here if it's used by Header 
                (which it's not currently). 
            */}
            <LanguageDialog 
                isOpen={isLangOpen} 
                onOpenChange={setIsLangOpen}
                currentLanguage="english" // This would ideally come from the page or a store
                onSelectLanguage={(lang: string) => {
                    // This needs a global state if we want to change language from anywhere
                    window.dispatchEvent(new CustomEvent('language-changed', { detail: lang }));
                    setIsLangOpen(false);
                }}
            />
        </>
    );
}
