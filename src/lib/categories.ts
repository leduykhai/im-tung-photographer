import type { AlbumCategory } from "@/types/album";

/** Nhãn danh mục — module nhẹ, an toàn để import ở client. */
export const categoryLabels: Record<AlbumCategory, string> = {
  "phong-su-cuoi": "Phóng sự cưới",
  "le-gia-tien": "Lễ gia tiên",
  "tiec-cuoi": "Tiệc cưới",
  "pre-wedding": "Pre-wedding",
};

/** Thứ tự hiển thị của bộ lọc. */
export const categoryOrder: AlbumCategory[] = [
  "phong-su-cuoi",
  "le-gia-tien",
  "tiec-cuoi",
  "pre-wedding",
];
