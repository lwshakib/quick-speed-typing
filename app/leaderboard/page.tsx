'use client';

// Import a set of utility icons for data visualization and navigation
import { Trophy, Clock, Globe, User, Hash, Star } from 'lucide-react';
// Import animation toolkit for fluid state transitions and entry animations
import { motion, AnimatePresence } from 'framer-motion';
// Import React hooks for local state management and lifecycle control
import { useState, useEffect, useCallback } from 'react';
// Import server action to fetch leaderboard data based on time periods
import { getLeaderboard } from '@/lib/actions';
// Import utility for logic-based className merging
import { cn } from '@/lib/utils';
// Import date formatting utility
import { format } from 'date-fns';
// Import optimized image component
import Image from 'next/image';

// Type definition for the supported ranking filter periods
type RankingPeriod = 'all' | 'daily' | 'weekly' | 'monthly';

/**
 * LeaderboardPage: A dynamic view that displays the top performing typists.
 * Supports filtering by different timeframes and provides detailed performance metrics for each rank.
 */
export default function LeaderboardPage() {
  // Local state for filter selections and data management
  const [period, setPeriod] = useState<RankingPeriod>('daily');
  const [rankings, setRankings] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Executes the data retrieval process using the current period filter.
   * Manages loading states to provide visual feedback during the network request.
   */
  const fetchRankings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getLeaderboard(period);
      setRankings(data);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }, [period]);

  // Re-fetch data whenever the chosen filter period changes
  useEffect(() => {
    fetchRankings();
  }, [fetchRankings]);

  return (
    <main className="flex w-full max-w-[1440px] flex-1 flex-col gap-10 px-8 py-12">
      {/* HEADER: Animated title and period filter toggles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="text-primary flex items-center gap-4">
            <Trophy className="h-8 w-8 md:h-10 md:w-10" />
            <h1 className="text-2xl font-bold tracking-tighter lowercase md:text-4xl">
              leaderboard
            </h1>
          </div>

          {/* FILTER BAR: Allows users to switch between all-time and periodic rankings */}
          <div className="bg-secondary/5 border-secondary/10 flex flex-wrap items-center justify-center rounded-lg border p-1">
            <PeriodButton active={period === 'all'} onClick={() => setPeriod('all')}>
              all-time
            </PeriodButton>
            <PeriodButton active={period === 'daily'} onClick={() => setPeriod('daily')}>
              daily
            </PeriodButton>
            <PeriodButton active={period === 'weekly'} onClick={() => setPeriod('weekly')}>
              weekly
            </PeriodButton>
            <PeriodButton active={period === 'monthly'} onClick={() => setPeriod('monthly')}>
              monthly
            </PeriodButton>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col gap-4">
        {/* INFO BAR: Shows meta context and manual refresh option */}
        <div className="flex items-center justify-between px-4 py-2 md:px-6">
          <div className="flex items-center gap-2 text-[9px] font-black tracking-widest uppercase opacity-40 md:text-[10px]">
            <span className="text-primary">
              <Hash size={12} />
            </span>
            top 50 rankings
          </div>
          <button
            onClick={fetchRankings}
            className="hover:bg-secondary/5 text-secondary hover:text-primary rounded-md p-2 transition-all"
            title="Refresh Rankings"
          >
            <Clock size={16} />
          </button>
        </div>

        {/* TABLE HEADER: Defines the columns for the leaderboard data */}
        <div className="border-secondary/5 grid grid-cols-[40px_1fr_60px_60px] border-b px-4 py-2 text-[9px] font-black tracking-widest uppercase opacity-40 md:grid-cols-[60px_1fr_100px_100px_100px_100px_150px] md:px-6 md:text-[10px]">
          <span>rank</span>
          <span>user</span>
          <span>wpm</span>
          <span className="hidden md:block">accuracy</span>
          <span className="hidden md:block">raw</span>
          <span className="hidden md:block">consistency</span>
          <span className="text-right">achieved</span>
        </div>

        {/* CONTENT AREA: Multi-state container for loading, empty, and populated results */}
        <div className="mt-2 flex min-h-[400px] flex-col gap-1">
          <AnimatePresence mode="wait">
            {/* State: Data is being fetched */}
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-1 flex-col items-center justify-center gap-4 py-32"
              >
                <div className="border-primary h-10 w-10 animate-spin rounded-full border-2 border-t-transparent" />
                <span className="animate-pulse text-xs font-bold opacity-40">
                  fetching best scores...
                </span>
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
                  <RankingRow key={rank.id as string} rank={index + 1} data={rank} />
                ))}
              </motion.div>
            ) : (
              /* State: No records found for the selected period */
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center gap-4 py-20 text-sm italic opacity-30"
              >
                <div className="bg-secondary/5 flex h-16 w-16 items-center justify-center rounded-full">
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
function PeriodButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-md px-2 py-1.5 text-[10px] font-bold transition-all md:px-4 md:text-xs',
        active
          ? 'bg-primary text-background'
          : 'text-secondary hover:text-foreground hover:bg-white/5',
      )}
    >
      {children}
    </button>
  );
}

/**
 * RankingRow: Displays a single user's performance record with specialized styling for the Top 3 podium.
 */
function RankingRow({ rank, data }: { rank: number; data: Record<string, unknown> }) {
  // Visual importance for the highest achievers
  const isTop3 = rank <= 3;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.02 }} // Staggered entry animation for the list
      className={cn(
        'group grid grid-cols-[40px_1fr_60px_60px] items-center rounded-xl border px-4 py-4 transition-all md:grid-cols-[60px_1fr_100px_100px_100px_100px_150px] md:px-6',
        isTop3
          ? 'bg-primary/5 border-primary/20'
          : 'bg-secondary/5 border-secondary/10 hover:border-secondary/20',
      )}
    >
      {/* Rank Indicator: Highlights the number 1 spot with a star */}
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'text-xs font-black md:text-sm',
            rank === 1
              ? 'text-primary'
              : rank === 2
                ? 'text-foreground opacity-80'
                : rank === 3
                  ? 'text-foreground opacity-60'
                  : 'opacity-30',
          )}
        >
          {rank === 1 ? <Star size={14} fill="currentColor" /> : rank}
        </span>
      </div>

      {/* User Identity: Displays avatar and name */}
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="bg-secondary/20 border-secondary/10 h-6 w-6 shrink-0 overflow-hidden rounded-full border md:h-8 md:w-8">
          {(data.user as Record<string, string>).image ? (
            <Image
              src={(data.user as Record<string, string>).image}
              alt={(data.user as Record<string, string>).name}
              width={32}
              height={32}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="bg-primary/10 text-primary flex h-full w-full items-center justify-center">
              <User size={12} />
            </div>
          )}
        </div>
        <span className="text-foreground group-hover:text-primary truncate text-xs font-bold transition-colors md:text-sm">
          {(data.user as Record<string, string>).name}
        </span>
      </div>

      {/* Performance Stats: WPM, Accuracy, and Consistency */}
      <div className="text-primary text-base font-black md:text-xl">{data.wpm as number}</div>

      <div className="hidden text-sm font-bold opacity-60 md:block">{data.accuracy as number}%</div>
      <div className="hidden text-sm font-bold opacity-40 md:block">
        {(data.rawWpm as number) || (data.wpm as number)}
      </div>
      <div className="hidden text-sm font-bold opacity-40 md:block">
        {(data.consistency as number) || '--'}%
      </div>

      {/* Achievement Timestamp */}
      <div className="text-right text-[8px] font-bold tracking-tighter uppercase opacity-30 md:text-[10px]">
        {format(new Date(data.createdAt as string), 'dd MMM yyyy')}
      </div>
    </motion.div>
  );
}
