"use client";

import { useState, useEffect } from "react";
import { authClient, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
    User, 
    Shield, 
    Trash2, 
    Smartphone, 
    Monitor, 
    Globe, 
    Link as LinkIcon, 
    Plus, 
    LogOut,
    ExternalLink,
    Mail,
    Lock
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

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
  const [linkedAccounts, setLinkedAccounts] = useState<any[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      fetchSessions();
      fetchAccounts();
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

  const fetchAccounts = async () => {
    try {
       // listAccounts may not be available in all better-auth versions
       if ('listAccounts' in authClient) {
         const { data } = await (authClient as any).listAccounts();
         setLinkedAccounts(data || []);
       }
    } catch (error) {
      console.error("Failed to fetch accounts", error);
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  const handleUpdateName = async () => {
    if (!name.trim()) return toast.error("Name cannot be empty");
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

  const handleLinkAccount = async (provider: 'google') => {
    try {
      // Use social sign-in to link account when user is already authenticated
      await authClient.signIn.social({
        provider: provider,
        callbackURL: window.location.href
      });
    } catch (error) {
      toast.error(`Failed to link ${provider} account`);
    }
  };

  const handleUnlinkAccount = async (accountId: string) => {
    if (linkedAccounts.length <= 1 && !session?.user?.email) {
        return toast.error("You must have at least one login method.");
    }
    
    try {
        if ('unlinkAccount' in authClient) {
            await (authClient as any).unlinkAccount({
                accountId: accountId
            });
            toast.success("Account unlinked");
            fetchAccounts();
        } else {
            toast.error("Unlinking is not supported in this version");
        }
    } catch (error) {
        toast.error("Failed to unlink account");
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
      className="flex-1 w-full max-w-[1250px] mx-auto py-12 sm:py-20 space-y-20 px-4 sm:px-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="space-y-3" variants={itemVariants}>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter lowercase" style={{ color: 'var(--text-color)' }}>account settings</h1>
          <p className="text-sm lowercase opacity-40">Manage your identity, connected apps, and security.</p>
        </motion.div>

        <div className="grid gap-20">
          {/* Profile Section */}
          <motion.div 
            className="rounded-3xl border-2 overflow-hidden bg-transparent" 
            style={{ borderColor: 'var(--border)' }}
            variants={itemVariants}
          >
            <div className="border-b-2 p-8 flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border-2 border-white/5 overflow-hidden">
                    {session.user.image ? (
                        <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-7 h-7 opacity-20" />
                    )}
                </div>
                <div>
                  <h2 className="text-2xl font-black lowercase" style={{ color: 'var(--text-color)' }}>profile info</h2>
                  <p className="text-[10px] uppercase font-black opacity-30 tracking-widest">Identification settings</p>
                </div>
              </div>
            </div>
            
            <div className="p-10 space-y-10">
              <div className="grid sm:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <Label htmlFor="name" className="lowercase font-black text-xs opacity-60 ml-1 tracking-widest">display name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="your name"
                    className="h-14 border-2 rounded-2xl focus-visible:ring-primary/20 transition-all font-black text-lg bg-transparent"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-color)' }}
                  />
                  <p className="text-[10px] lowercase opacity-40 ml-1">this is how you will appear on the leaderboard.</p>
                </div>
                <div className="space-y-4">
                  <Label htmlFor="email" className="lowercase font-black text-xs opacity-60 ml-1 tracking-widest">email address</Label>
                  <div className="relative">
                    <Input 
                        id="email" 
                        value={session.user.email} 
                        disabled 
                        className="h-14 border-2 rounded-2xl opacity-40 cursor-not-allowed font-black text-lg bg-white/5" 
                        style={{ borderColor: 'var(--border)' }} 
                    />
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-20" />
                  </div>
                  <p className="text-[10px] lowercase opacity-40 ml-1 flex items-center gap-1">
                    <Lock size={10} />
                    primary account identifier
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                    onClick={handleUpdateName} 
                    disabled={isUpdating}
                    className="h-14 px-10 rounded-2xl font-black lowercase tracking-tight transition-all active:scale-95 bg-primary text-black hover:bg-primary/90"
                >
                  {isUpdating ? "saving..." : "save profile"}
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Connected Accounts Section */}
          <motion.div 
            className="rounded-3xl border-2 overflow-hidden bg-transparent" 
            style={{ borderColor: 'var(--border)' }}
            variants={itemVariants}
          >
            <div className="border-b-2 p-8 flex items-center gap-6" style={{ borderColor: 'var(--border)' }}>
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border-2 border-white/5">
                    <LinkIcon className="w-7 h-7 opacity-20" />
                </div>
                <div>
                  <h2 className="text-2xl font-black lowercase" style={{ color: 'var(--text-color)' }}>connected accounts</h2>
                  <p className="text-[10px] uppercase font-black opacity-30 tracking-widest">OAuth identity providers</p>
                </div>
            </div>

            <div className="p-10 space-y-8">
                <div className="grid gap-4">
                    {/* Google Provider */}
                    <div className="flex items-center justify-between p-6 rounded-2xl border-2 border-white/5 bg-white/5 transition-all hover:bg-white/[0.08]">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg">
                                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-black text-lg lowercase">Google</p>
                                {linkedAccounts.find(a => a.provider === 'google') ? (
                                    <p className="text-[11px] font-black uppercase text-emerald-500 tracking-tighter">linked established</p>
                                ) : (
                                    <p className="text-[11px] font-black uppercase text-white/30 tracking-tighter">not connected</p>
                                )}
                            </div>
                        </div>
                        {linkedAccounts.find(a => a.provider === 'google') ? (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-10 px-6 rounded-xl font-black lowercase text-destructive hover:bg-destructive hover:text-white"
                                onClick={() => handleUnlinkAccount(linkedAccounts.find(a => a.provider === 'google').id)}
                            >
                                unlink
                            </Button>
                        ) : (
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-10 px-6 rounded-xl font-black lowercase border-2 border-white/10 hover:bg-white/10"
                                onClick={() => handleLinkAccount('google')}
                            >
                                <Plus size={14} className="mr-2" />
                                link account
                            </Button>
                        )}
                    </div>
                </div>
                <p className="text-[11px] lowercase opacity-40 text-center">Linking multiple accounts allows you to sign in with any verified method.</p>
            </div>
          </motion.div>

          {/* Active Sessions */}
          <motion.div 
            className="rounded-3xl border-2 overflow-hidden bg-transparent" 
            style={{ borderColor: 'var(--border)' }}
            variants={itemVariants}
          >
            <div className="border-b-2 p-8 flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border-2 border-white/5">
                  <Shield className="w-7 h-7 opacity-20" />
                </div>
                <div>
                  <h2 className="text-2xl font-black lowercase" style={{ color: 'var(--text-color)' }}>active sessions</h2>
                  <p className="text-[10px] uppercase font-black opacity-30 tracking-widest">Real-time security logs</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="lowercase font-black text-xs opacity-60 hover:opacity-100 bg-white/5 px-6 rounded-xl h-10"
                onClick={fetchSessions}
              >
                refresh status
              </Button>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b-2" style={{ borderColor: 'var(--border)' }}>
                    <TableHead className="px-10 py-6 lowercase font-black text-[10px] opacity-40">device / browser</TableHead>
                    <TableHead className="px-10 py-6 lowercase font-black text-[10px] opacity-40">ip address</TableHead>
                    <TableHead className="px-10 py-6 lowercase font-black text-[10px] opacity-40">last active</TableHead>
                    <TableHead className="px-10 py-6 text-right lowercase font-black text-[10px] opacity-40 px-10">command</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingSessions ? (
                    <TableRow className="hover:bg-transparent">
                       <TableCell colSpan={4} className="text-center py-20 opacity-30 lowercase font-black">polling session data...</TableCell>
                    </TableRow>
                  ) : activeSessions.length === 0 ? (
                    <TableRow className="hover:bg-transparent">
                       <TableCell colSpan={4} className="text-center py-20 opacity-30 lowercase font-black">no remote sessions detected.</TableCell>
                    </TableRow>
                  ) : activeSessions.map((s) => (
                    <TableRow key={s.id} className="hover:bg-white/[0.02] transition-all h-24 border-b last:border-0 border-white/[0.03]">
                      <TableCell className="px-10 py-6">
                        <div className="flex items-center gap-5">
                          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                            {s.userAgent?.toLowerCase().includes("mobile") ? <Smartphone className="w-5 h-5 opacity-40" /> : <Monitor className="w-5 h-5 opacity-40" />}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-lg font-black lowercase" style={{ color: 'var(--text-color)' }}>
                              {getDeviceName(s.userAgent)}
                            </span>
                            <span className="text-[10px] uppercase opacity-20 font-black tracking-tighter">
                              {s.userAgent?.length > 50 ? s.userAgent?.substring(0, 50) + "..." : s.userAgent}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-10 py-6 font-mono text-xs opacity-40 tracking-wider">
                        <div className="flex items-center gap-2">
                           <Globe size={14} className="opacity-40" />
                           {s.ipAddress || "0.0.0.0"}
                        </div>
                      </TableCell>
                      <TableCell className="px-10 py-6 text-xs lowercase opacity-40 font-black">
                        {format(new Date(s.createdAt), "dd MMM yyyy")}<br/>
                        <span className="opacity-50">{format(new Date(s.createdAt), "HH:mm")}</span>
                      </TableCell>
                      <TableCell className="px-10 py-6 text-right">
                         <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-10 px-6 rounded-xl font-black lowercase text-destructive hover:bg-destructive hover:text-white transition-all active:scale-95"
                            onClick={() => handleRevokeSession(s.token)}
                          >
                            <LogOut size={14} className="mr-2" />
                            revoke access
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
            className="rounded-3xl border-2 border-destructive/20 overflow-hidden bg-destructive/[0.02]"
            variants={itemVariants}
          >
            <div className="p-12 space-y-10">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
                    <Trash2 className="w-7 h-7 text-destructive" />
                </div>
                <div>
                  <h2 className="text-2xl font-black lowercase text-destructive">danger zone</h2>
                  <p className="text-xs opacity-40 font-black">Permanent account destruction.</p>
                </div>
              </div>

              <div className="p-8 rounded-2xl border-2 border-destructive/10 bg-destructive/5 space-y-4">
                <p className="text-xs font-black text-destructive uppercase tracking-widest">irreversible action</p>
                <p className="text-sm font-black opacity-60 lowercase leading-relaxed max-w-2xl">
                  Deleting your account will permanently wipe your entire typing legacy. This includes your all-time high scores, consistency graph, and performance insights across all game modes.
                </p>
              </div>

              <div className="pt-2">
                <Button 
                    variant="destructive" 
                    onClick={handleDeleteAccount}
                    className="h-14 px-10 rounded-2xl font-black lowercase tracking-tight transition-all active:scale-95 bg-destructive text-white hover:bg-destructive/90"
                >
                    delete my profile
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.main>
  );
}
