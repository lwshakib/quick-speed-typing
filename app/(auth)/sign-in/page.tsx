'use client';

// Import core React hooks and authentication client
import { useState } from 'react';
import { signIn } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
// Import UI components from the system library
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Import icons to enrich the visual language
import { Mail, Lock, Loader2, ChevronRight } from 'lucide-react';
// Import navigation and toast utilities
import { toast } from 'sonner';
import Link from 'next/link';

export default function SignInPage() {
  // Local state to track loading indicators for specific actions and form inputs
  const [loading, setLoading] = useState<'signIn' | 'google' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  // Helper boolean to determine if any async operation is in progress
  const isLoading = loading !== null;

  // Handler for standard Email/Password authentication
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading('signIn');
    try {
      // Dispatch sign-in request to the authentication provider
      await signIn.email(
        {
          email,
          password,
          callbackURL: '/', // Where to redirect upon successful authentication
        },
        {
          onSuccess: () => {
            toast.success('Signed in successfully!');
            router.push('/'); // Navigate to the homepage
            router.refresh(); // Refresh the page to update the session state globally
          },
          onError: (ctx: { error: { message?: string } }) => {
            // Display descriptive error messages from the server
            toast.error(ctx.error.message || 'Failed to sign in');
          },
        },
      );
    } catch {
      toast.error('Something went wrong');
    } finally {
      // Clear the loading state
      setLoading(null);
    }
  };

  // Handler for social authentication via Google
  const handleGoogleSignIn = async () => {
    setLoading('google');
    try {
      // Trigger the browser redirect for Google OAuth
      await signIn.social({
        provider: 'google',
        callbackURL: '/',
      });
    } catch {
      toast.error('Failed to sign in with Google');
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section with welcoming text */}
      <div className="space-y-2 text-center">
        <h1
          className="text-3xl font-black tracking-tighter lowercase"
          style={{ color: 'var(--text-color)' }}
        >
          welcome back
        </h1>
        <p className="text-sm lowercase opacity-60">Sign in to save your typing progress.</p>
      </div>

      {/* Main Email/Password authentication form */}
      <form onSubmit={handleSignIn} className="space-y-4">
        {/* Email input group */}
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

        {/* Password input group with password recovery link */}
        <div className="space-y-2">
          <div className="ml-1 flex items-center justify-between">
            <Label
              htmlFor="password"
              className="text-[10px] font-black tracking-widest uppercase opacity-40"
            >
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-primary text-[10px] font-black tracking-widest uppercase hover:underline"
            >
              forgot?
            </Link>
          </div>
          <div className="group relative">
            {/* Visual indicator for password field */}
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

        {/* Submission button with loading state */}
        <Button
          type="submit"
          className="mt-2 h-12 w-full border-none text-xs font-black tracking-widest uppercase transition-all hover:opacity-90"
          style={{ backgroundColor: 'var(--main-color)', color: 'var(--bg-color)' }}
          disabled={isLoading}
        >
          {loading === 'signIn' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          sign in
        </Button>
      </form>

      {/* Visual separator for social authentication options */}
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

      {/* Google social authentication button */}
      <Button
        type="button"
        variant="outline"
        className="hover:bg-main/5 group h-12 w-full border-2 font-black tracking-widest uppercase transition-all"
        style={{ borderColor: 'var(--sub-color)', color: 'var(--sub-color)', opacity: 0.8 }}
        // Dynamic hover effects to match the app's premium theme
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
        disabled={isLoading}
      >
        {loading === 'google' ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
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
        )}
        google
      </Button>

      {/* Navigation footer for users who need to create a new account */}
      <div className="pt-4 text-center">
        <span className="text-xs lowercase opacity-60">no account? </span>
        <Link href="/sign-up" className="text-primary text-xs font-black lowercase hover:underline">
          create one <ChevronRight className="inline-block h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
