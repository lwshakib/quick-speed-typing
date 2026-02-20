'use client';

import { Logo } from "@/components/logo";
import { ArrowLeft, Mail, MessageCircle, Github, Twitter, Heart, Send } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-secondary font-mono selection:bg-primary/30 selection:text-primary transition-colors duration-300 flex flex-col items-center overflow-x-hidden">
      <header className="w-full max-w-[1250px] px-8 py-8 flex justify-between items-center z-50">
        <Link href="/">
          <Logo iconSize={32} textSize="1.5rem" className="text-foreground hover:opacity-80 transition-opacity" />
        </Link>
      </header>

      <main className="flex-1 w-full max-w-[1000px] px-8 py-12 flex flex-col gap-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6 items-center text-center max-w-[600px] mx-auto"
        >
          <div className="flex items-center gap-4 text-primary">
            <Mail size={32} />
            <h1 className="text-4xl font-bold lowercase tracking-tighter">contact</h1>
          </div>
          <p className="text-lg opacity-80 decoration-secondary">
             Have questions, suggestions, or just want to say hi? Reach out to us through any of the channels below.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            {/* Contact Form Placeholder */}
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.1 }}
               className="bg-secondary/5 p-8 rounded-xl border border-secondary/10 flex flex-col gap-6"
            >
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-bold text-foreground lowercase">send a message</h2>
                    <p className="text-xs opacity-60">we'll get back to you as soon as possible.</p>
                </div>
                
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-black opacity-40 ml-1">name</label>
                        <input type="text" className="bg-background border border-secondary/20 rounded-lg h-12 px-4 focus:outline-none focus:border-primary transition-colors text-foreground" placeholder="John Doe" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-black opacity-40 ml-1">email</label>
                        <input type="email" className="bg-background border border-secondary/20 rounded-lg h-12 px-4 focus:outline-none focus:border-primary transition-colors text-foreground" placeholder="john@example.com" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-black opacity-40 ml-1">message</label>
                        <textarea className="bg-background border border-secondary/20 rounded-lg min-h-[120px] p-4 focus:outline-none focus:border-primary transition-colors text-foreground resize-none" placeholder="Your message here..." />
                    </div>
                </div>

                <Button className="w-full h-12 bg-primary text-background hover:bg-primary/90 rounded-lg font-bold flex items-center gap-2 group">
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    <span>Send Message</span>
                </Button>
            </motion.div>

            {/* Social Links & Info */}
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.2 }}
               className="flex flex-col gap-8 py-4"
            >
                <div className="flex flex-col gap-6">
                    <h2 className="text-xl font-bold text-foreground lowercase">our channels</h2>
                    <div className="flex flex-col gap-4">
                        <SocialCard icon={<MessageCircle size={20} />} title="discord" value="join our community" href="https://discord.com" />
                        <SocialCard icon={<Twitter size={20} />} title="twitter" value="@quick_typing" href="https://twitter.com" />
                        <SocialCard icon={<Github size={20} />} title="github" value="lwshakib/quick-speed-typing" href="https://github.com" />
                        <SocialCard icon={<Heart size={20} />} title="support" value="buy us a coffee" href="/support" />
                    </div>
                </div>

                <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 flex items-start gap-4">
                    <div className="text-primary mt-1"><Mail size={24} /></div>
                    <div className="flex flex-col gap-1">
                        <h3 className="font-bold text-foreground lowercase">direct email</h3>
                        <p className="text-sm opacity-60">contact@quicktyping.io</p>
                    </div>
                </div>
            </motion.div>
        </div>

        <div className="mt-8 flex justify-center">
          <Link href="/" className="flex items-center gap-2 text-secondary hover:text-primary transition-colors font-bold group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>back to home</span>
          </Link>
        </div>
      </main>
    </div>
  );
}

function SocialCard({ icon, title, value, href }: { icon: React.ReactNode, title: string, value: string, href: string }) {
    return (
        <a 
            href={href} 
            target={href.startsWith('http') ? "_blank" : "_self"}
            className="flex items-center justify-between p-4 bg-secondary/5 rounded-lg border border-secondary/10 hover:border-primary/40 transition-all group"
        >
            <div className="flex items-center gap-4">
                <div className="text-secondary opacity-60 group-hover:text-primary group-hover:opacity-100 transition-all">{icon}</div>
                <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase font-black opacity-30">{title}</span>
                    <span className="font-bold text-foreground group-hover:text-primary transition-colors">{value}</span>
                </div>
            </div>
            <ArrowLeft size={16} className="rotate-180 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </a>
    );
}
