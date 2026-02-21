"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
    TrendingUp, 
    Zap, 
    Target, 
    History as HistoryIcon, 
    Crown,
    Info,
    Tag,
    Clock,
    FileDown,
    Star,
    Activity,
    BarChart3,
    Smartphone,
    Monitor,
    Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, subDays, isAfter, parseISO } from "date-fns";
import { motion } from "framer-motion";

import { ContributionActivity } from "@/components/contribution-activity";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ProfileStats {
    user: any;
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
    avgWpm10: number;
    avgRawWpm10: number;
    avgAccuracy10: number;
    avgConsistency10: number;
    timeRecords: Record<string, { wpm: number; accuracy: number }>;
    wordRecords: Record<string, { wpm: number; accuracy: number }>;
    chartData: any[];
    history: any[];
}

interface ProfileViewProps {
  session: any;
  history: any[];
  contributionData: {
    calendar: any[];
    totalContributions: number;
  };
  profileStats: ProfileStats;
}

const chartConfig = {
  wpm: {
    label: "wpm",
    color: "var(--main-color)",
  },
  rawWpm: {
    label: "raw wpm",
    color: "var(--sub-color)",
  },
  accuracy: {
    label: "accuracy",
    color: "#10b981",
  },
  consistency: {
    label: "consistency",
    color: "#8b5cf6",
  },
  avgWpm: {
    label: "avg wpm",
    color: "var(--main-color)",
  },
  tests: {
    label: "tests",
    color: "var(--text-color)",
  },
  time: {
    label: "time",
    color: "var(--sub-color)",
  },
} satisfies ChartConfig;

export function ProfileView({ session, history: initialHistory, contributionData, profileStats }: ProfileViewProps) {
  const [timeRange, setTimeRange] = React.useState("90d");
  const [activeMetric, setActiveMetric] = React.useState<keyof typeof chartConfig>("wpm");
  const { user, totalTests, completedTests, totalTimeSeconds } = profileStats;

  const filteredChartData = profileStats.chartData.filter((item) => {
    const date = parseISO(item.date);
    const now = new Date();
    let daysToSubtract = 90;
    if (timeRange === "30d") daysToSubtract = 30;
    else if (timeRange === "7d") daysToSubtract = 7;
    const startDate = subDays(now, daysToSubtract);
    return isAfter(date, startDate) || timeRange === "all";
  }).map(item => ({
    ...item,
    formattedDate: format(parseISO(item.date), "MMM d")
  }));

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const exportCSV = () => {
    const headers = ["WPM", "Raw WPM", "Accuracy", "Errors", "Duration (s)", "Consistency", "Mode", "Amount", "Date"];
    const rows = profileStats.history.map(h => [
        h.wpm,
        h.rawWpm || h.wpm,
        h.accuracy,
        h.errors,
        h.duration,
        h.consistency || 0,
        h.mode,
        h.amount,
        format(new Date(h.createdAt), "yyyy-MM-dd HH:mm:ss")
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n"
        + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `profile_${user.name}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const metrics: { id: keyof typeof chartConfig; label: string; icon: any }[] = [
    { id: "wpm", label: "wpm", icon: Zap },
    { id: "rawWpm", label: "raw", icon: BarChart3 },
    { id: "accuracy", label: "accuracy", icon: Target },
    { id: "consistency", label: "consistency", icon: Activity },
    { id: "avgWpm", label: "avg wpm", icon: TrendingUp },
    { id: "tests", label: "tests", icon: Shield },
    { id: "time", label: "time", icon: Clock },
  ];

  return (
    <motion.main 
      className="flex-1 w-full max-w-5xl mx-auto py-12 px-6 space-y-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Profile Header */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-white/5">
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24 rounded-2xl border border-white/10">
            <AvatarImage src={user.image || ""} />
            <AvatarFallback className="text-3xl font-black bg-white/5 text-primary">
              {user.name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter lowercase leading-none" style={{ color: 'var(--text-color)' }}>
              {user.name}
            </h1>
            <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">
              member since {format(new Date(user.createdAt), "MMM yyyy")}
            </p>
            <div className="pt-2 flex flex-col gap-1.5 w-full min-w-[200px]">
              <div className="flex justify-between text-[10px] font-bold opacity-30 uppercase tracking-tighter">
                <span>level 1</span>
                <span>20% to next</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '20%' }}
                    className="h-full bg-primary"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-12 text-center md:text-left">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase opacity-30 tracking-widest">started</p>
            <p className="text-3xl font-black tabular-nums lowercase">{totalTests}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase opacity-30 tracking-widest">completed</p>
            <p className="text-3xl font-black tabular-nums lowercase">{completedTests}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase opacity-30 tracking-widest">time</p>
            <p className="text-3xl font-black tabular-nums font-mono lowercase">{formatDuration(totalTimeSeconds).split(':').slice(0, 2).join(':')}</p>
          </div>
        </div>
      </section>

      {/* Best Scores */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 pb-2 border-b border-white/5">
          <Crown size={18} className="opacity-40" />
          <h2 className="text-xl font-bold lowercase">personal bests</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Time Records */}
          <div className="grid grid-cols-4 gap-4 p-6 rounded-xl border border-white/5 bg-white/[0.02]">
            {["15", "30", "60", "120"].map((t) => (
              <div key={t} className="space-y-2 text-center">
                <p className="text-[10px] font-bold opacity-30 lowercase">{t}s</p>
                <div className="space-y-0.5">
                  <p className="text-2xl font-black tabular-nums" style={{ color: (profileStats.timeRecords[t]?.wpm ?? 0) > 0 ? 'var(--text-color)' : 'rgba(255,255,255,0.05)' }}>
                    {profileStats.timeRecords[t]?.wpm.toFixed(0) || "-"}
                  </p>
                  <p className="text-[10px] font-bold opacity-20 tabular-nums">
                    {profileStats.timeRecords[t]?.accuracy ? `${profileStats.timeRecords[t].accuracy}%` : "-"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Word Records */}
          <div className="grid grid-cols-4 gap-4 p-6 rounded-xl border border-white/5 bg-white/[0.02]">
            {["10", "25", "50", "100"].map((w) => (
              <div key={w} className="space-y-2 text-center">
                <p className="text-[10px] font-bold opacity-30 lowercase">{w}w</p>
                <div className="space-y-0.5">
                  <p className="text-2xl font-black tabular-nums" style={{ color: (profileStats.wordRecords[w]?.wpm ?? 0) > 0 ? 'var(--text-color)' : 'rgba(255,255,255,0.05)' }}>
                    {profileStats.wordRecords[w]?.wpm.toFixed(0) || "-"}
                  </p>
                  <p className="text-[10px] font-bold opacity-20 tabular-nums">
                    {profileStats.wordRecords[w]?.accuracy ? `${profileStats.wordRecords[w].accuracy}%` : "-"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Progress Chart */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-2 border-b border-white/5">
          <div className="flex items-center gap-3">
            <TrendingUp size={18} className="opacity-40" />
            <h2 className="text-xl font-bold lowercase">progress</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {metrics.slice(0, 4).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveMetric(m.id)}
                  className={cn(
                    "px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all",
                    activeMetric === m.id 
                      ? "bg-primary text-black" 
                      : "bg-white/5 text-white/30 hover:bg-white/10"
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
            
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="h-7 w-[100px] text-[10px] font-bold lowercase bg-white/5 border-none rounded-md px-3">
                <SelectValue placeholder="range" />
              </SelectTrigger>
              <SelectContent className="bg-background border-white/10">
                <SelectItem value="all" className="text-xs lowercase">all time</SelectItem>
                <SelectItem value="90d" className="text-xs lowercase">3 months</SelectItem>
                <SelectItem value="30d" className="text-xs lowercase">30 days</SelectItem>
                <SelectItem value="7d" className="text-xs lowercase">7 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="h-[300px] w-full pt-4">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <AreaChart data={filteredChartData}>
              <defs>
                <linearGradient id="fillMetric" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartConfig[activeMetric].color} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={chartConfig[activeMetric].color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" opacity={0.3} />
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
                content={<ChartTooltipContent indicator="dot" className="bg-background border-white/10 rounded-lg shadow-xl" />}
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

      {/* Detailed Stats */}
      <section className="space-y-12">
        <div className="flex items-center gap-3 pb-2 border-b border-white/5">
          <Activity size={18} className="opacity-40" />
          <h2 className="text-xl font-bold lowercase">detailed statistics</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase opacity-30 tracking-widest">all-time avg</p>
            <p className="text-3xl font-black lowercase">{profileStats.avgWpm.toFixed(1)} <span className="text-xs opacity-20">wpm</span></p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase opacity-30 tracking-widest">all-time raw</p>
            <p className="text-3xl font-black lowercase">{profileStats.avgRawWpm.toFixed(1)} <span className="text-xs opacity-20">wpm</span></p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase opacity-30 tracking-widest">avg accuracy</p>
            <p className="text-3xl font-black lowercase">{profileStats.avgAccuracy.toFixed(1)}%</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase opacity-30 tracking-widest">avg consistency</p>
            <p className="text-3xl font-black lowercase">{profileStats.avgConsistency.toFixed(1)}%</p>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase opacity-30 tracking-widest">l10 avg</p>
            <p className="text-3xl font-black lowercase">{profileStats.avgWpm10.toFixed(1)} <span className="text-xs opacity-20">wpm</span></p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase opacity-30 tracking-widest">l10 raw</p>
            <p className="text-3xl font-black lowercase">{profileStats.avgRawWpm10.toFixed(1)} <span className="text-xs opacity-20">wpm</span></p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase opacity-30 tracking-widest">l10 accuracy</p>
            <p className="text-3xl font-black lowercase">{profileStats.avgAccuracy10.toFixed(1)}%</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase opacity-30 tracking-widest">l10 consistency</p>
            <p className="text-3xl font-black lowercase">{profileStats.avgConsistency10.toFixed(1)}%</p>
          </div>
        </div>
      </section>

      {/* Activity Map */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 pb-2 border-b border-white/5">
          <Clock size={18} className="opacity-40" />
          <h2 className="text-xl font-bold lowercase">typing activity</h2>
        </div>
        <div className="pt-2">
          <ContributionActivity 
            calendar={contributionData.calendar}
            totalContributions={contributionData.totalContributions}
          />
        </div>
      </section>

      {/* History Table */}
      <section className="space-y-8">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <div className="flex items-center gap-3">
            <HistoryIcon size={18} className="opacity-40" />
            <h2 className="text-xl font-bold lowercase">history</h2>
          </div>
          <Button 
              onClick={exportCSV}
              variant="ghost" 
              className="h-8 text-[10px] font-bold uppercase tracking-widest bg-white/5 hover:bg-white/10 px-4 rounded-md transition-all"
          >
              <FileDown size={12} className="mr-1.5" />
              export csv
          </Button>
        </div>
        
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase font-bold opacity-30 tracking-widest border-b border-white/5">
                <th className="px-4 py-4 w-12"></th>
                <th className="px-4 py-4">wpm</th>
                <th className="px-4 py-4">raw</th>
                <th className="px-4 py-4">acc</th>
                <th className="px-4 py-4">con</th>
                <th className="px-4 py-4">mode</th>
                <th className="px-4 py-4 text-right">date</th>
              </tr>
            </thead>
            <tbody className="text-sm">
                {profileStats.history.slice().reverse().map((h) => {
                  const isBest = h.wpm === profileStats.highestWpm;
                  return (
                    <tr key={h.id} className="group hover:bg-white/[0.02] transition-all border-b border-white/[0.03] last:border-0 h-16">
                      <td className="px-4 py-3">
                        {isBest && <Crown size={14} className="text-primary fill-primary/10" />}
                      </td>
                      <td className="px-4 py-3 font-bold text-lg tabular-nums" style={{ color: 'var(--text-color)' }}>
                        {h.wpm.toFixed(0)}
                      </td>
                      <td className="px-4 py-3 opacity-40 tabular-nums">
                        {h.rawWpm?.toFixed(0) || h.wpm.toFixed(0)}
                      </td>
                      <td className="px-4 py-3 opacity-60 tabular-nums">
                        {h.accuracy.toFixed(0)}%
                      </td>
                      <td className="px-4 py-3 opacity-40 tabular-nums">
                        {h.consistency?.toFixed(0) || 0}%
                      </td>
                      <td className="px-4 py-3 opacity-60 lowercase font-medium">
                        {h.mode} {h.amount}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-bold opacity-40 uppercase tracking-tighter">
                            {format(new Date(h.createdAt), "dd MMM yyyy")}
                          </span>
                          <span className="text-[10px] opacity-20 tabular-nums">
                            {format(new Date(h.createdAt), "HH:mm")}
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
