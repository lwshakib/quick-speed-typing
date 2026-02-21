"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
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
    Calendar, 
    Crown,
    Info,
    Tag,
    Clock,
    FileDown,
    Globe,
    Star,
    Layers,
    Activity,
    BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, subDays, isAfter, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

import { ContributionActivity } from "@/components/contribution-activity";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
    color: "#10b981", // Emerald
  },
  consistency: {
    label: "consistency",
    color: "#8b5cf6", // Violet
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

  const completionRate = totalTests > 0 ? Math.round((completedTests / totalTests) * 100) : 0;

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
    link.setAttribute("download", `typing_history_${user.name}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const StatBox = ({ label, value, subLabel, icon: Icon, large = false }: any) => (
    <div className="flex flex-col gap-1 items-start">
        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest opacity-60">
            {Icon && <Icon size={12} />}
            {label}
        </div>
        <div className={large ? "text-6xl font-black tabular-nums" : "text-4xl font-black tabular-nums"} style={{ color: 'var(--text-color)' }}>
            {value || "-"}
        </div>
        {subLabel && <div className="text-[10px] font-bold opacity-40 lowercase">{subLabel}</div>}
    </div>
  );

  const metrics: { id: keyof typeof chartConfig; label: string; icon: any }[] = [
    { id: "wpm", label: "wpm", icon: Zap },
    { id: "rawWpm", label: "raw", icon: BarChart3 },
    { id: "accuracy", label: "accuracy", icon: Target },
    { id: "consistency", label: "consistency", icon: Activity },
    { id: "avgWpm", label: "avg wpm", icon: TrendingUp },
    { id: "tests", label: "tests", icon: Layers },
    { id: "time", label: "time typing", icon: Clock },
  ];

  return (
    <main className="flex-1 w-full max-w-[1440px] mx-auto py-8 sm:py-16 space-y-20 px-4 sm:px-12">
        
        {/* Profile Header & Basic Stats - Transparent Background */}
        <div className="rounded-3xl p-10 flex flex-col md:flex-row items-center gap-12 border border-white/5">
             <div className="flex items-center gap-8">
                <div className="relative">
                    <Avatar className="h-28 w-28 border-2" style={{ borderColor: 'var(--border)' }}>
                        <AvatarImage src={user.image || ""} />
                        <AvatarFallback className="text-4xl font-black bg-muted text-primary">
                            {user.name?.[0]?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <div className="space-y-1">
                   <h1 className="text-4xl font-black tracking-tighter lowercase" style={{ color: 'var(--text-color)' }}>
                        {user.name}
                    </h1>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                        Joined {format(new Date(user.createdAt), "dd MMM yyyy")}
                    </p>
                    <div className="pt-3 flex flex-col gap-2 w-full max-w-[220px]">
                        <div className="flex justify-between text-[11px] font-black opacity-60">
                            <span>1</span>
                            <span>20/100</span>
                        </div>
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '20%' }}
                                className="h-full bg-primary"
                            />
                        </div>
                    </div>
                </div>
             </div>

             <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-12 w-full md:w-auto md:border-l-2 md:pl-12 h-full items-center" style={{ borderColor: 'var(--border)' }}>
                 <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">tests started</p>
                    <p className="text-5xl font-black tabular-nums" style={{ color: 'var(--text-color)' }}>{totalTests}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">tests completed</p>
                    <p className="text-5xl font-black tabular-nums" style={{ color: 'var(--text-color)' }}>{completedTests}</p>
                 </div>
                 <div className="space-y-1 col-span-2 lg:col-span-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">time typing</p>
                    <p className="text-5xl font-black tabular-nums font-mono" style={{ color: 'var(--text-color)' }}>{formatDuration(totalTimeSeconds)}</p>
                 </div>
             </div>
        </div>

        {/* Time & Word Multi-Mode Records - Transparent Background */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="rounded-3xl p-12 border border-white/5 grid grid-cols-4 gap-8">
                {["15", "30", "60", "120"].map((t) => (
                    <div key={t} className="space-y-8">
                        <div className="text-[10px] font-bold opacity-60 lowercase tracking-widest">{t} seconds</div>
                        <div className="space-y-1">
                            <div className="text-5xl font-black tabular-nums" style={{ color: (profileStats.timeRecords[t]?.wpm ?? 0) > 0 ? 'var(--text-color)' : 'rgba(255,255,255,0.05)' }}>
                                {(profileStats.timeRecords[t]?.wpm ?? 0) > 0 ? profileStats.timeRecords[t].wpm : "-"}
                            </div>
                            <div className="text-xl font-bold opacity-40 tabular-nums">
                                {(profileStats.timeRecords[t]?.accuracy ?? 0) > 0 ? `${profileStats.timeRecords[t].accuracy}%` : "-"}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="rounded-3xl p-12 border border-white/5 grid grid-cols-4 gap-8">
                {["10", "25", "50", "100"].map((w) => (
                    <div key={w} className="space-y-8">
                        <div className="text-[10px] font-bold opacity-60 lowercase tracking-widest">{w} words</div>
                        <div className="space-y-1">
                            <div className="text-5xl font-black tabular-nums" style={{ color: (profileStats.wordRecords[w]?.wpm ?? 0) > 0 ? 'var(--text-color)' : 'rgba(255,255,255,0.05)' }}>
                                {(profileStats.wordRecords[w]?.wpm ?? 0) > 0 ? profileStats.wordRecords[w].wpm : "-"}
                            </div>
                            <div className="text-xl font-bold opacity-40 tabular-nums">
                                {(profileStats.wordRecords[w]?.accuracy ?? 0) > 0 ? `${profileStats.wordRecords[w].accuracy}%` : "-"}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Contribution Activity Section - Styled as Transparent */}
        <div className="space-y-6">
             <div className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-2">consistency activity</div>
             <div className="mt-4">
                <ContributionActivity 
                    calendar={contributionData.calendar}
                    totalContributions={contributionData.totalContributions}
                />
             </div>
        </div>

        {/* Interactive Data Chart with Filter & Metric Selectors */}
        <div className="space-y-10">
            <div className="flex flex-col gap-10">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div className="text-2xl font-black flex items-center gap-3 lowercase" style={{ color: 'var(--text-color)' }}>
                        <TrendingUp className="w-6 h-6 text-primary" />
                        detailed progress
                    </div>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger
                            className="w-full sm:w-[220px] rounded-2xl border-2 lowercase font-black h-14 transition-all active:scale-95 px-8 text-sm"
                            style={{ borderColor: 'var(--border)', backgroundColor: 'transparent' }}
                        >
                            <SelectValue placeholder="last 3 months" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-2 font-mono" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
                            <SelectItem value="all" className="lowercase">all time</SelectItem>
                            <SelectItem value="90d" className="lowercase">last 3 months</SelectItem>
                            <SelectItem value="30d" className="lowercase">last 30 days</SelectItem>
                            <SelectItem value="7d" className="lowercase">last 7 days</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Metric Selector Buttons */}
                <div className="flex flex-wrap gap-3">
                    {metrics.map((m) => (
                        <button
                            key={m.id}
                            onClick={() => setActiveMetric(m.id)}
                            className={cn(
                                "flex items-center gap-2 px-6 py-3 rounded-xl border-2 transition-all duration-300 active:scale-95 group",
                                activeMetric === m.id 
                                    ? "bg-primary border-primary text-black" 
                                    : "border-white/10 bg-white/5 text-white/40 hover:border-white/30 hover:text-white"
                            )}
                        >
                            <m.icon size={14} className={cn(activeMetric === m.id ? "text-black" : "text-white/20 group-hover:text-white/60")} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="rounded-3xl border-2 p-10 mt-6" style={{ borderColor: 'var(--border)', backgroundColor: 'transparent' }}>
                <ChartContainer config={chartConfig} className="aspect-auto h-[500px] w-full">
                    <AreaChart data={filteredChartData}>
                        <defs>
                            <linearGradient id="fillMetric" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={chartConfig[activeMetric].color} stopOpacity={0.4} />
                                <stop offset="95%" stopColor={chartConfig[activeMetric].color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" opacity={0.3} />
                        <XAxis
                            dataKey="formattedDate"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={15}
                            minTickGap={50}
                            stroke="var(--sub-color)"
                            opacity={0.3}
                            fontSize={10}
                            className="lowercase font-black"
                        />
                        <YAxis tickLine={false} axisLine={false} stroke="var(--sub-color)" opacity={0.3} fontSize={10} className="font-black" />
                        <ChartTooltip
                            cursor={{ stroke: 'var(--border)', strokeWidth: 2 }}
                            content={<ChartTooltipContent indicator="dot" className="font-mono rounded-2xl border-2 shadow-2xl" id="profile-chart-tooltip" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }} />}
                        />
                        <Area 
                            dataKey={activeMetric} 
                            type="monotone" 
                            fill="url(#fillMetric)" 
                            stroke={chartConfig[activeMetric].color} 
                            strokeWidth={5} 
                            animationDuration={1000}
                        />
                        <ChartLegend content={<ChartLegendContent className="lowercase text-[12px] font-black opacity-60 mt-12 tracking-widest" />} />
                    </AreaChart>
                </ChartContainer>
            </div>
        </div>

        {/* Phase 2 UI: Gigantic Result Overview - Transparent */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-20 gap-y-24 py-16 border-t-2" style={{ borderColor: 'var(--border)' }}>
            {/* Main Counters */}
            <StatBox label="tests started" value={totalTests} large />
            <div className="space-y-1 py-1">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-1">
                    tests completed <TooltipProvider><Tooltip><TooltipTrigger><Info size={12}/></TooltipTrigger><TooltipContent className="lowercase text-[10px] font-bold">completed without aborting</TooltipContent></Tooltip></TooltipProvider>
                </p>
                <div className="text-6xl font-black tabular-nums" style={{ color: 'var(--text-color)' }}>
                    {completedTests} <span className="text-4xl opacity-20">({completionRate}%)</span>
                </div>
                <div className="text-[11px] font-bold opacity-40 lowercase tracking-wide">0.0 restarts per completed test</div>
            </div>
            <StatBox label="time typing" value={formatDuration(totalTimeSeconds)} large />

            {/* Performance Metric Vertical Stacks */}
            <div className="space-y-16">
                <StatBox label="highest wpm" value={profileStats.highestWpm} subLabel="time 15" />
                <StatBox label="highest raw wpm" value={profileStats.highestRawWpm} />
                <StatBox label="highest accuracy" value={profileStats.highestAccuracy ? `${profileStats.highestAccuracy}%` : "-"} />
                <StatBox label="highest consistency" value={profileStats.highestConsistency ? `${profileStats.highestConsistency}%` : "-"} />
            </div>

            <div className="space-y-16">
                <StatBox label="average wpm" value={profileStats.avgWpm} />
                <StatBox label="average raw wpm" value={profileStats.avgRawWpm} />
                <StatBox label="avg accuracy" value={profileStats.avgAccuracy ? `${profileStats.avgAccuracy}%` : "-"} />
                <StatBox label="avg consistency" value={profileStats.avgConsistency ? `${profileStats.avgConsistency}%` : "-"} />
            </div>

            <div className="space-y-16">
                <StatBox label="average wpm (last 10 tests)" value={profileStats.avgWpm10} />
                <StatBox label="average raw wpm (last 10 tests)" value={profileStats.avgRawWpm10} />
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">avg accuracy (last 10 tests)</p>
                    <div className="text-4xl font-black" style={{ color: 'var(--text-color)' }}>{profileStats.avgAccuracy10 ? `${profileStats.avgAccuracy10}%` : "-"}</div>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">avg consistency (last 10 tests)</p>
                    <div className="text-4xl font-black" style={{ color: 'var(--text-color)' }}>{profileStats.avgConsistency10 ? `${profileStats.avgConsistency10}%` : "-"}</div>
                </div>
            </div>
        </div>

        {/* Test History Final Section */}
        <div className="space-y-10 border-t-2 pt-16" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between">
                <div className="text-3xl font-black flex items-center gap-3 lowercase" style={{ color: 'var(--text-color)' }}>
                    <HistoryIcon className="w-8 h-8 opacity-40" />
                    test history
                </div>
                <Button 
                    id="export-csv-button"
                    onClick={exportCSV}
                    variant="ghost" 
                    className="h-12 text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 px-10 rounded-2xl transition-all"
                >
                    <FileDown size={14} className="mr-2" />
                    Export CSV
                </Button>
            </div>
            
            <div className="overflow-x-auto w-full pb-8">
                <table className="w-full text-left border-collapse min-w-[1100px]">
                    <thead>
                        <tr className="text-[10px] uppercase font-black opacity-40 tracking-[0.2em]">
                            <th className="px-6 py-8 w-16"></th>
                            <th className="px-6 py-8">wpm</th>
                            <th className="px-6 py-8">raw</th>
                            <th className="px-6 py-8">accuracy</th>
                            <th className="px-6 py-8">consistency</th>
                            <th className="px-6 py-8">chars</th>
                            <th className="px-6 py-8">mode</th>
                            <th className="px-6 py-8">info</th>
                            <th className="px-6 py-8">tags</th>
                            <th className="px-6 py-8 text-right">date</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm font-black">
                        {profileStats.history.slice().reverse().map((h) => {
                            const isBest = h.wpm === profileStats.highestWpm;
                            return (
                                <tr key={h.id} id={`history-row-${h.id}`} className="group hover:bg-white/10 transition-all h-24 border-y border-white/[0.03]">
                                    <td className="px-6 py-4 rounded-l-3xl">
                                        {isBest && <Crown size={16} className="text-primary fill-primary/10" />}
                                    </td>
                                    <td className="px-6 py-4 text-xl tabular-nums" style={{ color: 'var(--text-color)' }}>{h.wpm.toFixed(2)}</td>
                                    <td className="px-6 py-4 opacity-70 tabular-nums">{(h.rawWpm || h.wpm).toFixed(2)}</td>
                                    <td className="px-6 py-4 tabular-nums">{h.accuracy.toFixed(2)}%</td>
                                    <td className="px-6 py-4 opacity-70 tabular-nums">{(h.consistency || 0).toFixed(2)}%</td>
                                    <td className="px-6 py-4 opacity-60 tabular-nums font-mono text-[11px]">
                                        {h.correctChars || 0}/{h.errorChars || 0}/{h.extraChars || 0}/{h.missedChars || 0}
                                    </td>
                                    <td className="px-6 py-4 opacity-80">
                                        {h.mode} {h.amount}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3 opacity-30">
                                            <Globe size={16} />
                                            <Star size={16} />
                                            <BarChart3 size={16} />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Tag size={16} className="opacity-10" />
                                    </td>
                                    <td className="px-6 py-4 rounded-r-3xl text-[11px] opacity-60 uppercase tabular-nums text-right font-mono tracking-tighter">
                                        {format(new Date(h.createdAt), "dd MMM yyyy")}<br/>
                                        {format(new Date(h.createdAt), "HH:mm")}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
      </main>
    );
}
