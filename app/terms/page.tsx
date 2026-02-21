'use client';

import { Logo } from "@/components/logo";
import { ArrowLeft, FileText, Shield, Lock, Scale } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <PolicyLayout title="terms of service" icon={<FileText size={32} />}>
        <PolicySection title="1. acceptance of terms">
            <p>by accessing and using quick, you agree to be bound by these terms of service and all applicable laws and regulations.</p>
        </PolicySection>

        <PolicySection title="2. use license">
            <p>quick is an open-source project. the code is available on github under the mit license. you are free to use, modify, and distribute the code in accordance with the license.</p>
        </PolicySection>

        <PolicySection title="3. disclaimer">
            <p>the materials on quick type are provided on an 'as is' basis. quick type makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
        </PolicySection>

        <PolicySection title="4. limitations">
            <p>in no event shall quick type or its builders be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on quick type.</p>
        </PolicySection>
    </PolicyLayout>
  );
}

export function PolicyLayout({ children, title, icon }: { children: React.ReactNode, title: string, icon: React.ReactNode }) {
    return (
        <main className="flex-1 w-full max-w-[800px] px-8 py-12 flex flex-col gap-12">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-6"
            >
                <div className="flex items-center gap-4 text-primary">
                    {icon}
                    <h1 className="text-4xl font-bold lowercase tracking-tighter">{title}</h1>
                </div>
            </motion.div>

            <div className="flex flex-col gap-10">
                {children}
            </div>
        </main>
    );
}

export function PolicySection({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <motion.section 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4"
        >
            <h2 className="text-xl font-bold text-foreground lowercase flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                {title}
            </h2>
            <div className="text-sm leading-relaxed text-secondary opacity-60 ml-4 max-w-[700px]">
                {children}
            </div>
        </motion.section>
    );
}
