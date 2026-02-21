'use client';

import { Logo } from "@/components/logo";
import { LinkWithIcon } from "@/components/link-with-icon";
import { 
  ArrowLeft, 
  Info, 
  Shield, 
  Lock, 
  Mail, 
  Github, 
  Heart, 
  Keyboard, 
  Palette, 
  History 
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <main className="flex-1 w-full max-w-[800px] px-8 py-12 flex flex-col gap-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6"
      >
        <div className="flex items-center gap-4 text-primary">
          <Info size={32} />
          <h1 className="text-4xl font-bold lowercase tracking-tighter">about</h1>
        </div>
        
        <div className="flex flex-col gap-4 text-lg leading-relaxed text-secondary opacity-80">
          <p>
            <span className="text-primary font-bold">quick type</span> is a minimalist, customizable typing website, inspired by monkeytype. It's designed to provide a distraction-free typing experience while providing detailed analytics and progress tracking.
          </p>
          <p>
            Whether you're a competitive typist looking to break your personal records or a beginner wanting to improve your speed and accuracy, quick type provides the tools you need to reach your goals.
          </p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col gap-6"
      >
        <h2 className="text-2xl font-bold text-foreground lowercase tracking-tight">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard 
            icon={<Lock size={20} />}
            title="private"
            description="no tracking or intrusive analytics. your data is yours."
          />
          <FeatureCard 
            icon={<Palette size={20} />}
            title="customizable"
            description="choose from dozens of themes and languages."
          />
          <FeatureCard 
            icon={<History size={20} />}
            title="history"
            description="track your progress with detailed charts and stats."
          />
          <FeatureCard 
            icon={<Keyboard size={20} />}
            title="game modes"
            description="time, words, quote, and zen modes to suit your style."
          />
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col gap-6"
      >
        <h2 className="text-2xl font-bold text-foreground lowercase tracking-tight">credits</h2>
        <p className="text-secondary opacity-80 leading-relaxed">
          Quick was built with ❤️ using Next.js, Tailwind CSS, and Framer Motion. 
          Huge thanks to the <a href="https://monkeytype.com" target="_blank" className="text-primary hover:underline">Monkeytype</a> team for the inspiration and for creating such an incredible community.
        </p>
      </motion.div>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-secondary/5 p-6 rounded-lg border border-secondary/10 hover:border-primary/30 transition-colors flex flex-col gap-3">
      <div className="text-primary">{icon}</div>
      <h3 className="font-bold text-foreground lowercase">{title}</h3>
      <p className="text-sm text-secondary opacity-60">{description}</p>
    </div>
  );
}
