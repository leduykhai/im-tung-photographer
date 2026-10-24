import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllAlbums } from "@/lib/albums";

/**
 * Chỉ xuất sitemap khi đã cấu hình domain thật (NEXT_PUBLIC_SITE_URL) và cho phép lập chỉ mục.
 * Không tự bịa domain.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.siteUrl;
  if (!base || !siteConfig.allowIndexing) return [];

  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...getAllAlbums().map((album) => ({
      url: `${base}/album/${album.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${base}/chinh-sach-bao-mat`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
