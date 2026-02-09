"use client";

import Albums from "@/components/dashboard/Albums";
import { useAlbums } from "@/hooks/albums/use-albums";
import { useToast } from "@/hooks/use-toast";
import { AlbumApi } from "@/services/albums";
import type { AlbumVM } from "@/types/album";
import { useState } from "react";

export default function AlbumsPageClient() {
  const { toast } = useToast();

  // filters/search
  const [publishedFilter, setPublishedFilter] = useState<
    "all" | "published" | "unpublished"
  >("all");
  const [q, setQ] = useState("");

  const isPublished =
    publishedFilter === "all"
      ? undefined
      : publishedFilter === "published"
      ? true
      : false;

  // data + pagination
  const {
    items: albums,
    isLoading,
    hasMore,
    setSize,
    mutate,
    total,
  } = useAlbums({ q, isPublished, pageSize: 24 });

  // handlers
  const onCreate = async (form: {
    title: string;
    slug?: string;
    description?: string;
    eventDate?: Date;
  }) => {
    try {
      const created = await AlbumApi.create(form);
      await mutate((prev) => {
        if (!prev) return prev;
        const first = { ...prev[0], items: [created, ...prev[0].items] };
        return [first, ...prev.slice(1)];
      }, false);
      await mutate();
      toast({
        title: "Album created",
        description: `"${created.title}" berhasil dibuat.`,
      });
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message;
      toast({
        title: "Gagal membuat album",
        description: msg,
        variant: "destructive",
      });
    }
  };

  const onEdit = async (
    id: string,
    form: Partial<{
      title: string;
      slug: string;
      description: string;
      eventDate: Date;
    }>
  ) => {
    try {
      const updated = await AlbumApi.update(id, form);
      await mutate((prev) => {
        if (!prev) return prev;
        return prev.map((page) => ({
          ...page,
          items: page.items.map((a) => (a.id === id ? updated : a)),
        }));
      }, false);
      await mutate();
      toast({
        title: "Album updated",
        description: `"${updated.title}" disimpan.`,
      });
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message;
      toast({
        title: "Gagal update",
        description: msg,
        variant: "destructive",
      });
    }
  };

  const onDelete = async (id: string) => {
    await mutate(
      (prev) =>
        prev?.map((p) => ({ ...p, items: p.items.filter((a) => a.id !== id) })),
      false
    );
    try {
      await AlbumApi.remove(id);
      toast({ title: "Album deleted", description: "Album telah dihapus." });
    } catch (e: any) {
      await mutate(); // rollback via revalidate
      const msg = e?.response?.data?.message || e?.message;
      toast({
        title: "Gagal menghapus",
        description: msg,
        variant: "destructive",
      });
    }
  };

  const onTogglePublish = async (album: AlbumVM) => {
    await mutate(
      (prev) =>
        prev?.map((p) => ({
          ...p,
          items: p.items.map((a) =>
            a.id === album.id ? { ...a, isPublished: !a.isPublished } : a
          ),
        })),
      false
    );
    try {
      if (album.isPublished) await AlbumApi.unpublish(album.id);
      else await AlbumApi.publish(album.id);
      await mutate();
      toast({
        title: "Status updated",
        description: "Status album berhasil diganti.",
      });
    } catch (e: any) {
      await mutate(); // rollback by revalidate
      const msg = e?.response?.data?.message || e?.message;
      toast({
        title: "Gagal mengubah status",
        description: msg,
        variant: "destructive",
      });
    }
  };

  const onSetCover = async (albumId: string, photoId: string) => {
    try {
      await AlbumApi.setCover(albumId, photoId);
      await mutate();
      toast({
        title: "Cover updated",
        description: "Cover album berhasil diganti.",
      });
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message;
      toast({
        title: "Gagal set cover",
        description: msg,
        variant: "destructive",
      });
    }
  };

  const loadMore = () => setSize((s) => s + 1);

  return (
    <Albums
      albums={albums}
      isLoading={isLoading}
      hasMore={hasMore}
      onLoadMore={loadMore}
      photoCount={total}
      q={q}
      setQ={setQ}
      publishedFilter={publishedFilter}
      setPublishedFilter={setPublishedFilter}
      onCreate={onCreate}
      onEdit={onEdit}
      onDelete={onDelete}
      onTogglePublish={onTogglePublish}
      onSetCover={onSetCover}
    />
  );
}
