"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Loader2, CheckCircle2, XCircle, ChevronRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await resetPassword({
        newPassword: password,
        token,
      }, {
        onSuccess: () => {
          setIsSuccess(true);
          toast.success("Password reset successful!");
        },
        onError: (ctx: any) => {
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

  if (!token) {
    return (
      <div className="space-y-6 text-center py-4">
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

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center py-4">
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
        {error && (
          <p className="text-sm text-destructive font-black bg-destructive/10 p-3 rounded-xl border border-destructive/20 animate-in fade-in slide-in-from-top-1 lowercase">
            {error}
          </p>
        )}
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
