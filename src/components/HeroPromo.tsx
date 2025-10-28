import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Sparkles, ChevronRight, TrendingUp, Users, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroPromo = () => {
  // Sample event data - replace with actual data
  const events = [
    { 
      id: 1, 
      title: "Championship Finals", 
      image: "https://mir-s3-cdn-cf.behance.net/project_modules/1400/48bca0137364371.620a44b68df1e.jpg", 
      date: "Oct 28, 2025",
      sport: "Basketball"
    },
    { 
      id: 2, 
      title: "World Cup Semifinals", 
      image: "/hero_bg.png", 
      date: "Nov 5, 2025",
      sport: "Soccer"
    },
    { 
      id: 3, 
      title: "Grand Prix", 
      image: "/hero_bg.png", 
      date: "Nov 12, 2025",
      sport: "F1"
    },
    { 
      id: 4, 
      title: "Playoff Series", 
      image: "/hero_bg.png", 
      date: "Nov 19, 2025",
      sport: "Baseball"
    },
    { 
      id: 5, 
      title: "Championship Match", 
      image: "https://mir-s3-cdn-cf.behance.net/project_modules/1400/48bca0137364371.620a44b68df1e.jpg", 
      date: "Nov 26, 2025",
      sport: "Tennis"
    }
  ];

  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section 
      ref={sectionRef}
      className="py-24 md:py-36 relative overflow-hidden" 
      style={{
        backgroundImage: "url('/landing_background.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background/70 to-secondary/10"></div>
      
      {/* Animated background elements with parallax effect */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 0.3, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        style={{ translateY: '-20%' }}
      ></motion.div>
      
      <motion.div 
        className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-secondary/5 rounded-full blur-3xl"
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 0.3, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        viewport={{ once: true, margin: "-100px" }}
        style={{ translateY: '20%' }}
      ></motion.div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 bg-muted/30 rounded-full px-4 py-1.5 text-sm mb-6 border border-border/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            style={{
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            }}
          >
            <motion.div
              animate={{ rotate: [0, 15, 0, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="font-medium">The future of sports tracking</span>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-none transform-gpu"
            style={{
              textShadow: `
                0 1px 0 rgba(255,255,255,0.1),
                0 2px 0 rgba(0,0,0,0.05),
                0 3px 0 rgba(0,0,0,0.05),
                0 4px 0 rgba(0,0,0,0.05),
                0 5px 0 rgba(0,0,0,0.05),
                0 6px 0 rgba(0,0,0,0.05),
                0 7px 0 rgba(0,0,0,0.05),
                0 8px 0 rgba(0,0,0,0.05),
                0 9px 0 rgba(0,0,0,0.05),
                0 10px 10px rgba(0,0,0,0.1)
              `,
              transform: 'translateZ(0)'
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            track every <motion.span 
              className="text-primary relative inline-block"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              game
              <motion.span 
                className="absolute -bottom-2 left-0 w-full h-1 bg-primary/30 rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
              ></motion.span>
            </motion.span>.<br />
            review every <motion.span 
              className="text-secondary relative inline-block"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              moment
              <motion.span 
                className="absolute -bottom-2 left-0 w-full h-1 bg-secondary/30 rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                viewport={{ once: true }}
              ></motion.span>
            </motion.span>.
          </motion.h1>
          
          {/* Stats section with staggered animations and glass effect */}
          <motion.div 
            className="flex flex-wrap justify-center gap-8 mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {[{ icon: TrendingUp, value: "10K+", label: "Events" }, 
              { icon: Users, value: "50K+", label: "Users" }, 
              { icon: Award, value: "100K+", label: "Reviews" }].map((stat, index) => (
              <motion.div 
                key={stat.label}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border/30"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                style={{
                  backdropFilter: 'blur(3px)',
                  WebkitBackdropFilter: 'blur(3px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                }}
              >
                <stat.icon className="w-5 h-5 text-primary" />
                <div>
                  <span className="font-bold text-lg block">{stat.value}</span>
                  <span className="text-muted-foreground text-xs">{stat.label}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        
        {/* Popular Events Grid - Contained within 70% width */}
        <motion.div 
          className="relative w-[70%] mx-auto mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-center mb-10">Popular Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                className="rounded-2xl overflow-hidden shadow-xl border border-border/30 transform transition-all duration-500 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                style={{
                  backdropFilter: 'blur(2px)',
                  WebkitBackdropFilter: 'blur(2px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                  height: '350px',
                }}
              >
                <div className="relative h-90 overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm"></div>
                  <div className="absolute top-3 right-3 bg-primary/80 text-white text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm">
                    {event.sport}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-all duration-500">
                    <h3 className="text-lg font-bold text-white">{event.title}</h3>
                    <p className="text-white/80 text-xs">{event.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          className="flex flex-col sm:flex-row justify-center gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Button 
              size="lg" 
              asChild 
              className="px-10 py-7 rounded-full text-lg font-semibold hover:shadow-xl transition-all group border-0"
              style={{
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Link href="/sign-up">
                Get Started Free
                <motion.div
                  className="inline-block"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </motion.div>
              </Link>
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Button 
              size="lg" 
              variant="outline" 
              asChild 
              className="px-10 py-7 rounded-full text-lg font-semibold border-2 hover:shadow-xl transition-all"
              style={{
                backdropFilter: 'blur(3px)',
                WebkitBackdropFilter: 'blur(3px)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
              }}
            >
              <Link href="/discover">
                Explore Events
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroPromo;