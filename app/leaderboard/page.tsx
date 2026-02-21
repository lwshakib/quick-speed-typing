'use client';

// Import core branding components
import { Logo } from "@/components/logo";
// Import a set of utility icons for data visualization and navigation
import { Trophy, Clock, Calendar, Globe, User, ChevronRight, Hash, Star } from "lucide-react";
// Import Next.js linking for client-side navigation
import Link from "next/link";
// Import animation toolkit for fluid state transitions and entry animations
import { motion, AnimatePresence } from "framer-motion";
// Import React hooks for local state management and lifecycle control
import { useState, useEffect } from "react";
// Import server action to fetch leaderboard data based on time periods
import { getLeaderboard } from "@/lib/actions";
// Import utility for logic-based className merging
import { cn } from "@/lib/utils";
// Import date formatting utility
import { format } from "date-fns";

// Type definition for the supported ranking filter periods
type RankingPeriod = "all" | "daily" | "weekly" | "monthly";

/**
 * LeaderboardPage: A dynamic view that displays the top performing typists.
 * Supports filtering by different timeframes and provides detailed performance metrics for each rank.
 */
export default function LeaderboardPage() {
    // Local state for filter selections and data management
    const [period, setPeriod] = useState<RankingPeriod>("daily");
    const [rankings, setRankings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Re-fetch data whenever the chosen filter period changes
    useEffect(() => {
        fetchRankings();
    }, [period]);

    /**
     * Executes the data retrieval process using the current period filter.
     * Manages loading states to provide visual feedback during the network request.
     */
    const fetchRankings = async () => {
        setLoading(true);
        try {
            const data = await getLeaderboard(period);
            setRankings(data);
        } catch (error) {
            console.error("Failed to fetch leaderboard:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex-1 w-full max-w-[1440px] px-8 py-12 flex flex-col gap-10">
                {/* HEADER: Animated title and period filter toggles */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-8"
                >
                    <div className="flex items-center justify-between flex-wrap gap-6">
                        <div className="flex items-center gap-4 text-primary">
                            <Trophy className="w-8 h-8 md:w-10 md:h-10" />
                            <h1 className="text-2xl md:text-4xl font-bold lowercase tracking-tighter">leaderboard</h1>
                        </div>

                        {/* FILTER BAR: Allows users to switch between all-time and periodic rankings */}
                        <div className="flex items-center bg-secondary/5 p-1 rounded-lg border border-secondary/10 flex-wrap justify-center">
                            <PeriodButton active={period === "all"} onClick={() => setPeriod("all")}>all-time</PeriodButton>
                            <PeriodButton active={period === "daily"} onClick={() => setPeriod("daily")}>daily</PeriodButton>
                            <PeriodButton active={period === "weekly"} onClick={() => setPeriod("weekly")}>weekly</PeriodButton>
                            <PeriodButton active={period === "monthly"} onClick={() => setPeriod("monthly")}>monthly</PeriodButton>
                        </div>
                    </div>
                </motion.div>

                <div className="flex flex-col gap-4">
                    {/* INFO BAR: Shows meta context and manual refresh option */}
                    <div className="flex items-center justify-between px-4 md:px-6 py-2">
                        <div className="flex items-center gap-2 opacity-40 text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                            <span className="text-primary"><Hash size={12} /></span>
                            top 50 rankings
                        </div>
                        <button 
                            onClick={fetchRankings}
                            className="p-2 hover:bg-secondary/5 rounded-md transition-all text-secondary hover:text-primary"
                            title="Refresh Rankings"
                        >
                            <Clock size={16} />
                        </button>
                    </div>

                    {/* TABLE HEADER: Defines the columns for the leaderboard data */}
                    <div className="grid grid-cols-[40px_1fr_60px_60px] md:grid-cols-[60px_1fr_100px_100px_100px_100px_150px] px-4 md:px-6 py-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-40 border-b border-secondary/5">
                        <span>rank</span>
                        <span>user</span>
                        <span>wpm</span>
                        <span className="hidden md:block">accuracy</span>
                        <span className="hidden md:block">raw</span>
                        <span className="hidden md:block">consistency</span>
                        <span className="text-right">achieved</span>
                    </div>

                    {/* CONTENT AREA: Multi-state container for loading, empty, and populated results */}
                    <div className="flex flex-col gap-1 min-h-[400px] mt-2">
                        <AnimatePresence mode="wait">
                            {/* State: Data is being fetched */}
                            {loading ? (
                                <motion.div 
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center flex-1 py-32 gap-4"
                                >
                                    <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                    <span className="text-xs font-bold opacity-40 animate-pulse">fetching best scores...</span>
                                </motion.div>
                            ) : rankings.length > 0 ? (
                                /* State: Data has been successfully retrieved */
                                <motion.div 
                                    key="list"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col gap-1"
                                >
                                    {rankings.map((rank, index) => (
                                        <RankingRow key={rank.id} rank={index + 1} data={rank} />
                                    ))}
                                </motion.div>
                            ) : (
                                /* State: No records found for the selected period */
                                <motion.div 
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center py-20 opacity-30 text-sm italic gap-4"
                                >
                                    <div className="w-16 h-16 bg-secondary/5 rounded-full flex items-center justify-center">
                                        <Globe size={32} />
                                    </div>
                                    <div className="flex flex-col items-center gap-1 text-center">
                                        <p className="font-bold">no data for this period</p>
                                        <p className="text-xs">be the first to set a score!</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                </div>
            </div>
        </main>
    );
}

/**
 * PeriodButton: A themed toggle button used in the leaderboard filter bar.
 */
function PeriodButton({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) {
    return (
        <button 
            onClick={onClick}
            className={cn(
                "px-2 md:px-4 py-1.5 rounded-md text-[10px] md:text-xs font-bold transition-all",
                active ? "bg-primary text-background" : "text-secondary hover:text-foreground hover:bg-white/5"
            )}
        >
            {children}
        </button>
    );
}

/**
 * RankingRow: Displays a single user's performance record with specialized styling for the Top 3 podium.
 */
function RankingRow({ rank, data }: { rank: number, data: any }) {
    // Visual importance for the highest achievers
    const isTop3 = rank <= 3;

    return (
        <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: rank * 0.02 }} // Staggered entry animation for the list
            className={cn(
                "grid grid-cols-[40px_1fr_60px_60px] md:grid-cols-[60px_1fr_100px_100px_100px_100px_150px] items-center px-4 md:px-6 py-4 rounded-xl transition-all border group",
                isTop3 ? "bg-primary/5 border-primary/20" : "bg-secondary/5 border-secondary/10 hover:border-secondary/20"
            )}
        >
            {/* Rank Indicator: Highlights the number 1 spot with a star */}
            <div className="flex items-center gap-2">
                <span className={cn(
                    "font-black text-xs md:text-sm",
                    rank === 1 ? "text-primary" : rank === 2 ? "text-foreground opacity-80" : rank === 3 ? "text-foreground opacity-60" : "opacity-30"
                )}>
                    {rank === 1 ? <Star size={14} fill="currentColor" /> : rank}
                </span>
            </div>

            {/* User Identity: Displays avatar and name */}
            <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-secondary/20 overflow-hidden border border-secondary/10 shrink-0">
                    {data.user.image ? (
                        <img src={data.user.image} alt={data.user.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                            <User size={12} />
                        </div>
                    )}
                </div>
                <span className="font-bold text-foreground text-xs md:text-sm group-hover:text-primary transition-colors truncate">{data.user.name}</span>
            </div>

            {/* Performance Stats: WPM, Accuracy, and Consistency */}
            <div className="text-base md:text-xl font-black text-primary">{data.wpm}</div>
            
            <div className="hidden md:block text-sm font-bold opacity-60">{data.accuracy}%</div>
            <div className="hidden md:block text-sm font-bold opacity-40">{data.rawWpm || data.wpm}</div>
            <div className="hidden md:block text-sm font-bold opacity-40">{data.consistency || '--'}%</div>
            
            {/* Achievement Timestamp */}
            <div className="text-[8px] md:text-[10px] font-bold opacity-30 text-right uppercase tracking-tighter">
                {format(new Date(data.createdAt), 'dd MMM yyyy')}
            </div>
        </motion.div>
    );
}
