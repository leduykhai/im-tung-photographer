import { albums } from "@/data/albums";
import { categoryLabels, categoryOrder } from "@/lib/categories";
import type { Album, AlbumCategory } from "@/types/album";

export { categoryLabels };

export function getAllAlbums(): Album[] {
  return albums;
}

export function getAlbumBySlug(slug: string): Album | undefined {
  return albums.find((album) => album.slug === slug);
}

/** Chỉ trả về danh mục đang có dữ liệu. */
export function getAvailableCategories(list: Album[] = albums): AlbumCategory[] {
  return categoryOrder.filter((category) =>
    list.some((album) => album.category === category),
  );
}

export function getPrevNextAlbums(slug: string): {
  prev: Album | null;
  next: Album | null;
} {
  const index = albums.findIndex((album) => album.slug === slug);
  if (index === -1 || albums.length < 2) return { prev: null, next: null };
  const prev = albums[(index - 1 + albums.length) % albums.length];
  const next = albums[(index + 1) % albums.length];
  return { prev, next };
}

/** Album liên quan: ưu tiên cùng danh mục, bổ sung bằng album còn lại. */
export function getRelatedAlbums(slug: string, limit = 4): Album[] {
  const current = getAlbumBySlug(slug);
  if (!current) return [];
  const others = albums.filter((album) => album.slug !== slug);
  const same = others.filter((album) => album.category === current.category);
  const rest = others.filter((album) => album.category !== current.category);
  return [...same, ...rest].slice(0, limit);
}
