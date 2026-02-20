"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      // Redirect to home page with token to handle verification in the modal
      router.replace(`/?token=${token}`);
    } else {
      router.replace("/");
    }
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background font-mono select-none" style={{ backgroundColor: 'var(--background)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
      </div>
      
      <div className="relative z-10 flex flex-col items-center gap-4 text-center">
        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
        <h1 className="text-2xl font-black text-foreground">Secure Redirection</h1>
        <p className="text-secondary/70">Preparing your verification... Please wait.</p>
      </div>
    </div>
  );
}
