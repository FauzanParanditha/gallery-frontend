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
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Edit,
  Eye,
  EyeOff,
  Filter,
  FolderOpen,
  Plus,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Album {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage?: string;
  eventDate: Date;
  published: boolean;
  tags: string[];
  createdOn: Date;
  photoCount: number;
  isDeleted?: boolean;
}

const Albums = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [albums, setAlbums] = useState<Album[]>([
    {
      id: "1",
      title: "Summer Vacation 2024",
      slug: "summer-vacation-2024",
      description: "Beach memories",
      eventDate: new Date("2024-07-15"),
      published: true,
      tags: ["vacation", "beach", "summer"],
      createdOn: new Date("2024-01-10"),
      photoCount: 24,
    },
    {
      id: "2",
      title: "Family Portraits",
      slug: "family-portraits",
      description: "Professional photoshoot",
      eventDate: new Date("2024-05-20"),
      published: true,
      tags: ["family", "portraits"],
      createdOn: new Date("2024-02-15"),
      photoCount: 18,
    },
    {
      id: "3",
      title: "Nature & Landscapes",
      slug: "nature-landscapes",
      description: "Hiking adventures",
      eventDate: new Date("2024-08-10"),
      published: false,
      tags: ["nature", "hiking", "landscapes"],
      createdOn: new Date("2024-03-20"),
      photoCount: 42,
    },
    {
      id: "4",
      title: "City Exploration",
      slug: "city-exploration",
      description: "Urban photography",
      eventDate: new Date("2024-09-05"),
      published: true,
      tags: ["urban", "city"],
      createdOn: new Date("2024-04-12"),
      photoCount: 31,
    },
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteAlbumId, setDeleteAlbumId] = useState<string | null>(null);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [newAlbum, setNewAlbum] = useState({
    title: "",
    slug: "",
    description: "",
    eventDate: new Date(),
    tags: "",
  });

  // Filters
  const [publishedFilter, setPublishedFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Get all unique tags
  const allTags = Array.from(new Set(albums.flatMap((album) => album.tags)));

  // Filter albums
  const filteredAlbums = albums.filter((album) => {
    if (album.isDeleted) return false;

    if (
      publishedFilter !== "all" &&
      album.published !== (publishedFilter === "published")
    ) {
      return false;
    }

    if (dateRange.from && album.eventDate < dateRange.from) return false;
    if (dateRange.to && album.eventDate > dateRange.to) return false;

    if (
      selectedTags.length > 0 &&
      !selectedTags.some((tag) => album.tags.includes(tag))
    ) {
      return false;
    }

    return true;
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleCreateAlbum = () => {
    if (!newAlbum.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter an album title",
        variant: "destructive",
      });
      return;
    }

    const album: Album = {
      id: Date.now().toString(),
      title: newAlbum.title,
      slug: newAlbum.slug || generateSlug(newAlbum.title),
      description: newAlbum.description,
      eventDate: newAlbum.eventDate,
      published: false,
      tags: newAlbum.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      createdOn: new Date(),
      photoCount: 0,
    };

    setAlbums([album, ...albums]);
    setNewAlbum({
      title: "",
      slug: "",
      description: "",
      eventDate: new Date(),
      tags: "",
    });
    setIsCreateDialogOpen(false);

    toast({
      title: "Album created!",
      description: `"${album.title}" has been created successfully.`,
    });
  };

  const handleEditAlbum = () => {
    if (!editingAlbum || !editingAlbum.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter an album title",
        variant: "destructive",
      });
      return;
    }

    setAlbums(
      albums.map((album) =>
        album.id === editingAlbum.id ? editingAlbum : album
      )
    );

    setIsEditDialogOpen(false);
    setEditingAlbum(null);

    toast({
      title: "Album updated!",
      description: `"${editingAlbum.title}" has been updated successfully.`,
    });
  };

  const handleTogglePublish = (albumId: string) => {
    const album = albums.find((a) => a.id === albumId);
    if (!album) return;

    setAlbums(
      albums.map((a) =>
        a.id === albumId ? { ...a, published: !a.published } : a
      )
    );

    toast({
      title: album.published ? "Album deactivated" : "Album published",
      description: `"${album.title}" has been ${
        album.published ? "deactivated" : "published"
      }.`,
    });
  };

  const handleDeleteAlbum = () => {
    if (!deleteAlbumId) return;

    const album = albums.find((a) => a.id === deleteAlbumId);
    if (!album) return;

    setAlbums(
      albums.map((a) =>
        a.id === deleteAlbumId ? { ...a, isDeleted: true } : a
      )
    );

    setDeleteAlbumId(null);

    toast({
      title: "Album deleted",
      description: `"${album.title}" has been deleted.`,
    });
  };

  const openEditDialog = (album: Album) => {
    setEditingAlbum({ ...album });
    setIsEditDialogOpen(true);
  };

  const toggleTagFilter = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setPublishedFilter("all");
    setDateRange({});
    setSelectedTags([]);
  };

  const hasActiveFilters =
    publishedFilter !== "all" ||
    dateRange.from ||
    dateRange.to ||
    selectedTags.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Albums</h1>
          <p className="text-muted-foreground mt-1">
            Organize your photos into collections
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1">
                {[
                  publishedFilter !== "all" ? 1 : 0,
                  dateRange.from || dateRange.to ? 1 : 0,
                  selectedTags.length,
                ].reduce((a, b) => a + b, 0)}
              </Badge>
            )}
          </Button>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Album
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Album</DialogTitle>
                <DialogDescription>
                  Start organizing your photos by creating a new album
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Album Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Summer Vacation 2024"
                      value={newAlbum.title}
                      onChange={(e) =>
                        setNewAlbum({ ...newAlbum, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      placeholder="auto-generated from title"
                      value={newAlbum.slug}
                      onChange={(e) =>
                        setNewAlbum({ ...newAlbum, slug: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Add a description for this album..."
                    value={newAlbum.description}
                    onChange={(e) =>
                      setNewAlbum({ ...newAlbum, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventDate">Event Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(newAlbum.eventDate, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newAlbum.eventDate}
                        onSelect={(date) =>
                          date && setNewAlbum({ ...newAlbum, eventDate: date })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    placeholder="e.g., vacation, beach, summer"
                    value={newAlbum.tags}
                    onChange={(e) =>
                      setNewAlbum({ ...newAlbum, tags: e.target.value })
                    }
                  />
                </div>
                <Button onClick={handleCreateAlbum} className="w-full">
                  Create Album
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Filters</h3>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear all
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Published Filter */}
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={publishedFilter}
                  onValueChange={setPublishedFilter}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="unpublished">Unpublished</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range Filter */}
              <div className="space-y-2">
                <Label>Event Date From</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from
                        ? format(dateRange.from, "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) =>
                        setDateRange({ ...dateRange, from: date })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Event Date To</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.to
                        ? format(dateRange.to, "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) =>
                        setDateRange({ ...dateRange, to: date })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Tags Filter */}
            {allTags.length > 0 && (
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={
                        selectedTags.includes(tag) ? "default" : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => toggleTagFilter(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {filteredAlbums.length === 0 ? (
        <Card className="p-12 text-center">
          <FolderOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            {hasActiveFilters ? "No albums match filters" : "No albums yet"}
          </h3>
          <p className="text-muted-foreground mb-6">
            {hasActiveFilters
              ? "Try adjusting your filters"
              : "Create your first album to start organizing photos"}
          </p>
          {hasActiveFilters ? (
            <Button variant="outline" onClick={clearFilters}>
              Clear filters
            </Button>
          ) : (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Album
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlbums.map((album) => (
            <Card key={album.id} className="overflow-hidden group">
              <div
                className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center cursor-pointer"
                onClick={() =>
                  router.push(`/dashboard/admin/albums/${album.id}`)
                }
              >
                {album.coverImage ? (
                  <Image
                    src={album.coverImage}
                    alt={album.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FolderOpen className="h-16 w-16 text-primary/40" />
                )}
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">
                      {album.title}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      /{album.slug}
                    </p>
                  </div>
                  <Badge variant={album.published ? "default" : "secondary"}>
                    {album.published ? "Published" : "Draft"}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {album.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Event Date:</span>
                  <span>{format(album.eventDate, "MMM d, yyyy")}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{format(album.createdOn, "MMM d, yyyy")}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Photos:</span>
                  <span>{album.photoCount}</span>
                </div>

                {album.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {album.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditDialog(album);
                    }}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant={album.published ? "secondary" : "default"}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTogglePublish(album.id);
                    }}
                  >
                    {album.published ? (
                      <EyeOff className="h-3 w-3" />
                    ) : (
                      <Eye className="h-3 w-3" />
                    )}
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteAlbumId(album.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Album</DialogTitle>
            <DialogDescription>
              Update album information and settings
            </DialogDescription>
          </DialogHeader>
          {editingAlbum && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Album Title *</Label>
                  <Input
                    id="edit-title"
                    value={editingAlbum.title}
                    onChange={(e) =>
                      setEditingAlbum({
                        ...editingAlbum,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-slug">Slug</Label>
                  <Input
                    id="edit-slug"
                    value={editingAlbum.slug}
                    onChange={(e) =>
                      setEditingAlbum({ ...editingAlbum, slug: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingAlbum.description}
                  onChange={(e) =>
                    setEditingAlbum({
                      ...editingAlbum,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-eventDate">Event Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(editingAlbum.eventDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={editingAlbum.eventDate}
                      onSelect={(date) =>
                        date &&
                        setEditingAlbum({ ...editingAlbum, eventDate: date })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
                <Input
                  id="edit-tags"
                  value={editingAlbum.tags.join(", ")}
                  onChange={(e) =>
                    setEditingAlbum({
                      ...editingAlbum,
                      tags: e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </div>
              <Button onClick={handleEditAlbum} className="w-full">
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteAlbumId}
        onOpenChange={() => setDeleteAlbumId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Album</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this album? This action will
              soft-delete the album and it can be recovered later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAlbum}
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

export default Albums;
