"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import StarRating from "./StarRating";
import { AlertTriangle, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ReviewCardProps {
  review: {
    id: number;
    rating: number;
    content: string;
    spoiler: boolean;
    createdAt: string;
    userId: number;
    eventId: number;
  };
  user?: {
    name: string;
    username: string;
    avatar?: string | null;
  };
  event?: {
    id: number;
    title: string;
    imageUrl?: string | null;
    date?: string;
  };
  showUser?: boolean; // New prop to control whether to show user info
}

export default function ReviewCard({ review, user, event, showUser = true }: ReviewCardProps) {
  const reviewDate = new Date(review.createdAt);
  const formattedDate = reviewDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Format event date if available
  let formattedEventDate = "";
  if (event?.date) {
    const eventDate = new Date(event.date);
    formattedEventDate = eventDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <Card className="group border-white/10 bg-card/10 hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
      {/* Content Section */}
      <CardContent className="px-4">
        {/* User Info (only shown when needed) */}
        {showUser && user && (
          <div className="flex items-center gap-3 mb-1">
            <Avatar className="h-8 w-8 ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all duration-300">
              <AvatarImage src={user?.avatar || undefined} alt={user?.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm group-hover:text-primary transition-colors duration-300">
                {user?.name || "Anonymous"}
              </p>
              <p className="text-xs text-muted-foreground">@{user?.username || "unknown"}</p>
            </div>
          </div>
        )}
        
        {/* Date and Rating in Content */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <StarRating rating={review.rating} size="sm" />
            {/* <span className="text-xs font-medium">{review.rating}.0</span> */}
          </div>
        </div>
        
        {review.spoiler && (
          <Badge variant="destructive" className="mb-3 gap-1.5 text-xs px-2 py-1 rounded-full">
            <AlertTriangle className="w-3 h-3" />
            Contains Spoilers
          </Badge>
        )}
        
        <p className="text-sm leading-relaxed mb-2 group-hover:text-foreground transition-colors duration-300">
          {review.content}
        </p>
        
        {event && (
          <Link href={`/events/${event.id}`} className="block group/event-card">
            <div className="rounded-xl p-1.5 bg-muted/20 hover:bg-muted/40 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md border border-white/10">
              <div className="flex items-center gap-3">
                {event.imageUrl ? (
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      className="object-cover group-hover/event-card:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-sm flex-shrink-0">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold group-hover/event-card:text-primary transition-colors duration-300 truncate">
                    {event.title}
                  </p>
                  {formattedEventDate && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formattedEventDate}</span>
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <span>View event details</span>
                  </p>
                </div>
                <div className="i-lucide-arrow-right text-muted-foreground group-hover/event-card:text-primary group-hover/event-card:translate-x-1 transition-all duration-300" />
              </div>
            </div>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}