"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import StarRating from "./StarRating";
import { AlertTriangle } from "lucide-react";

interface ReviewCardProps {
  review: {
    id: number;
    rating: number;
    content: string;
    spoiler: boolean;
    createdAt: string;
    userId: number;
  };
  user?: {
    name: string;
    username: string;
    avatar?: string | null;
  };
}

export default function ReviewCard({ review, user }: ReviewCardProps) {
  const reviewDate = new Date(review.createdAt);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.avatar || undefined} alt={user?.name} />
              <AvatarFallback>
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{user?.name || "Anonymous"}</p>
              <p className="text-sm text-muted-foreground">
                @{user?.username || "unknown"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <StarRating rating={review.rating} size="sm" />
            <p className="text-xs text-muted-foreground mt-1">
              {reviewDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {review.spoiler && (
          <Badge variant="destructive" className="mb-3 gap-1">
            <AlertTriangle className="w-3 h-3" />
            Contains Spoilers
          </Badge>
        )}
        <p className="text-sm leading-relaxed">{review.content}</p>
      </CardContent>
    </Card>
  );
}