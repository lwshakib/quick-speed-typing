'use client';

// Import icons representing communication channels and actions
import { ArrowLeft, Mail, MessageCircle, Github, Twitter, Heart, Send } from 'lucide-react';
// Import animation library for dynamic entrances
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  return (
    // Main container for the contact page, centered and responsive
    <main className="flex w-full max-w-[1000px] flex-1 flex-col gap-12 px-8 py-12">
      {/* Header section with page title and introductory text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto flex max-w-[600px] flex-col items-center gap-6 text-center"
      >
        <div className="text-primary flex items-center gap-4">
          <Mail size={32} />
          <h1 className="text-4xl font-bold tracking-tighter lowercase">contact</h1>
        </div>
        <p className="decoration-secondary text-lg opacity-80">
          Have questions, suggestions, or just want to say hi? Reach out to us through any of the
          channels below.
        </p>
      </motion.div>

      {/* Two-column layout for Form and Social links */}
      <div className="mt-4 grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left Column: Interactive Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-secondary/5 border-secondary/10 flex flex-col gap-6 rounded-xl border p-8"
        >
          <div className="flex flex-col gap-2">
            <h2 className="text-foreground text-xl font-bold lowercase">send a message</h2>
            <p className="text-xs opacity-60">we&apos;ll get back to you as soon as possible.</p>
          </div>

          {/* Form fields with custom styling mirroring the overall theme */}
          <div className="flex flex-col gap-4">
            {/* Name field */}
            <div className="flex flex-col gap-1.5">
              <label className="ml-1 text-[10px] font-black uppercase opacity-40">name</label>
              <input
                type="text"
                className="bg-background border-secondary/20 focus:border-primary text-foreground h-12 rounded-lg border px-4 transition-colors focus:outline-none"
                placeholder="John Doe"
              />
            </div>
            {/* Email field */}
            <div className="flex flex-col gap-1.5">
              <label className="ml-1 text-[10px] font-black uppercase opacity-40">email</label>
              <input
                type="email"
                className="bg-background border-secondary/20 focus:border-primary text-foreground h-12 rounded-lg border px-4 transition-colors focus:outline-none"
                placeholder="john@example.com"
              />
            </div>
            {/* Message textarea */}
            <div className="flex flex-col gap-1.5">
              <label className="ml-1 text-[10px] font-black uppercase opacity-40">message</label>
              <textarea
                className="bg-background border-secondary/20 focus:border-primary text-foreground min-h-[120px] resize-none rounded-lg border p-4 transition-colors focus:outline-none"
                placeholder="Your message here..."
              />
            </div>
          </div>

          {/* Submit button with micro-animation on hover */}
          <Button className="bg-primary text-background hover:bg-primary/90 group flex h-12 w-full items-center gap-2 rounded-lg font-bold">
            <Send
              size={18}
              className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
            />
            <span>Send Message</span>
          </Button>
        </motion.div>

        {/* Right Column: Social Media Links & direct contact info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-8 py-4"
        >
          {/* Grouped social interaction cards */}
          <div className="flex flex-col gap-6">
            <h2 className="text-foreground text-xl font-bold lowercase">our channels</h2>
            <div className="flex flex-col gap-4">
              {/* Individual social links */}
              <SocialCard
                icon={<MessageCircle size={20} />}
                title="discord"
                value="join our community"
                href="https://discord.com"
              />
              <SocialCard
                icon={<Twitter size={20} />}
                title="twitter"
                value="@quick_typing"
                href="https://twitter.com"
              />
              <SocialCard
                icon={<Github size={20} />}
                title="github"
                value="lwshakib/quick-speed-typing"
                href="https://github.com"
              />
              <SocialCard
                icon={<Heart size={20} />}
                title="support"
                value="buy us a coffee"
                href="/support"
              />
            </div>
          </div>

          {/* Static direct email contact card */}
          <div className="bg-primary/5 border-primary/20 flex items-start gap-4 rounded-xl border p-6">
            <div className="text-primary mt-1">
              <Mail size={24} />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-foreground font-bold lowercase">direct email</h3>
              <p className="text-sm opacity-60">contact@quicktyping.io</p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

// Reusable SocialCard component for consistent presentation of external links
function SocialCard({
  icon,
  title,
  value,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : '_self'}
      className="bg-secondary/5 border-secondary/10 hover:border-primary/40 group flex items-center justify-between rounded-lg border p-4 transition-all"
    >
      <div className="flex items-center gap-4">
        {/* Visual icon for the channel */}
        <div className="text-secondary group-hover:text-primary opacity-60 transition-all group-hover:opacity-100">
          {icon}
        </div>
        {/* Channel details */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-black uppercase opacity-30">{title}</span>
          <span className="text-foreground group-hover:text-primary font-bold transition-colors">
            {value}
          </span>
        </div>
      </div>
      {/* Hover indicator arrow */}
      <ArrowLeft
        size={16}
        className="rotate-180 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
      />
    </a>
  );
}
