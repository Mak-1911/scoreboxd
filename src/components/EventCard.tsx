"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Trophy, Star, Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

export default function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();
  const imageUrl = event.imageUrl || sportImages[event.sport] || sportImages.Basketball;

  return (
    <Link href={`/events/${event.id}`} className="group">
      <Card className="overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full border-2 hover:border-primary/20 bg-gradient-to-br from-card to-card/80">
        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
          <Image
            src={imageUrl}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/20 group-hover:from-black/70 transition-all duration-300" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
            <Badge 
              variant={isUpcoming ? "default" : "secondary"}
              className="shadow-lg backdrop-blur-sm font-semibold"
            >
              {isUpcoming ? (
                <><Flame className="w-3 h-3 mr-1" /> Upcoming</>
              ) : (
                <><Star className="w-3 h-3 mr-1" /> Completed</>
              )}
            </Badge>
            <Badge variant="outline" className="bg-black/40 text-white border-white/30 backdrop-blur-sm font-semibold">
              {event.sport}
            </Badge>
          </div>

          {/* Score overlay */}
          {event.score && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-4 pt-12">
              <p className="text-white font-bold text-xl font-display tracking-wider">{event.score}</p>
            </div>
          )}
        </div>
        
        <CardContent className="p-5 space-y-3">
          <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors leading-tight">
            {event.title}
          </h3>
          
          {event.league && (
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {event.league}
            </p>
          )}

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium">
                {eventDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-xs line-clamp-1 font-medium">{event.location}</span>
              </div>
            )}
          </div>

          {(event.homeTeam && event.awayTeam) && (
            <div className="pt-3 border-t border-border/50">
              <p className="text-sm font-semibold text-foreground/80">
                {event.homeTeam} <span className="text-muted-foreground mx-1">vs</span> {event.awayTeam}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}