'use client';

import Image from 'next/image';

// Import core React hooks for state and lifecycle management
import { useState, useEffect } from 'react';
// Import authentication client hooks for sessions and user data
import { authClient, useSession, signIn } from '@/lib/auth-client';
// Import UI components from the project's design system
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
import { useRef } from 'react';

interface SessionData {
  id?: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  token: string;
}

interface LinkedAccountData {
  id: string;
  provider?: string;
  providerId?: string;
}

export function AccountView() {
  const { data: session } = useSession();

  // Local state for profile and account management
  const [name, setName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeSessions, setActiveSessions] = useState<SessionData[]>([]);
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccountData[]>([]);
  // Tracking loading states for different segments of the account view
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch all active browser/app sessions for the current user
  const fetchSessions = async () => {
    try {
      const { data } = await authClient.listSessions();
      setActiveSessions((data as unknown as SessionData[]) || []);
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
        const { data } = await (
          authClient as unknown as {
            listAccounts: () => Promise<{ data: LinkedAccountData[] }>;
          }
        ).listAccounts();
        setLinkedAccounts(
          (data || []).map((acc) => ({
            ...acc,
            providerId: acc.providerId || acc.provider,
          })),
        );
      }
    } catch {
      console.error('Failed to fetch accounts');
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  // Synchronize state with current session data when it becomes available
  useEffect(() => {
    if (session?.user) {
      const handle = requestAnimationFrame(() => {
        setName(session.user.name || '');
        fetchSessions();
        fetchAccounts();
      });
      return () => cancelAnimationFrame(handle);
    }
  }, [session]);

  // Fetch signed URL if image is a path
  useEffect(() => {
    const fetchAvatarUrl = async () => {
      if (session?.user?.image && !session.user.image.startsWith('http')) {
        try {
          const res = await fetch(
            `/api/s3/signed-url?key=${encodeURIComponent(session.user.image)}`,
          );
          const data = await res.json();
          if (data.url) setAvatarUrl(data.url);
        } catch (err) {
          console.error('Failed to fetch signed avatar URL:', err);
        }
      } else {
        setAvatarUrl(session?.user?.image || null);
      }
    };
    fetchAvatarUrl();
  }, [session?.user?.image]);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      return toast.error('Please upload an image file');
    }
    if (file.size > 2 * 1024 * 1024) {
      return toast.error('File size must be less than 2MB');
    }

    setIsUploadingImage(true);
    try {
      // 1. Get presigned URL
      const res = await fetch('/api/s3/presigned-url', {
        method: 'POST',
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
        }),
      });

      const { url, key, error } = await res.json();
      if (error) throw new Error(error);

      // 2. Upload to S3
      const uploadRes = await fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadRes.ok) throw new Error('Failed to upload to S3');

      // 3. Update User Profile
      await authClient.updateUser({
        image: key,
      });

      toast.success('avatar updated');
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(err instanceof Error ? err.message : 'failed to upload avatar');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Logic to delete the entire user profile and linked data
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await authClient.deleteUser();
      toast.success('account deleted');
      window.location.href = '/'; // Force redirect to homepage
    } catch {
      toast.error('failed to delete account');
    } finally {
      setIsDeleting(false);
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
      if ('linkSocial' in authClient) {
        await (
          authClient as unknown as {
            linkSocial: (p: { provider: 'google'; callbackURL: string }) => Promise<void>;
          }
        ).linkSocial({
          provider,
          callbackURL: window.location.href,
        });
      } else {
        // Fallback: Better Auth can still link via social sign-in when account linking is enabled.
        await signIn.social({
          provider,
          callbackURL: window.location.href,
        });
      }
    } catch {
      toast.error(`failed to link ${provider} account`);
    }
  };

  // Remove a linked social provider
  const handleUnlinkAccount = async (providerId: string, accountId?: string) => {
    try {
      if ('unlinkAccount' in authClient) {
        const unlink = (
          authClient as unknown as {
            unlinkAccount: (p: { providerId?: string; accountId?: string }) => Promise<unknown>;
          }
        ).unlinkAccount;
        await unlink({ providerId, accountId });
        toast.success('account unlinked');
        fetchAccounts();
      }
    } catch {
      toast.error('failed to unlink account');
    }
  };

  // Helper function to parse user agents into human-readable device/browser names
  const getDeviceName = (userAgent: string | undefined | null) => {
    if (!userAgent) return 'unknown device';
    const browsers = ['chrome', 'firefox', 'safari', 'edge', 'opera'];
    const os = ['windows', 'macintosh', 'linux', 'android', 'iphone'];
    const lowerUA = userAgent.toLowerCase();
    const browser = browsers.find((b) => lowerUA.includes(b)) || 'browser';
    const platform = os.find((p) => lowerUA.includes(p)) || 'device';
    return `${browser} / ${platform}`;
  };

  if (!session) return null;

  const currentSessionToken =
    (session as unknown as { session?: { token?: string } })?.session?.token || null;

  const isProviderLinked = (providerId: string) =>
    linkedAccounts.some((a) => (a.providerId || a.provider) === providerId);

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
                <div
                  className="group hover:border-primary/50 relative flex h-16 w-16 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-all"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={session.user.name || 'user avatar'}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover transition-opacity group-hover:opacity-50"
                    />
                  ) : (
                    <User className="h-8 w-8 opacity-20" />
                  )}
                  {isUploadingImage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <Plus size={20} className="text-primary" />
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
                <div>
                  <p className="text-sm font-bold lowercase opacity-40">profile picture</p>
                  <p className="text-xs lowercase opacity-20">
                    {session.user.image && !session.user.image.startsWith('http')
                      ? 'stored securely on s3'
                      : 'linked from your provider'}
                  </p>
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
                <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/2 p-3">
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
            {isLoadingAccounts ? (
              <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-xs lowercase opacity-40">
                loading connections...
              </div>
            ) : (
              <div className="space-y-3">
                {/* Google */}
                <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-white">
                      <Image
                        src="https://www.google.com/favicon.ico"
                        alt="Google"
                        width={16}
                        height={16}
                        className="h-4 w-4"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold lowercase">google</p>
                      {isProviderLinked('google') ? (
                        <p className="text-[10px] font-bold text-emerald-500/60 uppercase">
                          connected
                        </p>
                      ) : (
                        <p className="text-[10px] font-bold uppercase opacity-20">not active</p>
                      )}
                    </div>
                  </div>

                  {isProviderLinked('google') ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10 h-8 rounded-md px-4 text-xs font-bold lowercase"
                      onClick={() => {
                        const acc = linkedAccounts.find(
                          (a) => (a.providerId || a.provider) === 'google',
                        );
                        handleUnlinkAccount('google', acc?.id);
                      }}
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

                {/* Email/Password is always available in this app */}
                <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/3 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/5">
                      <Mail size={14} className="opacity-40" />
                    </div>
                    <div>
                      <p className="text-sm font-bold lowercase">email</p>
                      <p className="text-[10px] font-bold uppercase opacity-20">primary</p>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold uppercase opacity-30">password login</div>
                </div>
              </div>
            )}
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

          <div className="space-y-2">
            {isLoadingSessions ? (
              <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-xs lowercase opacity-40">
                loading sessions...
              </div>
            ) : activeSessions.length === 0 ? (
              <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-xs lowercase opacity-40">
                no active sessions
              </div>
            ) : (
              activeSessions.map((s) => {
                const lastSeen = s.updatedAt || s.createdAt;
                const isCurrent = Boolean(currentSessionToken && s.token === currentSessionToken);

                return (
                  <div
                    key={s.token}
                    className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      {s.userAgent?.toLowerCase().includes('mobile') ? (
                        <Smartphone size={14} className="shrink-0 opacity-40" />
                      ) : (
                        <Monitor size={14} className="shrink-0 opacity-40" />
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="truncate text-xs font-medium lowercase opacity-80">
                            {getDeviceName(s.userAgent)}
                          </div>
                          {isCurrent ? (
                            <span className="shrink-0 rounded-full border border-white/10 bg-white/3 px-2 py-0.5 text-[9px] font-bold uppercase opacity-40">
                              current
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] opacity-30">
                          <span className="font-mono">{s.ipAddress || 'unknown ip'}</span>
                          {lastSeen ? (
                            <span className="lowercase">
                              last used {format(new Date(lastSeen), 'MMM d, HH:mm')}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    {!isCurrent ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 h-8 rounded-md px-4 text-xs font-bold lowercase"
                        onClick={() => handleRevokeSession(s.token)}
                      >
                        <LogOut size={12} className="mr-1.5" />
                        revoke
                      </Button>
                    ) : (
                      <div className="text-[10px] font-bold uppercase opacity-20">active</div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Danger Zone: Irreversible account actions highlighted in red */}
        <section className="border-destructive/10 space-y-6 border-t pt-8">
          <div className="flex items-center gap-3">
            <Trash2 size={18} className="text-destructive opacity-60" />
            <h2 className="text-destructive text-xl font-bold lowercase opacity-80">danger zone</h2>
          </div>

          <div className="border-destructive/20 bg-destructive/2 flex flex-col justify-between gap-6 rounded-lg border p-6 md:flex-row md:items-center">
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
              onClick={() => setDeleteOpen(true)}
              className="h-10 rounded-lg px-6 font-bold lowercase"
            >
              delete profile
            </Button>
          </div>
        </section>
      </div>
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>delete profile?</AlertDialogTitle>
            <AlertDialogDescription>
              this action cannot be undone. it will permanently remove your account and typing data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDeleteAccount}
            >
              {isDeleting ? 'deleting...' : 'delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.main>
  );
}
