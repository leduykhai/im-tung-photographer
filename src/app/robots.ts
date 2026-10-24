import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  // Mặc định chặn lập chỉ mục khi còn dùng dữ liệu minh hoạ (xem siteConfig.allowIndexing).
  if (!siteConfig.allowIndexing) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    ...(siteConfig.siteUrl ? { sitemap: `${siteConfig.siteUrl}/sitemap.xml` } : {}),
  };
}
