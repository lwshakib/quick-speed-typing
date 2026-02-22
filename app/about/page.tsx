'use client';

// Import visual identifiers and UI helpers
// Import a set of iconic symbols to represent features and navigate
import { Info, Lock, Keyboard, Palette, History } from 'lucide-react';
// Import animation library for smooth transitions
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    // Main container for the about page content, centered and restricted in width for readability
    <main className="flex w-full max-w-[800px] flex-1 flex-col gap-12 px-8 py-12">
      {/* Intro section: Headlines and mission statement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} // Start invisible and lower
        animate={{ opacity: 1, y: 0 }} // Fade in and slide up
        className="flex flex-col gap-6"
      >
        <div className="text-primary flex items-center gap-4">
          <Info size={32} />
          <h1 className="text-4xl font-bold tracking-tighter lowercase">about</h1>
        </div>

        {/* Descriptive text block with emphasis on the brand name */}
        <div className="text-secondary flex flex-col gap-4 text-lg leading-relaxed opacity-80">
          <p>
            <span className="text-primary font-bold">quick type</span> is a minimalist, customizable
            typing website. It&apos;s designed to provide a distraction-free typing experience while
            providing detailed analytics and progress tracking.
          </p>
          <p>
            Whether you&apos;re a competitive typist looking to break your personal records or a
            beginner wanting to improve your speed and accuracy, quick type provides the tools you
            need to reach your goals.
          </p>
        </div>
      </motion.div>

      {/* Features section: Grid displaying the core value propositions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }} // Staggered intro animation
        className="flex flex-col gap-6"
      >
        <h2 className="text-foreground text-2xl font-bold tracking-tight lowercase">Features</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Detailed list of application features using cards */}
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
    </main>
  );
}

// Reusable FeatureCard component to display an icon, title, and description consistently
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-secondary/5 border-secondary/10 hover:border-primary/30 flex flex-col gap-3 rounded-lg border p-6 transition-colors">
      {/* Visual icon for the feature */}
      <div className="text-primary">{icon}</div>
      {/* Feature title */}
      <h3 className="text-foreground font-bold lowercase">{title}</h3>
      {/* Descriptive text explaining the benefit */}
      <p className="text-secondary text-sm opacity-60">{description}</p>
    </div>
  );
}
