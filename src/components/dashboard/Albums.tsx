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
import type { AlbumVM } from "@/types/album";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Edit,
  Eye,
  EyeOff,
  FolderOpen,
  Plus,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type AlbumsProps = {
  albums: AlbumVM[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  photoCount: number;

  q: string;
  setQ: (v: string) => void;
  publishedFilter: "all" | "published" | "unpublished";
  setPublishedFilter: (v: "all" | "published" | "unpublished") => void;

  onCreate: (p: {
    title: string;
    slug?: string;
    description?: string;
    eventDate?: Date;
  }) => Promise<void>;
  onEdit: (
    id: string,
    p: Partial<{
      title: string;
      slug: string;
      description: string;
      eventDate: Date;
    }>
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onTogglePublish: (a: AlbumVM) => Promise<void>;
  onSetCover: (albumId: string, photoId: string) => Promise<void>;
};

const toSlug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export default function Albums(props: AlbumsProps) {
  const {
    albums,
    isLoading,
    hasMore,
    onLoadMore,
    photoCount,
    q,
    setQ,
    publishedFilter,
    setPublishedFilter,
    onCreate,
    onEdit,
    onDelete,
    onTogglePublish,
  } = props;

  const router = useRouter();

  // Create dialog state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAlbum, setNewAlbum] = useState({
    title: "",
    slug: "",
    description: "",
    eventDate: new Date(),
  });

  // Edit & delete dialog state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<AlbumVM | null>(null);
  const [deleteAlbumId, setDeleteAlbumId] = useState<string | null>(null);

  // Optional: simple client-side filter by q (kalau backend q sudah dipakai, ini bisa dihapus)
  const filteredAlbums = useMemo(() => {
    if (!q?.trim()) return albums;
    const k = q.toLowerCase();
    return albums.filter(
      (a) =>
        a.title.toLowerCase().includes(k) ||
        a.slug.toLowerCase().includes(k) ||
        a.description.toLowerCase().includes(k)
    );
  }, [albums, q]);

  const hasActiveFilters = publishedFilter !== "all" || !!q;

  // Handlers
  const handleCreateAlbum = async () => {
    if (!newAlbum.title.trim()) return;
    await onCreate({
      title: newAlbum.title.trim(),
      slug: newAlbum.slug?.trim() || toSlug(newAlbum.title),
      description: newAlbum.description?.trim(),
      eventDate: newAlbum.eventDate,
    });
    setNewAlbum({
      title: "",
      slug: "",
      description: "",
      eventDate: new Date(),
    });
    setIsCreateDialogOpen(false);
  };

  const openEditDialog = (album: AlbumVM) => {
    setEditingAlbum({ ...album });
    setIsEditDialogOpen(true);
  };

  const handleEditAlbum = async () => {
    if (!editingAlbum) return;
    if (!editingAlbum.title.trim()) return;

    await onEdit(editingAlbum.id, {
      title: editingAlbum.title.trim(),
      slug: editingAlbum.slug.trim(),
      description: editingAlbum.description.trim(),
      eventDate: editingAlbum.eventDate,
    });
    setIsEditDialogOpen(false);
    setEditingAlbum(null);
  };

  return (
    <div className="space-y-6">
      {/* Header + toolbar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Albums</h1>
          <p className="text-muted-foreground mt-1">
            Organize your photos into collections
          </p>
        </div>

        <div className="flex gap-2">
          <div className="hidden md:flex items-center gap-2">
            <Input
              placeholder="Search title/slug/description…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-64"
            />
            <Select
              value={publishedFilter}
              onValueChange={(v: "all" | "published" | "unpublished") =>
                setPublishedFilter(v)
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="unpublished">Unpublished</SelectItem>
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1">
                Active filters
              </Badge>
            )}
          </div>

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
                      placeholder="e.g., Summer Vacation 2025"
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
                <Button onClick={handleCreateAlbum} className="w-full">
                  Create Album
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Empty state / Grid */}
      {!isLoading && filteredAlbums.length === 0 ? (
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
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => setQ("")}>
                Clear search
              </Button>
              <Button
                variant="outline"
                onClick={() => setPublishedFilter("all")}
              >
                Reset status
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Album
            </Button>
          )}
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlbums.map((album) => (
              <Card key={album.id} className="overflow-hidden group">
                <div
                  className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center cursor-pointer"
                  onClick={() =>
                    router.push(`/dashboard/admin/albums/${album.id}`)
                  }
                >
                  {album.coverPhotoId ? (
                    <Image
                      src={`/v1/photos/${album.coverPhotoId}/thumb`}
                      alt={album.title}
                      className="w-full h-full object-cover"
                      width={600}
                      height={600}
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
                    <Badge
                      variant={album.isPublished ? "default" : "secondary"}
                    >
                      {album.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {album.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Event Date:</span>
                    <span>
                      {album.eventDate
                        ? format(album.eventDate, "MMM d, yyyy")
                        : "—"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Created:</span>
                    <span>{format(album.createdAt, "MMM d, yyyy")}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Photos:</span>
                    <span>{photoCount}</span>
                  </div>

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
                      variant={album.isPublished ? "secondary" : "default"}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePublish(album);
                      }}
                    >
                      {album.isPublished ? (
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

          {hasMore && (
            <div className="flex justify-center">
              <Button
                onClick={onLoadMore}
                disabled={isLoading}
                className="mt-2"
              >
                Load more
              </Button>
            </div>
          )}
        </>
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
                      setEditingAlbum({
                        ...editingAlbum,
                        slug: e.target.value,
                      })
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
                      {editingAlbum.eventDate
                        ? format(editingAlbum.eventDate, "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
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
              soft-delete the album.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (deleteAlbumId) {
                  await onDelete(deleteAlbumId);
                }
                setDeleteAlbumId(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
