"use client";

import { useState, useEffect } from "react";
import { signIn, signUp, authClient, requestPasswordReset } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, User, Loader2, ArrowLeft, CheckCircle2, ExternalLink, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface AuthModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

type AuthView = "auth" | "check-email" | "forgot-password" | "verified" | "verifying" | "password-reset";

export function AuthModal({ isOpen, onOpenChange, onSuccess }: AuthModalProps) {
  const [loading, setLoading] = useState<"signIn" | "signUp" | "google" | "forgotPassword" | "resend" | "verifying" | null>(null);
  const [view, setView] = useState<AuthView>("auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const router = useRouter();

  const isLoading = loading !== null;

  // Handle URL parameters for initial view and verification
  useEffect(() => {
    if (isOpen) {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      const verified = params.get("verified");
      const passwordReset = params.get("reset-password");

      if (token) {
        handleTokenVerification(token);
      } else if (verified === "true") {
        setView("verified");
        // We delay clearing slightly to avoid triggering other effects
        setTimeout(clearParams, 500);
      } else if (passwordReset === "true") {
        setView("password-reset");
        setTimeout(clearParams, 500);
      }
    }
  }, [isOpen]);

  const clearParams = () => {
    router.replace("/", { scroll: false });
  };

  const handleTokenVerification = async (token: string) => {
    setView("verifying");
    setLoading("verifying");
    try {
      await authClient.verifyEmail({
        query: { token }
      }, {
        onSuccess: () => {
          setView("verified");
          toast.success("Email verified successfully!");
          clearParams();
        },
        onError: (ctx) => {
          setView("auth");
          setVerificationError(ctx.error.message || "Failed to verify email.");
          toast.error(ctx.error.message || "Verification failed");
          clearParams();
        }
      });
    } catch (err) {
      setView("auth");
      setVerificationError("An unexpected error occurred.");
      clearParams();
    } finally {
      setLoading(null);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("signIn");
    try {
      await signIn.email({
        email,
        password,
        callbackURL: window.location.href,
      }, {
        onSuccess: () => {
          toast.success("Signed in successfully!");
          onOpenChange(false);
          onSuccess?.();
        },
        onError: (ctx: any) => {
          toast.error(ctx.error.message || "Failed to sign in");
        }
      });
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("signUp");
    try {
      await signUp.email({
        email,
        password,
        name,
        callbackURL: window.location.href,
      }, {
        onSuccess: () => {
          setView("check-email");
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("forgotPassword");
    try {
      await requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      }, {
        onSuccess: () => {
          toast.success("Password reset email sent!");
          setView("check-email");
        },
        onError: (ctx: any) => {
          toast.error(ctx.error.message || "Failed to send reset email");
        }
      });
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  const handleResendVerification = async () => {
    setLoading("resend");
    try {
      const { sendVerificationEmail } = await import("@/lib/auth-client");
      await sendVerificationEmail({
        email,
        callbackURL: window.location.href,
      }, {
        onSuccess: () => {
          toast.success("Verification email resent!");
        },
        onError: (ctx: any) => {
          toast.error(ctx.error.message || "Failed to resend email");
        }
      });
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(null);
    }
  };


  const handleGoogleSignIn = async () => {
    setLoading("google");
    try {
      await signIn.social({
        provider: "google",
        callbackURL: window.location.href,
      });
    } catch (error) {
      toast.error("Failed to sign in with Google");
      setLoading(null);
    }
  };

  const openGmail = () => {
    window.open("https://mail.google.com", "_blank");
  };

  const resetModal = () => {
    setView("auth");
    setActiveTab("login");
    setEmail("");
    setPassword("");
    setName("");
    setVerificationError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) {
        setTimeout(resetModal, 300);
      }
    }}>
      <DialogContent 
        className="sm:max-w-[400px] border-2"
        style={{
          backgroundColor: 'var(--background)',
          borderColor: 'var(--border)'
        }}
      >
        {view === "auth" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">Welcome Back</DialogTitle>
              <DialogDescription className="text-center">
                Sign in to save your typing progress and track your speed over time.
              </DialogDescription>
            </DialogHeader>

            {verificationError && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20 mb-4 animate-in fade-in slide-in-from-top-1">
                {verificationError}
              </div>
            )}

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full mt-2">
              <TabsList 
                className="grid w-full grid-cols-2 mb-6 border"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.03)',
                  borderColor: 'var(--border)'
                }}
              >
                <TabsTrigger value="login" className="data-[state=active]:shadow-sm data-[state=active]:bg-background">Login</TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:shadow-sm data-[state=active]:bg-background">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="animate-in fade-in-50 duration-300">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-xs font-bold uppercase opacity-50 ml-1">Email</Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="login-email"
                        placeholder="name@example.com"
                        type="email"
                        className="pl-9 h-11 bg-muted/30 border-2 border-transparent focus:border-primary/20 transition-all font-mono text-sm"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between ml-1">
                      <Label htmlFor="login-password" className="text-xs font-bold uppercase opacity-50">Password</Label>
                      <button
                        type="button"
                        onClick={() => setView("forgot-password")}
                        className="text-[10px] text-primary hover:underline font-bold uppercase tracking-wider"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="login-password"
                        type="password"
                        className="pl-9 h-11 bg-muted/30 border-2 border-transparent focus:border-primary/20 transition-all font-mono text-sm"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-11 font-bold text-sm uppercase tracking-wide mt-2" disabled={isLoading}>
                    {loading === "signIn" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="animate-in fade-in-50 duration-300">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-xs font-bold uppercase opacity-50 ml-1">Full Name</Label>
                    <div className="relative group">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="signup-name"
                        placeholder="John Doe"
                        className="pl-9 h-11 bg-muted/30 border-2 border-transparent focus:border-primary/20 transition-all font-mono text-sm"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-xs font-bold uppercase opacity-50 ml-1">Email</Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="signup-email"
                        placeholder="name@example.com"
                        type="email"
                        className="pl-9 h-11 bg-muted/30 border-2 border-transparent focus:border-primary/20 transition-all font-mono text-sm"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-xs font-bold uppercase opacity-50 ml-1">Password</Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="signup-password"
                        type="password"
                        className="pl-9 h-11 bg-muted/30 border-2 border-transparent focus:border-primary/20 transition-all font-mono text-sm"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-11 font-bold text-sm uppercase tracking-wide mt-2" disabled={isLoading}>
                    {loading === "signUp" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-muted-foreground/50">
                <span className="bg-background px-4">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              className="w-full h-11 border-none font-bold uppercase tracking-wide bg-primary text-primary-foreground opacity-80 hover:opacity-100 transition-all duration-300"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              {loading === "google" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                  <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                </svg>
              )}
              Continue with Google
            </Button>
          </>
        )}

        {view === "check-email" && (
          <div className="py-6 flex flex-col items-center text-center space-y-4">
            <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-2 animate-bounce">
              <Mail className="h-10 w-10 text-primary" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Check your email</DialogTitle>
              <DialogDescription className="text-base">
                We've sent a link to <span className="font-semibold text-foreground">{email}</span>. 
                Please check your inbox (and spam folder) to proceed.
              </DialogDescription>
            </DialogHeader>
            <div className="w-full space-y-3 pt-4">
              <Button onClick={openGmail} className="w-full font-bold shadow-lg shadow-primary/20">
                <ExternalLink className="mr-2 h-4 w-4" />
                Go to Gmail
              </Button>
              <div className="flex flex-col space-y-1">
                <p className="text-xs text-muted-foreground">Didn't receive the email?</p>
                <button 
                  onClick={handleResendVerification}
                  disabled={isLoading}
                  className="text-xs text-primary hover:underline font-medium disabled:opacity-50"
                >
                  {loading === "resend" ? "Sending..." : "Click to resend"}
                </button>
              </div>
              <Button onClick={() => setView("auth")} variant="ghost" className="w-full text-muted-foreground hover:text-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </div>
          </div>
        )}


        {view === "forgot-password" && (
          <div className="space-y-4">
            <button
              onClick={() => setView("auth")}
              className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </button>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Forgot Password?</DialogTitle>
              <DialogDescription>
                Enter your email address to receive a password reset link.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleForgotPassword} className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="forgot-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="forgot-email"
                    placeholder="name@example.com"
                    type="email"
                    className="pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {loading === "forgotPassword" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Send Reset Link
              </Button>
            </form>
          </div>
        )}
        {view === "verifying" && (
          <div className="py-12 flex flex-col items-center text-center space-y-4">
            <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Verifying your email</DialogTitle>
              <DialogDescription className="text-base text-secondary/70">
                Please wait while we confirm your account. This will only take a moment.
              </DialogDescription>
            </DialogHeader>
          </div>
        )}

        {view === "verified" && (
          <div className="py-6 flex flex-col items-center text-center space-y-4">
            <div className="h-20 w-20 bg-green-500/10 rounded-full flex items-center justify-center mb-2 animate-in zoom-in duration-500">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Verified successfully!</DialogTitle>
              <DialogDescription className="text-base text-secondary/70">
                Your email has been confirmed. You can now log in to your account and start tracking your progress.
              </DialogDescription>
            </DialogHeader>
            <div className="w-full pt-4">
              <Button 
                onClick={() => setView("auth")} 
                className="w-full font-bold h-11 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
              >
                Go to Login
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        {view === "password-reset" && (
          <div className="py-6 flex flex-col items-center text-center space-y-4">
            <div className="h-20 w-20 bg-green-500/10 rounded-full flex items-center justify-center mb-2 animate-in zoom-in duration-500">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Password Reset Successfully!</DialogTitle>
              <DialogDescription className="text-base text-secondary/70">
                Your password has been changed successfully. You can now log in to your account with your new password.
              </DialogDescription>
            </DialogHeader>
            <div className="w-full pt-4">
              <Button 
                onClick={() => setView("auth")} 
                className="w-full font-bold h-11 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
              >
                Go to Login
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
