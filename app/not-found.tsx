'use client';

// Import navigation and core React components
import Link from 'next/link';
// Import animation library for a playful error state
import { motion } from 'framer-motion';
// Import custom icons to reinforce the typing theme and navigation
import { Keyboard, Home, ArrowLeft, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    // Centered container with dynamic height adjustment for the viewport
    <div className="flex min-h-[calc(100vh-280px)] w-full flex-1 flex-col items-center justify-center p-4">
      {/* Container for the animated 404 block */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} // Entrance animation starts slightly smaller
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center space-y-8 text-center"
      >
        {/* Visual Brand Block: Represents the 'lost' state with a playful keyboard overlay */}
        <div className="relative">
          {/* Main oscillating icon block */}
          <motion.div
            animate={{
              rotate: [0, -10, 10, -10, 0], // Continuous slight rotation
              y: [0, -5, 5, -5, 0], // Gentle floating movement
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="bg-primary/10 flex h-24 w-24 items-center justify-center rounded-3xl"
          >
            <SearchX size={48} className="text-primary" />
          </motion.div>

          {/* Static thematic icon badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-background border-primary/20 absolute -top-2 -right-2 rounded-full border-2 p-2"
          >
            <Keyboard size={16} className="text-primary" />
          </motion.div>
        </div>

        {/* Textual feedback: Clearly communicates the error and recovery path */}
        <div className="space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl font-black tracking-tighter lowercase"
            style={{ color: 'var(--text-color)' }}
          >
            404
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="mb-2 text-2xl font-bold lowercase opacity-80">page not found</h2>
            <p className="mx-auto max-w-xs text-sm leading-relaxed lowercase opacity-40">
              the page you&apos;re looking for doesn&apos;t exist or has been moved to another
              location.
            </p>
          </motion.div>
        </div>

        {/* User Recovery actions: Buttons to return to safe locations */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex w-full max-w-sm flex-col gap-4 pt-4 sm:flex-row"
        >
          {/* Navigation to homepage */}
          <Link href="/" className="flex-1">
            <Button
              className="h-12 w-full border-none text-xs font-black tracking-widest uppercase transition-all hover:opacity-90"
              style={{ backgroundColor: 'var(--main-color)', color: 'var(--bg-color)' }}
            >
              <Home size={16} className="mr-2" /> back to home
            </Button>
          </Link>

          {/* Programmatic 'Go Back' action */}
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="hover:bg-secondary/5 h-12 flex-1 border-2 font-black tracking-widest uppercase transition-all"
            style={{ borderColor: 'var(--sub-color)', color: 'var(--sub-color)' }}
          >
            <ArrowLeft size={16} className="mr-2" /> go back
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
