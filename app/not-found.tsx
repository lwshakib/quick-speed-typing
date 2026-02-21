'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Keyboard, Home, ArrowLeft, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center p-4 min-h-[calc(100vh-280px)]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center space-y-8"
      >
        {/* Animated Icon */}
        <div className="relative">
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, -10, 0],
              y: [0, -5, 5, -5, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center"
          >
            <SearchX size={48} className="text-primary" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -top-2 -right-2 bg-background border-2 border-primary/20 rounded-full p-2"
          >
             <Keyboard size={16} className="text-primary" />
          </motion.div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl font-black lowercase tracking-tighter"
            style={{ color: 'var(--text-color)' }}
          >
            404
          </motion.h1>
          <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold lowercase opacity-80 mb-2">page not found</h2>
            <p className="text-sm lowercase opacity-40 max-w-xs mx-auto leading-relaxed">
              the page you're looking for doesn't exist or has been moved to another location.
            </p>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 pt-4 w-full max-w-sm"
        >
          <Link href="/" className="flex-1">
            <Button 
              className="w-full h-12 font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all border-none"
              style={{ backgroundColor: 'var(--main-color)', color: 'var(--bg-color)' }}
            >
              <Home size={16} className="mr-2" /> back to home
            </Button>
          </Link>
          <Button 
            variant="outline"
            onClick={() => window.history.back()}
            className="flex-1 h-12 border-2 font-black uppercase tracking-widest hover:bg-secondary/5 transition-all"
            style={{ borderColor: 'var(--sub-color)', color: 'var(--sub-color)' }}
          >
            <ArrowLeft size={16} className="mr-2" /> go back
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
