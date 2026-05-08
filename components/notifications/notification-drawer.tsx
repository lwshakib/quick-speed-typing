'use client';

// Import sheet primitive for the drawer UI
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
// Import descriptive icon set
import { Bell, Info, Trophy, Star } from 'lucide-react';

// Import utility for conditional class merging
import { cn } from '@/lib/utils';

/**
 * Notification Interface: Defines the structure of individual announcement items.
 */
interface Notification {
  id: string;
  type: 'info' | 'success' | 'alert' | 'rank';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

/**
 * NOTIFICATIONS: A static collection of announcement records.
 * Currently hardcoded as per system requirements for persistent announcements.
 */
const NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'info',
    title: 'Welcome to Quick Type!',
    message:
      'Master the art of speed typing with our beautiful, minimalist interface. Start a test to see your potential!',
    time: 'just now',
    read: false,
  },
  {
    id: '2',
    type: 'info',
    title: 'Custom Themes are Live',
    message:
      'You can now create your own color palettes in the settings page. Make Quick Type truly yours!',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '3',
    type: 'info',
    title: 'New Leaderboard System',
    message: 'Our new daily-reset leaderboard is active. Can you reach the #1 spot today?',
    time: '5 hours ago',
    read: false,
  },
  {
    id: '4',
    type: 'success',
    title: 'Minimalist by Design',
    message: 'Quick Type is built for focus. No ads, no distractions, just you and the keys.',
    time: '1 day ago',
    read: true,
  },
];

/**
 * NotificationDrawer: A slide-out panel that displays a list of system notifications and announcements.
 */
export function NotificationDrawer({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  // Calculate the number of items that hasn't been engaged with yet
  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      {/* Main Drawer Canvas: Positioned to the right, matching the premium SaaS layout */}
      <SheetContent
        side="right"
        className="bg-background border-secondary/10 flex w-full flex-col border-l p-0 pt-12 sm:max-w-md"
      >
        {/* Header: Contains the drawer title and unread badge */}
        <SheetHeader className="border-secondary/10 flex flex-row items-center justify-between space-y-0 border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary rounded-lg p-2">
              <Bell size={18} />
            </div>
            <SheetTitle className="text-xl font-bold lowercase">notifications</SheetTitle>
            {/* Unread Badge: Rendered only if there's at least one unread message */}
            {unreadCount > 0 && (
              <span className="bg-primary text-background rounded-full px-2 py-0.5 text-[10px] font-black uppercase">
                {unreadCount} new
              </span>
            )}
          </div>
        </SheetHeader>

        {/* Body: Scrollable list of notification cards */}
        <div className="scrollbar-none flex-1 overflow-y-auto px-4 py-6">
          <div className="flex flex-col gap-3">
            {NOTIFICATIONS.map((n) => (
              <div
                key={n.id}
                className={cn(
                  'group relative rounded-xl border p-4 transition-all',
                  // Visual distinction between read and unread items
                  n.read
                    ? 'border-secondary/5 bg-transparent opacity-60'
                    : 'bg-secondary/5 border-secondary/10 shadow-sm',
                )}
              >
                <div className="flex gap-4">
                  {/* Icon Container: The color varies based on notification type */}
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                      n.type === 'rank'
                        ? 'bg-primary/20 text-primary'
                        : 'bg-secondary/20 text-foreground',
                    )}
                  >
                    <NotificationIcon type={n.type} />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-foreground truncate text-sm font-bold">{n.title}</h4>
                      <span className="text-[10px] font-bold whitespace-nowrap uppercase opacity-40">
                        {n.time}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed break-words opacity-60">{n.message}</p>
                  </div>
                </div>

                {/* New Message Indicator: A vertical stripe on the left edge for unread items */}
                {!n.read && (
                  <div className="bg-primary absolute top-1/2 -left-1 h-8 w-1 -translate-y-1/2 rounded-full shadow-[0_0_10px_var(--primary)]" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer: Simple end-of-list indicator */}
        <div className="border-secondary/10 border-t p-6 text-center">
          <p className="text-[10px] font-bold tracking-widest uppercase opacity-30">
            end of notifications
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/**
 * Helper Sub-component: Returns the appropriate icon for each notification type.
 */
function NotificationIcon({ type }: { type: Notification['type'] }) {
  switch (type) {
    case 'rank':
      return <Trophy size={18} />;
    case 'success':
      return <Star size={18} />;
    case 'info':
      return <Info size={18} />;
    default:
      return <Bell size={18} />;
  }
}
