'use client';

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Keyboard, 
    Trophy, 
    Info, 
    Settings, 
    Bell, 
    User as UserIcon
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";
import { useSession } from "@/lib/auth-client";
import { useUiStore } from "@/hooks/use-ui-store";
import { useEffect, useRef } from "react";
import { THEMES } from "@/lib/themes";
import { getUserTheme } from "@/lib/actions";

export function Header() {
    const pathname = usePathname();
    const { data: session } = useSession();
    
    const { 
        showUi, 
        isFocusMode, 
        setIsNotificationsOpen, 
        currentTheme,
        applyTheme
    } = useUiStore();

    const hasSyncedTheme = useRef(false);

    // Initial theme sync
    useEffect(() => {
        const savedThemeId = localStorage.getItem('typing-theme');
        if (savedThemeId) {
            if (savedThemeId === 'custom') {
                const savedCustom = localStorage.getItem('custom-theme-colors');
                if (savedCustom) {
                    applyTheme({
                        id: 'custom',
                        name: 'custom',
                        type: 'dark',
                        colors: JSON.parse(savedCustom)
                    }, session);
                }
            } else {
                const theme = THEMES.find(t => t.id === savedThemeId);
                if (theme) {
                    applyTheme(theme, session);
                }
            }
        }
    }, [session, applyTheme]);

    // Sync theme with database once on session load
    useEffect(() => {
        if (session && !hasSyncedTheme.current) {
            getUserTheme().then(dbTheme => {
                if (dbTheme) {
                    if (dbTheme === 'custom') {
                        const savedCustom = localStorage.getItem('custom-theme-colors');
                        if (savedCustom) {
                            applyTheme({
                                id: 'custom',
                                name: 'custom',
                                type: 'dark',
                                colors: JSON.parse(savedCustom)
                            }, null); // don't re-save to DB if already matched
                        }
                    } else if (currentTheme.id !== dbTheme) {
                        const theme = THEMES.find(t => t.id === dbTheme);
                        if (theme) {
                            applyTheme(theme, null);
                        }
                    }
                    hasSyncedTheme.current = true;
                }
            });
        } else if (!session) {
            hasSyncedTheme.current = false;
        }
    }, [session, currentTheme.id, applyTheme]);

    // Do not show navigation links on auth pages
    const isAuthPage = pathname?.startsWith('/sign-in') || 
                       pathname?.startsWith('/sign-up') || 
                       pathname?.startsWith('/forgot-password') || 
                       pathname?.startsWith('/verify-email') || 
                       pathname?.startsWith('/reset-password');

    return (
        <header className="fixed top-0 left-0 right-0 w-full flex justify-center z-50 bg-background/80 backdrop-blur-md transition-all duration-300">
            <div className="w-full max-w-[1440px] px-8 py-6 flex justify-between items-center">
            <div className="flex items-center gap-6">
                <Link 
                    href="/" 
                    className={cn(
                        "transition-all duration-500", 
                        isFocusMode ? "opacity-100" : "hover:scale-105 active:scale-95"
                    )}
                >
                    <Logo 
                        iconSize={32} 
                        textSize="1.5rem" 
                        className="text-foreground" 
                        hideText={false}
                    />
                </Link>

                <motion.nav 
                    animate={{ 
                        opacity: showUi ? 1 : 0, 
                        x: showUi ? 0 : -10,
                        pointerEvents: showUi ? 'auto' : 'none'
                    }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-4 ml-4"
                >
                    <Link href="/" className="hover:text-foreground transition-colors cursor-pointer group relative" title="Typing Test">
                        <Keyboard size={18} />
                        {pathname === '/' && (
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-full h-[2px] bg-primary transition-all duration-300" />
                        )}
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-300" />
                    </Link>
                    <Link href="/leaderboard" className="hover:text-foreground transition-colors cursor-pointer group relative" title="Leaderboards">
                        <Trophy size={16} />
                        {pathname === '/leaderboard' && (
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-full h-[2px] bg-primary transition-all duration-300" />
                        )}
                    </Link>
                    <Link href="/about" className="hover:text-foreground transition-colors cursor-pointer group relative" title="About">
                        <Info size={16} />
                        {pathname === '/about' && (
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-full h-[2px] bg-primary transition-all duration-300" />
                        )}
                    </Link>
                    <Link href="/settings" className="hover:text-foreground transition-colors cursor-pointer group relative" title="Settings">
                        <Settings size={16} />
                        {pathname === '/settings' && (
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-full h-[2px] bg-primary transition-all duration-300" />
                        )}
                    </Link>
                </motion.nav>
            </div>

            <motion.div 
                animate={{ 
                    opacity: showUi ? 1 : 0, 
                    x: showUi ? 0 : 10,
                    pointerEvents: showUi ? 'auto' : 'none'
                }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-4"
            >
                <button 
                    onClick={() => setIsNotificationsOpen(true)}
                    className="hover:text-foreground transition-colors cursor-pointer hover:scale-110 active:scale-95 duration-200 relative group"
                    title="Notifications"
                >
                    <Bell size={16} />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full border-2 border-background group-hover:animate-ping" />
                </button>
                <ThemeToggle />
                {session ? (
                    <UserMenu />
                ) : (
                    <Link 
                        href="/sign-in"
                        className="hover:text-foreground transition-colors cursor-pointer hover:scale-110 active:scale-95 duration-200"
                        title="Sign In"
                    >
                        <UserIcon size={16} />
                    </Link>
                )}
            </motion.div>
            </div>
        </header>
    );
}
