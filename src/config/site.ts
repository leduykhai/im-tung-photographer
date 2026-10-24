/**
 * CẤU HÌNH THƯƠNG HIỆU — nơi duy nhất để chỉnh thông tin liên hệ.
 *
 * Mục nào để `null` sẽ tự động được ẩn khỏi giao diện (không hiển thị link giả).
 * Khi có thêm địa chỉ studio, TikTok, Instagram, giờ làm việc... chỉ cần điền vào đây.
 */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || null;

export const siteConfig = {
  name: "I'm Tung Photographer",
  /** Wordmark dạng chữ khi chưa có logo. */
  wordmark: { primary: "I'm Tung", secondary: "PHOTOGRAPHER" },
  tagline: "Giữ lại khoảnh khắc. Kể lại yêu thương.",
  defaultTitle: "I'm Tung Photographer | Album cưới & Phóng sự cưới",
  defaultDescription:
    "I'm Tung Photographer — album cưới và phóng sự cưới với những khoảnh khắc tự nhiên, cảm xúc. Xem album và nhận tư vấn cho ngày cưới của bạn.",
  locale: "vi_VN",

  contact: {
    phoneDisplay: "0352 942 502",
    phoneHref: "tel:+84352942502",
    zaloHref: "https://zalo.me/0352942502",
    facebookHref: "https://www.facebook.com/nkttung1999",
    email: "tungkhac12b4@gmail.com",
    emailHref: "mailto:tungkhac12b4@gmail.com",
  },

  /** Chưa có dữ liệu → để null để ẩn. Điền vào khi có. */
  optional: {
    address: null as string | null,
    openingHours: null as string | null,
    tiktokHref: null as string | null,
    instagramHref: null as string | null,
    pricingHref: null as string | null,
  },

  /**
   * Domain thật. Chỉ dùng khi đặt NEXT_PUBLIC_SITE_URL (không tự bịa domain).
   * Khi null: không xuất canonical và sitemap.
   */
  siteUrl,

  /**
   * Cho phép công cụ tìm kiếm lập chỉ mục. Mặc định TẮT vì đang dùng ảnh/album minh hoạ.
   * Khi triển khai bản thật với ảnh thật: đặt NEXT_PUBLIC_ALLOW_INDEXING=true.
   */
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",

  /** Phiên bản chính sách bảo mật — lưu cùng lead khi khách đồng ý. */
  privacyPolicyVersion: "2026-10-24",
  privacyPolicyUpdatedAt: "24/10/2026",

  /** Số album hiển thị mỗi lượt trên trang chủ. */
  albumsPageSize: 12 as number,
} as const;

export type SiteConfig = typeof siteConfig;

export const navItems = [
  { label: "Album cưới", href: "/#albums" },
  { label: "Về Tùng", href: "/#about" },
  { label: "Liên hệ", href: "/#contact" },
] as const;
