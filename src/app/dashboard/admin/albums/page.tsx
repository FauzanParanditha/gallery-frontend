import AlbumsPageClient from "@/app/dashboard/admin/albums/AlbumsPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Albums | Page",
};

export default function AlbumsPage() {
  return <AlbumsPageClient />;
}
