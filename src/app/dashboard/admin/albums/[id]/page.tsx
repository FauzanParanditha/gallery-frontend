import AlbumDetailPageClient from "./AlbumDetailPageClient";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  return <AlbumDetailPageClient albumId={id} />;
}
