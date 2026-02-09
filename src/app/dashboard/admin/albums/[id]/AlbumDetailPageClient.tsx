"use client";

import type { AlbumPrivacy } from "@/components/album/AlbumPrivacySettings";
import type { ShareLink } from "@/components/album/AlbumShareLinks";
import type { Photo } from "@/components/album/PhotoGrid";
import AlbumDetail from "@/components/dashboard/AlbumDetail";
import { useAlbumDetail } from "@/hooks/albums/use-album";
import { useToast } from "@/hooks/use-toast";
import { AlbumApi } from "@/services/albums";
import { AlbumDetailModel } from "@/types/album";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AlbumDetailPageClient({
  albumId,
}: {
  albumId: string;
}) {
  const router = useRouter();
  const { toast } = useToast();

  const { album, isLoading, mutate: mutateAlbum } = useAlbumDetail(albumId);

  const [form, setForm] = useState<AlbumDetailModel | null>(null);
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

  useEffect(() => {
    if (!album) return;
    setForm({
      id: album.id,
      title: album.title,
      slug: album.slug,
      eventDate: album.eventDate
        ? new Date(album.eventDate).toISOString().split("T")[0]
        : "",
      isPublished: album.isPublished,
      tags: (album as any).tags ?? [],
      createdOn: (album as any).createdAt ?? new Date().toISOString(),
      cover: (album as any).coverUrl ?? null,
    });
  }, [album]);

  const handleChangeAlbum = (changes: Partial<AlbumDetailModel>) => {
    setForm((prev) => (prev ? { ...prev, ...changes } : prev));
  };

  const handleCoverChange = (file: File | null) => {
    if (!file || !form) return;
    const coverUrl = URL.createObjectURL(file);
    setForm({ ...form, cover: coverUrl });
    toast({
      title: "Cover updated!",
      description: "Album cover has been updated (preview only).",
    });
    // TODO: sambungkan ke API cover
  };

  const handlePhotosUpload = (files: File[]) => {
    const newPhotos: Photo[] = files.map((file, index) => ({
      id: Date.now().toString() + index,
      url: URL.createObjectURL(file),
      caption: "",
      isFeatured: false,
      sortOrder: photos.length + index,
      status: "completed",
      tags: [],
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
    toast({
      title: "Photos uploaded!",
      description: `${newPhotos.length} photo(s) added to album.`,
    });
    // TODO: sambungkan ke PhotoApi.uploadMany
  };

  const handleUpdatePhoto = (photoId: string, updates: Partial<Photo>) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, ...updates } : p))
    );
  };

  const handleRetryUpload = (photoId: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, status: "processing" } : p))
    );
    setTimeout(() => {
      setPhotos((prev) =>
        prev.map((p) => (p.id === photoId ? { ...p, status: "completed" } : p))
      );
      toast({
        title: "Upload successful!",
        description: "Photo has been uploaded.",
      });
    }, 2000);
  };

  const handleAddAlbumTag = (tag: string) => {
    if (!form) return;
    if (form.tags.includes(tag)) return;
    setForm({ ...form, tags: [...form.tags, tag] });
  };

  const handleRemoveAlbumTag = (tag: string) => {
    if (!form) return;
    setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });
  };

  const handleGenerateShareLink = () => {
    if (!form) return;
    const newLink: ShareLink = {
      id: Date.now().toString(),
      url: `${window.location.origin}/share/${form.slug}/${Date.now()}`,
      expiresOn: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    };
    setShareLinks((prev) => [...prev, newLink]);
    toast({
      title: "Share link generated!",
      description: "New share link created successfully.",
    });
  };

  const handleRevokeShareLink = (linkId: string) => {
    setShareLinks((prev) => prev.filter((l) => l.id !== linkId));
    toast({
      title: "Link revoked",
      description: "Share link has been revoked.",
    });
  };

  const handlePublishToggle = async () => {
    if (!form) return;
    const next = !form.isPublished;
    setForm({ ...form, isPublished: next });

    try {
      if (next) await AlbumApi.publish(albumId);
      else await AlbumApi.unpublish(albumId);
      await mutateAlbum();
      toast({
        title: next ? "Album published" : "Album unpublished",
        description: next ? "Album is now public." : "Album is now private.",
      });
    } catch (e: any) {
      await mutateAlbum();
      toast({
        title: "Error",
        description: e?.response?.data?.message,
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!form) return;
    try {
      await AlbumApi.update(albumId, {
        title: form.title,
        slug: form.slug,
        eventDate: form.eventDate ? new Date(form.eventDate) : undefined,
      });
      await mutateAlbum();
      toast({
        title: "Changes saved!",
        description: "All changes have been saved successfully.",
      });
    } catch (e: any) {
      toast({
        title: "Error",
        description: e?.response?.data?.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading || !form) {
    return <div className="p-6">Loading album...</div>;
  }

  return (
    <AlbumDetail
      album={form}
      photos={photos}
      privacy={privacy}
      shareLinks={shareLinks}
      availableTags={availableTags}
      onBack={() => router.push("/dashboard/admin/albums")}
      onChangeAlbum={handleChangeAlbum}
      onCoverChange={handleCoverChange}
      onPhotosUpload={handlePhotosUpload}
      onUpdatePhoto={handleUpdatePhoto}
      onRetryUpload={handleRetryUpload}
      onAddAlbumTag={handleAddAlbumTag}
      onRemoveAlbumTag={handleRemoveAlbumTag}
      onPrivacyChange={setPrivacy}
      onGenerateShareLink={handleGenerateShareLink}
      onRevokeShareLink={handleRevokeShareLink}
      onPublishToggle={handlePublishToggle}
      onSave={handleSave}
    />
  );
}
