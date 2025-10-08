"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
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
import { Search, User as UserIcon, Moon, Sun } from "lucide-react";
import { useSession, authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function Navbar() {
  const { data: session, refetch } = useSession();
  const router = useRouter();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

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
    <nav className="border-b border-border/50 bg-background/95 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 transition-transform group-hover:scale-105">
              <svg width="40" height="40" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="60" height="60" rx="12" stroke="currentColor" strokeWidth="4" className="text-foreground"/>
                <rect x="14" y="18" width="10" height="28" rx="2" fill="#FF6B35"/>
                <rect x="27" y="18" width="10" height="28" rx="2" fill="#2ECC71"/>
                <rect x="40" y="18" width="10" height="28" rx="2" fill="#3498DB"/>
              </svg>
            </div>
            <span className="text-xl font-normal tracking-tight text-foreground group-hover:text-foreground/80 transition-colors">
              scoreboxd
            </span>
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground hover:bg-transparent font-normal">
              <Link href="/">Home</Link>
            </Button>
            <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground hover:bg-transparent font-normal">
              <Link href="/discover">Explore</Link>
            </Button>
            <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground hover:bg-transparent font-normal">
              <Link href="/lists">Lists</Link>
            </Button>
            <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground hover:bg-transparent font-normal">
              <Link href="/profile">Journal</Link>
            </Button>
            <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground hover:bg-transparent font-normal">
              <Link href="/members">Members</Link>
            </Button>
          </div>

          {/* Right Side - Search, Theme Toggle and User */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-transparent">
              <Search className="w-5 h-5" />
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground hover:bg-transparent"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </Button>

            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-transparent">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user.image || undefined} alt={session.user.name} />
                      <AvatarFallback className="bg-muted text-foreground text-xs">
                        {session.user.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{session.user.name}</p>
                      <p className="text-xs text-muted-foreground">{session.user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/lists">My Lists</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" asChild className="text-muted-foreground hover:text-foreground hover:bg-transparent">
                <Link href="/sign-in">
                  <UserIcon className="w-5 h-5" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}