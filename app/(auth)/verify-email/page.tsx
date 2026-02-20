"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Missing verification token.");
      return;
    }

    const verify = async () => {
      try {
        await authClient.verifyEmail({
          query: {
            token,
          },
        }, {
          onSuccess: () => {
            setStatus("success");
            toast.success("Email verified successfully! Redirecting to login...");
            // Automatically redirect to home after a brief delay
            setTimeout(() => {
              router.push("/?verified=true");
            }, 2000);
          },
          onError: (ctx) => {
            setStatus("error");
            setErrorMessage(ctx.error.message || "Failed to verify email.");
          }
        });
      } catch (err) {
        setStatus("error");
        setErrorMessage("An unexpected error occurred.");
      }
    };

    verify();
  }, [token]);

  return (
    <Card className="w-full max-w-[450px] border-border/40 shadow-2xl bg-card/50 backdrop-blur-md">
      <CardHeader className="text-center pb-2">
        {status === "loading" && (
          <div className="mx-auto h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        )}
        {status === "success" && (
          <div className="mx-auto h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4 animate-in zoom-in duration-500">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
        )}
        {status === "error" && (
          <div className="mx-auto h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <XCircle className="h-10 w-10 text-destructive" />
          </div>
        )}
        <CardTitle className="text-3xl font-bold tracking-tight">
          {status === "loading" && "Verifying Email"}
          {status === "success" && "Verification Success!"}
          {status === "error" && "Verification Failed"}
        </CardTitle>
        <CardDescription className="text-base mt-2">
          {status === "loading" && "Please wait while we confirm your email address..."}
          {status === "success" && "Your email has been successfully verified. You can now access all features."}
          {status === "error" && errorMessage}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center py-4">
        {status === "loading" && (
          <p className="text-sm text-muted-foreground italic">Communicating with auth server...</p>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        {(status === "success" || status === "error") && (
          <Button asChild className="w-full font-bold h-11 shadow-lg shadow-primary/20">
            <Link href={status === "success" ? "/?verified=true" : "/"}>
              {status === "success" ? "Go to Login" : "Back to Home"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background font-mono select-none" style={{ backgroundColor: 'var(--background)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
      </div>
      
      <Suspense fallback={
        <Card className="w-full max-w-[450px] border-border/40 shadow-2xl bg-card/30 backdrop-blur-xl animate-pulse">
           <CardHeader className="text-center">
             <div className="mx-auto h-16 w-16 bg-muted rounded-full mb-4" />
             <div className="h-8 bg-muted rounded w-3/4 mx-auto mb-2" />
             <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
           </CardHeader>
        </Card>
      }>
        <div className="relative z-10 w-full flex justify-center">
          <VerifyEmailContent />
        </div>
      </Suspense>
    </div>
  );
}
