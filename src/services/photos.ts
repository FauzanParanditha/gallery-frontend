import { api } from "@/libs/api";

export type PhotoDTO = {
  id: string;
  albumId: string;
  status: "uploaded" | "processing" | "processed" | "failed";
  createdAt: string;
  width?: number;
  height?: number;
  // ...field lain yang kamu punya
};

export const PhotoApi = {
  async listByAlbum(albumId: string, page = 1, limit = 48) {
    const { data } = await api.get(`/v1/albums/${albumId}/photos`, {
      params: { page, limit },
    });
    return (data?.data ?? data) as {
      items: PhotoDTO[];
      page: number;
      limit: number;
      total: number;
      hasMore: boolean;
    };
  },
};
