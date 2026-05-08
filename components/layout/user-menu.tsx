'use client';

// Import authentication utilities for session access and termination
import { useSession, signOut } from '@/lib/auth-client';
import { useState } from 'react';
// Import dropdown menu primitive for the user interface
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// Import Avatar sub-components for user visualization
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// Import basic button and icon sets
import { User, LogOut, LayoutDashboard, Settings } from 'lucide-react';
// Import Next.js linking for client-side navigation
import Link from 'next/link';
// Import notification toolkit
import { toast } from 'sonner';
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

/**
 * UserMenu: A specialized dropdown component allowing authenticated users to
 * navigate to their profile, settings, and manage their session.
 */
export function UserMenu() {
  const { data: session } = useSession();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Guard clause: Ensure the menu only renders for authenticated users
  if (!session) return null;

  const user = session.user;
  // Logic to generate display initials if an avatar image is unavailable
  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <>
      <DropdownMenu>
        {/* TRIGGER: A minimalist user icon with subtle hover scale effects */}
        <DropdownMenuTrigger asChild>
          <button className="hover:text-foreground cursor-pointer transition-colors duration-200 outline-none hover:scale-110 active:scale-95">
            <User size={16} />
          </button>
        </DropdownMenuTrigger>

        {/* CONTENT: The main menu panel, styled to match the app's global theme and monospace aesthetic */}
        <DropdownMenuContent
          className="w-56 rounded-xl border-2 p-2 font-mono shadow-2xl"
          align="end"
          forceMount
          style={{
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
            color: 'var(--sub-color)',
          }}
        >
          {/* Profile Header: Shows the logged-in user's identity */}
          <DropdownMenuLabel className="px-3 py-3 font-normal">
            <div className="flex items-center gap-3">
              <Avatar className="border-secondary/10 h-8 w-8 shrink-0 border">
                <AvatarImage src={user.image || ''} alt={user.name || 'User'} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1 overflow-hidden">
                <p
                  className="text-foreground truncate text-sm leading-none font-bold"
                  style={{ color: 'var(--text-color)' }}
                >
                  {user.name}
                </p>
                <p className="truncate text-[10px] leading-none font-medium opacity-50">
                  {user.email}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="bg-current opacity-10" />

          {/* NAV SECTION: Links to various personal management pages */}
          <div className="flex flex-col gap-1 p-1">
            <DropdownMenuItem
              asChild
              className="hover:bg-primary/10 focus:bg-primary/10 group cursor-pointer rounded-lg transition-all duration-200"
            >
              <Link href="/profile" className="flex w-full items-center px-2 py-2">
                <User size={16} className="text-primary mr-3" />
                <span className="group-hover:text-foreground text-xs font-bold lowercase transition-colors">
                  profile
                </span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className="hover:bg-primary/10 focus:bg-primary/10 group cursor-pointer rounded-lg transition-all duration-200"
            >
              <Link href="/settings" className="flex w-full items-center px-2 py-2">
                <Settings size={16} className="text-primary mr-3" />
                <span className="group-hover:text-foreground text-xs font-bold lowercase transition-colors">
                  settings
                </span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className="hover:bg-primary/10 focus:bg-primary/10 group cursor-pointer rounded-lg transition-all duration-200"
            >
              <Link href="/account" className="flex w-full items-center px-2 py-2">
                <LayoutDashboard size={16} className="text-primary mr-3" />
                <span className="group-hover:text-foreground text-xs font-bold lowercase transition-colors">
                  account
                </span>
              </Link>
            </DropdownMenuItem>
          </div>

          <DropdownMenuSeparator className="bg-current opacity-10" />

          {/* ACTION SECTION: Critical actions like session termination */}
          <div className="p-1">
            <DropdownMenuItem
              className="hover:bg-destructive/10 focus:bg-destructive/10 group cursor-pointer rounded-lg transition-all duration-200"
              onSelect={(e) => {
                e.preventDefault();
                setLogoutOpen(true);
              }}
            >
              <div className="text-destructive flex w-full items-center px-2 py-2">
                <LogOut size={16} className="mr-3" />
                <span className="text-xs font-bold lowercase">log out</span>
              </div>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>log out?</AlertDialogTitle>
            <AlertDialogDescription>
              you will be signed out of this device. you can sign back in anytime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSigningOut}>cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isSigningOut}
              onClick={async () => {
                setIsSigningOut(true);
                try {
                  await signOut();
                  toast.success('logged out successfully');
                  window.location.href = '/';
                } finally {
                  setIsSigningOut(false);
                }
              }}
            >
              {isSigningOut ? 'logging out...' : 'log out'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
