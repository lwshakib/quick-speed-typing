"use client";

import { useState } from "react";
import { signUp, signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, Loader2, ChevronRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function SignUpPage() {
  const [loading, setLoading] = useState<"signUp" | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("signUp");
    try {
      await signUp.email({
        email,
        password,
        name,
        callbackURL: "/",
      }, {
        onSuccess: () => {
          setIsSuccess(true);
          toast.success("Account created! Please verify your email.");
        },
        onError: (ctx: any) => {
          toast.error(ctx.error.message || "Failed to create account");
        }
      });
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading("signUp" as any); // Use a temporary state or add google to the type
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error) {
      toast.error("Failed to sign in with Google");
      setLoading(null);
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
            check your email
          </h2>
          <p className="text-sm lowercase opacity-60">
            We've sent a link to <span className="font-bold text-foreground">{email}</span> to verify your account.
          </p>
        </div>
        <div className="pt-4">
          <Link href="/sign-in">
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
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-black lowercase tracking-tighter" style={{ color: 'var(--text-color)' }}>
          create account
        </h1>
        <p className="text-sm lowercase opacity-60">
          Join us to track your typing evolution.
        </p>
      </div>

      <form onSubmit={handleSignUp} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-[10px] uppercase font-black opacity-40 ml-1 tracking-widest">Full Name</Label>
          <div className="relative group">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              id="name"
              placeholder="John Doe"
              type="text"
              className="pl-9 h-12 bg-secondary/5 border-2 border-transparent focus:border-primary/20 transition-all font-mono text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>
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
        <div className="space-y-2">
          <Label htmlFor="password" className="text-[10px] uppercase font-black opacity-40 ml-1 tracking-widest">Password</Label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              id="password"
              type="password"
              className="pl-9 h-12 bg-secondary/5 border-2 border-transparent focus:border-primary/20 transition-all font-mono text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <Button 
          type="submit" 
          className="w-full h-12 font-black text-xs uppercase tracking-widest mt-4 hover:opacity-90 transition-all border-none" 
          style={{ backgroundColor: 'var(--main-color)', color: 'var(--bg-color)' }}
          disabled={loading !== null}
        >
          {loading === "signUp" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          create account
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" style={{ borderColor: 'var(--sub-color)', opacity: 0.1 }} />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest text-muted-foreground/50">
          <span className="bg-background px-4" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--sub-color)' }}>Or continue with</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full h-12 border-2 font-black uppercase tracking-widest hover:bg-main/5 transition-all group"
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
        <svg className="mr-2 h-4 w-4 transition-colors" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
        </svg>
        google
      </Button>

      <div className="text-center pt-4">
        <span className="text-xs lowercase opacity-60">already have an account? </span>
        <Link href="/sign-in" className="text-xs font-black lowercase text-primary hover:underline" style={{ color: 'var(--main-color)' }}>
          sign in <ChevronRight className="inline-block w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
