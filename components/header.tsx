'use client';

// Import core Next.js navigation and layout components
import Link from 'next/link';
// Import animation library for handling interface visibility and micro-interactions
import { motion } from 'framer-motion';
// Import icons to represent navigation destinations and actions
import { Keyboard, Trophy, Info, Settings, Bell, User as UserIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
// Import local branding and feature components
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserMenu } from '@/components/user-menu';
// Import authentication and state management hooks
import { useSession } from '@/lib/auth-client';
import { useUiStore } from '@/hooks/use-ui-store';
import { useEffect, useRef } from 'react';
// Import theme definitions and server actions for profile persistence
import { THEMES } from '@/lib/themes';
import { getUserTheme } from '@/lib/actions';

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Access global UI state to handle visibility during typing (focus mode)
  const { showUi, isFocusMode, setIsNotificationsOpen, currentTheme, applyTheme } = useUiStore();

  // Ref to prevent multiple theme sync calls on initial load
  const hasSyncedTheme = useRef(false);

  /**
   * EFFECT: Initial theme synchronization from localStorage.
   * This ensures the user's preferred visual style is applied immediately,
   * even before the session is fully resolved from the server.
   */
  useEffect(() => {
    const savedThemeId = localStorage.getItem('typing-theme');
    if (savedThemeId) {
      if (savedThemeId === 'custom') {
        const savedCustom = localStorage.getItem('custom-theme-colors');
        if (savedCustom) {
          applyTheme(
            {
              id: 'custom',
              name: 'custom',
              type: 'dark',
              colors: JSON.parse(savedCustom),
            },
            session,
          );
        }
      } else {
        const theme = THEMES.find((t) => t.id === savedThemeId);
        if (theme) {
          applyTheme(theme, session);
        }
      }
    }
  }, [session, applyTheme]);

  /**
   * EFFECT: Profile-based theme synchronization.
   * If a user is logged in, fetch their saved theme from the database to ensure
   * a consistent experience across different devices.
   */
  useEffect(() => {
    if (session && !hasSyncedTheme.current) {
      getUserTheme().then((dbTheme) => {
        if (dbTheme) {
          if (dbTheme === 'custom') {
            const savedCustom = localStorage.getItem('custom-theme-colors');
            if (savedCustom) {
              applyTheme(
                {
                  id: 'custom',
                  name: 'custom',
                  type: 'dark',
                  colors: JSON.parse(savedCustom),
                },
                null,
              ); // don't re-save to DB if already matched
            }
          } else if (currentTheme.id !== dbTheme) {
            const theme = THEMES.find((t) => t.id === dbTheme);
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

  return (
    // Fixed header with glassmorphism effect
    <header className="bg-background/80 fixed top-0 right-0 left-0 z-50 flex w-full justify-center backdrop-blur-md transition-all duration-300">
      <div className="flex w-full max-w-[1440px] items-center justify-between px-8 py-6">
        {/* Left side: Branding and Main Navigation */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className={cn(
              'transition-all duration-500',
              isFocusMode ? 'opacity-100' : 'hover:scale-105 active:scale-95',
            )}
          >
            {/* Consistent brand identity through the Logo component */}
            <Logo iconSize={32} textSize="1.5rem" className="text-foreground" hideText={false} />
          </Link>

          {/* Animated Navigation: Hidden during active typing in focus mode */}
          <motion.nav
            animate={{
              opacity: showUi ? 1 : 0,
              x: showUi ? 0 : -10,
              pointerEvents: showUi ? 'auto' : 'none',
            }}
            transition={{ duration: 0.5 }}
            className="ml-4 flex items-center gap-4"
          >
            {/* Navigation Links with active state indicators */}
            <Link
              href="/"
              className="hover:text-foreground group relative cursor-pointer transition-colors"
              title="Typing Test"
            >
              <Keyboard size={18} />
              {pathname === '/' && (
                <span className="bg-primary absolute -bottom-1 left-1/2 h-[2px] w-full -translate-x-1/2 transition-all duration-300" />
              )}
              <span className="bg-primary absolute -bottom-1 left-1/2 h-[2px] w-0 -translate-x-1/2 transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href="/leaderboard"
              className="hover:text-foreground group relative cursor-pointer transition-colors"
              title="Leaderboards"
            >
              <Trophy size={16} />
              {pathname === '/leaderboard' && (
                <span className="bg-primary absolute -bottom-1 left-1/2 h-[2px] w-full -translate-x-1/2 transition-all duration-300" />
              )}
            </Link>
            <Link
              href="/about"
              className="hover:text-foreground group relative cursor-pointer transition-colors"
              title="About"
            >
              <Info size={16} />
              {pathname === '/about' && (
                <span className="bg-primary absolute -bottom-1 left-1/2 h-[2px] w-full -translate-x-1/2 transition-all duration-300" />
              )}
            </Link>
            <Link
              href="/settings"
              className="hover:text-foreground group relative cursor-pointer transition-colors"
              title="Settings"
            >
              <Settings size={16} />
              {pathname === '/settings' && (
                <span className="bg-primary absolute -bottom-1 left-1/2 h-[2px] w-full -translate-x-1/2 transition-all duration-300" />
              )}
            </Link>
          </motion.nav>
        </div>

        {/* Right side: Global Actions and User Identity */}
        <motion.div
          animate={{
            opacity: showUi ? 1 : 0,
            x: showUi ? 0 : 10,
            pointerEvents: showUi ? 'auto' : 'none',
          }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4"
        >
          {/* Notification trigger button with active indicator */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="hover:text-foreground group relative cursor-pointer transition-colors duration-200 hover:scale-110 active:scale-95"
            title="Notifications"
          >
            <Bell size={16} />
            <span className="bg-primary border-background absolute top-0 right-0 h-2 w-2 rounded-full border-2 group-hover:animate-ping" />
          </button>
          {/* Visual theme switcher */}
          <ThemeToggle />
          {/* User menu for authenticated users, otherwise a login link */}
          {session ? (
            <UserMenu />
          ) : (
            <Link
              href="/sign-in"
              className="hover:text-foreground cursor-pointer transition-colors duration-200 hover:scale-110 active:scale-95"
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
