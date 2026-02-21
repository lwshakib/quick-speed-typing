"use client";

// Import core React hooks and Next.js internal navigation/search utilities
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
// Import authentication action for processing the password reset
import { resetPassword } from "@/lib/auth-client";
// Import UI design system components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Import icons for visual state representation
import { Lock, Loader2, CheckCircle2, XCircle, ChevronRight, ArrowLeft } from "lucide-react";
// Import toast feedback and React built-ins
import { toast } from "sonner";
import Link from "next/link";
import { Suspense } from "react";

// Inner component to handle password reset logic (wrapped in Suspense for useSearchParams)
function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Extract the unique reset token from the URL query
  
  // Local state for the new password inputs and submission status
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate the presence of the token
    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }

    // Client-side validation for password match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Client-side validation for password complexity
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Dispatch the reset request to the authentication provider
      await resetPassword({
        newPassword: password,
        token,
      }, {
        onSuccess: () => {
          setIsSuccess(true);
          toast.success("Password reset successful!");
        },
        onError: (ctx: any) => {
          // Capture and display server-side errors
          const msg = ctx.error.message || "Failed to reset password";
          setError(msg);
          toast.error(msg);
        }
      });
    } catch (err) {
      setError("An unexpected error occurred");
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // State: Handle missing or invalid token in the URL
  if (!token) {
    return (
      <div className="space-y-6 text-center py-4">
        {/* Error icon */}
        <div className="h-20 w-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="h-10 w-10 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black lowercase tracking-tighter" style={{ color: 'var(--text-color)' }}>
            invalid link
          </h2>
          <p className="text-sm lowercase opacity-60">
            The password reset link is invalid or has expired.
          </p>
        </div>
        {/* Navigation back to request a new link */}
        <div className="pt-4">
          <Link href="/forgot-password">
            <Button variant="outline" className="w-full h-12 border-2 font-black uppercase tracking-widest hover:bg-secondary/5 transition-all" style={{ borderColor: 'var(--border)' }}>
              try again
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // State: Handle successful password update
  if (isSuccess) {
    return (
      <div className="space-y-6 text-center py-4">
        {/* Success icon with animation */}
        <div className="h-20 w-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-500">
          <CheckCircle2 className="h-10 w-10 text-green-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black lowercase tracking-tighter" style={{ color: 'var(--text-color)' }}>
            success!
          </h2>
          <p className="text-sm lowercase opacity-60">
            Your password has been successfully reset.
          </p>
        </div>
        {/* CTA to proceed to the login page */}
        <div className="pt-4">
          <Link href="/sign-in" className="w-full">
            <Button 
                className="w-full h-12 font-black text-xs uppercase tracking-widest mt-2 hover:opacity-90 transition-all border-none" 
                style={{ backgroundColor: 'var(--main-color)', color: 'var(--bg-color)' }}
            >
              go to sign in <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Primary State: Render the reset form
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center relative">
        <h1 className="text-3xl font-black lowercase tracking-tighter" style={{ color: 'var(--text-color)' }}>
          reset password
        </h1>
        <p className="text-sm lowercase opacity-60">
          Enter your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {/* New Password input field */}
        <div className="space-y-2">
          <Label htmlFor="password" style={{ color: 'var(--sub-color)' }} className="text-[10px] uppercase font-black opacity-40 ml-1 tracking-widest">New Password</Label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="pl-9 h-12 bg-secondary/5 border-2 border-transparent focus:border-primary/20 transition-all font-mono text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        
        {/* Confirm Password input field */}
        <div className="space-y-2">
          <Label htmlFor="confirm-password" style={{ color: 'var(--sub-color)' }} className="text-[10px] uppercase font-black opacity-40 ml-1 tracking-widest">Confirm Password</Label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              className="pl-9 h-12 bg-secondary/5 border-2 border-transparent focus:border-primary/20 transition-all font-mono text-sm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Dynamic error feedback message */}
        {error && (
          <p className="text-sm text-destructive font-black bg-destructive/10 p-3 rounded-xl border border-destructive/20 animate-in fade-in slide-in-from-top-1 lowercase">
            {error}
          </p>
        )}

        {/* Submit button with async loading state */}
        <Button 
          type="submit" 
          className="w-full h-12 font-black text-xs uppercase tracking-widest mt-4 hover:opacity-90 transition-all border-none" 
          style={{ backgroundColor: 'var(--main-color)', color: 'var(--bg-color)' }}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          reset password
        </Button>
      </form>
    </div>
  );
}

// Parent Page component that handles Suspense for URL search parameters
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      // Subtle loading UI while search parameters are parsed
      <div className="flex flex-col items-center justify-center p-8 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-xs font-bold opacity-40 lowercase">loading reset form...</p>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
