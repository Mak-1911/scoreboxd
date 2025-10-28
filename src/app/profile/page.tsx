"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ReviewCard from "@/components/ReviewCard";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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

interface Event {
  id: number;
  title: string;
  imageUrl?: string | null;
  date?: string;
}

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [events, setEvents] = useState<Record<number, Event>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("feed");

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
        
        // Fetch events for each review
        await fetchEventsForReviews(data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEventsForReviews = async (reviews: Review[]) => {
    try {
      const eventIds = [...new Set(reviews.map(review => review.eventId))];
      
      // Fetch events in batches to avoid overwhelming the API
      const eventPromises = eventIds.map(async (eventId) => {
        try {
          const response = await fetch(`/api/events/${eventId}`);
          if (response.ok) {
            const eventData = await response.json();
            return {
              id: eventData.id,
              title: eventData.title,
              imageUrl: eventData.imageUrl,
              date: eventData.date,
            };
          }
          return null;
        } catch (error) {
          console.error(`Error fetching event ${eventId}:`, error);
          return null;
        }
      });
      
      const eventResults = await Promise.all(eventPromises);
      const eventMap: Record<number, Event> = {};
      
      eventResults.forEach((event) => {
        if (event) {
          eventMap[event.id] = event;
        }
      });
      
      setEvents(eventMap);
    } catch (error) {
      console.error("Error fetching events for reviews:", error);
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
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-[70%] mx-auto">
          {/* Full-height layout with sidebar and main content */}
          <div className="flex gap-5">
            {/* Left Sidebar Navigation - Fixed Height */}
            <div className="w-60 flex-shrink-0 ">
              <Card className="h-[calc(100vh-10rem)]  sticky top-20 bg-card/10 backdrop-blur-sm border-0 shadow-sm rounded-lg">
                <CardContent className="p-1.5 h-full">
                  <nav className="space-y-0.5 h-full flex flex-col">
                    <div className="mb-2 px-1.5">
                      <h2 className="text-xs font-semibold">Profile</h2>
                    </div>
                    
                    <Button
                      variant={activeTab === "feed" ? "default" : "ghost"}
                      className="w-full justify-start gap-1.5 h-7 px-1.5 text-xs hover:scale-105 transition-transform duration-200 rounded-md"
                      onClick={() => setActiveTab("feed")}
                    >
                      <Star className="w-3.5 h-3.5" />
                      Feed
                    </Button>
                    <Button
                      variant={activeTab === "reviews" ? "default" : "ghost"}
                      className="w-full justify-start gap-1.5 h-7 px-1.5 text-xs hover:scale-105 transition-transform duration-200 rounded-md"
                      onClick={() => setActiveTab("reviews")}
                    >
                      <Star className="w-3.5 h-3.5" />
                      Reviews
                    </Button>
                    <Button
                      variant={activeTab === "lists" ? "default" : "ghost"}
                      className="w-full justify-start gap-1.5 h-7 px-1.5 text-xs hover:scale-105 transition-transform duration-200 rounded-md"
                      onClick={() => setActiveTab("lists")}
                    >
                      <List className="w-3.5 h-3.5" />
                      Lists
                    </Button>
                    <Button
                      variant={activeTab === "following" ? "default" : "ghost"}
                      className="w-full justify-start gap-1.5 h-7 px-1.5 text-xs hover:scale-105 transition-transform duration-200 rounded-md"
                      onClick={() => setActiveTab("following")}
                    >
                      <Users className="w-3.5 h-3.5" />
                      Following
                    </Button>
                    <Button
                      variant={activeTab === "followers" ? "default" : "ghost"}
                      className="w-full justify-start gap-1.5 h-7 px-1.5 text-xs hover:scale-105 transition-transform duration-200 rounded-md"
                      onClick={() => setActiveTab("followers")}
                    >
                      <Users className="w-3.5 h-3.5" />
                      Followers
                    </Button>
                    
                    <div className="mt-auto pt-1.5">
                      <Button variant="outline" className="w-full gap-1.5 h-7 px-1.5 text-xs hover:scale-105 transition-transform duration-200 rounded-md">
                        <Edit className="w-2.5 h-2.5" />
                        Edit
                      </Button>
                    </div>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
              {/* Tab Content */}
              <div className="flex-1">
                {/* Feed Tab */}
                {activeTab === "feed" && (
                  <div className="space-y-3">
                    <h2 className="text-base font-bold">Your Feed</h2>
                    <Card className="p-3 text-center bg-card/70 backdrop-blur-sm border-0 shadow-sm rounded-lg">
                      <Star className="w-8 h-8 mx-auto mb-1.5 text-muted-foreground/40" />
                      <h3 className="text-sm font-semibold mb-1">No activity yet</h3>
                      <p className="text-muted-foreground text-xs mb-2">
                        Your feed will show activity from people you follow
                      </p>
                      <Button size="sm" className="rounded-md hover:scale-105 transition-transform text-xs px-2.5 py-1">
                        Find People
                      </Button>
                    </Card>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === "reviews" && (
                  <div className="space-y-3">
                    {/* Profile Header - Sleek and Simple (Only shown in Reviews tab) */}
                    <Card className="mb-3 bg-card/10 backdrop-blur-sm border-white/10 shadow-sm rounded-lg">
                      <CardContent className="p-2.5">
                        <div className="flex items-start gap-2.5">
                          {/* Profile Picture */}
                          <Avatar className="h-14 w-14 border border-border ring-1 ring-primary/10">
                            <AvatarImage src={user.image || undefined} alt={user.name} />
                            <AvatarFallback className="text-sm bg-primary/10 text-primary font-bold">
                              {user.name?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          
                          {/* User Info */}
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
                              <div>
                                <h1 className="text-base font-bold">{user.name}</h1>
                                <p className="text-muted-foreground text-xs">@{user.email.split("@")[0]}</p>
                              </div>
                              
                              <Button variant="outline" size="sm" className="h-6 px-1.5 text-xs rounded-md hover:scale-105 transition-transform">
                                <Edit className="w-2 h-2 mr-0.5" />
                                Edit
                              </Button>
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-2 h-2" />
                                <span>Joined {joinDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
                              </div>
                            </div>
                            
                            <div className="flex gap-3">
                              <div>
                                <div className="text-sm font-bold">{reviews.length}</div>
                                <div className="text-xs text-muted-foreground">Posts</div>
                              </div>
                              <div>
                                <div className="text-sm font-bold">36</div>
                                <div className="text-xs text-muted-foreground">Following</div>
                              </div>
                              <div>
                                <div className="text-sm font-bold">6</div>
                                <div className="text-xs text-muted-foreground">Followers</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-bold">Your Reviews</h2>
                      <Badge variant="secondary" className="rounded-full px-1.5 py-0.5 text-xs">
                        {reviews.length} reviews
                      </Badge>
                    </div>
                    
                    {loading ? (
                      <div className="space-y-2.5">
                        {[...Array(3)].map((_, i) => (
                          <Card key={i} className="bg-card/70 backdrop-blur-sm border-0 shadow-sm rounded-lg">
                            <CardContent className="p-2.5 space-y-1.5">
                              <Skeleton className="h-2 w-3/4" />
                              <Skeleton className="h-2 w-full" />
                              <Skeleton className="h-2 w-2/3" />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : reviews.length === 0 ? (
                      <Card className="p-3 text-center bg-card/70 backdrop-blur-sm border-0 shadow-sm rounded-lg">
                        <Star className="w-8 h-8 mx-auto mb-1.5 text-muted-foreground/40" />
                        <h3 className="text-sm font-semibold mb-1">No reviews yet</h3>
                        <p className="text-muted-foreground text-xs mb-2">
                          Start reviewing sports events you've watched
                        </p>
                        <Button size="sm" className="rounded-md hover:scale-105 transition-transform text-xs px-2.5 py-1">
                          Browse Events
                        </Button>
                      </Card>
                    ) : (
                      <div className="space-y-1">
                        {reviews.map((review) => (
                          <ReviewCard
                            key={review.id}
                            review={review}
                            user={{
                              name: user.name,
                              username: user.email.split("@")[0],
                              avatar: user.image || undefined,
                            }}
                            event={events[review.eventId]}
                            showUser={false} // Don't show user info in profile reviews
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Lists Tab */}
                {activeTab === "lists" && (
                  <div className="space-y-3">
                    <h2 className="text-base font-bold">Your Lists</h2>
                    <Card className="p-3 text-center bg-card/70 backdrop-blur-sm border-0 shadow-sm rounded-lg">
                      <List className="w-8 h-8 mx-auto mb-1.5 text-muted-foreground/40" />
                      <h3 className="text-sm font-semibold mb-1">No lists yet</h3>
                      <p className="text-muted-foreground text-xs mb-2">
                        Create lists to organize your favorite sports events
                      </p>
                      <Button size="sm" className="rounded-md hover:scale-105 transition-transform text-xs px-2.5 py-1">
                        Create List
                      </Button>
                    </Card>
                  </div>
                )}

                {/* Following Tab */}
                {activeTab === "following" && (
                  <div className="space-y-3">
                    <h2 className="text-base font-bold">Following</h2>
                    <Card className="p-3 text-center bg-card/70 backdrop-blur-sm border-0 shadow-sm rounded-lg">
                      <Users className="w-8 h-8 mx-auto mb-1.5 text-muted-foreground/40" />
                      <h3 className="text-sm font-semibold mb-1">Not following anyone</h3>
                      <p className="text-muted-foreground text-xs mb-2">
                        Follow other sports fans to see their reviews and activity
                      </p>
                      <Button size="sm" className="rounded-md hover:scale-105 transition-transform text-xs px-2.5 py-1">
                        Find Users
                      </Button>
                    </Card>
                  </div>
                )}

                {/* Followers Tab */}
                {activeTab === "followers" && (
                  <div className="space-y-3">
                    <h2 className="text-base font-bold">Followers</h2>
                    <Card className="p-3 text-center bg-card/70 backdrop-blur-sm border-0 shadow-sm rounded-lg">
                      <Users className="w-8 h-8 mx-auto mb-1.5 text-muted-foreground/40" />
                      <h3 className="text-sm font-semibold mb-1">No followers yet</h3>
                      <p className="text-muted-foreground text-xs mb-2">
                        Your followers will appear here
                      </p>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}