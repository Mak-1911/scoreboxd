"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import StaggeredAnimationWrapper from "@/components/StaggeredAnimationWrapper";
import ParallaxElement from "@/components/ParallaxElement";

export default function AnimationsDemo() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        
        <div className="space-y-16">
          <header className="text-center py-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Animation Showcase</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Demonstrating the sophisticated scroll-based animation system implemented with Framer Motion
            </p>
          </header>

          {/* Fade In Up Animation */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold">Fade In Up Animation</h2>
            <p className="text-muted-foreground">
              Elements fade in while moving up as they enter the viewport
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <ScrollAnimationWrapper
                  key={item}
                  preset="fadeInUp"
                  delay={item * 0.1}
                  className="p-6 bg-card border border-border rounded-lg h-48 flex items-center justify-center"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-white font-bold text-xl">{item}</span>
                    </div>
                    <h3 className="font-bold text-lg">Fade In Up {item}</h3>
                  </div>
                </ScrollAnimationWrapper>
              ))}
            </div>
          </section>

          {/* Scale In Animation */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold">Scale In Animation</h2>
            <p className="text-muted-foreground">
              Elements scale in while fading in as they enter the viewport
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <ScrollAnimationWrapper
                  key={item}
                  preset="scaleIn"
                  delay={item * 0.1}
                  className="p-6 bg-card border border-border rounded-lg h-32 flex items-center justify-center"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <span className="text-white font-bold">{item}</span>
                    </div>
                    <p className="text-sm">Scale In {item}</p>
                  </div>
                </ScrollAnimationWrapper>
              ))}
            </div>
          </section>

          {/* Staggered Animation */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold">Staggered Animation</h2>
            <p className="text-muted-foreground">
              Children elements animate in sequence with a staggered delay
            </p>
            <StaggeredAnimationWrapper
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              staggerDelay={0.2}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <ScrollAnimationWrapper
                  key={item}
                  preset="staggerChild"
                  className="p-6 bg-card border border-border rounded-lg h-32 flex items-center justify-center"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <span className="text-white font-bold">{item}</span>
                    </div>
                    <p className="text-sm">Staggered Item {item}</p>
                  </div>
                </ScrollAnimationWrapper>
              ))}
            </StaggeredAnimationWrapper>
          </section>

          {/* Parallax Effect */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold">Parallax Effect</h2>
            <p className="text-muted-foreground">
              Background elements move at different speeds to create depth
            </p>
            <div className="relative h-96 rounded-xl overflow-hidden border border-border">
              <ParallaxElement 
                speed={-0.5}
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center"
              >
                <div className="text-white text-center p-8">
                  <h3 className="text-2xl font-bold mb-2">Background Layer</h3>
                  <p>Moving slower than the foreground</p>
                </div>
              </ParallaxElement>
              
              <ParallaxElement 
                speed={-0.2}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-8 max-w-md text-center">
                  <h3 className="text-2xl font-bold mb-2 text-white">Foreground Layer</h3>
                  <p className="text-white/90">Moving faster than the background</p>
                </div>
              </ParallaxElement>
            </div>
          </section>

          {/* Combined Animations */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold">Combined Animations</h2>
            <p className="text-muted-foreground">
              Multiple animation techniques combined for sophisticated effects
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ScrollAnimationWrapper
                preset="fadeInUp"
                className="p-8 bg-card border border-border rounded-xl"
              >
                <h3 className="text-2xl font-bold mb-4">Feature Card</h3>
                <p className="text-muted-foreground mb-6">
                  This card combines fade-in animation with hover effects for a polished user experience.
                </p>
                <Button>Learn More</Button>
              </ScrollAnimationWrapper>
              
              <ScrollAnimationWrapper
                preset="scaleIn"
                delay={0.2}
                className="p-8 bg-card border border-border rounded-xl"
              >
                <h3 className="text-2xl font-bold mb-4">Statistics Panel</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Users</span>
                    <span className="font-bold text-2xl">12,402</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Events</span>
                    <span className="font-bold text-2xl">3,842</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Reviews</span>
                    <span className="font-bold text-2xl">28,931</span>
                  </div>
                </div>
              </ScrollAnimationWrapper>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}