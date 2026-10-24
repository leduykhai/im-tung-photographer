export type AlbumCategory =
  | "phong-su-cuoi"
  | "le-gia-tien"
  | "tiec-cuoi"
  | "pre-wedding";

export interface AlbumImage {
  /** Đường dẫn ảnh (trong /public hoặc URL đã cấu hình trong next.config images). */
  src: string;
  /** Kích thước thật của ảnh — bắt buộc để giữ tỷ lệ và tránh nhảy bố cục. */
  width: number;
  height: number;
  alt: string;
  /** Thứ tự kể chuyện (nhỏ → lớn). */
  order: number;
}

export interface Album {
  id: string;
  slug: string;
  /** Tên cặp đôi — dùng làm H1 trang chi tiết. */
  title: string;
  category: AlbumCategory;
  /** Ảnh bìa dọc tỷ lệ 2:3 (đã chuẩn bị sẵn, ảnh đơn hoặc collage). */
  coverImage: AlbumImage;
  /** Ảnh đại diện đầu trang chi tiết (nên là ảnh ngang ~3:2). */
  heroImage: AlbumImage;
  /** Lời dẫn ngắn 2–3 câu. */
  description: string;
  location?: string;
  images: AlbumImage[];
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  /** true = dữ liệu/ ảnh minh hoạ, không phải tác phẩm thật. */
  isDemo?: boolean;
}
