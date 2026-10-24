/**
 * DỮ LIỆU ALBUM MẪU (DEMO).
 *
 * ⚠️ Toàn bộ tên cặp đôi, địa điểm và ảnh ở đây là DỮ LIỆU MINH HOẠ (ảnh do AI tạo),
 * KHÔNG phải tác phẩm của Tùng. Hãy thay bằng album thật trước khi xuất bản
 * (xem mục "Cách thay album" trong README).
 *
 * Mỗi album gồm: ảnh bìa dọc 2:3, ảnh hero ngang, và gallery theo thứ tự kể chuyện.
 * Với album thật, chỉ cần cung cấp `src`, `width`, `height`, `alt` cho từng ảnh.
 */
import manifest from "./demo-manifest.json";
import realAlbumManifest from "./real-album-manifest.json";
import type { Album, AlbumCategory, AlbumImage } from "@/types/album";

type ManifestKey = keyof typeof manifest;

function img(key: string, alt: string, order = 0): AlbumImage {
  const entry = manifest[key as ManifestKey];
  if (!entry) throw new Error(`Thiếu ảnh demo trong manifest: ${key}`);
  return { ...entry, alt, order };
}

/** Sắp xếp theo `order` và đánh số lại liên tục. */
function ordered(images: AlbumImage[]): AlbumImage[] {
  return images.map((image, index) => ({ ...image, order: index + 1 }));
}

interface DemoAlbumInput {
  n: number;
  slug: string;
  title: string;
  category: AlbumCategory;
  location: string;
  scene: string;
  description: string;
  featured?: boolean;
  /** Ảnh gallery (đã theo thứ tự kể chuyện). Mặc định: toàn cảnh → bìa → cận cảnh → chi tiết. */
  extra?: AlbumImage[];
  gallery?: AlbumImage[];
}

function buildAlbum(input: DemoAlbumInput): Album {
  const { slug, title, scene } = input;
  const cover = img(`${slug}/cover`, `Ảnh bìa album ${title}: ${scene}`);
  const hero = img(`${slug}/hero`, `${title} — ${scene}`);

  const gallery =
    input.gallery ??
    ordered([
      img(`${slug}/scenery`, `${title}: khung cảnh bối cảnh, ${scene}`),
      img(`${slug}/cover`, `${title}: ${scene}`),
      img(`${slug}/close`, `${title}: cận cảnh cặp đôi, ${scene}`),
      img(`${slug}/detail`, `${title}: chi tiết trang phục và không gian, ${scene}`),
    ]);

  return {
    id: `demo-${String(input.n).padStart(2, "0")}`,
    slug,
    title,
    category: input.category,
    coverImage: cover,
    heroImage: hero,
    description: input.description,
    location: input.location,
    images: gallery,
    featured: input.featured ?? false,
    seoTitle: `${title} — Album cưới`,
    seoDescription: `${input.description} Xem album ${title} tại I'm Tung Photographer.`,
    isDemo: true,
  };
}

const albumInputs: DemoAlbumInput[] = [
  {
    n: 1,
    slug: "gia-han-minh-quan",
    title: "Gia Hân & Minh Quân",
    category: "pre-wedding",
    location: "Đà Lạt",
    scene: "dạo bước giữa đồi thông trong sương sớm",
    featured: true,
    description:
      "Một buổi sáng chậm rãi giữa đồi thông và sương mỏng. Không cần tạo dáng nhiều — chỉ là bàn tay nắm lấy nhau và những nụ cười tự nhiên theo từng bước chân.",
    gallery: ordered([
      img("gia-han-minh-quan/wide", "Gia Hân & Minh Quân: toàn cảnh đồi núi trong ánh sáng sớm"),
      img("gia-han-minh-quan/cover", "Gia Hân & Minh Quân dạo bước giữa đồi thông trong sương sớm"),
      img("gia-han-minh-quan/valley", "Thung lũng và những dãy đồi phủ sương mỏng"),
      img("gia-han-minh-quan/close", "Cận cảnh cô dâu chú rể nắm tay, cầm bó hoa trắng"),
      img("gia-han-minh-quan/nearer", "Cô dâu chú rể trong trang phục áo dài đứng cạnh nhau trên triền đồi"),
      img("gia-han-minh-quan/scenery", "Rừng thông trong ánh sáng vàng nhạt"),
      img("gia-han-minh-quan/detail", "Chi tiết váy cưới và con đường đất đỏ giữa rừng thông"),
    ]),
  },
  {
    n: 2,
    slug: "ngoc-lan-hoang-nam",
    title: "Ngọc Lan & Hoàng Nam",
    category: "le-gia-tien",
    location: "Hà Nội",
    scene: "lễ gia tiên trước bàn thờ trang trí đỏ vàng",
    featured: true,
    description:
      "Lễ gia tiên trong không khí ấm áp của hai gia đình. Những ánh mắt, cái chạm tay và nụ cười nhẹ nhàng làm nên một buổi lễ đáng nhớ.",
    gallery: ordered([
      img("ngoc-lan-hoang-nam/couple", "Ngọc Lan & Hoàng Nam bên mâm quả trong lễ gia tiên"),
      img("ngoc-lan-hoang-nam/cover", "Cô dâu áo dài đỏ và chú rể áo dài gấm trước bàn thờ gia tiên"),
      img("ngoc-lan-hoang-nam/bride", "Chân dung cô dâu trong áo dài đỏ thêu chim phượng"),
      img("ngoc-lan-hoang-nam/groom", "Chú rể trong áo dài gấm đỏ mận mỉm cười"),
      img("ngoc-lan-hoang-nam/altar", "Chữ song hỷ đỏ vàng trên bàn thờ gia tiên"),
      img("ngoc-lan-hoang-nam/tray", "Mâm trái cây và quả lễ đặt trên bàn thờ"),
      img("ngoc-lan-hoang-nam/scenery", "Không gian trang trí đỏ vàng của buổi lễ"),
    ]),
  },
  {
    n: 3,
    slug: "thu-ha-duc-anh",
    title: "Thu Hà & Đức Anh",
    category: "tiec-cuoi",
    location: "Sài Gòn",
    scene: "nâng ly trong sảnh tiệc ánh đèn ấm",
    description:
      "Khoảnh khắc nâng ly giữa tiếng cười và những tràng pháo tay. Ánh đèn pha lê và gương mặt rạng rỡ của hai bạn là điều làm nên bữa tiệc.",
  },
  {
    n: 4,
    slug: "khanh-linh-tuan-kiet",
    title: "Khánh Linh & Tuấn Kiệt",
    category: "pre-wedding",
    location: "Hội An",
    scene: "chạm trán nhau giữa phố cổ dưới những chiếc đèn lồng",
    description:
      "Phố cổ vàng nắng, đèn lồng đung đưa trên cao và hai người chỉ cần đứng gần nhau. Một buổi chụp nhẹ nhàng, không vội vã.",
  },
  {
    n: 5,
    slug: "bao-ngoc-quoc-viet",
    title: "Bảo Ngọc & Quốc Việt",
    category: "pre-wedding",
    location: "Biển miền Trung",
    scene: "ôm nhau trên bãi biển lúc bình minh",
    description:
      "Bình minh trên bãi biển vắng, tấm voan bay trong gió và một cái ôm thật chặt. Khung hình đơn giản để cảm xúc là điều nổi bật nhất.",
  },
  {
    n: 6,
    slug: "phuong-thao-viet-hoang",
    title: "Phương Thảo & Việt Hoàng",
    category: "le-gia-tien",
    location: "Nam Định",
    scene: "lễ gia tiên bên người thân trong sân nhà gỗ",
    description:
      "Lễ cưới tại ngôi nhà cổ, nơi người thân quây quần trong sân. Những nụ cười của ông bà, cha mẹ cũng là một phần của câu chuyện ngày hôm đó.",
  },
  {
    n: 7,
    slug: "mai-anh-thanh-dat",
    title: "Mai Anh & Thành Đạt",
    category: "tiec-cuoi",
    location: "Đà Nẵng",
    scene: "điệu nhảy chậm trong tiệc cưới sân vườn",
    description:
      "Tiệc cưới sân vườn khi trời chạng vạng, đèn dây lấp lánh trên cao. Điệu nhảy chậm giữa vòng tay quây quần của bạn bè và người thân.",
  },
  {
    n: 8,
    slug: "dieu-linh-hai-dang",
    title: "Diệu Linh & Hải Đăng",
    category: "pre-wedding",
    location: "Tây Bắc",
    scene: "đứng giữa ruộng bậc thang xanh mướt",
    description:
      "Những thửa ruộng bậc thang xanh nối tiếp nhau dưới trời nhiều mây. Tà váy dài trải trên sườn đồi tạo nên một khung hình rộng và yên tĩnh.",
  },
  {
    n: 9,
    slug: "hong-nhung-gia-bao",
    title: "Hồng Nhung & Gia Bảo",
    category: "phong-su-cuoi",
    location: "Bến Tre",
    scene: "ngồi trên chiếc xuồng nhỏ giữa sông nước miền Tây",
    description:
      "Một buổi sáng trên sông, tiếng cười bất chợt của cô dâu khi chiếc xuồng nhỏ lướt qua hàng dừa. Những khoảnh khắc không sắp đặt thường là điều đáng nhớ nhất.",
  },
  {
    n: 10,
    slug: "thanh-truc-anh-khoa",
    title: "Thanh Trúc & Anh Khoa",
    category: "pre-wedding",
    location: "Quy Nhơn",
    scene: "đứng bên nhau nhìn hoàng hôn trên mỏm đá",
    description:
      "Hoàng hôn trên mỏm đá ven biển, hai người đứng cạnh nhau nhìn về phía xa. Một bố cục tối giản dành cho những khoảnh khắc lặng yên.",
  },
  {
    n: 11,
    slug: "yen-nhi-trong-nghia",
    title: "Yến Nhi & Trọng Nghĩa",
    category: "phong-su-cuoi",
    location: "Hà Nội",
    scene: "bước ra khỏi nhà thờ giữa cánh hoa trắng",
    description:
      "Khoảnh khắc bước ra khỏi nhà thờ giữa những cánh hoa và tiếng reo vui. Những biểu cảm thật nhất thường đến trong vài giây ngắn ngủi như thế này.",
  },
  {
    n: 12,
    slug: "cam-tu-dinh-phong",
    title: "Cẩm Tú & Đình Phong",
    category: "le-gia-tien",
    location: "Huế",
    scene: "cô dâu chắp tay trước người thân trong lễ gia tiên",
    description:
      "Lễ gia tiên trong căn nhà ấm cúng với đèn lồng đỏ và bộ ấm trà. Cái chắp tay của cô dâu trước người thân là khoảnh khắc nhẹ nhàng nhưng đầy cảm xúc.",
  },
];

const realAlbumData = realAlbumManifest.album;

export const realAlbum: Album = {
  id: realAlbumData.id,
  slug: realAlbumData.slug,
  title: realAlbumData.title,
  category: realAlbumData.category as AlbumCategory,
  location: realAlbumData.location,
  coverImage: realAlbumData.coverImage,
  heroImage: realAlbumData.heroImage,
  description:
    "Phóng sự ngày cưới chân thực ghi lại trọn vẹn những cung bậc cảm xúc trong lễ vu quy của Hồng Mai & Văn Phố — từ ánh bình minh ban mai, sự tỉ mỉ của bàn tiệc gia tiên, giọt nước mắt nghẹn ngào của cha mẹ cho đến nụ cười rạng ngời khi đôi uyên ương trao nhau chiếc nhẫn trăm năm.",
  images: realAlbumData.images.map((im) => ({
    src: im.src,
    width: im.width,
    height: im.height,
    alt: im.alt,
    order: im.order,
  })),
  featured: true,
  seoTitle: "Hồng Mai & Văn Phố — Phóng sự cưới Lễ Vu Quy",
  seoDescription:
    "Bộ ảnh phóng sự ngày cưới Lễ Vu Quy của Hồng Mai & Văn Phố được thực hiện bởi I'm Tung Photographer. Khoảnh khắc xúc động, tự nhiên và trọn vẹn yêu thương.",
  isDemo: false,
};

export const albums: Album[] = [realAlbum, ...albumInputs.map(buildAlbum)];

/** Ảnh hero trang chủ và ảnh phần "Về Tùng". */
export const homeImages = {
  hero: {
    src: "/hero/hong-mai-hero.webp",
    width: 1920,
    height: 1280,
    alt: "Cô dâu Hồng Mai đón nắng sớm ngày vu quy — I'm Tung Photographer",
  },
  about: img(
    "home/about",
    "Chi tiết bó hoa cưới và tà váy trên con đường lát đá",
  ),
};

