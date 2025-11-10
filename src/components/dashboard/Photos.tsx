"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  Image as ImageIcon,
  RefreshCw,
  Star,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface Photo {
  id: string;
  url: string;
  caption: string;
  albumId: string;
  albumName: string;
  isFeatured: boolean;
  sortOrder: number;
  status: "pending" | "processing" | "completed" | "error";
  tags: string[];
}

const Photos = () => {
  // Mock data - replace with actual data fetching
  const [photos, setPhotos] = useState<Photo[]>([
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7",
      caption: "Sunset view",
      albumId: "album1",
      albumName: "Summer 2024",
      isFeatured: true,
      sortOrder: 1,
      status: "completed",
      tags: ["nature", "sunset"],
    },
    {
      id: "2",
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
      caption: "Mountain landscape",
      albumId: "album1",
      albumName: "Summer 2024",
      isFeatured: false,
      sortOrder: 2,
      status: "error",
      tags: ["nature", "mountains"],
    },
  ]);

  const [selectedAlbum, setSelectedAlbum] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [errorOnly, setErrorOnly] = useState(false);
  const [deletePhotoId, setDeletePhotoId] = useState<string | null>(null);

  const albums = Array.from(
    new Map(photos.map((p) => [p.albumId, p.albumName]))
  ).map(([id, name]) => ({ id, name }));

  const allTags = Array.from(new Set(photos.flatMap((p) => p.tags)));

  // Filter photos
  const filteredPhotos = photos.filter((photo) => {
    if (selectedAlbum !== "all" && photo.albumId !== selectedAlbum)
      return false;
    if (selectedTag !== "all" && !photo.tags.includes(selectedTag))
      return false;
    if (selectedStatus !== "all" && photo.status !== selectedStatus)
      return false;
    if (errorOnly && photo.status !== "error") return false;
    return true;
  });

  const handleDelete = (id: string) => {
    setPhotos(photos.filter((p) => p.id !== id));
    setDeletePhotoId(null);
    toast({
      title: "Photo deleted",
      description: "The photo has been removed from the album",
    });
  };

  const handleSetFeatured = (id: string) => {
    const photo = photos.find((p) => p.id === id);
    if (!photo) return;

    setPhotos(
      photos.map((p) => (p.id === id ? { ...p, isFeatured: !p.isFeatured } : p))
    );
    toast({
      title: photo.isFeatured ? "Removed from featured" : "Set as featured",
      description: `Photo ${
        photo.isFeatured ? "is no longer" : "is now"
      } featured in ${photo.albumName}`,
    });
  };

  const handleReprocess = (id: string) => {
    setPhotos(
      photos.map((p) =>
        p.id === id ? { ...p, status: "processing" as const } : p
      )
    );
    toast({
      title: "Reprocessing photo",
      description: "The photo is being processed again",
    });
  };

  const handleUpdateCaption = (id: string, caption: string) => {
    setPhotos(photos.map((p) => (p.id === id ? { ...p, caption } : p)));
  };

  const StatusIcon = ({ status }: { status: Photo["status"] }) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "processing":
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">All Photos</h1>
        <p className="text-muted-foreground mt-1">
          Browse and manage all your photos across albums
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Album</label>
            <Select value={selectedAlbum} onValueChange={setSelectedAlbum}>
              <SelectTrigger>
                <SelectValue placeholder="All albums" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All albums</SelectItem>
                {albums.map((album) => (
                  <SelectItem key={album.id} value={album.id}>
                    {album.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tag</label>
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger>
                <SelectValue placeholder="All tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All tags</SelectItem>
                {allTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Error Only</label>
            <div className="flex items-center space-x-2 h-10">
              <Checkbox
                id="error-only"
                checked={errorOnly}
                onCheckedChange={(checked) => setErrorOnly(!!checked)}
              />
              <label htmlFor="error-only" className="text-sm cursor-pointer">
                Show errors only
              </label>
            </div>
          </div>
        </div>
      </Card>

      {/* Photos Grid */}
      {filteredPhotos.length === 0 ? (
        <Card className="p-16 text-center">
          <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No photos found</h3>
          <p className="text-muted-foreground">
            {photos.length === 0
              ? "Upload photos to albums to see them here"
              : "Try adjusting your filters"}
          </p>
        </Card>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredPhotos.length} of {photos.length} photos
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPhotos.map((photo) => (
              <Card key={photo.id} className="overflow-hidden">
                <div className="relative aspect-square bg-muted">
                  <Image
                    src={photo.url}
                    alt={photo.caption || "Photo"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 space-y-3">
                  <div className="flex flex-wrap gap-2 items-center">
                    <Badge variant="outline">{photo.albumName}</Badge>
                    <Badge variant="secondary" className="gap-1">
                      <StatusIcon status={photo.status} />
                      {photo.status}
                    </Badge>
                    {photo.isFeatured && (
                      <Badge variant="default" className="gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <Input
                    placeholder="Add caption..."
                    value={photo.caption}
                    onChange={(e) =>
                      handleUpdateCaption(photo.id, e.target.value)
                    }
                  />
                  {photo.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {photo.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => handleSetFeatured(photo.id)}
                    >
                      <Star
                        className={`h-4 w-4 ${
                          photo.isFeatured ? "fill-current" : ""
                        }`}
                      />
                      {photo.isFeatured ? "Unfeature" : "Feature"}
                    </Button>
                    {photo.status === "error" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2"
                        onClick={() => handleReprocess(photo.id)}
                      >
                        <RefreshCw className="h-4 w-4" />
                        Retry
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletePhotoId(photo.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deletePhotoId !== null}
        onOpenChange={(open) => !open && setDeletePhotoId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete photo?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this photo. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletePhotoId && handleDelete(deletePhotoId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Photos;
