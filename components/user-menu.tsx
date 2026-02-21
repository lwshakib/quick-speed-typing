"use client";

// Import authentication utilities for session access and termination
import { useSession, signOut } from "@/lib/auth-client";
// Import dropdown menu primitive for the user interface
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// Import Avatar sub-components for user visualization
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// Import basic button and icon sets
import { Button } from "@/components/ui/button";
import { User, LogOut, LayoutDashboard, Settings } from "lucide-react";
// Import Next.js linking for client-side navigation
import Link from "next/link";
// Import notification toolkit
import { toast } from "sonner";

/**
 * UserMenu: A specialized dropdown component allowing authenticated users to
 * navigate to their profile, settings, and manage their session.
 */
export function UserMenu() {
  const { data: session } = useSession();

  // Guard clause: Ensure the menu only renders for authenticated users
  if (!session) return null;

  const user = session.user;
  // Logic to generate display initials if an avatar image is unavailable
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <DropdownMenu>
      {/* TRIGGER: A minimalist user icon with subtle hover scale effects */}
      <DropdownMenuTrigger asChild>
        <button className="hover:text-foreground transition-colors cursor-pointer hover:scale-110 active:scale-95 duration-200 outline-none">
          <User size={16} />
        </button>
      </DropdownMenuTrigger>

      {/* CONTENT: The main menu panel, styled to match the app's global theme and monospace aesthetic */}
      <DropdownMenuContent 
        className="w-56 p-2 border-2 rounded-xl shadow-2xl font-mono" 
        align="end" 
        forceMount
        style={{
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
            color: 'var(--sub-color)'
        }}
      >
        {/* Profile Header: Shows the logged-in user's identity */}
        <DropdownMenuLabel className="font-normal px-3 py-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border border-secondary/10 shrink-0">
              <AvatarImage src={user.image || ""} alt={user.name || "User"} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1 overflow-hidden">
              <p className="text-sm font-bold leading-none text-foreground truncate" style={{ color: 'var(--text-color)' }}>{user.name}</p>
              <p className="text-[10px] font-medium leading-none opacity-50 truncate">
                {user.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="opacity-10 bg-current" />
        
        {/* NAV SECTION: Links to various personal management pages */}
        <div className="p-1 flex flex-col gap-1">
            <DropdownMenuItem asChild className="rounded-lg cursor-pointer hover:bg-primary/10 focus:bg-primary/10 group transition-all duration-200">
              <Link href="/profile" className="flex items-center w-full px-2 py-2">
                <User size={16} className="mr-3 text-primary" />
                <span className="text-xs font-bold lowercase group-hover:text-foreground transition-colors">profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-lg cursor-pointer hover:bg-primary/10 focus:bg-primary/10 group transition-all duration-200">
              <Link href="/settings" className="flex items-center w-full px-2 py-2">
                <Settings size={16} className="mr-3 text-primary" />
                <span className="text-xs font-bold lowercase group-hover:text-foreground transition-colors">settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-lg cursor-pointer hover:bg-primary/10 focus:bg-primary/10 group transition-all duration-200">
              <Link href="/account" className="flex items-center w-full px-2 py-2">
                <LayoutDashboard size={16} className="mr-3 text-primary" />
                <span className="text-xs font-bold lowercase group-hover:text-foreground transition-colors">account</span>
              </Link>
            </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="opacity-10 bg-current" />
        
        {/* ACTION SECTION: Critical actions like session termination */}
        <div className="p-1">
            <DropdownMenuItem
              className="rounded-lg cursor-pointer hover:bg-destructive/10 focus:bg-destructive/10 group transition-all duration-200"
              onClick={async () => {
                await signOut();
                toast.success("logged out successfully");
                window.location.href = "/"; // Force redirect to home
              }}
            >
              <div className="flex items-center w-full px-2 py-2 text-destructive">
                <LogOut size={16} className="mr-3" />
                <span className="text-xs font-bold lowercase">log out</span>
              </div>
            </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
