import { parseISOorUndef } from "@/libs/helper";
import { parseISO } from "date-fns";

export type AlbumDTO = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  eventDate: string | null;
  coverPhotoId: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AlbumVM = {
  id: string;
  slug: string;
  title: string;
  description: string;
  eventDate?: Date;
  coverPhotoId?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export const dtoToVM = (a: AlbumDTO): AlbumVM => ({
  id: a.id,
  slug: a.slug,
  title: a.title,
  description: a.description ?? "",
  eventDate: parseISOorUndef(a.eventDate),
  coverPhotoId: a.coverPhotoId ?? undefined,
  isPublished: a.isPublished,
  createdAt: parseISO(a.createdAt),
  updatedAt: parseISO(a.updatedAt),
});

export type AlbumDetailDTO = AlbumDTO & {
  coverPhoto: {
    id: string;
    keyOriginal: string;
    keyThumb: string;
  } | null;

  photos: {
    id: string;
    keyOriginal: string;
    keyThumb: string;
    caption: string | null;
    isFeatured: boolean;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
  }[];

  albumTag: { tag: string }[];

  albumPrivacy: {
    visibility: "public" | "private" | "unlisted";
    requirePassword?: boolean;
    passwordHint?: string | null;
  } | null;

  shareLinks: {
    id: string;
    token: string;
    expiresAt: string | null;
    createdAt: string;
  }[];
};

export type AlbumDetailModel = {
  id: string;
  title: string;
  slug: string;
  cover?: string | null;
  eventDate: string;
  isPublished: boolean;
  tags: string[];
  createdOn: string; // ISO
};

export function dtoToAlbumDetail(a: AlbumDetailDTO): AlbumDetailModel {
  return {
    id: a.id,
    title: a.title,
    slug: a.slug,
    cover: a.coverPhoto?.keyThumb ?? null,
    eventDate: a.eventDate ?? "",
    isPublished: a.isPublished,
    tags: a.albumTag.map((t) => t.tag),
    createdOn: a.createdAt,
  };
}
