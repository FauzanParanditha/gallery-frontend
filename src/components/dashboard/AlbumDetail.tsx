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
import { AlbumDetailModel } from "@/types/album";
import { ArrowLeft, Save } from "lucide-react";

interface AlbumDetailProps {
  album: AlbumDetailModel;
  photos: Photo[];
  privacy: AlbumPrivacy;
  shareLinks: ShareLink[];
  availableTags: string[];

  // actions
  onBack: () => void;
  onChangeAlbum: (changes: Partial<AlbumDetailModel>) => void;
  onCoverChange: (file: File | null) => void;
  onPhotosUpload: (files: File[]) => void;
  onUpdatePhoto: (photoId: string, updates: Partial<Photo>) => void;
  onRetryUpload: (photoId: string) => void;
  onAddAlbumTag: (tag: string) => void;
  onRemoveAlbumTag: (tag: string) => void;
  onPrivacyChange: (privacy: AlbumPrivacy) => void;
  onGenerateShareLink: () => void;
  onRevokeShareLink: (linkId: string) => void;
  onPublishToggle: () => void;
  onSave: () => void;
}

const AlbumDetail = ({
  album,
  photos,
  privacy,
  shareLinks,
  availableTags,
  onBack,
  onChangeAlbum,
  onCoverChange,
  onPhotosUpload,
  onUpdatePhoto,
  onRetryUpload,
  onAddAlbumTag,
  onRemoveAlbumTag,
  onPrivacyChange,
  onGenerateShareLink,
  onRevokeShareLink,
  onPublishToggle,
  onSave,
}: AlbumDetailProps) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Album Details</h1>
          <p className="text-muted-foreground mt-1">
            Created on {new Date(album.createdOn).toLocaleDateString()}
          </p>
        </div>
        <Button variant="outline" onClick={onSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
        <Button onClick={onPublishToggle}>
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
              onChange={(e) => onChangeAlbum({ title: e.target.value })}
              placeholder="Album title"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Slug</label>
            <Input
              value={album.slug}
              onChange={(e) => onChangeAlbum({ slug: e.target.value })}
              placeholder="album-slug"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Event Date</label>
          <Input
            type="date"
            value={album.eventDate}
            onChange={(e) => onChangeAlbum({ eventDate: e.target.value })}
          />
        </div>
      </div>

      {/* Cover Upload */}
      <AlbumCoverUpload
        currentCover={album.cover ?? undefined}
        onCoverChange={onCoverChange}
      />

      {/* Photo Uploader */}
      <PhotoUploader onPhotosUpload={onPhotosUpload} />

      {/* Photo Grid */}
      {photos.length > 0 && (
        <PhotoGrid
          photos={photos}
          onUpdatePhoto={onUpdatePhoto}
          onRetryUpload={onRetryUpload}
        />
      )}

      {/* Tags */}
      <AlbumTags
        tags={album.tags}
        onAddTag={onAddAlbumTag}
        onRemoveTag={onRemoveAlbumTag}
        availableTags={availableTags}
      />

      {/* Privacy Settings */}
      <AlbumPrivacySettings
        privacy={privacy}
        onPrivacyChange={onPrivacyChange}
      />

      {/* Share Links */}
      <AlbumShareLinks
        shareLinks={shareLinks}
        onGenerateLink={onGenerateShareLink}
        onRevokeLink={onRevokeShareLink}
      />
    </div>
  );
};

export default AlbumDetail;
