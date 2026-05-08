'use client';

// Import core React functionality and authentication actions
import { useEffect, useState } from 'react';
import { signUp, signIn } from '@/lib/auth-client';
// Import UI design system components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Import descriptive icons
import { Mail, Lock, User, Loader2, ChevronRight } from 'lucide-react';
// Import feedback and navigation utilities
import { toast } from 'sonner';
import Link from 'next/link';

export default function SignUpPage() {
  // State management for form processing, user inputs, and submission success
  const [loading, setLoading] = useState<'signUp' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const successKey = 'quicktype:signup:successEmail';

  useEffect(() => {
    try {
      const storedEmail = sessionStorage.getItem(successKey);
      if (storedEmail) {
        const handle = requestAnimationFrame(() => {
          setEmail(storedEmail);
          setIsSuccess(true);
        });
        return () => cancelAnimationFrame(handle);
      }
    } catch {
      // Ignore storage access issues (e.g. restricted environments)
    }
  }, []);

  // Handler for creating a new account via Email and Password
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading('signUp');
    try {
      // Dispatch registration request to the authentication provider
      await signUp.email(
        {
          email,
          password,
          name,
          callbackURL: '/sign-in', // Target redirect after verification
        },
        {
          onSuccess: () => {
            setIsSuccess(true);
            try {
              sessionStorage.setItem(successKey, email);
            } catch {
              // Ignore storage access issues (e.g. restricted environments)
            }
            toast.success('Account created! Please verify your email.');
          },
          onError: (ctx: { error: { message?: string } }) => {
            // Provide granular feedback on registration failures
            toast.error(ctx.error.message || 'Failed to create account');
          },
        },
      );
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(null);
    }
  };

  // Handler for quick registration/sign-in via Google social auth
  const handleGoogleSignIn = async () => {
    setLoading('signUp'); // Track loading state during redirect
    try {
      await signIn.social({
        provider: 'google',
        callbackURL: '/',
      });
    } catch {
      toast.error('Failed to sign in with Google');
      setLoading(null);
    }
  };

  // State: Render a success message and verification instructions
  if (isSuccess) {
    return (
      <div className="space-y-6 py-4 text-center">
        {/* Animated verification icon */}
        <div className="bg-primary/10 animate-in zoom-in mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full duration-500">
          <Mail className="h-10 w-10" style={{ color: 'var(--main-color)' }} />
        </div>
        <div className="space-y-2">
          <h2
            className="text-2xl font-black tracking-tighter lowercase"
            style={{ color: 'var(--text-color)' }}
          >
            check your email
          </h2>
          <p className="text-sm lowercase opacity-60">
            We&apos;ve sent a link to <span className="text-foreground font-bold">{email}</span> to
            verify your account. Without email verification, you cannot sign in.
          </p>
        </div>

        {/* Post-registration action buttons */}
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
              // Hover micro-interactions
              onClick={() => {
                try {
                  sessionStorage.removeItem(successKey);
                } catch {
                  // Ignore storage access issues (e.g. restricted environments)
                }
              }}
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

  // Primary State: Render the registration form
  return (
    <div className="space-y-6">
      {/* Header section explaining the benefit of joining */}
      <div className="space-y-2 text-center">
        <h1
          className="text-3xl font-black tracking-tighter lowercase"
          style={{ color: 'var(--text-color)' }}
        >
          create account
        </h1>
        <p className="text-sm lowercase opacity-60">Join us to track your typing evolution.</p>
      </div>

      {/* Main registration form */}
      <form onSubmit={handleSignUp} className="space-y-4">
        {/* Full Name input field */}
        <div className="space-y-2">
          <Label
            htmlFor="name"
            className="ml-1 text-[10px] font-black tracking-widest uppercase opacity-40"
          >
            Full Name
          </Label>
          <div className="group relative">
            <User className="text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transition-colors" />
            <Input
              id="name"
              placeholder="John Doe"
              type="text"
              className="bg-secondary/5 focus:border-primary/20 h-12 border-2 border-transparent pl-9 font-mono text-sm transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Email Address input field */}
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="ml-1 text-[10px] font-black tracking-widest uppercase opacity-40"
          >
            Email
          </Label>
          <div className="group relative">
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

        {/* Secure Password input field */}
        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="ml-1 text-[10px] font-black tracking-widest uppercase opacity-40"
          >
            Password
          </Label>
          <div className="group relative">
            <Lock className="text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transition-colors" />
            <Input
              id="password"
              type="password"
              className="bg-secondary/5 focus:border-primary/20 h-12 border-2 border-transparent pl-9 font-mono text-sm transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Submit button with loading feedback */}
        <Button
          type="submit"
          className="mt-4 h-12 w-full border-none text-xs font-black tracking-widest uppercase transition-all hover:opacity-90"
          style={{ backgroundColor: 'var(--main-color)', color: 'var(--bg-color)' }}
          disabled={loading !== null}
        >
          {loading === 'signUp' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          create account
        </Button>
      </form>

      {/* Social login option separator */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span
            className="w-full border-t"
            style={{ borderColor: 'var(--sub-color)', opacity: 0.1 }}
          />
        </div>
        <div className="text-muted-foreground/50 relative flex justify-center text-[10px] font-black tracking-widest uppercase">
          <span
            className="bg-background px-4"
            style={{ backgroundColor: 'var(--bg-color)', color: 'var(--sub-color)' }}
          >
            Or continue with
          </span>
        </div>
      </div>

      {/* Google OAuth alternative */}
      <Button
        type="button"
        variant="outline"
        className="hover:bg-main/5 group h-12 w-full border-2 font-black tracking-widest uppercase transition-all"
        style={{ borderColor: 'var(--sub-color)', color: 'var(--sub-color)', opacity: 0.8 }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--main-color)';
          e.currentTarget.style.color = 'var(--main-color)';
          e.currentTarget.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--sub-color)';
          e.currentTarget.style.color = 'var(--sub-color)';
          e.currentTarget.style.opacity = '0.8';
        }}
        onClick={handleGoogleSignIn}
        disabled={loading !== null}
      >
        <svg
          className="mr-2 h-4 w-4 transition-colors"
          aria-hidden="true"
          focusable="false"
          data-prefix="fab"
          data-icon="google"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 488 512"
        >
          <path
            fill="currentColor"
            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
          ></path>
        </svg>
        google
      </Button>

      {/* Navigation link for existing users */}
      <div className="pt-4 text-center">
        <span className="text-xs lowercase opacity-60">already have an account? </span>
        <Link
          href="/sign-in"
          className="text-primary text-xs font-black lowercase hover:underline"
          style={{ color: 'var(--main-color)' }}
        >
          sign in <ChevronRight className="inline-block h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
