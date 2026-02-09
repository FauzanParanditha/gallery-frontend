import { parseISO } from "date-fns";

export const getErrorMsg = (e: any) => {
  const msg =
    e?.response?.data?.message ||
    e?.response?.data?.error ||
    e?.message ||
    "Terjadi kesalahan. Coba lagi.";
  return typeof msg === "string" ? msg : JSON.stringify(msg);
};

export const parseISOorUndef = (s?: string | null) =>
  s ? parseISO(s) : undefined;

export const toSlug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
