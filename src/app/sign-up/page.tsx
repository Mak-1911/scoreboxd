"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react"; // Added ArrowLeft icon import
// Removed Navbar import

type ErrorTypes = Partial<Record<keyof typeof authClient.$ERROR_CODES, string>>;
const errorCodes = {
  USER_ALREADY_EXISTS: "User already registered with this email",
} satisfies ErrorTypes;

const getErrorMessage = (code: string) => {
  if (code in errorCodes) {
    return errorCodes[code as keyof typeof errorCodes];
  }
  return "Registration failed. Please try again.";
};

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        email,
        name,
        password,
      });

      if (error?.code) {
        toast.error(getErrorMessage(error.code));
        return;
      }

      toast.success("Account created successfully!");
      router.push("/sign-in?registered=true");
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Removed Navbar component */}
      <div className="flex items-center justify-center p-4 pt-20">
        {/* Large Card Container - 70% width */}
        <div className="w-[70%] bg-card rounded-2xl shadow-lg overflow-hidden relative">
          {/* Back Link with Icon in Circle Container */}
          <Link 
            href="#"
            className="absolute top-4 left-4 z-10"
            onClick={(e) => {
              e.preventDefault();
              router.back();
            }}
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-all duration-200 hover:scale-120">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </div>
          </Link>
          
          {/* Two sections side by side with no gap */}
          <div className="flex h-full">
            {/* Left Section - Sign-up Form */}
            <div className="w-1/2 p-8 flex flex-col justify-center">
              <div className="space-y-1 text-center mb-8">
                <div className="flex justify-center mb-4">
                  {/* Nav logo and Create Account title side by side */}
                  <div className="flex items-center justify-center gap-3">
                    <div className="p-1">
                      <img src="/nav_logo.png" alt="Logo" className="w-17 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold">Create an Account</h1>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Join the community and start tracking your favorite sports events
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    minLength={8}
                  />
                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters long
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link href="/sign-in" className="text-primary font-semibold hover:underline">
                  Sign in
                </Link>
              </div>
            </div>

            {/* Right Section - Background Video with Grain Effect (now full width) */}
            <div className="w-1/2 relative">
              {/* Background Video - Full width and height */}
              <div className="absolute inset-0">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover opacity-80"
                >
                  <source src="/bg.mp4" type="video/mp4" />
                </video>
              </div>

              {/* Enhanced Grid Dots Overlay */}
              <div className="absolute inset-0 pointer-events-none" 
                   style={{
                     background: `
                       linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                       linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                     `,
                     backgroundSize: "20px 20px",
                     opacity: 0.3,
                     mixBlendMode: "overlay"
                   }} />
                   
              {/* Grainy Effect Overlay */}
              <div className="absolute inset-0 pointer-events-none"
                   style={{
                     background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.3'/%3E%3C/svg%3E")`,
                     opacity: 0.4,
                     mixBlendMode: "overlay"
                   }} />

              {/* Additional Visual Enhancements */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/30" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}