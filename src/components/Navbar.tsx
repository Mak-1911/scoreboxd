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
        <div className="flex h-16 items-center justify-center w-full">
          <div className="flex items-center justify-between w-[70%]">
            {/* Logo */}
            <Link href="/" className="md:flex items-center gap-3 group">
              <div className="relative w-30 h-30 transition-transform group-hover:scale-105 flex items-center justify-center">
                <Image 
                  src="/nav_logo.png" 
                  alt="Scoreboxd Logo" 
                  width={100} 
                  height={100} 
                  className="object-contain"
                />
              </div>
            </Link>

            {/* Center Navigation */}
            <div className="flex items-center gap-6">
              <Link 
                href="/" 
                className="text-foreground font-normal px-2 hover:bg-transparent hover:scale-110 transition-transform duration-200 inline-block"
              >
                Home
              </Link>
              <Link 
                href="/discover" 
                className="text-foreground font-normal px-2 hover:bg-transparent hover:scale-110 transition-transform duration-200 inline-block"
              >
                Discover
              </Link>
              <Link 
                href="/lists" 
                className="text-foreground font-normal px-2 hover:bg-transparent hover:scale-110 transition-transform duration-200 inline-block"
              >
                Lists
              </Link>
              <Link 
                href="/profile" 
                className="text-foreground font-normal px-2 hover:bg-transparent hover:scale-110 transition-transform duration-200 inline-block"
              >
                Journal
              </Link>
              <Link 
                href="/members" 
                className="text-foreground font-normal px-2 hover:bg-transparent hover:scale-110 transition-transform duration-200 inline-block"
              >
                Members
              </Link>
            </div>

            {/* Right Side - Search, Theme Toggle and User */}
            <div className="flex items-center gap-2">
              <button 
                className="text-muted-foreground hover:text-foreground hover:bg-transparent hover:scale-110 transition-transform duration-200 p-2 rounded-md"
                onClick={() => console.log('Search clicked')}
              >
                <Search className="w-5 h-5" />
              </button>

              <button 
                className="text-muted-foreground hover:text-foreground hover:bg-transparent hover:scale-110 transition-transform duration-200 p-2 rounded-md"
                onClick={toggleTheme}
              >
                {theme === "light" ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </button>

              {session?.user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="rounded-full hover:bg-transparent hover:scale-110 transition-transform duration-200 p-1">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={session.user.image || undefined} alt={session.user.name} />
                        <AvatarFallback className="bg-muted text-foreground text-xs">
                          {session.user.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </button>
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
                <Link 
                  href="/sign-in"
                  className="text-muted-foreground hover:text-foreground hover:bg-transparent hover:scale-110 transition-transform duration-200 p-2 rounded-md inline-block"
                >
                  <UserIcon className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}