"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import EventCard from "@/components/EventCard";
import ReviewCard from "@/components/ReviewCard";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Calendar, Edit, Star, List, Users } from "lucide-react";

interface Review {
  id: number;
  rating: number;
  content: string;
  spoiler: boolean;
  createdAt: string;
  userId: number;
  eventId: number;
}

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      fetchUserReviews();
    }
  }, [session]);

  const fetchUserReviews = async () => {
    try {
      // For demo purposes, we'll fetch reviews from userId 1
      const response = await fetch("/api/reviews?userId=1&limit=10");
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isPending || !session?.user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const user = session.user;
  const joinDate = new Date(user.createdAt || Date.now());

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.image || undefined} alt={user.name} />
                <AvatarFallback className="text-2xl">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </Button>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {joinDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>Location not set</span>
                  </div>
                </div>

                <div className="flex gap-6 mt-4">
                  <div>
                    <div className="text-2xl font-bold">{reviews.length}</div>
                    <div className="text-sm text-muted-foreground">Reviews</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-sm text-muted-foreground">Lists</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-sm text-muted-foreground">Following</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Content */}
        <Tabs defaultValue="reviews" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="reviews" className="gap-2">
              <Star className="w-4 h-4" />
              <span className="hidden sm:inline">Reviews</span>
            </TabsTrigger>
            <TabsTrigger value="lists" className="gap-2">
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Lists</span>
            </TabsTrigger>
            <TabsTrigger value="watched" className="gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Watched</span>
            </TabsTrigger>
            <TabsTrigger value="following" className="gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Following</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reviews" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Your Reviews</h2>
              <Badge variant="secondary">{reviews.length} reviews</Badge>
            </div>
            
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6 space-y-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <Card className="p-12 text-center">
                <Star className="w-16 h-16 mx-auto mb-4 text-muted-foreground/40" />
                <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start reviewing sports events you've watched
                </p>
                <Button>Browse Events</Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    user={{
                      name: user.name,
                      username: user.email.split("@")[0],
                      avatar: user.image || undefined,
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="lists">
            <Card className="p-12 text-center">
              <List className="w-16 h-16 mx-auto mb-4 text-muted-foreground/40" />
              <h3 className="text-xl font-semibold mb-2">No lists yet</h3>
              <p className="text-muted-foreground mb-6">
                Create lists to organize your favorite sports events
              </p>
              <Button>Create Your First List</Button>
            </Card>
          </TabsContent>

          <TabsContent value="watched">
            <Card className="p-12 text-center">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground/40" />
              <h3 className="text-xl font-semibold mb-2">No watched events</h3>
              <p className="text-muted-foreground mb-6">
                Mark events as watched to track your sports viewing history
              </p>
              <Button>Discover Events</Button>
            </Card>
          </TabsContent>

          <TabsContent value="following">
            <Card className="p-12 text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground/40" />
              <h3 className="text-xl font-semibold mb-2">Not following anyone</h3>
              <p className="text-muted-foreground mb-6">
                Follow other sports fans to see their reviews and activity
              </p>
              <Button>Find Users</Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}