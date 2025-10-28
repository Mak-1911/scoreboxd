"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import EventCard from "@/components/EventCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, SlidersHorizontal, Sparkles, TrendingUp, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

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
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState(searchParams.get("sport") || "all");
  const [sortBy, setSortBy] = useState("date");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [currentPlaceholder, setCurrentPlaceholder] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Typewriter effect placeholders
  const placeholders = [
    "Italian Grand Prix",
    "India vs Australia",
    "NBA Finals",
    "Wimbledon Championship",
    "World Cup Final"
  ];

  // Typewriter effect
  useEffect(() => {
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseTime = 2000;

    const currentPlaceholderText = placeholders[placeholderIndex];
    
    if (!isDeleting && currentPlaceholder.length < currentPlaceholderText.length) {
      // Typing
      const timeout = setTimeout(() => {
        setCurrentPlaceholder(currentPlaceholderText.substring(0, currentPlaceholder.length + 1));
      }, typingSpeed);
      return () => clearTimeout(timeout);
    } else if (!isDeleting && currentPlaceholder.length === currentPlaceholderText.length) {
      // Pause after typing
      const timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pauseTime);
      return () => clearTimeout(timeout);
    } else if (isDeleting && currentPlaceholder.length > 0) {
      // Deleting
      const timeout = setTimeout(() => {
        setCurrentPlaceholder(currentPlaceholder.substring(0, currentPlaceholder.length - 1));
      }, deletingSpeed);
      return () => clearTimeout(timeout);
    } else if (isDeleting && currentPlaceholder.length === 0) {
      // Move to next placeholder
      const timeout = setTimeout(() => {
        setIsDeleting(false);
        setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
      }, typingSpeed);
      return () => clearTimeout(timeout);
    }
  }, [currentPlaceholder, isDeleting, placeholderIndex]);

  const handleSearch = async () => {
    if (!searchQuery.trim() && selectedSport === "all") {
      setEvents([]);
      setSearchPerformed(false);
      return;
    }

    setLoading(true);
    setSearchPerformed(true);
    
    try {
      let url = `/api/events?limit=50&sort=${sortBy}&order=desc`;
      
      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      
      if (selectedSport !== "all") {
        url += `&sport=${selectedSport}`;
      }

      const response = await fetch(url);
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

  const clearSearch = () => {
    setSearchQuery("");
    setSelectedSport("all");
    setEvents([]);
    setSearchPerformed(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const sports = ["all", "Basketball", "Football", "Soccer", "Baseball", "Hockey", "Tennis", "Cricket", "F1"];

  return (
    // Added background image container
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/background4.png')" }}
    >
      {/* Added overlay for better text readability */}
      <div className="min-h-screen bg-gradient-to-b from-background/90 via-background/80 to-muted/20">
        <Navbar />
        
        <div className="w-full flex justify-center">
          {/* Reduced the max width from 80% to 60% */}
          <div className="w-full max-w-[60%]">
            <div className="container mx-auto px-4 py-10">
              {/* Header Section - Only visible before search */}
              {!searchPerformed && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="mb-10 text-center"
                >
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary mb-3"
                  >
                    <motion.div
                      animate={{ rotate: [0, 15, 0, -15, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </motion.div>
                    <span className="text-xs font-semibold">Discover Amazing Events</span>
                  </motion.div>
                  <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.7 }}
                    className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent font-display"
                  >
                    EXPLORE SPORTS
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-base text-muted-foreground max-w-xl mx-auto"
                  >
                    Search and filter through thousands of sports events from around the world
                  </motion.p>
                </motion.div>
              )}

              {/* Enhanced Search Bar */}
              <motion.div 
                ref={searchContainerRef}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={`mb-8 transition-all duration-500 ease-in-out ${
                  searchPerformed 
                    ? "sticky top-20 z-40 transform translate-y-0" 
                    : "relative"
                }`}
              >
                <motion.div 
                  className={`
                    flex flex-col gap-4 bg-black border border-white/10 rounded-2xl shadow-2xl
                    transition-all duration-500 ease-in-out
                    ${isSearchFocused || searchPerformed ? 'shadow-2xl ring-1 ring-white/20' : 'shadow-lg'}
                    ${searchPerformed ? 'p-4' : 'p-6'}
                  `}
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Main Search Input with Enhanced Styling */}
                  <div className="relative bg-black rounded-lg">
                    <motion.div 
                      className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <div className="absolute w-4 h-4 rounded-full bg-white/20 blur-sm"></div>
                      <Search className={`relative z-10 text-white transition-all ${
                        searchPerformed ? 'w-4 h-4' : 'w-5 h-5'
                      }`} />
                    </motion.div>
                    <Input
                      placeholder={searchQuery ? "" : `Search for "${currentPlaceholder}"`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                      className={`
                        pl-12 pr-12 text-white placeholder:text-white/50 border-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none
                        transition-all duration-300
                        ${searchPerformed ? 'h-12 text-base rounded-xl' : 'h-16 text-lg rounded-2xl'}
                      `}
                    />
                    <AnimatePresence>
                      {searchQuery && (
                        <motion.button 
                          onClick={clearSearch}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <X className="w-5 h-5" />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Enhanced Filters Section */}
                  <motion.div 
                    className={`
                      flex flex-wrap gap-3 items-center transition-all duration-500 ease-in-out
                      ${searchPerformed ? 'opacity-100 max-h-20' : 'opacity-100 max-h-40'}
                    `}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <motion.div 
                      className="flex items-center gap-2 text-xs font-medium text-white/70"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                    >
                      <motion.div 
                        className="w-2 h-2 rounded-full bg-white/30"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.7, 0.3]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      ></motion.div>
                      <span>FILTERS</span>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                    >
                      <Select value={selectedSport} onValueChange={setSelectedSport}>
                        <SelectTrigger className="h-9 border-0 bg-white/5 text-white hover:bg-white/10 shadow-none transition-colors">
                          <Filter className="w-3.5 h-3.5 mr-1.5 text-white/70" />
                          <SelectValue placeholder="Sport" className="text-white" />
                        </SelectTrigger>
                        <SelectContent>
                          {sports.map((sport) => (
                            <SelectItem key={sport} value={sport} className="text-white">
                              {sport === "all" ? "All Sports" : sport}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.4 }}
                    >
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="h-9 border-0 bg-white/5 text-white hover:bg-white/10 shadow-none transition-colors">
                          <TrendingUp className="w-3.5 h-3.5 mr-1.5 text-white/70" />
                          <SelectValue placeholder="Sort by" className="text-white" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="date" className="text-white">Event Date</SelectItem>
                          <SelectItem value="createdAt" className="text-white">Recently Added</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.4 }}
                    >
                      <Button 
                        onClick={handleSearch} 
                        className={`
                          ml-auto shadow-none transition-all duration-300 bg-white text-black hover:bg-white/90
                          ${searchPerformed ? 'h-9 px-4' : 'h-12 px-6'}
                          font-medium rounded-lg
                        `}
                      >
                        <Search className={`mr-2 ${searchPerformed ? 'w-4 h-4' : 'w-5 h-5'}`} />
                        {searchPerformed ? 'Refine' : 'Search'}
                      </Button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Results Section */}
              <AnimatePresence>
                {searchPerformed && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    {loading ? (
                      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                        {[...Array(10)].map((_, i) => (
                          <div key={i} className="space-y-2">
                            <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        ))}
                      </div>
                    ) : events.length === 0 ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                      >
                        <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-muted flex items-center justify-center">
                          <Search className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <p className="text-xl font-bold mb-2">No events found</p>
                        <p className="text-muted-foreground">Try adjusting your search or filters</p>
                      </motion.div>
                    ) : (
                      <div className="space-y-6">
                        <motion.div 
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <motion.div 
                            className="h-0.5 w-10 bg-primary rounded-full"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.5 }}
                          ></motion.div>
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            Found {events.length} event{events.length !== 1 ? "s" : ""}
                          </p>
                        </motion.div>
                        <motion.div 
                          className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <AnimatePresence>
                            {events.map((event, index) => (
                              <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: 0.1 * index }}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                              >
                                <EventCard event={event} />
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </motion.div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}