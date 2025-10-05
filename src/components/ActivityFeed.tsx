"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import StarRating from "./StarRating";
import Link from "next/link";
import { Clock, MessageSquare, Heart } from "lucide-react";

interface Activity {
  id: number;
  type: "review" | "list" | "follow";
  user: {
    id: number;
    name: string;
    username: string;
    avatar?: string;
  };
  event?: {
    id: number;
    title: string;
    sport: string;
  };
  review?: {
    rating: number;
    content: string;
  };
  createdAt: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case "review":
        return "reviewed";
      case "list":
        return "added to a list";
      case "follow":
        return "started following";
      default:
        return "interacted with";
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (activities.length === 0) {
    return (
      <Card className="border-2">
        <CardContent className="py-12 text-center text-muted-foreground">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-medium">No recent activity to display</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card key={activity.id} className="hover:shadow-xl hover:border-primary/20 transition-all duration-300 border-2 bg-gradient-to-br from-card to-card/80">
          <CardContent className="p-5">
            <div className="flex gap-4">
              <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 font-bold">
                  {activity.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <span className="font-bold text-foreground">{activity.user.name}</span>
                    <span className="text-muted-foreground font-medium"> {getActivityText(activity)} </span>
                    {activity.event && (
                      <Link
                        href={`/events/${activity.event.id}`}
                        className="font-bold hover:text-primary transition-colors inline-block"
                      >
                        {activity.event.title}
                      </Link>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium bg-muted/50 px-2.5 py-1 rounded-full">
                    <Clock className="w-3.5 h-3.5" />
                    {getTimeAgo(activity.createdAt)}
                  </div>
                </div>

                {activity.event && (
                  <Badge variant="outline" className="text-xs font-semibold">
                    {activity.event.sport}
                  </Badge>
                )}

                {activity.review && (
                  <div className="space-y-2 bg-muted/30 p-4 rounded-lg border">
                    <StarRating rating={activity.review.rating} size="sm" />
                    <p className="text-sm text-foreground/90 line-clamp-2 leading-relaxed">
                      {activity.review.content}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                      <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                        <Heart className="w-3.5 h-3.5" />
                        <span className="font-medium">Like</span>
                      </button>
                      <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="font-medium">Comment</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}