"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trophy, LogOut, User, Search, Home, List, Sparkles } from "lucide-react";
import { useSession, authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function Navbar() {
  const { data: session, refetch } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    const token = localStorage.getItem("bearer_token");

    const { error } = await authClient.signOut({
      fetchOptions: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    if (error?.code) {
      toast.error("Failed to sign out");
    } else {
      localStorage.removeItem("bearer_token");
      refetch();
      toast.success("Signed out successfully");
      router.push("/");
      router.refresh();
    }
  };

  return (
    <nav className="border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 font-bold text-xl group">
            <div className="relative p-2.5 bg-gradient-to-br from-primary to-primary/70 rounded-xl shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
              <Trophy className="w-6 h-6 text-primary-foreground" />
              <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="hidden sm:inline font-display text-2xl tracking-wider bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              SPORTLOG
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild className="gap-2 hover:bg-primary/10 transition-colors">
              <Link href="/">
                <Home className="w-5 h-5" />
                <span className="hidden sm:inline font-semibold">Home</span>
              </Link>
            </Button>
            <Button variant="ghost" asChild className="gap-2 hover:bg-primary/10 transition-colors">
              <Link href="/discover">
                <Search className="w-5 h-5" />
                <span className="hidden sm:inline font-semibold">Discover</span>
              </Link>
            </Button>
            <Button variant="ghost" asChild className="gap-2 hover:bg-primary/10 transition-colors">
              <Link href="/lists">
                <List className="w-5 h-5" />
                <span className="hidden sm:inline font-semibold">Lists</span>
              </Link>
            </Button>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-12 w-12 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                    <Avatar className="h-11 w-11">
                      <AvatarImage src={session.user.image || undefined} alt={session.user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-bold">
                        {session.user.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2">
                  <DropdownMenuLabel className="p-3">
                    <div className="flex flex-col space-y-1.5">
                      <p className="text-base font-bold leading-none">{session.user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground font-medium">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer p-3">
                    <Link href="/profile" className="flex items-center">
                      <User className="w-4 h-4 mr-3" />
                      <span className="font-medium">Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer p-3">
                    <Link href="/my-lists" className="flex items-center">
                      <List className="w-4 h-4 mr-3" />
                      <span className="font-medium">My Lists</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive p-3 font-medium">
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild className="font-semibold">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild className="shadow-lg font-semibold">
                  <Link href="/sign-up">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Sign Up
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}