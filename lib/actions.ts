"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function saveTypingHistory(data: {
  wpm: number;
  accuracy: number;
  errors: number;
  duration: number;
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
      accuracy: data.accuracy,
      errors: data.errors,
      duration: data.duration,
    },
  });

  revalidatePath("/profile");
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
