"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Lock, Globe, List } from "lucide-react";
import Link from "next/link";

interface ListItem {
  id: number;
  name: string;
  description?: string | null;
  isPublic: boolean;
  userId: number;
  createdAt: string;
}

export default function ListsPage() {
  const [lists, setLists] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const response = await fetch("/api/lists?limit=50");
      if (response.ok) {
        const data = await response.json();
        setLists(data);
      }
    } catch (error) {
      console.error("Error fetching lists:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Sports Lists</h1>
            <p className="text-muted-foreground">
              Curated collections of memorable sports events
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create List
          </Button>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : lists.length === 0 ? (
          <Card className="p-12 text-center">
            <List className="w-16 h-16 mx-auto mb-4 text-muted-foreground/40" />
            <h3 className="text-xl font-semibold mb-2">No lists yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first list to start organizing your favorite sports events
            </p>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Your First List
            </Button>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lists.map((list) => (
              <Card key={list.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-xl line-clamp-1">{list.name}</CardTitle>
                    {list.isPublic ? (
                      <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                  {list.description && (
                    <CardDescription className="line-clamp-2">
                      {list.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={`https://i.pravatar.cc/150?img=${list.userId}`} />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">
                        User {list.userId}
                      </span>
                    </div>
                    <Badge variant={list.isPublic ? "default" : "secondary"}>
                      {list.isPublic ? "Public" : "Private"}
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" className="w-full" size="sm">
                      View List
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}