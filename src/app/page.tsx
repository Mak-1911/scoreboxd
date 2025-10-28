"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventCard from "@/components/EventCard";
import ActivityFeed from "@/components/ActivityFeed";
import Navbar from "@/components/Navbar";
import { TrendingUp, Flame, Calendar, Users, Sparkles, Star, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import HeroPromo from "@/components/HeroPromo";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import ParallaxElement from "@/components/ParallaxElement";
import ProductDemo from "@/components/ProductDemo";
import { motion } from "framer-motion";

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
  const [events, setEvents] = useState<any[]>([]);
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
        // Fetch review statistics for each event
        const eventsWithStats = await Promise.all(data.map(async (event: any) => {
          try {
            const statsResponse = await fetch(`/api/events/${event.id}`);
            if (statsResponse.ok) {
              const eventData = await statsResponse.json();
              return eventData;
            }
          } catch (error) {
            console.error(`Error fetching stats for event ${event.id}:`, error);
          }
          // Return event with default stats if fetch fails
          return {
            ...event,
            reviewStats: {
              count: 0,
              averageRating: 0
            }
          };
        }));
        setEvents(eventsWithStats);
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
        
        <div className="container relative mx-auto px-0 py-16">
          <div className="relative w-full h-screen overflow-hidden">
            {/* Background Video - 60% width, centered with parallax effect */}
            <ParallaxElement 
              speed={-0.3}
              className="absolute inset-0 flex items-center justify-center rounded-2xl"
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-[60%] h-full object-cover opacity-80"
              >
                <source src="/bg.mp4" type="video/mp4" />
              </video>
              
              {/* Vertical Decorative Text Elements - Blended with the video */}
              <div className="absolute left-8 top-2/5 transform -rotate-90 origin-center text-white/15 text-6xl font-bold uppercase whitespace-nowrap">
                JOIN THE FIESTA
              </div>
              <div className="absolute right-[0] top-2/5 transform rotate-90 origin-center text-white/15 text-6xl font-bold uppercase">
                SOCIALIZE SPORTS
              </div>
            </ParallaxElement>

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
                   background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.4' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.3'/%3E%3C/svg%3E")`,
                   opacity: 0.9,
                   mixBlendMode: "overlay"
                 }} />

            {/* Additional Visual Enhancements */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/30" />
            
            {/* Content Layer */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
              <ScrollAnimationWrapper
                className="flex flex-col space-y-2"
                preset="fadeInUp"
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <h1 
                  className="text-7xl md:text-8xl font-bold text-white drop-shadow-2xl transition-all duration-300 cursor-default"
                  style={{ 
                    textShadow: "0 4px 8px rgba(0,0,0,0.5), 0 8px 16px rgba(0,0,0,0.3)",
                    transform: "perspective(500px) rotateX(5deg)",
                    transformStyle: "preserve-3d",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "perspective(500px) rotateX(0deg) translateZ(10px)";
                    e.currentTarget.style.textShadow = "0 6px 12px rgba(0,0,0,0.6), 0 12px 24px rgba(0,0,0,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "perspective(500px) rotateX(5deg)";
                    e.currentTarget.style.textShadow = "0 4px 8px rgba(0,0,0,0.5), 0 8px 16px rgba(0,0,0,0.3)";
                  }}
                >
                  scoreboxd.
                </h1>
                <p 
                  className="text-5xl md:text-5xl text-white drop-shadow-xl font-light transition-all duration-300 cursor-default"
                  style={{ 
                    textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                    transform: "perspective(500px) rotateX(3deg)",
                    transformStyle: "preserve-3d",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "perspective(500px) rotateX(0deg) translateZ(5px)";
                    e.currentTarget.style.textShadow = "0 4px 8px rgba(0,0,0,0.6), 0 8px 16px rgba(0,0,0,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "perspective(500px) rotateX(3deg)";
                    e.currentTarget.style.textShadow = "0 2px 4px rgba(0,0,0,0.5)";
                  }}
                >
                  the social network for sport fiends.
                </p>
              </ScrollAnimationWrapper>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
      `}</style>

      {/* Hero Promo Section with Scroll Animation */}
      <ScrollAnimationWrapper 
        delay={0.2}
        preset="smoothFadeUp"
        className="w-full"
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        fadeOut={false}
      >
        <HeroPromo />
      </ScrollAnimationWrapper>

      {/* Product Demo Section with Scroll Animation */}
      <ScrollAnimationWrapper 
        delay={0.3}
        preset="smoothFadeUp"
        className="w-full py-16"
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <ProductDemo />
      </ScrollAnimationWrapper>

      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center w-full">
          <div className="w-[70%]">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main Content - Full Width */}
              <div className="lg:col-span-3 space-y-16">
                {/* Featured Events - Redesigned with Scroll Animation */}
                <ScrollAnimationWrapper
                  className="w-full"
                  preset="smoothFadeUp"
                  transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <div className="mb-8 text-center">
                    <motion.h2 
                      className="text-4xl font-bold tracking-tight mb-2 inline-block relative"
                      style={{
                        backdropFilter: 'blur(2px)',
                        WebkitBackdropFilter: 'blur(2px)',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.75rem',
                        transform: 'perspective(500px) rotateX(2deg)',
                        transformStyle: 'preserve-3d',
                      }}
                      whileHover={{ 
                        transform: "perspective(500px) rotateX(0deg) scale(1.02)",
                        transition: { duration: 0.3 }
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      viewport={{ once: true }}
                    >
                      Featured Events
                      <motion.span 
                        className="absolute -bottom-1 left-0 w-full h-1 bg-primary/30 rounded-full"
                        style={{
                          transformOrigin: 'left',
                        }}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                      />
                    </motion.h2>
                    <motion.p 
                      className="text-muted-foreground inline-block"
                      style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '0.5rem',
                        transform: 'perspective(500px) rotateX(2deg)',
                        transformStyle: 'preserve-3d',
                      }}
                      whileHover={{ 
                        transform: "perspective(500px) rotateX(0deg) scale(1.02)",
                        transition: { duration: 0.3 }
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      viewport={{ once: true }}
                    >
                      Handpicked events you won't want to miss
                    </motion.p>
                  </div>
                  
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-5 gap-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    {loading ? (
                      <>
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="rounded-xl"
                            style={{
                              backdropFilter: 'blur(6px)',
                              WebkitBackdropFilter: 'blur(6px)',
                              backgroundColor: 'rgba(0, 0, 0, 0.03)',
                            }}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                          >
                            <Skeleton className="w-full h-48 rounded-t-xl" />
                            <div className="p-4 space-y-3">
                              <Skeleton className="h-6 w-3/4" />
                              <Skeleton className="h-4 w-1/2" />
                              <Skeleton className="h-4 w-full" />
                              <div className="flex gap-2 pt-2">
                                <Skeleton className="h-8 w-20" />
                                <Skeleton className="h-8 w-20" />
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </>
                    ) : filteredEvents.length === 0 ? (
                      <motion.div 
                        className="text-center py-16 text-muted-foreground md:col-span-5"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                      >
                        <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">No events found for this sport</p>
                      </motion.div>
                    ) : (
                      <>
                        {filteredEvents.slice(0, 5).map((event, index) => (
                          <motion.div
                            key={event.id}
                            className="rounded-xl"
                            style={{
                              backdropFilter: 'blur(6px)',
                              WebkitBackdropFilter: 'blur(6px)',
                              backgroundColor: 'rgba(0, 0, 0, 0.03)',
                              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                              borderRadius: '0.75rem',
                              overflow: 'hidden',
                            }}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ 
                              y: -10,
                              scale: 1.03,
                              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                              transition: { duration: 0.3 }
                            }}
                          >
                            <EventCard 
                              event={event} 
                              delay={index * 0.1} 
                            />
                          </motion.div>
                        ))}
                      </>
                    )}
                  </motion.div>
                </ScrollAnimationWrapper>

                {/* Popular Sports - Enhanced with 3D Effects and Scroll Animation */}
                <ScrollAnimationWrapper
                  className="w-full"
                  preset="smoothFadeUp"
                  transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                  delay={0.2}
                >
                  <section>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-2 bg-green/10 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-green" />
                      </div>
                      <h2 className="text-3xl font-bold tracking-tight">Popular Sports</h2>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
                      {[
                        { name: "Basketball", icon: "basketball" },
                        { name: "Football", icon: "football" },
                        { name: "Baseball", icon: "baseball" },
                        { name: "F1", icon: "f1" },
                        { name: "Cricket", icon: "cricket" },
                        { name: "Golf", icon: "golf" }
                      ].map((sport, idx) => (
                        <ScrollAnimationWrapper
                          key={sport.name}
                          delay={idx * 0.1}
                          preset="smoothScaleFade"
                          className="w-full h-full"
                          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                        >
                          <div
                            className="group p-8 rounded-xl hover:bg-card/50 transition-all flex flex-col items-center justify-center gap-6 transform transition-transform duration-300 ease-in-out hover:shadow-xl cursor-pointer"
                            style={{ 
                              transformStyle: "preserve-3d",
                              perspective: "1000px"
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "scale(1.05) rotateX(5deg) rotateY(5deg)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "scale(1) rotateX(0) rotateY(0)";
                            }}
                            onClick={() => window.location.href = `/discover?sport=${sport.name}`}
                          >
                            <div 
                              className="w-24 h-24 transition-transform duration-300 ease-in-out"
                              style={{ 
                                transform: "translateZ(20px)",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateZ(20px) scale(1.2) rotateX(10deg) rotateY(10deg)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateZ(20px) scale(1) rotateX(0) rotateY(0)";
                              }}
                            >
                              <img 
                                src={`/icons/${sport.icon}.png`} 
                                alt={sport.name} 
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="text-center" style={{ transform: "translateZ(10px)" }}>
                              <h3 className="font-bold text-2xl group-hover:text-blue transition-colors">
                                {sport.name}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-2">
                                Explore events
                              </p>
                            </div>
                          </div>
                        </ScrollAnimationWrapper>
                      ))}
                    </div>
                  </section>
                </ScrollAnimationWrapper>
              </div>

              {/* Removed Sidebar */}
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Scroll Animation */}
      <ScrollAnimationWrapper
        className="w-full"
        preset="smoothFadeUp"
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        delay={0.3}
        fadeOut={false}
      >
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
      </ScrollAnimationWrapper>
    </div>
  );
}