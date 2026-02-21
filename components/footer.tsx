"use client";

import { motion } from "framer-motion";
import { 
    Mail, 
    Heart, 
    Github, 
    MessageCircle, 
    Twitter, 
    FileText, 
    Shield, 
    Lock,
    Palette
} from "lucide-react";
import { LinkWithIcon } from "@/components/link-with-icon";
import { useUiStore } from "@/hooks/use-ui-store";

export function Footer() {
    const { 
        showUi, 
        setIsThemeOpen,
        currentTheme
    } = useUiStore();

    return (
        <motion.footer 
            animate={{ 
                opacity: showUi ? 0.6 : 0, 
                pointerEvents: showUi ? 'auto' : 'none'
            }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[1250px] px-8 py-10 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold select-none hover:opacity-100 transition-opacity duration-700 gap-6"
        >
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-6">
                <LinkWithIcon href="/contact" icon={<Mail size={12} />} text="contact" />
                <LinkWithIcon href="/support" icon={<Heart size={12} />} text="support" />
                <LinkWithIcon href="https://github.com" icon={<Github size={12} />} text="github" isExternal />
                <LinkWithIcon href="https://discord.com" icon={<MessageCircle size={12} />} text="discord" isExternal />
                <LinkWithIcon href="https://twitter.com" icon={<Twitter size={12} />} text="twitter" isExternal />
                <LinkWithIcon href="/terms" icon={<FileText size={12} />} text="terms" />
                <LinkWithIcon href="/security" icon={<Shield size={12} />} text="security" />
                <LinkWithIcon href="/privacy" icon={<Lock size={12} />} text="privacy" />
            </div>
            <div className="flex items-center gap-8">
                <span 
                    className="hover:text-foreground transition-colors flex items-center gap-2 cursor-pointer group px-2 py-1 rounded-md hover:bg-white/5 transition-all duration-300"
                    onClick={() => setIsThemeOpen(true)}
                >
                    <Palette size={14} className="group-hover:rotate-180 transition-transform duration-500 text-primary" />
                    {currentTheme.name}
                </span>
                <span className="font-light opacity-50">v{currentTheme.id === 'serika-dark' ? '26.6.0' : 'theme.' + currentTheme.id}</span>
            </div>
        </motion.footer>
    );
}
