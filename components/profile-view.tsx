"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { ArrowLeft, Zap, Target, History, TrendingUp, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/user-menu";
import { format, subDays, isAfter } from "date-fns";

interface ProfileViewProps {
  session: any;
  history: any[];
}

const chartConfig = {
  wpm: {
    label: "WPM",
    color: "#f59e0b", // Vibrant Amber
  },
  accuracy: {
    label: "Accuracy",
    color: "#10b981", // Vibrant Emerald
  },
} satisfies ChartConfig;



export function ProfileView({ session, history }: ProfileViewProps) {
  const [timeRange, setTimeRange] = React.useState("90d");

  const displayHistory = history;

  // Format data for chart
  const formattedData = displayHistory.slice().reverse().map((h) => ({
    date: h.createdAt,
    wpm: h.wpm,
    accuracy: h.accuracy,
  }));

  const filteredData = formattedData.filter((item) => {
    const date = new Date(item.date);
    const now = new Date();
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = subDays(now, daysToSubtract);
    return isAfter(date, startDate);
  }).map(d => ({
    ...d,
    formattedDate: format(new Date(d.date), "MMM d, HH:mm")
  }));

  const bestWpm = displayHistory.length > 0 ? Math.max(...displayHistory.map(h => h.wpm)) : 0;
  const avgWpm = displayHistory.length > 0 ? Math.round(displayHistory.reduce((acc, h) => acc + h.wpm, 0) / displayHistory.length) : 0;
  const avgAccuracy = displayHistory.length > 0 ? Math.round(displayHistory.reduce((acc, h) => acc + h.accuracy, 0) / displayHistory.length) : 0;

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-[#d4d4d4] font-mono p-4 sm:p-6 transition-colors duration-300">
      <header className="p-4 sm:p-6 flex justify-between items-center z-50">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2 -ml-2 hover:bg-zinc-100 dark:hover:bg-zinc-900">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Type</span>
          </Button>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <UserMenu />
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto py-8 sm:py-12 space-y-8 sm:space-y-12">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tighter">Your Progress</h1>
          <p className="text-muted-foreground">Track your evolution in speed and accuracy.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 uppercase tracking-widest text-[10px] sm:text-xs font-bold">
                <Zap className="w-3 h-3 text-yellow-500" />
                Best WPM
              </CardDescription>
              <CardTitle className="text-3xl sm:text-4xl font-black">{bestWpm}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 uppercase tracking-widest text-[10px] sm:text-xs font-bold">
                <TrendingUp className="w-3 h-3 text-green-500" />
                Avg WPM
              </CardDescription>
              <CardTitle className="text-3xl sm:text-4xl font-black">{avgWpm}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 uppercase tracking-widest text-[10px] sm:text-xs font-bold">
                <Target className="w-3 h-3 text-blue-500" />
                Avg Accuracy
              </CardDescription>
              <CardTitle className="text-3xl sm:text-4xl font-black">{avgAccuracy}%</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Interactive Charts */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-xl overflow-hidden">
          <CardHeader className="flex items-center gap-2 space-y-0 border-b border-border/50 py-5 sm:flex-row">
            <div className="grid flex-1 gap-1">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Interactive Stats
              </CardTitle>
              <CardDescription>
                Showing typing history for the selected period
              </CardDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="w-[160px] rounded-lg sm:ml-auto"
                aria-label="Select a value"
              >
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="90d" className="rounded-lg">
                  Last 3 months
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                  Last 30 days
                </SelectItem>
                <SelectItem value="7d" className="rounded-lg">
                  Last 7 days
                </SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[300px] w-full"
            >
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient id="fillWpm" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-wpm)"
                      stopOpacity={0.6}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-wpm)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="fillAccuracy" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-accuracy)"
                      stopOpacity={0.6}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-accuracy)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
                <XAxis
                  dataKey="formattedDate"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      indicator="dot"
                    />
                  }
                />
                <Area
                  dataKey="accuracy"
                  type="monotone"
                  fill="url(#fillAccuracy)"
                  stroke="var(--color-accuracy)"
                  strokeWidth={3}
                />
                <Area
                  dataKey="wpm"
                  type="monotone"
                  fill="url(#fillWpm)"
                  stroke="var(--color-wpm)"
                  strokeWidth={3}
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* History List */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
             <CardTitle className="text-xl font-bold flex items-center gap-2">
                <History className="w-5 h-5 text-muted-foreground" />
                Recent Tests
              </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {history.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No tests completed yet.</p>
              ) : (
                history.map((h) => (
                  <div key={h.id} className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/50">
                    <div className="flex items-center gap-4 sm:gap-8">
                       <div className="flex flex-col">
                         <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">WPM</span>
                         <span className="text-xl font-black">{h.wpm}</span>
                       </div>
                       <div className="flex flex-col">
                         <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">ACC</span>
                         <span className="text-xl font-black">{h.accuracy}%</span>
                       </div>
                       <div className="hidden sm:flex flex-col">
                         <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">ERR</span>
                         <span className="text-xl font-black text-destructive">{h.errors}</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(h.createdAt), "MMM d, yyyy HH:mm")}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
