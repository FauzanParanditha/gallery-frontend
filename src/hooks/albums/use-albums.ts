import { AlbumApi } from "@/services/albums";
import { AlbumDTO, AlbumVM, dtoToVM } from "@/types/album";
import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite";

type AlbumListResp = {
  items: AlbumDTO[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
};

type ListParams = {
  page: number;
  limit: number;
  q?: string;
  isPublished?: boolean;
};

/**
 * List albums (paging tak terbatas / infinite scroll)
 * via AlbumApi.list
 */
export function useAlbums(params: {
  q?: string;
  isPublished?: boolean; // undefined: all
  pageSize?: number;
}) {
  const { q, isPublished, pageSize = 24 } = params;

  const getKey: SWRInfiniteKeyLoader = (
    pageIndex: number,
    previousPageData: AlbumListResp | null
  ) => {
    // kalau sudah tidak ada data berikutnya, stop
    if (previousPageData && !previousPageData.hasMore) return null;

    const page = pageIndex + 1;

    const keyParams: ListParams = {
      page,
      limit: pageSize,
      q,
      isPublished,
    };

    return ["albums", keyParams] as const;
  };

  const fetcher = async (
    key: readonly [string, ListParams]
  ): Promise<AlbumListResp> => {
    const [, params] = key;

    const cleanParams: any = {
      page: params.page,
      limit: params.limit,
    };

    if (params.q) cleanParams.q = params.q;
    if (typeof params.isPublished === "boolean") {
      cleanParams.isPublished = params.isPublished;
    }

    return AlbumApi.list(cleanParams);
  };

  const { data, error, isLoading, size, setSize, mutate } =
    useSWRInfinite<AlbumListResp>(getKey, fetcher, {
      revalidateFirstPage: true,
    });

  // flatten + convert DTO -> VM
  const items: AlbumVM[] =
    data?.flatMap((d) => (d?.items ?? []).map(dtoToVM)) ?? [];

  const hasMore = data ? Boolean(data[data.length - 1]?.hasMore) : true;

  // total album (diambil dari page pertama)
  const total = data?.[0]?.total ?? 0;

  return {
    items,
    error,
    isLoading,
    size,
    setSize,
    hasMore,
    mutate,
    total,
  };
}
