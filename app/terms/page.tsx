'use client';

// Import core UI components and icons
import { FileText } from 'lucide-react';
// Import animation library for smooth content reveals
import { motion } from 'framer-motion';

export default function TermsPage() {
  return (
    // Utilize the specialized PolicyLayout for consistent legal page presentation
    <PolicyLayout title="terms of service" icon={<FileText size={32} />}>
      {/* Define individual legal sections using the PolicySection helper */}
      <PolicySection title="1. acceptance of terms">
        <p>
          by accessing and using quick, you agree to be bound by these terms of service and all
          applicable laws and regulations.
        </p>
      </PolicySection>

      <PolicySection title="2. use license">
        <p>
          quick is an open-source project. the code is available on github under the mit license.
          you are free to use, modify, and distribute the code in accordance with the license.
        </p>
      </PolicySection>

      <PolicySection title="3. disclaimer">
        <p>
          the materials on quick type are provided on an &apos;as is&apos; basis. quick type makes no
          warranties, expressed or implied, and hereby disclaims and negates all other warranties
          including, without limitation, implied warranties or conditions of merchantability,
          fitness for a particular purpose, or non-infringement of intellectual property or other
          violation of rights.
        </p>
      </PolicySection>

      <PolicySection title="4. limitations">
        <p>
          in no event shall quick type or its builders be liable for any damages (including, without
          limitation, damages for loss of data or profit, or due to business interruption) arising
          out of the use or inability to use the materials on quick type.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}

/**
 * Reusable layout for legal and policy documents.
 * Ensures consistent padding, width, animations, and heading styles globally.
 */
export function PolicyLayout({
  children,
  title,
  icon,
}: {
  children: React.ReactNode;
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <main className="flex w-full max-w-[800px] flex-1 flex-col gap-12 px-8 py-12">
      {/* Animated Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6"
      >
        <div className="text-primary flex items-center gap-4">
          {/* Page-specific icon passed from parent */}
          {icon}
          <h1 className="text-4xl font-bold tracking-tighter lowercase">{title}</h1>
        </div>
      </motion.div>

      {/* Content container for all sections */}
      <div className="flex flex-col gap-10">{children}</div>
    </main>
  );
}

/**
 * Helper component for individual legal clauses or sections.
 * Handles the consistent styling of section titles and body text.
 */
export function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4"
    >
      {/* Sub-heading with a visual bullet point */}
      <h2 className="text-foreground flex items-center gap-2 text-xl font-bold lowercase">
        <div className="bg-primary h-1.5 w-1.5 rounded-full" />
        {title}
      </h2>
      {/* Descriptive content with restricted width and increased line height for legibility */}
      <div className="text-secondary ml-4 max-w-[700px] text-sm leading-relaxed opacity-60">
        {children}
      </div>
    </motion.section>
  );
}
