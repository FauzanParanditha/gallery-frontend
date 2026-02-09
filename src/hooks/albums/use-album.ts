import { AlbumApi } from "@/services/albums";
import { AlbumDetailModel, dtoToAlbumDetail } from "@/types/album";
import useSWR from "swr";

export function useAlbumDetail(id?: string) {
  const { data, error, isLoading, mutate } = useSWR<AlbumDetailModel, Error>(
    id ? ["album-detail", id] : null,
    async () => {
      const dto = await AlbumApi.getById(id!);
      return dtoToAlbumDetail(dto);
    }
  );

  return {
    album: data,
    isLoading,
    isError: !!error,
    mutate,
  };
}
