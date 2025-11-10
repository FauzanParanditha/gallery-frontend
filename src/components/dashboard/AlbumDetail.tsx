"use client";

import { AlbumCoverUpload } from "@/components/album/AlbumCoverUpload";
import {
  AlbumPrivacy,
  AlbumPrivacySettings,
} from "@/components/album/AlbumPrivacySettings";
import { AlbumShareLinks, ShareLink } from "@/components/album/AlbumShareLinks";
import { AlbumTags } from "@/components/album/AlbumTags";
import { Photo, PhotoGrid } from "@/components/album/PhotoGrid";
import { PhotoUploader } from "@/components/album/PhotoUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useParams } from "react-router-dom";

interface Album {
  id: string;
  title: string;
  slug: string;
  cover?: string;
  eventDate: string;
  isPublished: boolean;
  tags: string[];
  createdOn: string;
}

const AlbumDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [album, setAlbum] = useState<Album>({
    id: id || "1",
    title: "Sample Album",
    slug: "sample-album",
    eventDate: new Date().toISOString().split("T")[0],
    isPublished: false,
    tags: [],
    createdOn: new Date().toISOString(),
  });

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [privacy, setPrivacy] = useState<AlbumPrivacy>({
    isPublic: true,
    allowDownload: true,
    allowShare: true,
    watermarkOn: false,
    accessCode: "",
  });
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);

  const availableTags = [
    "wedding",
    "birthday",
    "corporate",
    "portrait",
    "landscape",
    "event",
  ];

  const handleCoverChange = (file: File | null) => {
    if (file) {
      const coverUrl = URL.createObjectURL(file);
      setAlbum({ ...album, cover: coverUrl });
      toast({
        title: "Cover updated!",
        description: "Album cover has been updated.",
      });
    }
  };

  const handlePhotosUpload = (files: File[]) => {
    const newPhotos: Photo[] = files.map((file, index) => ({
      id: Date.now().toString() + index,
      url: URL.createObjectURL(file),
      caption: "",
      isFeatured: false,
      sortOrder: photos.length + index,
      status: "completed" as const,
      tags: [],
    }));

    setPhotos([...photos, ...newPhotos]);
    toast({
      title: "Photos uploaded!",
      description: `${newPhotos.length} photo(s) added to album.`,
    });
  };

  const handleUpdatePhoto = (photoId: string, updates: Partial<Photo>) => {
    setPhotos(
      photos.map((photo) =>
        photo.id === photoId ? { ...photo, ...updates } : photo
      )
    );
  };

  const handleRetryUpload = (photoId: string) => {
    setPhotos(
      photos.map((photo) =>
        photo.id === photoId
          ? { ...photo, status: "processing" as const }
          : photo
      )
    );

    // Simulate upload retry
    setTimeout(() => {
      setPhotos(
        photos.map((photo) =>
          photo.id === photoId
            ? { ...photo, status: "completed" as const }
            : photo
        )
      );
      toast({
        title: "Upload successful!",
        description: "Photo has been uploaded.",
      });
    }, 2000);
  };

  const handleAddAlbumTag = (tag: string) => {
    setAlbum({ ...album, tags: [...album.tags, tag] });
  };

  const handleRemoveAlbumTag = (tag: string) => {
    setAlbum({ ...album, tags: album.tags.filter((t) => t !== tag) });
  };

  const handleGenerateShareLink = () => {
    const newLink: ShareLink = {
      id: Date.now().toString(),
      url: `${window.location.origin}/share/${album.slug}/${Date.now()}`,
      expiresOn: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      createdAt: new Date().toISOString(),
    };
    setShareLinks([...shareLinks, newLink]);
    toast({
      title: "Share link generated!",
      description: "New share link created successfully.",
    });
  };

  const handleRevokeShareLink = (linkId: string) => {
    setShareLinks(shareLinks.filter((link) => link.id !== linkId));
    toast({
      title: "Link revoked",
      description: "Share link has been revoked.",
    });
  };

  const handlePublishToggle = () => {
    setAlbum({ ...album, isPublished: !album.isPublished });
    toast({
      title: album.isPublished ? "Album unpublished" : "Album published",
      description: album.isPublished
        ? "Album is now private."
        : "Album is now public.",
    });
  };

  const handleSave = () => {
    toast({
      title: "Changes saved!",
      description: "All changes have been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dashboard/admin/albums")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Album Details</h1>
          <p className="text-muted-foreground mt-1">
            Created on {new Date(album.createdOn).toLocaleDateString()}
          </p>
        </div>
        <Button variant="outline" onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
        <Button onClick={handlePublishToggle}>
          {album.isPublished ? "Unpublish" : "Publish"}
        </Button>
      </div>

      {/* Album Info */}
      <div className="grid gap-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={album.title}
              onChange={(e) => setAlbum({ ...album, title: e.target.value })}
              placeholder="Album title"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Slug</label>
            <Input
              value={album.slug}
              onChange={(e) => setAlbum({ ...album, slug: e.target.value })}
              placeholder="album-slug"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Event Date</label>
          <Input
            type="date"
            value={album.eventDate}
            onChange={(e) => setAlbum({ ...album, eventDate: e.target.value })}
          />
        </div>
      </div>

      {/* Cover Upload */}
      <AlbumCoverUpload
        currentCover={album.cover}
        onCoverChange={handleCoverChange}
      />

      {/* Photo Uploader */}
      <PhotoUploader onPhotosUpload={handlePhotosUpload} />

      {/* Photo Grid */}
      {photos.length > 0 && (
        <PhotoGrid
          photos={photos}
          onUpdatePhoto={handleUpdatePhoto}
          onRetryUpload={handleRetryUpload}
        />
      )}

      {/* Tags */}
      <AlbumTags
        tags={album.tags}
        onAddTag={handleAddAlbumTag}
        onRemoveTag={handleRemoveAlbumTag}
        availableTags={availableTags}
      />

      {/* Privacy Settings */}
      <AlbumPrivacySettings privacy={privacy} onPrivacyChange={setPrivacy} />

      {/* Share Links */}
      <AlbumShareLinks
        shareLinks={shareLinks}
        onGenerateLink={handleGenerateShareLink}
        onRevokeLink={handleRevokeShareLink}
      />
    </div>
  );
};

export default AlbumDetail;
