'use client';

// Import core React hooks and authentication utilities
import { useState } from 'react';
import { requestPasswordReset } from '@/lib/auth-client';
// Import UI components from the system library
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Import iconic metaphors for the UI
import { Mail, Loader2, ChevronRight } from 'lucide-react';
// Import feedback and navigation tools
import { toast } from 'sonner';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  // State management for form submission and success feedback
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Triggered when the user submits the email for password recovery
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Dispatch a password reset request via the auth client
      await requestPasswordReset(
        {
          email,
          redirectTo: '/reset-password', // Redirect target after recovery link is clicked
        },
        {
          onSuccess: () => {
            setIsSuccess(true);
            toast.success('Password reset email sent!');
          },
          onError: (ctx: { error: { message?: string } }) => {
            // Provide granular error feedback from the authentication server
            toast.error(ctx.error.message || 'Failed to send reset email');
          },
        },
      );
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Render the success state after the email has been dispatched
  if (isSuccess) {
    return (
      <div className="space-y-6 py-4 text-center">
        {/* Animated icon container */}
        <div className="bg-primary/10 animate-in zoom-in mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full duration-500">
          <Mail className="h-10 w-10" style={{ color: 'var(--main-color)' }} />
        </div>

        {/* Success message heading and description */}
        <div className="space-y-2">
          <h2
            className="text-2xl font-black tracking-tighter lowercase"
            style={{ color: 'var(--text-color)' }}
          >
            email sent
          </h2>
          <p className="text-sm lowercase opacity-60">
            We have sent a reset link. You have to check your email to get it.
          </p>
        </div>

        {/* Action buttons to help the user proceed after sending the email */}
        <div className="flex flex-col gap-3 pt-4">
          <Button
            onClick={() => window.open('https://mail.google.com', '_blank')}
            className="h-12 w-full border-none text-xs font-black tracking-widest uppercase transition-all hover:opacity-90"
            style={{ backgroundColor: 'var(--main-color)', color: 'var(--bg-color)' }}
          >
            go to gmail <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
          <Link href="/sign-in" className="w-full">
            <Button
              variant="outline"
              className="hover:bg-main/5 h-12 w-full border-2 font-black tracking-widest uppercase transition-all"
              style={{ borderColor: 'var(--sub-color)', color: 'var(--sub-color)' }}
              // Interactive hover styles for the outline button
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--main-color)';
                e.currentTarget.style.color = 'var(--main-color)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--sub-color)';
                e.currentTarget.style.color = 'var(--sub-color)';
              }}
            >
              back to sign in
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Render the initial request form
  return (
    <div className="space-y-6">
      {/* Form header and context */}
      <div className="relative space-y-2 text-center">
        <h1
          className="text-3xl font-black tracking-tighter lowercase"
          style={{ color: 'var(--text-color)' }}
        >
          forgot password?
        </h1>
        <p className="text-sm lowercase opacity-60">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      {/* Main interaction form */}
      <form onSubmit={handleForgotPassword} className="space-y-4 pt-2">
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="ml-1 text-[10px] font-black tracking-widest uppercase opacity-40"
          >
            Email
          </Label>
          <div className="group relative">
            {/* Visual indicator for email field */}
            <Mail className="text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transition-colors" />
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              className="bg-secondary/5 focus:border-primary/20 h-12 border-2 border-transparent pl-9 font-mono text-sm transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Submission button with loading state */}
        <Button
          type="submit"
          className="mt-4 h-12 w-full border-none text-xs font-black tracking-widest uppercase transition-all hover:opacity-90"
          style={{ backgroundColor: 'var(--main-color)', color: 'var(--bg-color)' }}
          disabled={loading}
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          send reset link
        </Button>
      </form>

      {/* Navigation footer for users who remember their credentials */}
      <div className="pt-4 text-center">
        <span className="text-xs lowercase opacity-60">remember your password? </span>
        <Link href="/sign-in" className="text-primary text-xs font-black lowercase hover:underline">
          go back <ChevronRight className="inline-block h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
