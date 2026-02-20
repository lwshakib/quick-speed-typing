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
  language?: string;
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
      language: data.language,
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
