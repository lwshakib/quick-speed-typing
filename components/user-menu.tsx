"use client";

import { useSession, signOut } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, LogOut, LayoutDashboard, Settings } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export function UserMenu() {
  const { data: session } = useSession();

  if (!session) return null;

  const user = session.user;
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative h-10 w-10 rounded-full outline-none group transition-transform active:scale-95 duration-200">
          <Avatar className="h-10 w-10 border-2 border-transparent group-hover:border-primary transition-all duration-300">
            <AvatarImage src={user.image || ""} alt={user.name || "User"} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
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
        <DropdownMenuLabel className="font-normal px-3 py-3">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-bold leading-none text-foreground" style={{ color: 'var(--text-color)' }}>{user.name}</p>
            <p className="text-[10px] font-medium leading-none opacity-50">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="opacity-10 bg-current" />
        <div className="p-1 flex flex-col gap-1">
            <DropdownMenuItem asChild className="rounded-lg cursor-pointer hover:bg-primary/10 focus:bg-primary/10 group transition-all duration-200">
              <Link href="/profile" className="flex items-center w-full px-2 py-2">
                <LayoutDashboard size={16} className="mr-3 text-primary" />
                <span className="text-xs font-bold lowercase group-hover:text-foreground transition-colors">Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-lg cursor-pointer hover:bg-primary/10 focus:bg-primary/10 group transition-all duration-200">
              <Link href="/settings" className="flex items-center w-full px-2 py-2">
                <Settings size={16} className="mr-3 text-primary" />
                <span className="text-xs font-bold lowercase group-hover:text-foreground transition-colors">Settings</span>
              </Link>
            </DropdownMenuItem>
        </div>
        <DropdownMenuSeparator className="opacity-10 bg-current" />
        <div className="p-1">
            <DropdownMenuItem
              className="rounded-lg cursor-pointer hover:bg-destructive/10 focus:bg-destructive/10 group transition-all duration-200"
              onClick={async () => {
                await signOut();
                toast.success("Logged out successfully");
                window.location.href = "/";
              }}
            >
              <div className="flex items-center w-full px-2 py-2 text-destructive">
                <LogOut size={16} className="mr-3" />
                <span className="text-xs font-bold lowercase">Log out</span>
              </div>
            </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
