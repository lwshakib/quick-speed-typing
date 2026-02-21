"use client";

// Import animation and authentication hooks
import { motion } from "framer-motion";
import { useSession } from "@/lib/auth-client";
// Import navigation utility for handling unauthorized access redirections
import { notFound } from "next/navigation";
// Import loading icon
import { Loader2 } from "lucide-react";

// Layout component specifically for authentication pages (Login, Signup, etc.)
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check the current user session status
  const { data: session, isPending } = useSession();

  // If the session state is still being determined, display a central loading spinner
  if (isPending) {
    return (
      <div className="flex-1 w-full flex flex-col items-center justify-center p-4 min-h-[calc(100vh-280px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary opacity-20" />
      </div>
    );
  }

  // Security: If a user is already logged in and tries to access an auth page, redirect them or show 404
  if (session) {
    notFound();
  }

  // Render the authentication page content with a slide-up animation for a premium feel
  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center min-h-[calc(100vh-280px)]">
      <motion.div
        initial={{ opacity: 0, y: 10 }} // Start slightly below and transparent
        animate={{ opacity: 1, y: 0 }}   // Animate to full opacity and original position
        transition={{ duration: 0.4 }}  // Smooth transition duration
        className="w-full max-w-[400px] px-4"
      >
        {children}
      </motion.div>
    </div>
  );
}
