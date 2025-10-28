"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Trophy, Star, Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper"; // Import ScrollAnimationWrapper

interface EventCardProps {
  event: {
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
  };
  delay?: number; // Add delay prop for staggered animations
}

const sportImages: Record<string, string> = {
  Basketball: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/da26eebf-2b36-44a6-ba7b-cdfa1fcb3869/generated_images/dramatic-basketball-game-action-shot-wit-b19f013c-20251005162139.jpg",
  Football: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/da26eebf-2b36-44a6-ba7b-cdfa1fcb3869/generated_images/american-football-touchdown-celebration--bf30bfd9-20251005162149.jpg",
  Soccer: "https://v3b.fal.media/files/b/lion/ZFGey5kg5QMSl0ue9M0tj_output.png",
  Baseball: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/da26eebf-2b36-44a6-ba7b-cdfa1fcb3869/generated_images/baseball-home-run-celebration-at-night-g-90b12a03-20251005162209.jpg",
  Hockey: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/da26eebf-2b36-44a6-ba7b-cdfa1fcb3869/generated_images/ice-hockey-action-shot-with-player-scori-ca69198d-20251005162220.jpg",
  Tennis: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/da26eebf-2b36-44a6-ba7b-cdfa1fcb3869/generated_images/tennis-championship-match-point-celebrat-80e43cb9-20251005162230.jpg",
  Cricket: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/da26eebf-2b36-44a6-ba7b-cdfa1fcb3869/generated_images/cricket-match-action-shot-with-batsman-h-fcc96b37-20251008062219.jpg",
  F1: "https://v3b.fal.media/files/b/elephant/vcge_23vdWBJhjMXZBMDy_output.png",
};

export default function EventCard({ event, delay = 0 }: EventCardProps) {
  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();
  const imageUrl = event.imageUrl || sportImages[event.sport] || sportImages.Basketball;

  return (
    <ScrollAnimationWrapper
      preset="smoothScaleFade"
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      delay={delay}
    >
      <Link href={`/events/${event.id}`} className="group">
        <Card className="overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 h-full border hover:border-primary/30 bg-black">
          <div className="relative aspect-[4/3] overflow-hidden bg-black">
            <Image
              src={imageUrl}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0  transition-all duration-300" />
            
            {/* Badges */}
            <div className="absolute top-2 left-2 right-2 flex items-start justify-between gap-1.5">
              <Badge 
                variant={isUpcoming ? "default" : "secondary"}
                className="shadow text-xs py-1 px-2 font-semibold"
              >
                {isUpcoming ? (
                  <><Flame className="w-2.5 h-2.5 mr-1" /> Upcoming</>
                ) : (
                  <><Star className="w-2.5 h-2.5 mr-1" /> Completed</>
                )}
              </Badge>
              <Badge variant="outline" className="bg-black/30 text-white border-white/20 text-xs py-1 px-2 font-semibold">
                {event.sport}
              </Badge>
            </div>

            {/* Score overlay */}
            {event.score && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 pt-8">
                <p className="text-white font-bold text-lg font-display tracking-wider">{event.score}</p>
              </div>
            )}
          </div>
          
          <CardContent className="p-3 space-y-2">
            <h3 className="font-bold text-sm line-clamp-2 group-hover:text-primary transition-colors leading-tight">
              {event.title}
            </h3>
            
            {event.league && (
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {event.league}
              </p>
            )}

            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span className="font-medium">
                  {eventDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              {event.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span className="line-clamp-1 font-medium">{event.location}</span>
                </div>
              )}
            </div>

            {(event.homeTeam && event.awayTeam) && (
              <div className="pt-2 border-t border-border/30">
                <p className="text-xs font-semibold text-foreground/80">
                  {event.homeTeam} <span className="text-muted-foreground mx-0.5">vs</span> {event.awayTeam}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </ScrollAnimationWrapper>
  );
}