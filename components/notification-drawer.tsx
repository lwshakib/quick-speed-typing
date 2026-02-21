'use client';

// Import sheet primitive for the drawer UI
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
// Import descriptive icon set
import { Bell, Info, Trophy, Star, Clock, FileText } from "lucide-react";
// Import animation toolkit
import { motion } from "framer-motion";
// Import utility for conditional class merging
import { cn } from "@/lib/utils";

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
        message: 'Master the art of speed typing with our beautiful, minimalist interface. Start a test to see your potential!',
        time: 'just now',
        read: false
    },
    {
        id: '2',
        type: 'info',
        title: 'Custom Themes are Live',
        message: 'You can now create your own color palettes in the settings page. Make Quick Type truly yours!',
        time: '2 hours ago',
        read: false
    },
    {
        id: '3',
        type: 'info',
        title: 'New Leaderboard System',
        message: 'Our new daily-reset leaderboard is active. Can you reach the #1 spot today?',
        time: '5 hours ago',
        read: false
    },
    {
        id: '4',
        type: 'success',
        title: 'Minimalist by Design',
        message: 'Quick Type is built for focus. No ads, no distractions, just you and the keys.',
        time: '1 day ago',
        read: true
    }
];

/**
 * NotificationDrawer: A slide-out panel that displays a list of system notifications and announcements.
 */
export function NotificationDrawer({ 
    isOpen, 
    onOpenChange 
}: { 
    isOpen: boolean, 
    onOpenChange: (open: boolean) => void 
}) {
    // Calculate the number of items that hasn't been engaged with yet
    const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            {/* Main Drawer Canvas: Positioned to the right, matching the premium SaaS layout */}
            <SheetContent 
                side="right" 
                className="w-full sm:max-w-md bg-background border-l border-secondary/10 p-0 flex flex-col pt-12"
            >
                {/* Header: Contains the drawer title and unread badge */}
                <SheetHeader className="px-6 py-4 border-b border-secondary/10 flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Bell size={18} />
                        </div>
                        <SheetTitle className="text-xl font-bold lowercase">notifications</SheetTitle>
                        {/* Unread Badge: Rendered only if there's at least one unread message */}
                        {unreadCount > 0 && (
                            <span className="bg-primary text-background text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                                {unreadCount} new
                            </span>
                        )}
                    </div>
                </SheetHeader>

                {/* Body: Scrollable list of notification cards */}
                <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-none">
                    <div className="flex flex-col gap-3">
                        {NOTIFICATIONS.map((n) => (
                            <div
                                key={n.id}
                                className={cn(
                                    "relative group p-4 rounded-xl border transition-all",
                                    // Visual distinction between read and unread items
                                    n.read ? "bg-transparent border-secondary/5 opacity-60" : "bg-secondary/5 border-secondary/10 shadow-sm"
                                )}
                            >
                                <div className="flex gap-4">
                                    {/* Icon Container: The color varies based on notification type */}
                                    <div className={cn(
                                        "shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                                        n.type === 'rank' ? "bg-primary/20 text-primary" : "bg-secondary/20 text-foreground"
                                    )}>
                                        <NotificationIcon type={n.type} />
                                    </div>
                                    <div className="flex-1 flex flex-col gap-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <h4 className="font-bold text-sm text-foreground truncate">{n.title}</h4>
                                            <span className="text-[10px] opacity-40 font-bold uppercase whitespace-nowrap">{n.time}</span>
                                        </div>
                                        <p className="text-xs opacity-60 leading-relaxed break-words">{n.message}</p>
                                    </div>
                                </div>
                                
                                {/* New Message Indicator: A vertical stripe on the left edge for unread items */}
                                {!n.read && (
                                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-1 h-8 bg-primary rounded-full shadow-[0_0_10px_var(--primary)]" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer: Simple end-of-list indicator */}
                <div className="p-6 border-t border-secondary/10 text-center">
                    <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">
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
        case 'rank': return <Trophy size={18} />;
        case 'success': return <Star size={18} />;
        case 'info': return <Info size={18} />;
        default: return <Bell size={18} />;
    }
}
