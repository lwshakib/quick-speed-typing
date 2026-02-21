"use client";

import { useState } from "react";
import { requestPasswordReset } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2, ChevronRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      }, {
        onSuccess: () => {
          setIsSuccess(true);
          toast.success("Password reset email sent!");
        },
        onError: (ctx: any) => {
          toast.error(ctx.error.message || "Failed to send reset email");
        }
      });
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center py-4">
        <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-500">
          <Mail className="h-10 w-10" style={{ color: 'var(--main-color)' }} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black lowercase tracking-tighter" style={{ color: 'var(--text-color)' }}>
            email sent
          </h2>
          <p className="text-sm lowercase opacity-60">
            Check your inbox for a link to reset your password.
          </p>
        </div>
        <div className="pt-4">
          <Link href="/sign-in" className="w-full">
            <Button 
              variant="outline" 
              className="w-full h-12 border-2 font-black uppercase tracking-widest hover:bg-main/5 transition-all" 
              style={{ borderColor: 'var(--sub-color)', color: 'var(--sub-color)' }}
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

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center relative">
        <h1 className="text-3xl font-black lowercase tracking-tighter" style={{ color: 'var(--text-color)' }}>
          forgot password?
        </h1>
        <p className="text-sm lowercase opacity-60">
          Enter your email and we'll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleForgotPassword} className="space-y-4 pt-2">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[10px] uppercase font-black opacity-40 ml-1 tracking-widest">Email</Label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              className="pl-9 h-12 bg-secondary/5 border-2 border-transparent focus:border-primary/20 transition-all font-mono text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <Button 
          type="submit" 
          className="w-full h-12 font-black text-xs uppercase tracking-widest mt-4 hover:opacity-90 transition-all border-none" 
          style={{ backgroundColor: 'var(--main-color)', color: 'var(--bg-color)' }}
          disabled={loading}
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          send reset link
        </Button>
      </form>

      <div className="text-center pt-4">
        <span className="text-xs lowercase opacity-60">remember your password? </span>
        <Link href="/sign-in" className="text-xs font-black lowercase text-primary hover:underline">
          go back <ChevronRight className="inline-block w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
