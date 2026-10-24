# I'm Tung Photographer — Landing Page Marketing Album Cưới

Website marketing album cưới và phóng sự cưới dành riêng cho thương hiệu **I'm Tung Photographer**. Thiết kế theo phong cách tối giản, biên tập ảnh cưới cao cấp (*editorial wedding photography*), tôn vinh cảm xúc tự nhiên, tối ưu trải nghiệm xem ảnh trên cả máy tính lẫn điện thoại, cùng luồng đăng ký tư vấn minh bạch, thuận tiện.

---

## 1. Thông Tin Thương Hiệu Chính Xác

Toàn bộ thông tin thương hiệu được quản lý tập trung tại [`src/config/site.ts`](src/config/site.ts):

* **Tên thương hiệu:** `I'm Tung Photographer`
* **Wordmark chữ (khi chưa có logo):**
  ```text
  I'm Tung
  PHOTOGRAPHER
  ```
* **Điện thoại:** `0352 942 502` (`tel:+84352942502`)
* **Zalo:** [https://zalo.me/0352942502](https://zalo.me/0352942502)
* **Facebook:** [https://www.facebook.com/nkttung1999](https://www.facebook.com/nkttung1999)
* **Email:** [tungkhac12b4@gmail.com](mailto:tungkhac12b4@gmail.com)
* **Thông tin chưa có (được ẩn tự động, không bịa đặt):** Địa chỉ studio, giờ mở cửa, bảng giá cố định, Instagram, TikTok. Khi có thông tin mới, chỉ cần cập nhật trong `src/config/site.ts`.

---

## 2. Kiến Trúc & Công Nghệ Triển Khai

* **Framework:** Next.js (App Router, Turbopack, TypeScript 5).
* **Styling:** Tailwind CSS v4 với hệ màu tinh chỉnh (*Ivory #FAF8F5, Surface #FFFFFF, Ink #252525, Muted #68615B, Accent #80624A, Line #E8E1D9*).
* **Typography:** Font Serif tiếng Việt `Cormorant Garamond` kết hợp Sans-serif `Be Vietnam Pro` (tải qua `next/font/google`).
* **Form & Validation:** `react-hook-form` + `@hookform/resolvers` + `zod`.
* **Ảnh & Tối ưu:** Next.js Image với chuẩn WebP, placeholder tránh nhảy layout (CLS = 0).
* **Bảo mật & Hiệu năng:** Rate limiter theo IP, honeypot chống bot tự động, CSRF same-origin check, HTTP security headers, payload size limit.

---

## 3. Cấu Trúc Thư Mục Dự Án

```text
im-tung-photographer/
├── public/
│   ├── albums/                 # Thư mục ảnh từng album (cover, hero, gallery...)
│   ├── hero/                   # Ảnh hero trang chủ
│   └── about/                  # Ảnh minh hoạ phần "Về Tùng"
├── scripts/
│   ├── build-demo-images.mjs   # Script tạo ảnh WebP tối ưu & manifest demo
│   └── supabase-schema.sql     # Script SQL tạo bảng lưu trữ lead trong Supabase
├── src/
│   ├── app/
│   │   ├── album/[slug]/       # Trang chi tiết từng album & 404 album
│   │   ├── api/leads/          # API route POST nhận lead tư vấn & GET kiểm tra cấu hình
│   │   ├── chinh-sach-bao-mat/ # Trang chính sách bảo mật dữ liệu khách hàng
│   │   ├── globals.css         # Hệ thống design tokens, typography, utilities
│   │   ├── layout.tsx          # Root layout, fonts tiếng Việt, header/footer, dialog provider
│   │   ├── not-found.tsx       # Trang 404 toàn website
│   │   ├── error.tsx           # Error boundary thân thiện
│   │   ├── robots.ts           # robots.txt động theo cấu hình indexing
│   │   ├── sitemap.ts          # sitemap.xml động theo danh sách album
│   │   └── page.tsx            # Landing page marketing chính
│   ├── components/
│   │   ├── album/              # Gallery ảnh justified, Lightbox toàn màn hình, AlbumNav, AlbumCta
│   │   ├── consult/            # ConsultationForm, ConsultationDialog, OpenConsultationButton
│   │   ├── contact/            # FloatingContact (desktop), MobileContactBar (mobile)
│   │   ├── home/               # HeroSection, IntroSection, AlbumBrowser, AlbumCard, AlbumGrid, AboutSection
│   │   ├── layout/             # SiteHeader, SiteFooter, Wordmark, CurrentYear, AnalyticsListener
│   │   └── ui/                 # SmartImage (có trạng thái retry khi lỗi mạng), bộ icon SVG
│   ├── config/
│   │   └── site.ts             # Toàn bộ cấu hình thương hiệu, liên hệ, metadata
│   ├── data/
│   │   ├── albums.ts           # Dữ liệu 12 album mẫu (dễ dàng thay thế)
│   │   └── demo-manifest.json  # Kích thước thật của từng ảnh demo
│   ├── lib/
│   │   ├── albums.ts           # Hàm truy vấn album, album liên quan, next/prev
│   │   ├── analytics.ts        # Đo lường sự kiện (view_album, click_phone, click_zalo...) KHÔNG PII
│   │   ├── browse-state.ts     # Ghi nhớ bộ lọc & vị trí cuộn khi back từ album detail
│   │   ├── categories.ts       # Nhãn & thứ tự danh mục album
│   │   ├── json-ld.ts          # Schema.org Structured Data chuẩn SEO
│   │   ├── lead-schema.ts      # Schema Zod dùng chung client & server
│   │   ├── phone.ts            # Chuẩn hoá số điện thoại Việt Nam (0x & +84)
│   │   └── leads/
│   │       ├── client.ts       # Service gửi lead phía client
│   │       ├── rate-limit.ts   # Rate limit bảo vệ API route
│   │       └── storage.ts      # Adapter lưu Supabase & Webhook
│   └── types/
│       └── album.ts            # Định nghĩa kiểu dữ liệu Album & AlbumImage
├── .env.example                # File mẫu biến môi trường
└── next.config.ts              # Cấu hình Next.js & Turbopack
```

---

## 4. Hướng Dẫn Cài Đặt & Chạy Website

### 4.1. Yêu cầu môi trường
* Node.js v18.18 trở lên (khuyên dùng Node 20 hoặc 24).
* Trình quản lý gói `pnpm` (hoặc `npm` / `yarn`).

### 4.2. Khởi chạy môi trường phát triển (Dev)
```bash
cd im-tung-photographer

# Cài đặt thư viện phụ thuộc (nếu chưa cài)
pnpm install

# Khởi chạy server phát triển
pnpm dev
```
Mở trình duyệt truy cập: [http://localhost:3000](http://localhost:3000)

### 4.3. Kiểm tra mã nguồn & Build sản phẩm
```bash
# Kiểm tra lỗi cú pháp TypeScript
pnpm typecheck

# Kiểm tra quy chuẩn mã nguồn ESLint
pnpm lint

# Tạo bản build tối ưu cho production
pnpm build

# Chạy bản build production thử nghiệm
pnpm start
```

---

## 5. Những Tính Năng Đã Hoạt Động Ngay (Out-Of-The-Box)

1. **Landing Page Marketing (`/`):**
   * **Header:** Tự động trong suốt trên nền Hero, đổi sang nền trắng ngà mờ (*backdrop blur*) khi cuộn trang; menu thu gọn mượt mà trên mobile.
   * **Hero Section:** Bố cục ảnh cưới lớn, xử lý tương phản chữ hoàn hảo, 2 nút CTA “Khám phá album” và “Nhận tư vấn”.
   * **Danh sách Album (Trọng tâm):**
     * Hiển thị lưới chuẩn 4 cột (desktop), 2-3 cột (tablet), 2 cột (mobile).
     * Tỷ lệ ảnh bìa dọc 2:3, tên album đặt dưới ảnh, hover zoom tinh tế và hiện nhãn “Xem album”.
     * Bộ lọc động: *Tất cả, Phóng sự cưới, Lễ gia tiên, Tiệc cưới, Pre-wedding* (tự ẩn nếu danh mục chưa có ảnh).
     * Phân trang hiển thị 12 album ban đầu kèm nút “Xem thêm album”.
     * **Khôi phục vị trí cuộn & bộ lọc:** Khi khách từ trang chi tiết quay lại trang chủ, website tự động giữ nguyên danh mục đã lọc và vị trí cuộn trang trước đó.
   * **Section Về Tùng:** Bố cục 2 cột thanh lịch với ảnh cưới tĩnh vật (không mạo danh chân dung của người khác), nút CTA mở trực tiếp Zalo.
   * **Footer:** Wordmark, tagline, số điện thoại, email, liên kết mạng xã hội chính xác, bản quyền tự cập nhật năm hiện tại.
2. **Trang Chi Tiết Album (`/album/[slug]`):**
   * Breadcrumb chuẩn điều hướng: *Trang chủ / Album cưới / Tên album*.
   * Tiêu đề `h1` là tên cặp đôi, nhãn thể loại, địa điểm và ảnh đại diện ngang 3:2.
   * **Gallery ảnh justified:** Kết hợp linh hoạt ảnh ngang và dọc, giữ nguyên 100% tỷ lệ gốc (không bị crop mất chi tiết quan trọng), khai báo trước kích thước để triệt tiêu hiện tượng giật trang (*Layout Shift*).
   * **Lightbox toàn màn hình:**
     * Nền tối sang trọng, đóng bằng phím `Escape`, nút Close hoặc click ra ngoài.
     * Chuyển ảnh bằng phím mũi tên `←` `→`, nút điều hướng hoặc thao tác vuốt cảm ứng trên di động.
     * Tự động tải trước (*preload*) ảnh kế tiếp để chuyển ảnh tức thì.
     * Trả focus chính xác về đúng ảnh vừa xem khi đóng Lightbox.
     * Khoá cuộn trang nền và tự ẩn các nút liên hệ nổi để không che ảnh.
   * **CTA Cuối Album:** Nút “Tư vấn album tương tự” tự động gắn kèm Tên, ID và Đường dẫn album khách đang xem vào form.
   * Điều hướng **Album trước / Album tiếp theo** và đề xuất **4 album liên quan**.
3. **Liên Hệ Nhanh Đa Thiết Bị:**
   * **Desktop:** Cụm nút nổi bên góc phải màn hình gồm Gọi điện, Zalo, Facebook kèm tooltip giải thích.
   * **Mobile:** Thanh cố định dưới đáy màn hình gồm *Gọi ngay*, *Zalo*, *Tư vấn* (hỗ trợ *safe-area* cho màn hình tai thỏ/home indicator và tự động ẩn khi bàn phím ảo bật lên để không che form).
4. **Form Tư Vấn & Xác Thực Chặt Chẽ:**
   * Các trường cơ bản luôn hiển thị: Họ tên, Số điện thoại (chuẩn hoá định dạng VN dạng `0x` và `+84`), Ngày cưới dự kiến.
   * Vùng mở rộng linh hoạt: Email, Số Zalo (có tùy chọn *Zalo dùng cùng số điện thoại*), Tỉnh/thành, Địa điểm dự kiến (không bắt buộc địa chỉ nhà), Dịch vụ quan tâm, Kênh liên hệ mong muốn, Lời nhắn.
   * Checkbox đồng thuận liên hệ kèm link tới **Chính sách bảo mật** (`/chinh-sach-bao-mat`).
   * Chống spam: Honeypot ẩn với người dùng thật, Rate Limiting (5 lượt / 10 phút / IP), giới hạn dung lượng request.
   * **Chế độ Demo:** Khi chưa kết nối database, form hiển thị thông báo rõ ràng cho khách và gợi ý gọi điện/Zalo, tuyệt đối không giả lập thành công để tránh thất lạc thông tin khách hàng.
5. **SEO & Đo Lường An Toàn:**
   * Thẻ `title`, `meta description`, `Open Graph`, `Twitter Card` riêng biệt cho từng trang và từng album.
   * Schema Structured Data (`application/ld+json`) cho tổ chức và BreadcrumbList.
   * Bộ phát sự kiện đo lường chuẩn (`view_album`, `click_phone`, `click_zalo`, `open_consultation_form`, `submit_lead_success`) **hoàn toàn không chứa thông tin cá nhân (PII)**.

---

## 6. Hướng Dẫn Cấu Hình Thêm

### 6.1. Nhận Lead Tư Vấn Về Cho Tùng (Hoàn Toàn Miễn Phí 100%)

Tạo file `.env.local` (sao chép từ `.env.example`). Bạn có thể chọn **1 trong các cách miễn phí sau** (hoặc kết hợp cùng lúc):

#### 🚀 Cách 1: Bắn Tin Nhắn Ngay Về Điện Thoại Qua Telegram Bot (Khuyên dùng nhất — Nhanh nhất)
* **Ưu điểm:** Điện thoại rung chuông trong 1 giây ngay khi khách bấm gửi, hiển thị đầy đủ thông tin + nút bấm gọi điện/mở Zalo liền, không giới hạn số lượng tin nhắn, không tốn 1 xu.
* **Cách làm (chưa đầy 2 phút):**
  1. Mở app Telegram, tìm tài khoản bot `@BotFather` -> Gõ `/newbot` -> Đặt tên cho bot -> Bạn sẽ nhận được chuỗi **TOKEN** (dạng `123456789:ABCdef...`).
  2. Tìm bot `@userinfobot` trên Telegram -> Bấm Start -> Bot trả về **Id** của bạn (dạng `987654321`).
  3. Tìm tên bot bạn vừa tạo ở bước 1, bấm **Start** một lần để cho phép bot gửi tin nhắn cho bạn.
  4. Mở file `.env.local` điền vào:
     ```env
     TELEGRAM_BOT_TOKEN=123456789:ABCdefGhIjk...
     TELEGRAM_CHAT_ID=987654321
     ```

#### 📊 Cách 2: Tự Động Lưu Vào Google Sheets & Gửi Email Về Gmail
* **Ưu điểm:** Lưu toàn bộ danh sách khách vào file Google Sheet online để tiện quản lý lâu dài, đồng thời Google tự gửi 1 email thông báo về Gmail (`tungkhac12b4@gmail.com`).
* **Cách làm:**
  1. Mở [Google Sheets](https://sheets.google.com) tạo một bảng tính mới.
  2. Chọn menu **Tiện ích mở rộng** (Extensions) -> **Apps Script**.
  3. Xoá hết code cũ, copy toàn bộ code có sẵn tại [`scripts/google-sheet-lead-collector.js`](scripts/google-sheet-lead-collector.js) dán vào.
  4. Bấm **Triển khai** (Deploy) -> **Tùy chọn triển khai mới** (New deployment) -> Chọn loại **Ứng dụng web** (Web app) -> Mục *Ai có quyền truy cập* chọn **Bất kỳ ai** (Anyone) -> Bấm **Triển khai**.
  5. Copy đường dẫn Web App URL dán vào `.env.local`:
     ```env
     LEAD_WEBHOOK_URL=https://script.google.com/macros/s/AKfycb.../exec
     ```

#### 🗄️ Cách 3: Lưu Vào Database Supabase (Miễn phí 500MB)
1. Tạo project miễn phí tại [Supabase.com](https://supabase.com).
2. Vào **SQL Editor**, dán nội dung file [`scripts/supabase-schema.sql`](scripts/supabase-schema.sql) và nhấn **Run**.
3. Cấu hình vào `.env.local`:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
   SUPABASE_LEADS_TABLE=leads
   ```

*(Lưu ý: Chỉ cần cấu hình ÍT NHẤT 1 trong các cách trên, website sẽ tự động kích hoạt chế độ nhận lead thật 100% và không còn hiển thị chế độ demo).*

---

### 6.2. Thay thế Album mẫu bằng Tác phẩm thật của Tùng

Dữ liệu album được tách biệt hoàn toàn trong file [`src/data/albums.ts`](src/data/albums.ts).

1. **Chuẩn bị ảnh:**
   * Tạo thư mục tương ứng với slug của cặp đôi trong thư mục `public/albums/`, ví dụ: `public/albums/hoang-nam-thu-trang/`.
   * Đặt các file ảnh đã xuất (định dạng JPG hoặc WebP chất lượng cao) vào thư mục trên:
     * `cover.webp` (Ảnh bìa dọc tỷ lệ 2:3, khuyến nghị 800x1200px trở lên).
     * `hero.webp` (Ảnh đại diện ngang tỷ lệ ~3:2).
     * Các ảnh phóng sự chi tiết trong buổi lễ/tiệc/ngoại cảnh.
2. **Khai báo trong `src/data/albums.ts`:**
   Mỗi album là một object theo chuẩn:
   ```typescript
   {
     id: "album-01",
     slug: "hoang-nam-thu-trang",
     title: "Hoàng Nam & Thu Trang",
     category: "phong-su-cuoi", // "phong-su-cuoi" | "le-gia-tien" | "tiec-cuoi" | "pre-wedding"
     location: "Hà Nội",
     description: "Lời dẫn cảm xúc ngắn 2-3 câu về ngày cưới của cặp đôi...",
     coverImage: {
       src: "/albums/hoang-nam-thu-trang/cover.webp",
       width: 848,
       height: 1264,
       alt: "Ảnh bìa album Hoàng Nam & Thu Trang",
       order: 1,
     },
     heroImage: {
       src: "/albums/hoang-nam-thu-trang/hero.webp",
       width: 1200,
       height: 800,
       alt: "Hoàng Nam & Thu Trang",
       order: 2,
     },
     images: [
       // Danh sách ảnh theo thứ tự kể chuyện từ đầu đến cuối buổi lễ
       { src: "/albums/hoang-nam-thu-trang/01.webp", width: 1200, height: 800, alt: "...", order: 1 },
       { src: "/albums/hoang-nam-thu-trang/02.webp", width: 800, height: 1200, alt: "...", order: 2 },
     ],
     featured: true,
     seoTitle: "Hoàng Nam & Thu Trang — Phóng sự cưới Hà Nội",
     seoDescription: "Xem trọn bộ album phóng sự cưới của Hoàng Nam & Thu Trang thực hiện bởi I'm Tung Photographer.",
     isDemo: false, // Đặt false khi đã là tác phẩm thật của Tùng
   }
   ```
3. Khi toàn bộ album đã là tác phẩm thật của Tùng:
   * Mở file `.env.local` đặt `NEXT_PUBLIC_ALLOW_INDEXING=true` và `NEXT_PUBLIC_SITE_URL=https://your-domain.vn` để kích hoạt sitemap và cho phép Google index website.

---

## 7. Giấy Phép & Bản Quyền
Dự án được xây dựng dành riêng cho thương hiệu **I'm Tung Photographer**. Toàn bộ mã nguồn sẵn sàng cho triển khai thương mại thực tế.
