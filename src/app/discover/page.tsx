"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import EventCard from "@/components/EventCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, SlidersHorizontal, Sparkles, TrendingUp } from "lucide-react";
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

export default function DiscoverPage() {
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState(searchParams.get("sport") || "all");
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    fetchEvents();
  }, [selectedSport, sortBy]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      let url = `/api/events?limit=50&sort=${sortBy}&order=desc`;
      
      if (selectedSport !== "all") {
        url += `&sport=${selectedSport}`;
      }

      const response = await fetch(url);
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

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchEvents();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/events?search=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error("Error searching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const sports = ["all", "Basketball", "Football", "Soccer", "Baseball", "Hockey", "Tennis", "Cricket", "F1"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Discover Amazing Events</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent font-display">
            EXPLORE SPORTS
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Search and filter through thousands of sports events from around the world
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-10 space-y-6 max-w-4xl mx-auto">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search events, teams, leagues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-12 h-14 text-lg border-2 focus:border-primary shadow-lg"
              />
            </div>
            <Button onClick={handleSearch} size="lg" className="px-8 shadow-lg">
              <Search className="w-5 h-5 mr-2" />
              Search
            </Button>
          </div>

          <div className="flex flex-wrap gap-4 items-center justify-center">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <SlidersHorizontal className="w-4 h-4" />
              Filters:
            </div>
            <Select value={selectedSport} onValueChange={setSelectedSport}>
              <SelectTrigger className="w-[200px] h-11 border-2 shadow-md">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sport" />
              </SelectTrigger>
              <SelectContent>
                {sports.map((sport) => (
                  <SelectItem key={sport} value={sport}>
                    {sport === "all" ? "All Sports" : sport}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px] h-11 border-2 shadow-md">
                <TrendingUp className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Event Date</SelectItem>
                <SelectItem value="createdAt">Recently Added</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[3/4] w-full rounded-xl" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold mb-2">No events found</p>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="h-1 w-12 bg-primary rounded-full"></div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Found {events.length} event{events.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}