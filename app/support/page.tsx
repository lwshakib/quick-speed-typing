'use client';

// Import visual identifiers and UI primitives
// Import icons representing gratitude and specific support actions
import { Heart, Coffee, Star, Shield } from 'lucide-react';
// Import animation library for engaging UI transitions
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
// Import utility for conditional class merging
import { cn } from '@/lib/utils';

export default function SupportPage() {
  return (
    // Main container for the support page, using a vertical layout with generous spacing
    <main className="flex w-full max-w-[800px] flex-1 flex-col gap-16 px-8 py-12">
      {/* Header section with page title and emotional hook */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-6 text-center"
      >
        <div className="text-primary flex items-center gap-4">
          <Heart size={32} />
          <h1 className="text-4xl font-bold tracking-tighter lowercase">support</h1>
        </div>
        <p className="max-w-[500px] text-lg opacity-80">
          Quick Type is a passion project and is completely free to use. If you love the app and
          want to help us keep it running, consider supporting us.
        </p>
      </motion.div>

      {/* Grid of primary support options (monetary and social) */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Donation option */}
        <SupportOption
          icon={<Coffee size={24} />}
          title="Buy us a coffee"
          description="A small, one-time donation to help with server costs and development."
          href="https://ko-fi.com"
          price="$5"
        />
        {/* Free growth option */}
        <SupportOption
          icon={<Star size={24} />}
          title="GitHub Star"
          description="Showing your support by starring the project on GitHub helps us grow."
          href="https://github.com"
          price="Free"
          isPrimary
        />
      </div>

      {/* Impact section: Explaining the value of supporting the project */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} // Subtle zoom-in effect
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-primary/5 border-primary/20 flex flex-col items-center gap-6 rounded-2xl border p-10 text-center"
      >
        <div className="flex flex-col gap-2">
          <h2 className="text-foreground text-2xl font-bold lowercase">Why support us?</h2>
          <p className="max-w-[400px] text-sm opacity-60">
            Your support allows us to focus on new features, improve performance, and keep the user
            experience completely ad-free.
          </p>
        </div>

        {/* Horizontal list of key benefits for the community */}
        <div className="mt-4 flex flex-wrap justify-center gap-8">
          <WhyCard icon={<Shield size={18} />} text="No Ads Forever" />
          <WhyCard icon={<Star size={18} />} text="Fast Feature Delivery" />
          <WhyCard icon={<Heart size={18} />} text="Community Focused" />
        </div>
      </motion.div>
    </main>
  );
}

// Interactive card for a specific support method
function SupportOption({
  icon,
  title,
  description,
  href,
  price,
  isPrimary = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  price: string;
  isPrimary?: boolean;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      whileHover={{ y: -5 }} // Elevate card on hover for better affordance
      className={cn(
        'flex flex-col gap-6 rounded-2xl border p-8 transition-all',
        // Primary options get more visual prominence
        isPrimary
          ? 'bg-primary/10 border-primary/30'
          : 'bg-secondary/5 border-secondary/10 hover:border-secondary/20',
      )}
    >
      <div className="flex items-start justify-between">
        <div
          className={cn(
            'rounded-lg p-3',
            isPrimary ? 'bg-primary text-background' : 'bg-secondary/10 text-primary',
          )}
        >
          {icon}
        </div>
        {/* Price tag for clarity */}
        <span className="text-sm font-black tracking-widest uppercase opacity-40">{price}</span>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-foreground text-xl font-bold lowercase">{title}</h3>
        <p className="text-sm leading-relaxed opacity-60">{description}</p>
      </div>
      {/* CTA Button within the card */}
      <Button
        className={cn(
          'mt-2 w-full font-bold',
          isPrimary
            ? 'bg-primary text-background hover:bg-primary/90'
            : 'bg-secondary/10 hover:bg-secondary/20 text-foreground',
        )}
      >
        Support Now
      </Button>
    </motion.a>
  );
}

// Small badge used to list reasons for support
function WhyCard({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="text-secondary flex items-center gap-2 text-xs font-bold opacity-80">
      <div className="text-primary">{icon}</div>
      <span>{text}</span>
    </div>
  );
}
