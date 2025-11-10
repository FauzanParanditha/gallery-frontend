"use client";

import heroImage from "@/assets/hero-dashboard.jpg";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FolderOpen, Image, Plus, Tags } from "lucide-react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();

  const stats = [
    {
      title: "Total Albums",
      value: "12",
      icon: FolderOpen,
      color: "text-primary",
    },
    { title: "Total Photos", value: "248", icon: Image, color: "text-accent" },
    {
      title: "Total Tags",
      value: "36",
      icon: Tags,
      color: "text-muted-foreground",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl h-64">
        <img
          src={heroImage.src}
          alt="Dashboard Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-accent/90 flex items-center">
          <div className="px-8 text-white">
            <h1 className="text-4xl font-bold mb-2">
              Welcome to Your Photo Gallery
            </h1>
            <p className="text-lg opacity-90">
              Organize, tag, and manage your memories beautifully
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Get started with managing your photo collection
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button onClick={() => router.push("/albums")} className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Album
          </Button>
          <Button variant="outline" onClick={() => router.push("/albums")}>
            View All Albums
          </Button>
          <Button variant="outline" onClick={() => router.push("/photos")}>
            Browse Photos
          </Button>
        </CardContent>
      </Card>

      {/* Recent Albums Preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Recent Albums</h2>
          <Button variant="ghost" onClick={() => router.push("/albums")}>
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card
              key={i}
              className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="aspect-square bg-muted rounded-t-lg" />
              <CardHeader>
                <CardTitle className="text-base">Album {i}</CardTitle>
                <CardDescription>12 photos</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
