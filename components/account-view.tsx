'use client';

import Image from 'next/image';

// Import core React hooks for state and lifecycle management
import { useState, useEffect } from 'react';
// Import authentication client hooks for sessions and user data
import { authClient, useSession } from '@/lib/auth-client';
// Import UI components from the project's design system
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
// Import a set of icons to enrich the visual categories
import {
  User,
  Trash2,
  Smartphone,
  Monitor,
  Plus,
  LogOut,
  Mail,
  Lock,
  Settings,
  Activity,
  Users,
} from 'lucide-react';
// Import feedback and utility functions
import { toast } from 'sonner';
import { format } from 'date-fns';
// Import animation library for entrance transitions
import { motion } from 'framer-motion';

export function AccountView() {
  const { data: session } = useSession();

  // Local state for profile and account management
  const [name, setName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeSessions, setActiveSessions] = useState<Record<string, unknown>[]>([]);
  const [linkedAccounts, setLinkedAccounts] = useState<Record<string, unknown>[]>([]);
  // Tracking loading states for different segments of the account view
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);

  // Synchronize state with current session data when it becomes available
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      fetchSessions();
      fetchAccounts();
    }
  }, [session]);

  // Fetch all active browser/app sessions for the current user
  const fetchSessions = async () => {
    try {
      const { data } = await authClient.listSessions();
      setActiveSessions(data || []);
    } catch {
      console.error('Failed to fetch sessions');
    } finally {
      setIsLoadingSessions(false);
    }
  };

  // Fetch linked social accounts and providers
  const fetchAccounts = async () => {
    try {
      if ('listAccounts' in authClient) {
        const { data } = await (authClient as unknown as { listAccounts: () => Promise<{ data: Record<string, unknown>[] }> }).listAccounts();
        setLinkedAccounts(data || []);
      }
    } catch {
      console.error('Failed to fetch accounts');
    } finally {
      // Logic for accounts loading finished
    }
  };

  // Logic to update the user's public display name
  const handleUpdateName = async () => {
    if (!name.trim()) return toast.error('name cannot be empty');
    setIsUpdating(true);
    try {
      await authClient.updateUser({
        name: name,
      });
      toast.success('profile updated');
    } catch {
      toast.error('failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  // Logic to delete the entire user profile and linked data
  const handleDeleteAccount = async () => {
    if (confirm('are you sure? this will delete all your typing data permanently.')) {
      try {
        await authClient.deleteUser();
        toast.success('account deleted');
        window.location.href = '/'; // Force redirect to homepage
      } catch {
        toast.error('failed to delete account');
      }
    }
  };

  // Logic to kick a specific session out
  const handleRevokeSession = async (token: string) => {
    try {
      await authClient.revokeSession({ token });
      toast.success('session revoked');
      fetchSessions(); // Refresh list after modification
    } catch {
      toast.error('failed to revoke session');
    }
  };

  // Redirect to social provider for account linking
  const handleLinkAccount = async (provider: 'google') => {
    try {
      await authClient.signIn.social({
        provider: provider,
        callbackURL: window.location.href,
      });
    } catch {
      toast.error(`failed to link ${provider} account`);
    }
  };

  // Remove a linked social provider
  const handleUnlinkAccount = async (accountId: string) => {
    // Safety check to prevent users from losing all login methods
    if (linkedAccounts.length <= 1 && !session?.user?.email) {
      return toast.error('you must have at least one login method');
    }

    try {
      if ('unlinkAccount' in authClient) {
        await (authClient as unknown as { unlinkAccount: (p: { accountId: string }) => Promise<void> }).unlinkAccount({ accountId });
        toast.success('account unlinked');
        fetchAccounts();
      }
    } catch {
      toast.error('failed to unlink account');
    }
  };

  // Helper function to parse user agents into human-readable device/browser names
  const getDeviceName = (userAgent: string) => {
    if (!userAgent) return 'unknown device';
    const browsers = ['chrome', 'firefox', 'safari', 'edge', 'opera'];
    const os = ['windows', 'macintosh', 'linux', 'android', 'iphone'];
    const lowerUA = userAgent.toLowerCase();
    const browser = browsers.find((b) => lowerUA.includes(b)) || 'browser';
    const platform = os.find((p) => lowerUA.includes(p)) || 'device';
    return `${browser} / ${platform}`;
  };

  if (!session) return null;

  return (
    // Centered wrapper for all account-related settings
    <motion.main
      className="mx-auto w-full max-w-4xl flex-1 space-y-16 px-6 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header section with page identifier */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase opacity-40">
          <Settings size={12} />
          <span>account</span>
        </div>
        <h1
          className="text-3xl font-black tracking-tighter lowercase"
          style={{ color: 'var(--text-color)' }}
        >
          settings
        </h1>
      </div>

      <div className="grid gap-16">
        {/* Profile Section: Basic identity management */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-2">
            <User size={18} className="opacity-40" />
            <h2 className="text-xl font-bold lowercase">profile</h2>
          </div>

          <div className="grid items-start gap-8 md:grid-cols-2">
            {/* Avatar and Name update block */}
            <div className="space-y-4">
              <div className="mb-2 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'user avatar'}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 opacity-20" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold lowercase opacity-40">profile picture</p>
                  <p className="text-xs lowercase opacity-20">linked from your provider</p>
                </div>
              </div>

              {/* Display name input with lowercase restriction matching the brand's aesthetic */}
              <div className="space-y-2">
                <Label htmlFor="name" className="ml-1 text-xs lowercase opacity-40">
                  display name
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="your name"
                    className="focus-visible:ring-primary/20 h-10 rounded-lg border border-white/10 bg-white/5 font-medium lowercase transition-all"
                    style={{ color: 'var(--text-color)' }}
                  />
                  <Button
                    onClick={handleUpdateName}
                    disabled={isUpdating}
                    size="sm"
                    className="bg-primary hover:bg-primary/90 h-10 rounded-lg px-6 font-bold text-black lowercase"
                  >
                    {isUpdating ? '...' : 'save'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Email section (Read-only as it's the primary identifier) */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="ml-1 text-xs lowercase opacity-40">email address</Label>
                <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3">
                  <Mail size={14} className="opacity-20" />
                  <span className="text-sm font-medium opacity-60">{session.user.email}</span>
                  <Lock size={12} className="ml-auto opacity-20" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Connections Section: Third-party auth providers */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-2">
            <Users size={18} className="opacity-40" />
            <h2 className="text-xl font-bold lowercase">connections</h2>
          </div>

          <div className="max-w-md space-y-3">
            {/* Individal provider account status visualization */}
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white overflow-hidden">
                  <Image src="https://www.google.com/favicon.ico" alt="Google" width={16} height={16} className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-bold lowercase">google</p>
                  {/* Status indicator for the connection */}
                  {linkedAccounts.find((a) => a.provider === 'google') ? (
                    <p className="text-[10px] font-bold text-emerald-500/60 uppercase">connected</p>
                  ) : (
                    <p className="text-[10px] font-bold uppercase opacity-20">not active</p>
                  )}
                </div>
              </div>

              {/* Dynamic Action Button based on connection state */}
              {linkedAccounts.find((a) => a.provider === 'google') ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10 h-8 rounded-md px-4 text-xs font-bold lowercase"
                  onClick={() =>
                    handleUnlinkAccount(linkedAccounts.find((a) => a.provider === 'google').id)
                  }
                >
                  unlink
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-md border-white/10 px-4 text-xs font-bold lowercase hover:bg-white/10"
                  onClick={() => handleLinkAccount('google')}
                >
                  <Plus size={12} className="mr-1.5" />
                  connect
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Sessions Section: Audit trail of active user logins */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div className="flex items-center gap-3">
              <Activity size={18} className="opacity-40" />
              <h2 className="text-xl font-bold lowercase">sessions</h2>
            </div>
            {/* Utility to refresh the session audit trail */}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-[10px] tracking-widest uppercase opacity-40 hover:opacity-100"
              onClick={fetchSessions}
            >
              refresh
            </Button>
          </div>

          {/* Table displaying granular session details */}
          <div className="overflow-hidden rounded-lg border border-white/10">
            <Table>
              <TableHeader className="bg-white/[0.02]">
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="h-10 px-4 text-[10px] font-bold uppercase opacity-40">
                    device
                  </TableHead>
                  <TableHead className="h-10 px-4 text-[10px] font-bold uppercase opacity-40">
                    ip
                  </TableHead>
                  <TableHead className="h-10 px-4 text-[10px] font-bold uppercase opacity-40">
                    last seen
                  </TableHead>
                  <TableHead className="h-10 px-4 text-right text-[10px] font-bold uppercase opacity-40">
                    action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Fallback states for different loading or empty conditions */}
                {isLoadingSessions ? (
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableCell
                      colSpan={4}
                      className="py-12 text-center text-xs lowercase opacity-20"
                    >
                      loading sessions...
                    </TableCell>
                  </TableRow>
                ) : activeSessions.length === 0 ? (
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableCell
                      colSpan={4}
                      className="py-12 text-center text-xs lowercase opacity-20"
                    >
                      no active sessions
                    </TableCell>
                  </TableRow>
                ) : (
                  activeSessions.map((s) => (
                    <TableRow key={s.id} className="border-white/5 hover:bg-white/5">
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {/* Visual device icon mapping */}
                          {s.userAgent?.toLowerCase().includes('mobile') ? (
                            <Smartphone size={14} className="opacity-40" />
                          ) : (
                            <Monitor size={14} className="opacity-40" />
                          )}
                          <span className="text-xs font-medium lowercase opacity-80">
                            {getDeviceName(s.userAgent)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 font-mono text-[10px] opacity-40">
                        {s.ipAddress || 'unknown'}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-[10px] lowercase opacity-40">
                        {format(new Date(s.createdAt), 'MMM d, HH:mm')}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-right">
                        {/* Interactive session termination */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10 h-7 rounded-md px-3 text-[10px] font-bold lowercase"
                          onClick={() => handleRevokeSession(s.token)}
                        >
                          <LogOut size={10} className="mr-1.5" />
                          revoke
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Danger Zone: Irreversible account actions highlighted in red */}
        <section className="border-destructive/10 space-y-6 border-t pt-8">
          <div className="flex items-center gap-3">
            <Trash2 size={18} className="text-destructive opacity-60" />
            <h2 className="text-destructive text-xl font-bold lowercase opacity-80">danger zone</h2>
          </div>

          <div className="border-destructive/20 bg-destructive/[0.02] flex flex-col justify-between gap-6 rounded-lg border p-6 md:flex-row md:items-center">
            <div className="space-y-1">
              <p className="text-sm font-bold lowercase">delete account</p>
              <p className="max-w-md text-xs lowercase opacity-40">
                permanently remove your account and all associated data including typing history and
                achievements.
              </p>
            </div>
            {/* High-visibility destructive button */}
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteAccount}
              className="h-10 rounded-lg px-6 font-bold lowercase"
            >
              delete profile
            </Button>
          </div>
        </section>
      </div>
    </motion.main>
  );
}
