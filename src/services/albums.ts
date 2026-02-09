import { api } from "@/libs/api";
import { AlbumDetailDTO, AlbumDTO } from "@/types/album";
import { ApiResponse } from "@/types/api";

const toISO = (d?: Date) => (d ? d.toISOString() : null);

export function dateOnlyToUTC(d: Date) {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}

export const AlbumApi = {
  async list(params: {
    page: number;
    limit: number;
    q?: string;
    isPublished?: boolean;
  }) {
    const { data } = await api.get<
      ApiResponse<{
        items: AlbumDTO[];
        page: number;
        limit: number;
        total: number;
        hasMore: boolean;
      }>
    >("/v1/albums", { params });

    return data.data; // unwrap
  },

  async getById(id: string) {
    const { data } = await api.get<ApiResponse<AlbumDetailDTO>>(
      `/v1/albums/${id}`
    );
    return data.data; // unwrap
  },

  async create(p: {
    title: string;
    slug?: string;
    description?: string;
    eventDate?: Date;
    isPublished?: boolean;
  }) {
    const body = {
      title: p.title,
      slug: p.slug,
      description: p.description ?? null,
      eventDate: dateOnlyToUTC(p.eventDate!).toISOString(),
      isPublished: p.isPublished ?? false,
    };

    const { data } = await api.post<ApiResponse<AlbumDTO>>("/v1/albums", body);
    return data.data;
  },

  async update(
    id: string,
    p: {
      title?: string;
      slug?: string;
      description?: string;
      eventDate?: Date;
      isPublished?: boolean;
    }
  ) {
    const body = {
      ...p,
      description: p.description ?? undefined,
      eventDate: p.eventDate
        ? dateOnlyToUTC(p.eventDate).toISOString()
        : undefined,
    };

    const { data } = await api.patch<ApiResponse<AlbumDTO>>(
      `/v1/albums/${id}`,
      body
    );

    return data.data; // unwrap
  },

  async remove(id: string) {
    await api.delete(`/v1/albums/${id}`);
  },

  async publish(id: string) {
    const { data } = await api.post<ApiResponse<AlbumDTO>>(
      `/v1/albums/${id}/publish`,
      {}
    );
    return data.data;
  },

  async unpublish(id: string) {
    const { data } = await api.post<ApiResponse<AlbumDTO>>(
      `/v1/albums/${id}/unpublish`,
      {}
    );
    return data.data;
  },

  async setCover(id: string, photoId: string) {
    const { data } = await api.post<ApiResponse<AlbumDTO>>(
      `/v1/albums/${id}/cover`,
      { photoId }
    );

    return data.data;
  },
};
