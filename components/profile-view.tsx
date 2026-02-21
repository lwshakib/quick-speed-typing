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
    label: "wpm",
    color: "var(--main-color)",
  },
  accuracy: {
    label: "accuracy",
    color: "var(--sub-color)",
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
    <main className="flex-1 w-full max-w-[1250px] mx-auto py-8 sm:py-12 space-y-8 sm:space-y-12 px-4 sm:px-8">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tighter lowercase" style={{ color: 'var(--text-color)' }}>your progress</h1>
          <p className="text-sm lowercase opacity-60">Track your evolution in speed and accuracy.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border-2 transition-all duration-300 group" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
              <div className="flex items-center gap-2 uppercase tracking-widest text-[10px] font-bold opacity-40 mb-2">
                <Zap className="w-3 h-3 text-primary" />
                best wpm
              </div>
              <div className="text-4xl font-black transition-transform group-hover:scale-105 duration-300" style={{ color: 'var(--text-color)' }}>{bestWpm}</div>
          </div>
          <div className="p-6 rounded-2xl border-2 transition-all duration-300 group" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
              <div className="flex items-center gap-2 uppercase tracking-widest text-[10px] font-bold opacity-40 mb-2">
                <TrendingUp className="w-3 h-3 text-primary" />
                avg wpm
              </div>
              <div className="text-4xl font-black transition-transform group-hover:scale-105 duration-300" style={{ color: 'var(--text-color)' }}>{avgWpm}</div>
          </div>
          <div className="p-6 rounded-2xl border-2 transition-all duration-300 group" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
              <div className="flex items-center gap-2 uppercase tracking-widest text-[10px] font-bold opacity-40 mb-2">
                <Target className="w-3 h-3 text-primary" />
                avg accuracy
              </div>
              <div className="text-4xl font-black transition-transform group-hover:scale-105 duration-300" style={{ color: 'var(--text-color)' }}>{avgAccuracy}%</div>
          </div>
        </div>

        {/* Interactive Charts */}
        <div className="rounded-2xl border-2 overflow-hidden" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
          <div className="flex items-center gap-4 border-b-2 p-6 sm:flex-row flex-col" style={{ borderColor: 'var(--border)' }}>
            <div className="grid flex-1 gap-1">
              <div className="text-xl font-bold flex items-center gap-2 lowercase" style={{ color: 'var(--text-color)' }}>
                <TrendingUp className="w-5 h-5 text-primary" />
                interactive stats
              </div>
              <div className="text-xs opacity-50 lowercase">
                Showing typing history for the selected period
              </div>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="w-[160px] rounded-xl sm:ml-auto border-2 lowercase font-bold h-10"
                style={{ borderColor: 'var(--border)', backgroundColor: 'transparent' }}
              >
                <SelectValue placeholder="last 3 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-2 font-mono" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
                <SelectItem value="90d" className="lowercase">last 3 months</SelectItem>
                <SelectItem value="30d" className="lowercase">last 30 days</SelectItem>
                <SelectItem value="7d" className="lowercase">last 7 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="p-6">
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[350px] w-full"
            >
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient id="fillWpm" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--main-color)"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--main-color)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="fillAccuracy" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--sub-color)"
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--sub-color)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis
                  dataKey="formattedDate"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                  minTickGap={40}
                  stroke="var(--sub-color)"
                  opacity={0.5}
                  fontSize={10}
                  className="lowercase"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  stroke="var(--sub-color)"
                  opacity={0.5}
                  fontSize={10}
                />
                <ChartTooltip
                  cursor={{ stroke: 'var(--border)', strokeWidth: 2 }}
                  content={
                    <ChartTooltipContent
                      indicator="dot"
                      className="font-mono rounded-lg border-2"
                      style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                    />
                  }
                />
                <Area
                  dataKey="accuracy"
                  type="monotone"
                  fill="url(#fillAccuracy)"
                  stroke="var(--sub-color)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <Area
                  dataKey="wpm"
                  type="monotone"
                  fill="url(#fillWpm)"
                  stroke="var(--main-color)"
                  strokeWidth={4}
                />
                <ChartLegend content={<ChartLegendContent className="lowercase text-[10px] font-bold opacity-60 mt-4" />} />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>

        {/* History List */}
        <div className="space-y-6">
             <div className="text-xl font-bold flex items-center gap-2 lowercase" style={{ color: 'var(--text-color)' }}>
                <History className="w-5 h-5 opacity-40" />
                recent tests
              </div>
            <div className="flex flex-col gap-3">
              {history.length === 0 ? (
                <div className="text-center py-20 rounded-2xl border-2 border-dashed opacity-40 lowercase" style={{ borderColor: 'var(--border)' }}>
                    No tests completed yet.
                </div>
              ) : (
                history.slice(0, 10).map((h) => (
                  <div key={h.id} className="flex items-center justify-between p-5 rounded-2xl border-2 transition-all hover:translate-x-1 duration-200" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
                    <div className="flex items-center gap-6 sm:gap-12">
                       <div className="flex flex-col">
                         <span className="text-[10px] uppercase font-black opacity-30 tracking-widest mb-1">wpm</span>
                         <span className="text-2xl font-black" style={{ color: 'var(--text-color)' }}>{h.wpm}</span>
                       </div>
                       <div className="flex flex-col">
                         <span className="text-[10px] uppercase font-black opacity-30 tracking-widest mb-1">acc</span>
                         <span className="text-2xl font-black" style={{ color: 'var(--text-color)' }}>{h.accuracy}%</span>
                       </div>
                       <div className="hidden sm:flex flex-col">
                         <span className="text-[10px] uppercase font-black opacity-30 tracking-widest mb-1">err</span>
                         <span className="text-2xl font-black" style={{ color: 'var(--error-color)' }}>{h.errors}</span>
                       </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 opacity-40 text-[10px] font-bold uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                         {format(new Date(h.createdAt), "MMM d, yyyy")}
                      </div>
                      <div>{format(new Date(h.createdAt), "HH:mm")}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {history.length > 10 && (
                <div className="flex justify-center pt-4">
                    <Button variant="ghost" className="lowercase font-bold opacity-40 hover:opacity-100">view all history</Button>
                </div>
            )}
        </div>
      </main>
    );
}
