"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function saveTypingHistory(data: {
  wpm: number;
  rawWpm?: number;
  accuracy: number;
  errors: number;
  duration: number;
  consistency?: number;
  mode?: string;
  amount?: number;
  language?: string;
  correctChars?: number;
  errorChars?: number;
  extraChars?: number;
  missedChars?: number;
  isCompleted?: boolean;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const history = await prisma.typingHistory.create({
    data: {
      userId: session.user.id,
      wpm: data.wpm,
      rawWpm: data.rawWpm,
      accuracy: data.accuracy,
      errors: data.errors,
      duration: data.duration,
      consistency: data.consistency,
      mode: data.mode,
      amount: data.amount,
      language: data.language,
      correctChars: data.correctChars,
      errorChars: data.errorChars,
      extraChars: data.extraChars,
      missedChars: data.missedChars,
      isCompleted: data.isCompleted ?? true,
    },
  });

  revalidatePath("/profile");
  revalidatePath("/leaderboard");
  return history;
}

export async function getTypingHistory() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return [];
  }

  return await prisma.typingHistory.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });
}

export async function getContributionData() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { calendar: [], totalContributions: 0 };
  }

  const history = await prisma.typingHistory.findMany({
    where: {
      userId: session.user.id,
      createdAt: {
        gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
      },
    },
    select: {
      createdAt: true,
    },
  });

  // Group by date
  const contributionsByDate: Record<string, number> = {};
  history.forEach((h) => {
    const date = h.createdAt.toISOString().split("T")[0];
    contributionsByDate[date] = (contributionsByDate[date] || 0) + 1;
  });

  // Create calendar structure
  const calendar: any[] = [];
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);
  
  // Find the first Sunday before or on oneYearAgo
  const startDate = new Date(oneYearAgo);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  let currentDate = new Date(startDate);
  let currentWeek: any[] = [];

  while (currentDate <= today) {
    const dateStr = currentDate.toISOString().split("T")[0];
    const count = contributionsByDate[dateStr] || 0;
    
    currentWeek.push({
      date: dateStr,
      contributionCount: count,
    });

    if (currentWeek.length === 7) {
      calendar.push({ contributionDays: currentWeek });
      currentWeek = [];
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  if (currentWeek.length > 0) {
    // Fill the rest of the week if necessary
    while (currentWeek.length < 7) {
        const nextDate = new Date(currentDate);
        currentWeek.push({
            date: nextDate.toISOString().split("T")[0],
            contributionCount: 0,
        });
        currentDate.setDate(currentDate.getDate() + 1);
    }
    calendar.push({ contributionDays: currentWeek });
  }

  return {
    calendar,
    totalContributions: history.length,
  };
}

export async function getLeaderboard(timeRange: "all" | "daily" | "weekly" | "monthly" = "all") {
  let dateFilter = {};
  const now = new Date();

  // Reset to 00:00:00 for the current day as the base for calculations
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  if (timeRange === "daily") {
    dateFilter = { gte: today };
  } else if (timeRange === "weekly") {
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    dateFilter = { gte: startOfWeek };
  } else if (timeRange === "monthly") {
    dateFilter = { gte: new Date(now.getFullYear(), now.getMonth(), 1) };
  }

  const results = await prisma.typingHistory.findMany({
    where: {
      createdAt: dateFilter,
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: [
      { wpm: "desc" },
      { accuracy: "desc" },
      { createdAt: "desc" },
    ],
  });

  // Filter for unique users, keeping only their best score (already sorted by WPM)
  const uniqueRankings: any[] = [];
  const seenUsers = new Set();
  
  for (const item of results) {
    if (!seenUsers.has(item.userId)) {
      seenUsers.add(item.userId);
      uniqueRankings.push(item);
    }
    if (uniqueRankings.length >= 50) break;
  }

  return uniqueRankings;
}

export async function updateUserTheme(themeId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  return await prisma.user.update({
    where: { id: session.user.id },
    data: { theme: themeId } as any,
  });
}

export async function getUserTheme() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { theme: true } as any,
  }) as { theme: string | null } | null;

  return user?.theme || "default-theme";
}
export async function getProfileStats() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  const history = await prisma.typingHistory.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalTests = history.length;
  const completedHistory = history.filter(h => h.isCompleted);
  const completedTests = completedHistory.length;
  
  const totalTimeSeconds = history.reduce((acc, h) => acc + (h.duration || 0), 0);
  
  // Highest values
  const highestWpm = history.length > 0 ? Math.max(...history.map(h => h.wpm)) : 0;
  const highestRawWpm = history.length > 0 ? Math.max(...history.map(h => h.rawWpm || 0)) : 0;
  const highestAccuracy = history.length > 0 ? Math.max(...history.map(h => h.accuracy)) : 0;
  const highestConsistency = history.length > 0 ? Math.max(...history.map(h => h.consistency || 0)) : 0;

  // Global Averages
  const avgWpm = completedTests > 0 ? Math.round(completedHistory.reduce((acc, h) => acc + h.wpm, 0) / completedTests) : 0;
  const avgRawWpm = completedTests > 0 ? Math.round(completedHistory.reduce((acc, h) => acc + (h.rawWpm || 0), 0) / completedTests) : 0;
  const avgAccuracy = completedTests > 0 ? Math.round(completedHistory.reduce((acc, h) => acc + h.accuracy, 0) / completedTests) : 0;
  const avgConsistency = completedTests > 0 ? Math.round(completedHistory.reduce((acc, h) => acc + (h.consistency || 0), 0) / completedTests) : 0;

  // Averages for last 10 tests
  const last10 = completedHistory.slice(0, 10);
  const l10Count = last10.length;
  const avgWpm10 = l10Count > 0 ? Math.round(last10.reduce((acc, h) => acc + h.wpm, 0) / l10Count) : 0;
  const avgRawWpm10 = l10Count > 0 ? Math.round(last10.reduce((acc, h) => acc + (h.rawWpm || 0), 0) / l10Count) : 0;
  const avgAccuracy10 = l10Count > 0 ? Math.round(last10.reduce((acc, h) => acc + h.accuracy, 0) / l10Count) : 0;
  const avgConsistency10 = l10Count > 0 ? Math.round(last10.reduce((acc, h) => acc + (h.consistency || 0), 0) / l10Count) : 0;

  // Best records for time modes
  const timeRecords: Record<string, { wpm: number; accuracy: number }> = {
    "15": { wpm: 0, accuracy: 0 },
    "30": { wpm: 0, accuracy: 0 },
    "60": { wpm: 0, accuracy: 0 },
    "120": { wpm: 0, accuracy: 0 },
  };

  // Best records for word modes
  const wordRecords: Record<string, { wpm: number; accuracy: number }> = {
    "10": { wpm: 0, accuracy: 0 },
    "25": { wpm: 0, accuracy: 0 },
    "50": { wpm: 0, accuracy: 0 },
    "100": { wpm: 0, accuracy: 0 },
  };

  history.forEach((h) => {
    if (h.mode === "time") {
      const amtStr = h.amount?.toString() || "";
      if (timeRecords[amtStr] !== undefined && h.wpm > timeRecords[amtStr].wpm) {
        timeRecords[amtStr] = { wpm: h.wpm, accuracy: h.accuracy };
      }
    } else if (h.mode === "words") {
      const amtStr = h.amount?.toString() || "";
      if (wordRecords[amtStr] !== undefined && h.wpm > wordRecords[amtStr].wpm) {
        wordRecords[amtStr] = { wpm: h.wpm, accuracy: h.accuracy };
      }
    }
  });

  // Daily aggregation for charts
  const dailyStats: Record<string, {
    wpm: number[];
    rawWpm: number[];
    accuracy: number[];
    consistency: number[];
    tests: number;
    time: number;
  }> = {};

  history.forEach(h => {
    const dateStr = h.createdAt.toISOString().split('T')[0];
    if (!dailyStats[dateStr]) {
      dailyStats[dateStr] = { wpm: [], rawWpm: [], accuracy: [], consistency: [], tests: 0, time: 0 };
    }
    dailyStats[dateStr].wpm.push(h.wpm);
    dailyStats[dateStr].rawWpm.push(h.rawWpm || 0);
    dailyStats[dateStr].accuracy.push(h.accuracy);
    dailyStats[dateStr].consistency.push(h.consistency || 0);
    dailyStats[dateStr].tests += 1;
    dailyStats[dateStr].time += (h.duration || 0);
  });

  const chartData = Object.keys(dailyStats).sort().map(date => {
    const s = dailyStats[date];
    const mean = (arr: number[]) => arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
    const max = (arr: number[]) => arr.length > 0 ? Math.round(Math.max(...arr)) : 0;

    return {
      date,
      wpm: max(s.wpm),
      rawWpm: max(s.rawWpm),
      accuracy: mean(s.accuracy),
      consistency: mean(s.consistency),
      avgWpm: mean(s.wpm),
      tests: s.tests,
      time: s.time,
    };
  });

  return {
    user: session.user,
    totalTests,
    completedTests,
    totalTimeSeconds,
    highestWpm,
    highestRawWpm,
    highestAccuracy,
    highestConsistency,
    avgWpm,
    avgRawWpm,
    avgAccuracy,
    avgConsistency,
    avgWpm10,
    avgRawWpm10,
    avgAccuracy10,
    avgConsistency10,
    timeRecords,
    wordRecords,
    chartData,
    history: history.slice(0, 100).reverse(), 
  };
}
