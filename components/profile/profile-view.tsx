'use client';

// Import core React for component logic
import * as React from 'react';
// Import powerful charting library for data visualization
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
// Import UI components from the specialized chart design system
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
// Import selection UI components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
// Import an extensive set of icons for data categorization and visual storytelling
import {
  TrendingUp,
  Zap,
  Target,
  History as HistoryIcon,
  Crown,
  Clock,
  FileDown,
  Activity,
  BarChart3,
  Shield,
} from 'lucide-react';
// Import basic UI primitives
import { Button } from '@/components/ui/button';
// Import date manipulation and formatting utilities
import { format, subDays, isAfter, parseISO } from 'date-fns';
// Import animation library for fluid entrance and data transitions
import { motion } from 'framer-motion';

// Local sub-components for specialized views
import { ContributionActivity } from '@/components/profile/contribution-activity';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { cn } from '@/lib/utils';

interface ProfileStats {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    createdAt: string | Date;
  };
  totalTests: number;
  completedTests: number;
  totalTimeSeconds: number;
  highestWpm: number;
  highestRawWpm: number;
  highestAccuracy: number;
  highestConsistency: number;
  avgWpm: number;
  avgRawWpm: number;
  avgAccuracy: number;
  avgConsistency: number;
  avgWpm10: number; // Average of last 10 tests
  avgRawWpm10: number;
  avgAccuracy10: number;
  avgConsistency10: number;
  timeRecords: Record<string, { wpm: number; accuracy: number }>;
  wordRecords: Record<string, { wpm: number; accuracy: number }>;
  chartData: {
    date: string;
    wpm: number;
    rawWpm: number;
    accuracy: number;
    consistency: number;
    tests: number;
    time: number;
  }[]; // History formatted for charting
  history: {
    id: string;
    wpm: number;
    rawWpm: number | null;
    accuracy: number;
    errors: number;
    duration: number;
    consistency: number | null;
    mode: string | null;
    amount: number | null;
    createdAt: string | Date;
  }[]; // Raw historical records
}

interface ProfileViewProps {
  contributionData: {
    calendar: { contributionDays: { date: string; contributionCount: number }[] }[];
    totalContributions: number;
  };
  profileStats: ProfileStats;
}

// Global configuration for the progress chart, defining colors and labels using theme variables
const chartConfig = {
  wpm: {
    label: 'wpm',
    color: 'var(--main-color)',
  },
  rawWpm: {
    label: 'raw wpm',
    color: 'var(--sub-color)',
  },
  accuracy: {
    label: 'accuracy',
    color: '#10b981',
  },
  consistency: {
    label: 'consistency',
    color: '#8b5cf6',
  },
  avgWpm: {
    label: 'avg wpm',
    color: 'var(--main-color)',
  },
  tests: {
    label: 'tests',
    color: 'var(--text-color)',
  },
  time: {
    label: 'time',
    color: 'var(--sub-color)',
  },
} satisfies ChartConfig;

export function ProfileView({ contributionData, profileStats }: ProfileViewProps) {
  // State for chart filtering and metric selection
  const [timeRange, setTimeRange] = React.useState('90d');
  const [activeMetric, setActiveMetric] = React.useState<keyof typeof chartConfig>('wpm');
  const { user, totalTests, completedTests, totalTimeSeconds } = profileStats;

  /**
   * Filter and format data for the progress area chart based on the selected time range.
   */
  const filteredChartData = profileStats.chartData
    .filter((item) => {
      const date = parseISO(item.date);
      const now = new Date();
      let daysToSubtract = 90;
      if (timeRange === '30d') daysToSubtract = 30;
      else if (timeRange === '7d') daysToSubtract = 7;
      const startDate = subDays(now, daysToSubtract);
      return isAfter(date, startDate) || timeRange === 'all';
    })
    .map((item) => ({
      ...item,
      formattedDate: format(parseISO(item.date), 'MMM d'),
    }));

  // Utility to convert raw seconds into a formatted HH:MM:SS string
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Logic to generate and trigger a download of the user's typing history in CSV format.
   * Useful for external data analysis or personal backups.
   */
  const exportCSV = () => {
    const headers = [
      'WPM',
      'Raw WPM',
      'Accuracy',
      'Errors',
      'Duration (s)',
      'Consistency',
      'Mode',
      'Amount',
      'Date',
    ];
    const rows = profileStats.history.map((h) => [
      h.wpm,
      h.rawWpm || h.wpm,
      h.accuracy,
      h.errors,
      h.duration,
      h.consistency || 0,
      h.mode,
      h.amount,
      format(new Date(h.createdAt), 'yyyy-MM-dd HH:mm:ss'),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      headers.join(',') +
      '\n' +
      rows.map((e) => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `profile_${user.name}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metric definitions for the chart's filter bar
  const metrics: { id: keyof typeof chartConfig; label: string; icon: React.ElementType }[] = [
    { id: 'wpm', label: 'wpm', icon: Zap },
    { id: 'rawWpm', label: 'raw', icon: BarChart3 },
    { id: 'accuracy', label: 'accuracy', icon: Target },
    { id: 'consistency', label: 'consistency', icon: Activity },
    { id: 'avgWpm', label: 'avg wpm', icon: TrendingUp },
    { id: 'tests', label: 'tests', icon: Shield },
    { id: 'time', label: 'time', icon: Clock },
  ];

  return (
    // Main profile content with spaced vertical flow
    <motion.main
      className="mx-auto w-full max-w-5xl flex-1 space-y-20 px-6 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* SECTION 1: Profile Identity and High-Level Stats */}
      <section className="flex flex-col items-center justify-between gap-8 border-b border-white/5 pb-12 md:flex-row">
        <div className="flex items-center gap-6">
          {/* Large user avatar with fallback branding */}
          <Avatar className="h-24 w-24 rounded-2xl border border-white/10">
            <AvatarImage src={user.image || ''} />
            <AvatarFallback className="text-primary bg-white/5 text-3xl font-black">
              {user.name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h1
              className="text-4xl leading-none font-black tracking-tighter lowercase"
              style={{ color: 'var(--text-color)' }}
            >
              {user.name}
            </h1>
            <p className="text-[10px] font-bold tracking-widest uppercase opacity-40">
              member since {format(new Date(user.createdAt), 'MMM yyyy')}
            </p>
            {/* Gamification: Level and XP Progress (Current placeholder implementation) */}
            <div className="flex w-full min-w-[200px] flex-col gap-1.5 pt-2">
              <div className="flex justify-between text-[10px] font-bold tracking-tighter uppercase opacity-30">
                <span>level 1</span>
                <span>20% to next</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '20%' }}
                  className="bg-primary h-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Aggregate lifetime totals */}
        <div className="grid grid-cols-3 gap-12 text-center md:text-left">
          <div className="space-y-1">
            <p className="text-[10px] font-bold tracking-widest uppercase opacity-30">
              tests started
            </p>
            <p className="text-3xl font-black lowercase tabular-nums">{totalTests}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold tracking-widest uppercase opacity-30">completed</p>
            <p className="text-3xl font-black lowercase tabular-nums">{completedTests}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold tracking-widest uppercase opacity-30">total time</p>
            <p className="font-mono text-3xl font-black lowercase tabular-nums">
              {formatDuration(totalTimeSeconds).split(':').slice(0, 2).join(':')}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: Personal Bests across different modes */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 border-b border-white/5 pb-2">
          <Crown size={18} className="opacity-40" />
          <h2 className="text-xl font-bold lowercase">personal bests</h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Best WPM for specific Time durations */}
          <div className="grid grid-cols-4 gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-6">
            {['15', '30', '60', '120'].map((t) => (
              <div key={t} className="space-y-2 text-center">
                <p className="text-[10px] font-bold lowercase opacity-30">{t}s</p>
                <div className="space-y-0.5">
                  <p
                    className="text-2xl font-black tabular-nums"
                    style={{
                      color:
                        (profileStats.timeRecords[t]?.wpm ?? 0) > 0
                          ? 'var(--text-color)'
                          : 'rgba(255,255,255,0.05)',
                    }}
                  >
                    {profileStats.timeRecords[t]?.wpm.toFixed(0) || '-'}
                  </p>
                  <p className="text-[10px] font-bold tabular-nums opacity-20">
                    {profileStats.timeRecords[t]?.accuracy
                      ? `${profileStats.timeRecords[t].accuracy}%`
                      : '-'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Best WPM for specific Word counts */}
          <div className="grid grid-cols-4 gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-6">
            {['10', '25', '50', '100'].map((w) => (
              <div key={w} className="space-y-2 text-center">
                <p className="text-[10px] font-bold lowercase opacity-30">{w}w</p>
                <div className="space-y-0.5">
                  <p
                    className="text-2xl font-black tabular-nums"
                    style={{
                      color:
                        (profileStats.wordRecords[w]?.wpm ?? 0) > 0
                          ? 'var(--text-color)'
                          : 'rgba(255,255,255,0.05)',
                    }}
                  >
                    {profileStats.wordRecords[w]?.wpm.toFixed(0) || '-'}
                  </p>
                  <p className="text-[10px] font-bold tabular-nums opacity-20">
                    {profileStats.wordRecords[w]?.accuracy
                      ? `${profileStats.wordRecords[w].accuracy}%`
                      : '-'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: Progress Visualizations (Area Chart) */}
      <section className="space-y-8">
        <div className="flex flex-col items-center justify-between gap-6 border-b border-white/5 pb-2 md:flex-row">
          <div className="flex items-center gap-3">
            <TrendingUp size={18} className="opacity-40" />
            <h2 className="text-xl font-bold lowercase">progress tracking</h2>
          </div>

          {/* Controls for current chart view */}
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {metrics.slice(0, 4).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveMetric(m.id)}
                  className={cn(
                    'rounded-md px-3 py-1 text-[10px] font-bold tracking-wider uppercase transition-all',
                    activeMetric === m.id
                      ? 'bg-primary text-black'
                      : 'bg-white/5 text-white/30 hover:bg-white/10',
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Time period filter */}
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="h-7 w-[100px] rounded-md border-none bg-white/5 px-3 text-[10px] font-bold lowercase">
                <SelectValue placeholder="range" />
              </SelectTrigger>
              <SelectContent className="bg-background border-white/10">
                <SelectItem value="all" className="text-xs lowercase">
                  all time
                </SelectItem>
                <SelectItem value="90d" className="text-xs lowercase">
                  3 months
                </SelectItem>
                <SelectItem value="30d" className="text-xs lowercase">
                  30 days
                </SelectItem>
                <SelectItem value="7d" className="text-xs lowercase">
                  7 days
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main interactive chart area */}
        <div className="h-[300px] w-full pt-4">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <AreaChart data={filteredChartData}>
              {/* Gradient definition for futuristic area fills */}
              <defs>
                <linearGradient id="fillMetric" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartConfig[activeMetric].color} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={chartConfig[activeMetric].color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                stroke="var(--border)"
                strokeDasharray="3 3"
                opacity={0.3}
              />
              <XAxis
                dataKey="formattedDate"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                stroke="var(--sub-color)"
                opacity={0.3}
                fontSize={10}
              />
              <YAxis hide />
              <ChartTooltip
                cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
                content={
                  <ChartTooltipContent indicator="dot" className="bg-background rounded-lg border-white/10 shadow-xl" />
                }
              />
              <Area
                dataKey={activeMetric}
                type="monotone"
                fill="url(#fillMetric)"
                stroke={chartConfig[activeMetric].color}
                strokeWidth={2}
                animationDuration={800}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </section>

      {/* SECTION 4: Granular Lifetime and Recent Averages */}
      <section className="space-y-12">
        <div className="flex items-center gap-3 border-b border-white/5 pb-2">
          <Activity size={18} className="opacity-40" />
          <h2 className="text-xl font-bold lowercase">detailed statistics</h2>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4">
          {/* Split statistics across lifetime and last-10-test windows to show momentum */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold tracking-widest uppercase opacity-30">all-time avg</p>
            <p className="text-3xl font-black lowercase">
              {profileStats.avgWpm.toFixed(1)} <span className="text-xs opacity-20">wpm</span>
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold tracking-widest uppercase opacity-30">all-time raw</p>
            <p className="text-3xl font-black lowercase">
              {profileStats.avgRawWpm.toFixed(1)} <span className="text-xs opacity-20">wpm</span>
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold tracking-widest uppercase opacity-30">avg accuracy</p>
            <p className="text-3xl font-black lowercase">{profileStats.avgAccuracy.toFixed(1)}%</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold tracking-widest uppercase opacity-30">
              avg consistency
            </p>
            <p className="text-3xl font-black lowercase">{profileStats.avgConsistency.toFixed(1)}%</p>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-bold tracking-widest uppercase opacity-30">l10 avg</p>
            <p className="text-3xl font-black lowercase">
              {profileStats.avgWpm10.toFixed(1)} <span className="text-xs opacity-20">wpm</span>
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold tracking-widest uppercase opacity-30">l10 raw</p>
            <p className="text-3xl font-black lowercase">
              {profileStats.avgRawWpm10.toFixed(1)} <span className="text-xs opacity-20">wpm</span>
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold tracking-widest uppercase opacity-30">l10 accuracy</p>
            <p className="text-3xl font-black lowercase">
              {profileStats.avgAccuracy10.toFixed(1)}%
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold tracking-widest uppercase opacity-30">
              l10 consistency
            </p>
            <p className="text-3xl font-black lowercase">
              {profileStats.avgConsistency10.toFixed(1)}%
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: GitHub-style Activity heatmap */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-white/5 pb-2">
          <Clock size={18} className="opacity-40" />
          <h2 className="text-xl font-bold lowercase">typing activity</h2>
        </div>
        <div className="pt-2">
          {/* External component mapping daily test counts over time */}
          <ContributionActivity
            calendar={contributionData.calendar}
            totalContributions={contributionData.totalContributions}
          />
        </div>
      </section>

      {/* SECTION 6: Complete Test Logs Table */}
      <section className="space-y-8">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-3">
            <HistoryIcon size={18} className="opacity-40" />
            <h2 className="text-xl font-bold lowercase">history</h2>
          </div>
          {/* Data portability: Export trigger */}
          <Button
            onClick={exportCSV}
            variant="ghost"
            className="h-8 rounded-md bg-white/5 px-4 text-[10px] font-bold tracking-widest uppercase transition-all hover:bg-white/10"
          >
            <FileDown size={12} className="mr-1.5" />
            export csv
          </Button>
        </div>

        {/* Responsive table mapping individual test records */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-bold tracking-widest uppercase opacity-30">
                <th className="w-12 px-4 py-4"></th>
                <th className="px-4 py-4">wpm</th>
                <th className="px-4 py-4">raw</th>
                <th className="px-4 py-4">acc</th>
                <th className="px-4 py-4">con</th>
                <th className="px-4 py-4">mode</th>
                <th className="px-4 py-4 text-right">date</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {/* Render tests in reverse chronological order */}
              {profileStats.history
                .slice()
                .reverse()
                .map((h) => {
                  const isBest = h.wpm === profileStats.highestWpm;
                  return (
                    <tr
                      key={h.id}
                      className="group h-16 border-b border-white/[0.03] transition-all last:border-0 hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-3">
                        {/* Crown icon for all-time highest Wpm */}
                        {isBest && <Crown size={14} className="text-primary fill-primary/10" />}
                      </td>
                      <td className="px-4 py-3 text-lg font-bold tabular-nums" style={{ color: 'var(--text-color)' }}>
                        {h.wpm.toFixed(0)}
                      </td>
                      <td className="px-4 py-3 tabular-nums opacity-40">
                        {h.rawWpm?.toFixed(0) || h.wpm.toFixed(0)}
                      </td>
                      <td className="px-4 py-3 tabular-nums opacity-60">{h.accuracy.toFixed(0)}%</td>
                      <td className="px-4 py-3 tabular-nums opacity-40">
                        {h.consistency?.toFixed(0) || 0}%
                      </td>
                      <td className="px-4 py-3 font-medium lowercase opacity-60">
                        {h.mode} {h.amount}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-bold tracking-tighter uppercase opacity-40">
                            {format(new Date(h.createdAt), 'dd MMM yyyy')}
                          </span>
                          <span className="text-[10px] tabular-nums opacity-20">
                            {format(new Date(h.createdAt), 'HH:mm')}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </section>
    </motion.main>
  );
}

