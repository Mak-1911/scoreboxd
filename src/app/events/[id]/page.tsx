import { notFound } from "next/navigation";
import Image from "next/image";
import { Calendar, MapPin, Trophy, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ReviewCard from "@/components/ReviewCard";
import ReviewForm from "@/components/ReviewForm";

async function getEvent(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/events/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}

async function getEventReviews(eventId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/reviews?eventId=${eventId}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return [];
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

export default async function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await getEvent(params.id);

  if (!event) {
    notFound();
  }

  const reviews = await getEventReviews(params.id);
  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Event Image */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
                {event.imageUrl ? (
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                    <Trophy className="w-24 h-24 text-muted-foreground/40" />
                  </div>
                )}
              </div>
              
              {/* Quick Stats */}
              <div className="mt-6 p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={isUpcoming ? "default" : "secondary"}>
                    {isUpcoming ? "Upcoming" : "Completed"}
                  </Badge>
                </div>
                {reviews.length > 0 && (
                  <>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Reviews</span>
                      <span className="font-semibold">{reviews.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Avg Rating</span>
                      <span className="font-semibold">{averageRating.toFixed(1)} ★</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Event Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Header */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline">{event.sport}</Badge>
                {event.league && <Badge variant="outline">{event.league}</Badge>}
              </div>
              <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
              
              <div className="flex flex-col gap-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>
                    {eventDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>

              {(event.homeTeam || event.awayTeam) && (
                <div className="mt-6 p-6 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Matchup</h3>
                  <div className="text-lg">
                    <span className="font-semibold">{event.homeTeam}</span>
                    <span className="mx-3 text-muted-foreground">vs</span>
                    <span className="font-semibold">{event.awayTeam}</span>
                  </div>
                  {event.score && (
                    <div className="mt-3">
                      <Badge variant="secondary" className="text-base px-3 py-1">
                        Final Score: {event.score}
                      </Badge>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            {event.description && (
              <div>
                <h2 className="text-2xl font-semibold mb-3">About This Event</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              </div>
            )}

            <Separator />

            {/* Review Form - Only show for demo */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Leave a Review</h2>
              <ReviewForm eventId={event.id} userId={1} />
            </div>

            <Separator />

            {/* Reviews Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Reviews ({reviews.length})
              </h2>
              {reviews.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No reviews yet. Be the first to review this event!
                </p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review: any) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      user={{
                        name: "Sports Fan",
                        username: `user${review.userId}`,
                        avatar: `https://i.pravatar.cc/150?img=${review.userId}`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}