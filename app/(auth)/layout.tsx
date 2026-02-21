"use client";

import { motion } from "framer-motion";
import { useSession } from "@/lib/auth-client";
import { notFound } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = useSession();

  // If session is still loading, show a subtle loader
  if (isPending) {
    return (
      <div className="flex-1 w-full flex flex-col items-center justify-center p-4 min-h-[calc(100vh-280px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary opacity-20" />
      </div>
    );
  }

  // If user is already authenticated, don't show auth pages, show 404 instead
  if (session) {
    notFound();
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center min-h-[calc(100vh-280px)]">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[400px] px-4"
      >
        {children}
      </motion.div>
    </div>
  );
}
