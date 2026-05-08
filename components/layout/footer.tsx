'use client';

// Import animation library for handling visibility states
import { motion } from 'framer-motion';
// Import a set of icons for navigational and informative links
import {
  Mail,
  Heart,
  Github,
  MessageCircle,
  Twitter,
  FileText,
  Shield,
  Lock,
  Palette,
} from 'lucide-react';
// Import a custom helper component for rendering links with icons consistently
import { LinkWithIcon } from '@/components/common/link-with-icon';
// Import global state to handle reactive UI changes
import { useUiStore } from '@/hooks/use-ui-store';

export function Footer() {
  // Access UI visibility state and theme-related actions
  const { showUi, setIsThemeOpen, currentTheme } = useUiStore();

  return (
    // Animated footer that fades out during active typing (focus mode)
    <motion.footer
      animate={{
        opacity: showUi ? 0.6 : 0,
        pointerEvents: showUi ? 'auto' : 'none',
      }}
      transition={{ duration: 0.5 }}
      className="flex w-full max-w-[1440px] flex-col items-center justify-between gap-6 px-8 py-10 text-[10px] font-bold transition-opacity duration-700 select-none hover:opacity-100 md:flex-row"
    >
      {/* Left side: Navigation links for support, social, and legal information */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:justify-start">
        <LinkWithIcon href="/contact" icon={<Mail size={12} />} text="contact" />
        <LinkWithIcon href="/support" icon={<Heart size={12} />} text="support" />
        <LinkWithIcon
          href="https://github.com"
          icon={<Github size={12} />}
          text="github"
          isExternal
        />
        <LinkWithIcon
          href="https://discord.com"
          icon={<MessageCircle size={12} />}
          text="discord"
          isExternal
        />
        <LinkWithIcon
          href="https://twitter.com"
          icon={<Twitter size={12} />}
          text="twitter"
          isExternal
        />
        <LinkWithIcon href="/terms" icon={<FileText size={12} />} text="terms" />
        <LinkWithIcon href="/security" icon={<Shield size={12} />} text="security" />
        <LinkWithIcon href="/privacy" icon={<Lock size={12} />} text="privacy" />
      </div>

      {/* Right side: Quick theme access and versioning info */}
      <div className="flex items-center gap-8">
        {/* Theme indicator/button to quickly open theme settings */}
        <span
          className="hover:text-foreground group flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 transition-colors duration-300 hover:bg-white/5"
          onClick={() => setIsThemeOpen(true)}
        >
          <Palette
            size={14}
            className="text-primary transition-transform duration-500 group-hover:rotate-180"
          />
          {currentTheme.name}
        </span>
        {/* Visual versioning string for internal tracking and debugging */}
        <span className="font-light opacity-50">
          v{currentTheme.id === 'serika-dark' ? '26.6.0' : 'theme.' + currentTheme.id}
        </span>
      </div>
    </motion.footer>
  );
}
