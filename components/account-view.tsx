"use client";

import { useState, useEffect } from "react";
import { authClient, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, User, Shield, HardDrive, Trash2, Smartphone, Monitor, Globe } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";
import { toast } from "sonner";
import { format } from "date-fns";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15
    }
  }
};

export function AccountView() {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      fetchSessions();
    }
  }, [session]);

  const fetchSessions = async () => {
    try {
      const { data } = await authClient.listSessions();
      setActiveSessions(data || []);
    } catch (error) {
      console.error("Failed to fetch sessions", error);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const handleUpdateName = async () => {
    setIsUpdating(true);
    try {
      await authClient.updateUser({
        name: name,
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account? This action is irreversible.")) {
      try {
        await authClient.deleteUser();
        toast.success("Account deleted");
        window.location.href = "/";
      } catch (error) {
        toast.error("Failed to delete account");
      }
    }
  };

  const handleRevokeSession = async (token: string) => {
    try {
      await authClient.revokeSession({ token });
      toast.success("Session revoked");
      fetchSessions();
    } catch (error) {
      toast.error("Failed to revoke session");
    }
  };

  const getDeviceName = (userAgent: string) => {
    if (!userAgent) return "unknown device";
    const browsers = ["chrome", "firefox", "safari", "edge", "opera"];
    const os = ["windows", "macintosh", "linux", "android", "iphone"];
    
    const lowerUA = userAgent.toLowerCase();
    const browser = browsers.find(b => lowerUA.includes(b)) || "browser";
    const platform = os.find(p => lowerUA.includes(p)) || "device";
    
    return `${browser} on ${platform}`;
  };

  if (!session) return null;

  return (
    <motion.main 
      className="flex-1 w-full max-w-[1250px] mx-auto py-8 sm:py-12 space-y-12 px-4 sm:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="space-y-2" variants={itemVariants}>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tighter lowercase" style={{ color: 'var(--text-color)' }}>account settings</h1>
          <p className="text-sm lowercase opacity-60">Manage your profile, security, and account preferences.</p>
        </motion.div>

        <div className="grid gap-10">
          {/* Profile Section */}
          <motion.div 
            className="rounded-2xl border-2 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/5" 
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}
            variants={itemVariants}
          >
            <div className="border-b-2 p-6 flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border-2 border-primary/20 overflow-hidden transition-all group-hover:scale-105">
                    {session.user.image ? (
                        <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-6 h-6 text-primary" />
                    )}
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold lowercase" style={{ color: 'var(--text-color)' }}>profile info</h2>
                  <p className="text-[10px] uppercase font-bold opacity-40 tracking-widest">Update your identification</p>
                </div>
              </div>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="name" className="lowercase font-bold opacity-60 ml-1">full name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="your name"
                    className="h-12 border-2 rounded-xl bg-black/5 focus-visible:ring-primary/20 transition-all font-bold"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-color)' }}
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="email" className="lowercase font-bold opacity-60 ml-1">email address</Label>
                  <Input 
                    id="email" 
                    value={session.user.email} 
                    disabled 
                    className="h-12 border-2 rounded-xl opacity-40 cursor-not-allowed bg-black/10 font-bold" 
                    style={{ borderColor: 'var(--border)' }} 
                  />
                  <p className="text-[10px] lowercase opacity-40 ml-1">email cannot be changed at this time.</p>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                    onClick={handleUpdateName} 
                    disabled={isUpdating}
                    className="h-12 px-8 rounded-xl font-black lowercase tracking-tight transition-all active:scale-95 shadow-lg shadow-primary/10"
                >
                  {isUpdating ? "saving..." : "save changes"}
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Active Sessions */}
          <motion.div 
            className="rounded-2xl border-2 overflow-hidden transition-all duration-300" 
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}
            variants={itemVariants}
          >
            <div className="border-b-2 p-6 flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--background)' }}>
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold lowercase" style={{ color: 'var(--text-color)' }}>active sessions</h2>
                  <p className="text-[10px] uppercase font-bold opacity-40 tracking-widest">Security Monitoring</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="lowercase font-bold opacity-40 hover:opacity-100"
                onClick={fetchSessions}
              >
                refresh
              </Button>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b-2" style={{ borderColor: 'var(--border)' }}>
                    <TableHead className="px-8 py-5 lowercase font-bold opacity-40">device / browser</TableHead>
                    <TableHead className="px-8 py-5 lowercase font-bold opacity-40">ip address</TableHead>
                    <TableHead className="px-8 py-5 lowercase font-bold opacity-40">last active</TableHead>
                    <TableHead className="px-8 py-5 text-right lowercase font-bold opacity-40">action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingSessions ? (
                    <TableRow className="hover:bg-transparent">
                       <TableCell colSpan={4} className="text-center py-20 opacity-30 lowercase">loading active sessions...</TableCell>
                    </TableRow>
                  ) : activeSessions.length === 0 ? (
                    <TableRow className="hover:bg-transparent">
                       <TableCell colSpan={4} className="text-center py-20 opacity-30 lowercase">no other active sessions detected.</TableCell>
                    </TableRow>
                  ) : activeSessions.map((s) => (
                    <TableRow key={s.id} className="hover:bg-white/5 transition-all group border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                      <TableCell className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 rounded-xl transition-all group-hover:scale-110" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}>
                            {s.userAgent?.toLowerCase().includes("mobile") ? <Smartphone className="w-4 h-4 opacity-50" /> : <Monitor className="w-4 h-4 opacity-50" />}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold lowercase" style={{ color: 'var(--text-color)' }}>
                              {getDeviceName(s.userAgent)}
                            </span>
                            <span className="text-[10px] uppercase opacity-30 font-black tracking-tighter">
                              {s.userAgent?.length > 40 ? s.userAgent?.substring(0, 40) + "..." : s.userAgent}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-8 py-6 font-mono text-xs opacity-60">
                        <div className="flex items-center gap-2">
                          <Globe size={12} className="opacity-30" />
                          {s.ipAddress || "0.0.0.0"}
                        </div>
                      </TableCell>
                      <TableCell className="px-8 py-6 text-xs lowercase opacity-60">{format(new Date(s.createdAt), "MMM d, HH:mm")}</TableCell>
                      <TableCell className="px-8 py-6 text-right">
                         <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs font-black lowercase text-destructive hover:bg-destructive hover:text-white rounded-lg px-4 transition-all"
                            onClick={() => handleRevokeSession(s.token)}
                          >
                            revoke
                         </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div 
            className="rounded-2xl border-2 border-destructive/20 overflow-hidden bg-destructive/5"
            variants={itemVariants}
          >
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                    <Trash2 className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <h2 className="text-xl font-bold lowercase text-destructive">danger zone</h2>
                  <p className="text-xs opacity-60">Permanent actions that cannot be undone.</p>
                </div>
              </div>

              <div className="p-5 rounded-xl border-2 border-destructive/10 bg-destructive/5 space-y-2">
                <p className="text-sm font-bold text-destructive lowercase">warning: read carefully</p>
                <p className="text-xs opacity-60 lowercase leading-relaxed">
                  Deleting your account will permanently wipe your typing history, performance metrics, and all personal data. Your username will be released.
                </p>
              </div>

              <div className="pt-2">
                <Button 
                    variant="destructive" 
                    onClick={handleDeleteAccount}
                    className="h-12 px-8 rounded-xl font-black lowercase tracking-tight transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-destructive/10"
                >
                    delete my account
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.main>
    );
}
