"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventCard from "@/components/EventCard";
import ActivityFeed from "@/components/ActivityFeed";
import Navbar from "@/components/Navbar";
import { TrendingUp, Flame, Calendar, Users, Sparkles, Star, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Event {
  id: number;
  title: string;
  sport: string;
  league?: string | null;
  date: string;
  location?: string | null;
  homeTeam?: string | null;
  awayTeam?: string | null;
  score?: string | null;
  imageUrl?: string | null;
  description?: string | null;
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState<string>("all");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events?limit=12&sort=date&order=desc");
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const sports = ["all", "Basketball", "Football", "Soccer", "Baseball", "Hockey"];
  
  const filteredEvents = selectedSport === "all" 
    ? events 
    : events.filter(event => event.sport === selectedSport);

  const mockActivities = events.slice(0, 5).map((event, index) => ({
    id: index,
    type: "review" as const,
    user: {
      id: index + 1,
      name: ["John Smith", "Sarah Jones", "Michael Chen", "Emma Wilson", "Alex Rodriguez"][index],
      username: ["sportsf4n", "hoopsdreams", "soccerlover", "courtqueen", "gridironguru"][index],
      avatar: `https://i.pravatar.cc/150?img=${index + 1}`,
    },
    event: {
      id: event.id,
      title: event.title,
      sport: event.sport,
    },
    review: {
      rating: 5 - index,
      content: [
        "Amazing game! The atmosphere was electric and the finish was incredible.",
        "Best game of the season! The intensity never dropped and every possession mattered.",
        "Spectacular performance from both sides. This is why we love sports!",
        "Unforgettable experience! The team chemistry was phenomenal.",
        "Absolutely thrilling from start to finish. Every moment kept you guessing."
      ][index],
    },
    createdAt: new Date(Date.now() - index * 3600000).toISOString(),
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue/5 via-transparent to-green/5" />
        
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue/10 text-blue border border-blue/20">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium tracking-wide">Your Ultimate Sports Companion</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
              Track, Review, and Share Your
              <span className="block mt-2 bg-gradient-to-r from-orange via-green to-blue bg-clip-text text-transparent">
                SPORTS MOMENTS
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The social network for sports fans. Log the games you watch, rate and review events, 
              and connect with fellow enthusiasts worldwide.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <Button size="lg" asChild className="text-lg px-8 py-6 bg-blue hover:bg-blue/90">
                <Link href="/sign-up">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Get Started Free
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 border-2">
                <Link href="/discover">
                  Discover Events
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-16 max-w-2xl mx-auto">
              <div className="text-center p-6 rounded-xl bg-card/50 border border-border/50">
                <div className="text-4xl font-bold text-orange">{events.length}+</div>
                <div className="text-sm font-medium text-muted-foreground mt-1">Events</div>
              </div>
              <div className="text-center p-6 rounded-xl bg-card/50 border border-border/50">
                <div className="text-4xl font-bold text-green">15+</div>
                <div className="text-sm font-medium text-muted-foreground mt-1">Reviews</div>
              </div>
              <div className="text-center p-6 rounded-xl bg-card/50 border border-border/50">
                <div className="text-4xl font-bold text-blue">5</div>
                <div className="text-sm font-medium text-muted-foreground mt-1">Sports Fans</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            {/* Featured Events */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange/10 rounded-lg">
                    <Flame className="w-6 h-6 text-orange" />
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight">Trending Events</h2>
                </div>
                <Button variant="ghost" asChild className="gap-2">
                  <Link href="/discover">
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>

              {/* Sport Filter */}
              <Tabs value={selectedSport} onValueChange={setSelectedSport} className="mb-8">
                <TabsList className="w-full justify-start overflow-x-auto flex-nowrap bg-muted/30 p-1 h-auto">
                  {sports.map((sport) => (
                    <TabsTrigger 
                      key={sport} 
                      value={sport} 
                      className="capitalize px-6 py-2 data-[state=active]:bg-blue data-[state=active]:text-white"
                    >
                      {sport}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              {loading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="aspect-[3/4] w-full rounded-xl" />
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No events found for this sport</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredEvents.slice(0, 6).map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </section>

            {/* Popular Sports */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-green/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Popular Sports</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {["Basketball", "Football", "Soccer", "Baseball", "Hockey", "Tennis"].map((sport, idx) => (
                  <Link
                    key={sport}
                    href={`/discover?sport=${sport}`}
                    className="group p-8 border border-border/50 rounded-xl hover:border-blue hover:bg-card/50 transition-all"
                  >
                    <div className="text-4xl mb-4">
                      {["🏀", "🏈", "⚽", "⚾", "🏒", "🎾"][idx]}
                    </div>
                    <h3 className="font-bold text-xl group-hover:text-blue transition-colors mb-1">
                      {sport}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Explore events
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Recent Activity */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue/10 rounded-lg">
                  <Users className="w-5 h-5 text-blue" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Activity</h2>
              </div>
              <ActivityFeed activities={mockActivities} />
            </section>

            {/* Call to Action */}
            <div className="p-8 border border-border/50 rounded-xl bg-gradient-to-br from-blue/5 to-green/5 space-y-5">
              <div className="p-3 bg-blue/10 rounded-xl w-fit">
                <Star className="w-6 h-6 text-blue" />
              </div>
              <h3 className="font-bold text-2xl">Join the Community</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Create an account to start tracking events, writing reviews, and connecting with other sports fans worldwide.
              </p>
              <Button className="w-full h-12 text-base font-bold bg-blue hover:bg-blue/90" asChild>
                <Link href="/sign-up">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Sign Up Now
                </Link>
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="p-8 border border-border/50 rounded-xl space-y-6 bg-card/30">
              <h3 className="font-bold text-xl">Platform Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm font-medium text-muted-foreground">Total Events</span>
                  <Badge variant="secondary" className="font-bold">{events.length}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm font-medium text-muted-foreground">Active Users</span>
                  <Badge variant="secondary" className="font-bold">5</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm font-medium text-muted-foreground">Reviews Written</span>
                  <Badge variant="secondary" className="font-bold">15</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm font-medium text-muted-foreground">Sports Covered</span>
                  <Badge variant="secondary" className="font-bold">6</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-24 py-12 bg-card/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8">
                <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="60" height="60" rx="12" stroke="currentColor" strokeWidth="4" className="text-foreground"/>
                  <rect x="14" y="18" width="10" height="28" rx="2" fill="#FF6B35"/>
                  <rect x="27" y="18" width="10" height="28" rx="2" fill="#2ECC71"/>
                  <rect x="40" y="18" width="10" height="28" rx="2" fill="#3498DB"/>
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">
                © 2024 <span className="font-semibold">scoreboxd</span>. Track your sports journey.
              </p>
            </div>
            <div className="flex gap-8">
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}