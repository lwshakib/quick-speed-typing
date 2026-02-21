'use server';

/**
 * Server Actions: This file acts as the primary internal API for the application,
 * handling all database interactions, statistical aggregations, and session-based data retrieval.
 */

import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

/**
 * Persists a user's typing test results to the database.
 * @param data - The raw performance metrics captured during the test.
 */
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
  // Validate that the request is coming from an authenticated session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error('Unauthorized');
  }

  // Create a new record in the typingHistory table linked to the current user
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

  // Purge the cache for relevant pages to ensure the new data is reflected immediately
  revalidatePath('/profile');
  revalidatePath('/leaderboard');
  return history;
}

/**
 * Retrieves the most recent 50 typing tests for the authenticated user.
 */
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
      createdAt: 'desc',
    },
    take: 50,
  });
}

/**
 * Aggregates typing activity over the last year into a format suitable for the activity heatmap.
 * @returns A structured calendar array and the total contribution count.
 */
export async function getContributionData() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { calendar: [], totalContributions: 0 };
  }

  // Fetch all historical records within the past 365 days
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

  // Internal transformation: Group raw database timestamps by their YYYY-MM-DD string key
  const contributionsByDate: Record<string, number> = {};
  history.forEach((h) => {
    const date = h.createdAt.toISOString().split('T')[0];
    contributionsByDate[date] = (contributionsByDate[date] || 0) + 1;
  });

  // Initialization: Define the logical starting point for the contribution grid
  const calendar: any[] = [];
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  // Align the start date to the beginning of a week (Sunday) for a standard grid layout
  const startDate = new Date(oneYearAgo);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  let currentDate = new Date(startDate);
  let currentWeek: any[] = [];

  // Iterator: Scan through every day from one year ago until today
  while (currentDate <= today) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const count = contributionsByDate[dateStr] || 0;

    currentWeek.push({
      date: dateStr,
      contributionCount: count,
    });

    // Chunk the days into week arrays of size 7
    if (currentWeek.length === 7) {
      calendar.push({ contributionDays: currentWeek });
      currentWeek = [];
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Logic: Ensure the final week is padded and added to the calendar
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      const nextDate = new Date(currentDate);
      currentWeek.push({
        date: nextDate.toISOString().split('T')[0],
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

/**
 * Fetches the global leaderboard rankings, filtered by time range (Daily, Weekly, Monthly, All-time).
 * Automatically handles tie-breaking and unique user filtering.
 */
export async function getLeaderboard(timeRange: 'all' | 'daily' | 'weekly' | 'monthly' = 'all') {
  let dateFilter = {};
  const now = new Date();

  // Reset to 00:00:00 for the current day as the base for periodic filters
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  // Apply conditional date range logic
  if (timeRange === 'daily') {
    dateFilter = { gte: today };
  } else if (timeRange === 'weekly') {
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    dateFilter = { gte: startOfWeek };
  } else if (timeRange === 'monthly') {
    dateFilter = { gte: new Date(now.getFullYear(), now.getMonth(), 1) };
  }

  // Fetch performance data including user profiles for display
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
      { wpm: 'desc' }, // Primary criteria: Highest speed
      { accuracy: 'desc' }, // Second criteria: Highest precision
      { createdAt: 'desc' }, // Third criteria: Most recent effort
    ],
  });

  // Logic: Extract only the single best performance for each unique user to prevent leaderboard flooding
  const uniqueRankings: any[] = [];
  const seenUsers = new Set();

  for (const item of results) {
    if (!seenUsers.has(item.userId)) {
      seenUsers.add(item.userId);
      uniqueRankings.push(item);
    }
    // Limit to Top 50 results for optimal performance
    if (uniqueRankings.length >= 50) break;
  }

  return uniqueRankings;
}

/**
 * Persistently updates the user's preferred visual theme in the database.
 */
export async function updateUserTheme(themeId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error('Unauthorized');
  }

  return await prisma.user.update({
    where: { id: session.user.id },
    data: { theme: themeId } as any,
  });
}

/**
 * Retrieves the currently saved theme ID for the authenticated user.
 */
export async function getUserTheme() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  const user = (await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { theme: true } as any,
  })) as { theme: string | null } | null;

  return user?.theme || 'default-theme';
}

/**
 * Heavyweight Action: Computes a comprehensive statistical overview for the user's profile.
 * Heavily transforms raw performance data into actionable insights (averages, personal bests, chart data).
 */
export async function getProfileStats() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  // Fetch the entire typing history for computation
  const history = await prisma.typingHistory.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Base metrics
  const totalTests = history.length;
  const completedHistory = history.filter((h) => h.isCompleted);
  const completedTests = completedHistory.length;
  const totalTimeSeconds = history.reduce((acc, h) => acc + (h.duration || 0), 0);

  // Personal Best (Peak) Metrics
  const highestWpm = history.length > 0 ? Math.max(...history.map((h) => h.wpm)) : 0;
  const highestRawWpm = history.length > 0 ? Math.max(...history.map((h) => h.rawWpm || 0)) : 0;
  const highestAccuracy = history.length > 0 ? Math.max(...history.map((h) => h.accuracy)) : 0;
  const highestConsistency =
    history.length > 0 ? Math.max(...history.map((h) => h.consistency || 0)) : 0;

  // Global Average Calculations (Across all time)
  const avgWpm =
    completedTests > 0
      ? Math.round(completedHistory.reduce((acc, h) => acc + h.wpm, 0) / completedTests)
      : 0;
  const avgRawWpm =
    completedTests > 0
      ? Math.round(completedHistory.reduce((acc, h) => acc + (h.rawWpm || 0), 0) / completedTests)
      : 0;
  const avgAccuracy =
    completedTests > 0
      ? Math.round(completedHistory.reduce((acc, h) => acc + h.accuracy, 0) / completedTests)
      : 0;
  const avgConsistency =
    completedTests > 0
      ? Math.round(
          completedHistory.reduce((acc, h) => acc + (h.consistency || 0), 0) / completedTests,
        )
      : 0;

  // Trend Analysis: Averages for the last 10 successful tests
  const last10 = completedHistory.slice(0, 10);
  const l10Count = last10.length;
  const avgWpm10 =
    l10Count > 0 ? Math.round(last10.reduce((acc, h) => acc + h.wpm, 0) / l10Count) : 0;
  const avgRawWpm10 =
    l10Count > 0 ? Math.round(last10.reduce((acc, h) => acc + (h.rawWpm || 0), 0) / l10Count) : 0;
  const avgAccuracy10 =
    l10Count > 0 ? Math.round(last10.reduce((acc, h) => acc + h.accuracy, 0) / l10Count) : 0;
  const avgConsistency10 =
    l10Count > 0
      ? Math.round(last10.reduce((acc, h) => acc + (h.consistency || 0), 0) / l10Count)
      : 0;

  // Data Map: Tracking Personal Bests for specific Time durations
  const timeRecords: Record<string, { wpm: number; accuracy: number }> = {
    '15': { wpm: 0, accuracy: 0 },
    '30': { wpm: 0, accuracy: 0 },
    '60': { wpm: 0, accuracy: 0 },
    '120': { wpm: 0, accuracy: 0 },
  };

  // Data Map: Tracking Personal Bests for specific Word count modes
  const wordRecords: Record<string, { wpm: number; accuracy: number }> = {
    '10': { wpm: 0, accuracy: 0 },
    '25': { wpm: 0, accuracy: 0 },
    '50': { wpm: 0, accuracy: 0 },
    '100': { wpm: 0, accuracy: 0 },
  };

  // Iterator: Process through history to update specific mode bests
  history.forEach((h) => {
    if (h.mode === 'time') {
      const amtStr = h.amount?.toString() || '';
      if (timeRecords[amtStr] !== undefined && h.wpm > timeRecords[amtStr].wpm) {
        timeRecords[amtStr] = { wpm: h.wpm, accuracy: h.accuracy };
      }
    } else if (h.mode === 'words') {
      const amtStr = h.amount?.toString() || '';
      if (wordRecords[amtStr] !== undefined && h.wpm > wordRecords[amtStr].wpm) {
        wordRecords[amtStr] = { wpm: h.wpm, accuracy: h.accuracy };
      }
    }
  });

  // Visualization Logic: Aggregate every test by date for the progress charts
  const dailyStats: Record<
    string,
    {
      wpm: number[];
      rawWpm: number[];
      accuracy: number[];
      consistency: number[];
      tests: number;
      time: number;
    }
  > = {};

  history.forEach((h) => {
    const dateStr = h.createdAt.toISOString().split('T')[0];
    if (!dailyStats[dateStr]) {
      dailyStats[dateStr] = {
        wpm: [],
        rawWpm: [],
        accuracy: [],
        consistency: [],
        tests: 0,
        time: 0,
      };
    }
    dailyStats[dateStr].wpm.push(h.wpm);
    dailyStats[dateStr].rawWpm.push(h.rawWpm || 0);
    dailyStats[dateStr].accuracy.push(h.accuracy);
    dailyStats[dateStr].consistency.push(h.consistency || 0);
    dailyStats[dateStr].tests += 1;
    dailyStats[dateStr].time += h.duration || 0;
  });

  // Mapper: Convert daily aggregations into final chart data points (max WPM and average accuracy)
  const chartData = Object.keys(dailyStats)
    .sort()
    .map((date) => {
      const s = dailyStats[date];
      const mean = (arr: number[]) =>
        arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
      const max = (arr: number[]) => (arr.length > 0 ? Math.round(Math.max(...arr)) : 0);

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

  // Final Composite Object - The ultimate "Profile API" result
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
