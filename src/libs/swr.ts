import { api } from "./api";

export const swrFetcher = (url: string) =>
  api.get(url).then((r) => r.data?.data ?? r.data);
