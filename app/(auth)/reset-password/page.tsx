"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Loader2, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
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
          setError(ctx.error.message || "Failed to reset password");
          toast.error(ctx.error.message || "Failed to reset password");
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
      <div className="min-h-screen flex items-center justify-center p-4 bg-background font-mono select-none" style={{ backgroundColor: 'var(--background)' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] rounded-full bg-destructive/20 blur-[120px]" />
        </div>
        <Card className="w-full max-w-[400px] border-border/40 shadow-2xl bg-card/30 backdrop-blur-xl relative z-10 transition-all duration-300">
          <CardHeader className="text-center">
            <div className="mx-auto h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-3xl font-black tracking-tight text-foreground">Invalid Link</CardTitle>
            <CardDescription className="text-base text-secondary/70">
              The password reset link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full font-bold h-11 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
              <Link href="/">Back to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background font-mono select-none" style={{ backgroundColor: 'var(--background)' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] rounded-full bg-green-500/20 blur-[120px]" />
        </div>
        <Card className="w-full max-w-[400px] border-border/40 shadow-2xl bg-card/30 backdrop-blur-xl relative z-10 transition-all duration-300">
          <CardHeader className="text-center">
            <div className="mx-auto h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4 animate-in zoom-in duration-500">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <CardTitle className="text-3xl font-black tracking-tight text-foreground">Success!</CardTitle>
            <CardDescription className="text-base text-secondary/70">
              Your password has been successfully reset. You can now log in with your new credentials.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full font-bold h-11 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
              <Link href="/?verified=true">Go to Login</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background font-mono select-none" style={{ backgroundColor: 'var(--background)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <Card className="w-full max-w-[400px] border-border/40 shadow-2xl bg-card/30 backdrop-blur-xl relative z-10 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-3xl font-black tracking-tight text-foreground">Reset Password</CardTitle>
          <CardDescription className="text-base text-secondary/70">
            Enter your new password below to reset your account access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" style={{ color: 'var(--sub-color)' }}>New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9 h-11 bg-background/30 border-border/40 focus:border-primary/50 transition-all font-mono"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" style={{ color: 'var(--sub-color)' }}>Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9 h-11 bg-background/30 border-border/40 focus:border-primary/50 transition-all font-mono"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            {error && (
              <p className="text-sm text-destructive font-medium bg-destructive/10 p-2 rounded-md border border-destructive/20 animate-in fade-in slide-in-from-top-1">{error}</p>
            )}
            <Button type="submit" className="w-full font-bold h-11 shadow-lg shadow-primary/20 bg-primary text-primary-foreground hover:bg-primary/90 transition-all" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
            <Link href="/" className="text-sm text-secondary/60 hover:text-foreground flex items-center mx-auto transition-all group font-bold">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Login
            </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
