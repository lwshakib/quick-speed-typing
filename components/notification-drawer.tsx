'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Bell, Info, Trophy, Star, Clock, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Notification {
    id: string;
    type: 'info' | 'success' | 'alert' | 'rank';
    title: string;
    message: string;
    time: string;
    read: boolean;
}

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

export function NotificationDrawer({ 
    isOpen, 
    onOpenChange 
}: { 
    isOpen: boolean, 
    onOpenChange: (open: boolean) => void 
}) {
    const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent 
                side="right" 
                className="w-full sm:max-w-md bg-background border-l border-secondary/10 p-0 flex flex-col pt-12"
            >
                <SheetHeader className="px-6 py-4 border-b border-secondary/10 flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Bell size={18} />
                        </div>
                        <SheetTitle className="text-xl font-bold lowercase">notifications</SheetTitle>
                        {unreadCount > 0 && (
                            <span className="bg-primary text-background text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                                {unreadCount} new
                            </span>
                        )}
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-none">
                    <div className="flex flex-col gap-3">
                        {NOTIFICATIONS.map((n) => (
                            <div
                                key={n.id}
                                className={cn(
                                    "relative group p-4 rounded-xl border transition-all",
                                    n.read ? "bg-transparent border-secondary/5 opacity-60" : "bg-secondary/5 border-secondary/10 shadow-sm"
                                )}
                            >
                                <div className="flex gap-4">
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
                                
                                {!n.read && (
                                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-1 h-8 bg-primary rounded-full shadow-[0_0_10px_var(--primary)]" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 border-t border-secondary/10 text-center">
                    <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">
                        end of notifications
                    </p>
                </div>
            </SheetContent>
        </Sheet>
    );
}

function NotificationIcon({ type }: { type: Notification['type'] }) {
    switch (type) {
        case 'rank': return <Trophy size={18} />;
        case 'success': return <Star size={18} />;
        case 'info': return <Info size={18} />;
        default: return <Bell size={18} />;
    }
}
