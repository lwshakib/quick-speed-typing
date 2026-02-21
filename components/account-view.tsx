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
    Plus, 
    LogOut,
    Mail,
    Lock,
    Settings,
    Activity,
    Users
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { motion } from "framer-motion";

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
    if (!name.trim()) return toast.error("name cannot be empty");
    setIsUpdating(true);
    try {
      await authClient.updateUser({
        name: name,
      });
      toast.success("profile updated");
    } catch (error) {
      toast.error("failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm("are you sure? this will delete all your typing data permanently.")) {
      try {
        await authClient.deleteUser();
        toast.success("account deleted");
        window.location.href = "/";
      } catch (error) {
        toast.error("failed to delete account");
      }
    }
  };

  const handleRevokeSession = async (token: string) => {
    try {
      await authClient.revokeSession({ token });
      toast.success("session revoked");
      fetchSessions();
    } catch (error) {
      toast.error("failed to revoke session");
    }
  };

  const handleLinkAccount = async (provider: 'google') => {
    try {
      await authClient.signIn.social({
        provider: provider,
        callbackURL: window.location.href
      });
    } catch (error) {
      toast.error(`failed to link ${provider} account`);
    }
  };

  const handleUnlinkAccount = async (accountId: string) => {
    if (linkedAccounts.length <= 1 && !session?.user?.email) {
        return toast.error("you must have at least one login method");
    }
    
    try {
        if ('unlinkAccount' in authClient) {
            await (authClient as any).unlinkAccount({ accountId });
            toast.success("account unlinked");
            fetchAccounts();
        }
    } catch (error) {
        toast.error("failed to unlink account");
    }
  };

  const getDeviceName = (userAgent: string) => {
    if (!userAgent) return "unknown device";
    const browsers = ["chrome", "firefox", "safari", "edge", "opera"];
    const os = ["windows", "macintosh", "linux", "android", "iphone"];
    const lowerUA = userAgent.toLowerCase();
    const browser = browsers.find(b => lowerUA.includes(b)) || "browser";
    const platform = os.find(p => lowerUA.includes(p)) || "device";
    return `${browser} / ${platform}`;
  };

  if (!session) return null;

  return (
    <motion.main 
      className="flex-1 w-full max-w-4xl mx-auto py-12 px-6 space-y-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-40 font-bold">
          <Settings size={12} />
          <span>account</span>
        </div>
        <h1 className="text-3xl font-black lowercase tracking-tighter" style={{ color: 'var(--text-color)' }}>
          settings
        </h1>
      </div>

      <div className="grid gap-16">
        {/* Profile Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 pb-2 border-b border-white/5">
            <User size={18} className="opacity-40" />
            <h2 className="text-xl font-bold lowercase">profile</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden">
                  {session.user.image ? (
                    <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 opacity-20" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold lowercase opacity-40">profile picture</p>
                  <p className="text-xs lowercase opacity-20">linked from your provider</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="lowercase text-xs opacity-40 ml-1">display name</Label>
                <div className="flex gap-2">
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="your name"
                    className="h-10 border border-white/10 rounded-lg bg-white/5 focus-visible:ring-primary/20 transition-all font-medium lowercase"
                    style={{ color: 'var(--text-color)' }}
                  />
                  <Button 
                    onClick={handleUpdateName} 
                    disabled={isUpdating}
                    size="sm"
                    className="h-10 px-6 rounded-lg font-bold lowercase bg-primary text-black hover:bg-primary/90"
                  >
                    {isUpdating ? "..." : "save"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="lowercase text-xs opacity-40 ml-1">email address</Label>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/[0.02]">
                  <Mail size={14} className="opacity-20" />
                  <span className="text-sm font-medium opacity-60">{session.user.email}</span>
                  <Lock size={12} className="ml-auto opacity-20" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Connected Accounts */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 pb-2 border-b border-white/5">
            <Users size={18} className="opacity-40" />
            <h2 className="text-xl font-bold lowercase">connections</h2>
          </div>

          <div className="max-w-md space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold lowercase">google</p>
                  {linkedAccounts.find(a => a.provider === 'google') ? (
                    <p className="text-[10px] uppercase font-bold text-emerald-500/60">connected</p>
                  ) : (
                    <p className="text-[10px] uppercase font-bold opacity-20">not active</p>
                  )}
                </div>
              </div>
              
              {linkedAccounts.find(a => a.provider === 'google') ? (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-4 rounded-md text-xs font-bold lowercase text-destructive hover:bg-destructive/10"
                  onClick={() => handleUnlinkAccount(linkedAccounts.find(a => a.provider === 'google').id)}
                >
                  unlink
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 px-4 rounded-md text-xs font-bold lowercase border-white/10 hover:bg-white/10"
                  onClick={() => handleLinkAccount('google')}
                >
                  <Plus size={12} className="mr-1.5" />
                  connect
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Active Sessions */}
        <section className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <div className="flex items-center gap-3">
              <Activity size={18} className="opacity-40" />
              <h2 className="text-xl font-bold lowercase">sessions</h2>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 h-6 px-2"
              onClick={fetchSessions}
            >
              refresh
            </Button>
          </div>

          <div className="rounded-lg border border-white/10 overflow-hidden">
            <Table>
              <TableHeader className="bg-white/[0.02]">
                <TableRow className="hover:bg-transparent border-white/10">
                  <TableHead className="h-10 px-4 text-[10px] uppercase font-bold opacity-40">device</TableHead>
                  <TableHead className="h-10 px-4 text-[10px] uppercase font-bold opacity-40">ip</TableHead>
                  <TableHead className="h-10 px-4 text-[10px] uppercase font-bold opacity-40">last seen</TableHead>
                  <TableHead className="h-10 px-4 text-right text-[10px] uppercase font-bold opacity-40">action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingSessions ? (
                  <TableRow className="hover:bg-transparent border-white/5">
                    <TableCell colSpan={4} className="text-center py-12 text-xs opacity-20 lowercase">loading sessions...</TableCell>
                  </TableRow>
                ) : activeSessions.length === 0 ? (
                  <TableRow className="hover:bg-transparent border-white/5">
                    <TableCell colSpan={4} className="text-center py-12 text-xs opacity-20 lowercase">no active sessions</TableCell>
                  </TableRow>
                ) : activeSessions.map((s) => (
                  <TableRow key={s.id} className="hover:bg-white/5 border-white/5">
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {s.userAgent?.toLowerCase().includes("mobile") ? <Smartphone size={14} className="opacity-40" /> : <Monitor size={14} className="opacity-40" />}
                        <span className="text-xs font-medium lowercase opacity-80">{getDeviceName(s.userAgent)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-[10px] font-mono opacity-40">
                      {s.ipAddress || "unknown"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-[10px] lowercase opacity-40">
                      {format(new Date(s.createdAt), "MMM d, HH:mm")}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 px-3 rounded-md text-[10px] font-bold lowercase text-destructive hover:bg-destructive/10"
                        onClick={() => handleRevokeSession(s.token)}
                      >
                        <LogOut size={10} className="mr-1.5" />
                        revoke
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="space-y-6 pt-8 border-t border-destructive/10">
          <div className="flex items-center gap-3">
            <Trash2 size={18} className="text-destructive opacity-60" />
            <h2 className="text-xl font-bold lowercase text-destructive opacity-80">danger zone</h2>
          </div>

          <div className="p-6 rounded-lg border border-destructive/20 bg-destructive/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <p className="text-sm font-bold lowercase">delete account</p>
              <p className="text-xs lowercase opacity-40 max-w-md">
                permanently remove your account and all associated data including typing history and achievements.
              </p>
            </div>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleDeleteAccount}
              className="px-6 rounded-lg font-bold lowercase h-10"
            >
              delete profile
            </Button>
          </div>
        </section>
      </div>
    </motion.main>
  );
}
