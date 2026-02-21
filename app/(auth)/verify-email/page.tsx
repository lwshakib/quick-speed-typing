"use client";

// Import core React hooks and Next.js navigation utilities
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
// Import the authentication client for email verification processing
import { authClient } from "@/lib/auth-client";
// Import UI design system components
import { Button } from "@/components/ui/button";
// Import visual state icons
import { CheckCircle2, XCircle, Loader2, ChevronRight } from "lucide-react";
// Import routing and feedback tools
import Link from "next/link";
import { toast } from "sonner";
import { Suspense } from "react";

// Inner component to handle email verification logic (wrapped in Suspense for useSearchParams)
function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Extract verification token from URL
  
  // Local state to track the verification lifecycle and error feedback
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Trigger verification as soon as the component mounts and the token is available
  useEffect(() => {
    // If no token is provided in the URL, immediately flag an error
    if (!token) {
      setStatus("error");
      setErrorMessage("Missing verification token.");
      return;
    }

    const verify = async () => {
      try {
        // Dispatch verification request to the auth provider
        await authClient.verifyEmail({
          query: { token }
        }, {
          onSuccess: () => {
            // Update UI state and provide success feedback
            setStatus("success");
            toast.success("Email verified successfully!");
          },
          onError: (ctx) => {
            // Log the error and update UI state for the user
            setStatus("error");
            setErrorMessage(ctx.error.message || "Failed to verify email.");
            toast.error(ctx.error.message || "Verification failed");
          }
        });
      } catch (err) {
        setStatus("error");
        setErrorMessage("An unexpected error occurred.");
      }
    };

    verify();
  }, [token]);

  // State: Handle the active verification process
  if (status === "verifying") {
    return (status === "verifying" && (
      <div className="space-y-6 text-center py-4">
        {/* Loading spinner container */}
        <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black lowercase tracking-tighter" style={{ color: 'var(--text-color)' }}>
            verifying email
          </h2>
          <p className="text-sm lowercase opacity-60">
            Please wait while we confirm your account.
          </p>
        </div>
      </div>
    ));
  }

  // State: Handle successful verification
  if (status === "success") {
    return (
      <div className="space-y-6 text-center py-4">
        {/* Animated success icon */}
        <div className="h-20 w-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-500">
          <CheckCircle2 className="h-10 w-10 text-green-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black lowercase tracking-tighter" style={{ color: 'var(--text-color)' }}>
            email verified!
          </h2>
          <p className="text-sm lowercase opacity-60">
            Your account is now active. You can start tracking your progress.
          </p>
        </div>
        {/* CTA to proceed to login */}
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

  // State: Handle verification failure
  return (
    <div className="space-y-6 text-center py-4">
      {/* Error icon with animation */}
      <div className="h-20 w-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-500">
        <XCircle className="h-10 w-10 text-destructive" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-black lowercase tracking-tighter" style={{ color: 'var(--text-color)' }}>
          verification failed
        </h2>
        <p className="text-sm lowercase opacity-60">
          {errorMessage || "The link may be invalid or expired."}
        </p>
      </div>
      {/* Navigation to retry registration */}
      <div className="pt-4">
        <Link href="/sign-up" className="w-full">
          <Button 
            variant="outline" 
            className="w-full h-12 border-2 font-black uppercase tracking-widest hover:bg-main/5 transition-all" 
            style={{ borderColor: 'var(--sub-color)', color: 'var(--sub-color)' }}
            // Interactive outline behavior
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--main-color)';
                e.currentTarget.style.color = 'var(--main-color)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--sub-color)';
                e.currentTarget.style.color = 'var(--sub-color)';
            }}
          >
            try signing up again
          </Button>
        </Link>
      </div>
    </div>
  );
}

// Parent Page component that handles Suspense for URL search parameters
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      // Loading UI while search parameters are parsed
      <div className="flex flex-col items-center justify-center p-8 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-xs font-bold opacity-40 lowercase">verifying your email...</p>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
