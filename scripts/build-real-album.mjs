import fs from "fs";
import path from "path";
import sharp from "sharp";

const selectedPhotos = [
  {
    key: "01-binh-minh-ngay-cuoi",
    name: "QYN_7148 copy.jpg",
    id: "1IcIvC539YF9-VjDdw86bUOlQNBLV0rAD",
    isLandscape: false,
    alt: "Ánh bình minh lấp lánh xuyên qua cổng hoa cưới ven đường sớm",
  },
  {
    key: "02-ban-tra-le-gia-tien",
    name: "QYN_7154 copy.jpg",
    id: "1ZV8Z_rdiec0riDbP5fIkdCrCAsqEX27t",
    isLandscape: false,
    alt: "Chi tiết bàn tiệc trà gia tiên với hoa lan hồng và chuỗi ngọc trai",
  },
  {
    key: "03-bien-ten-hong-mai-van-pho",
    name: "QYN_7661 copy.jpg",
    id: "12YCnw5VwuVGSu3pNwcXjUIgnZj75MC1U",
    isLandscape: false,
    alt: "Biển tên Lễ Vu Quy Hồng Mai & Văn Phố trang trí hoa tươi",
  },
  {
    key: "04-co-dau-rang-ro-don-ngay-vui",
    name: "QYN_7206 copy.jpg",
    id: "1DShLtErrYrwEPdfOIRPIiShVB07j6HEz",
    isLandscape: false,
    isCover: true,
    alt: "Cô dâu Hồng Mai dịu dàng trong tà áo dài lụa trắng trước giờ làm lễ",
  },
  {
    key: "05-nang-som-ben-cong-hoa",
    name: "QYN_7178 copy.jpg",
    id: "1EcUfxjctjyiMyNfFzPUA07_PZHYdKRFe",
    isLandscape: true,
    isHomeHero: true,
    alt: "Cô dâu Hồng Mai đứng bên cổng hoa rực rỡ đón nắng sớm ngày cưới",
  },
  {
    key: "06-cong-hoa-le-vu-quy",
    name: "QYN_7238 copy.jpg",
    id: "1BbqjRRTx9YenaY7bRSU_DM09gL9-dsL5",
    isLandscape: true,
    isAlbumHero: true,
    alt: "Toàn cảnh cổng hoa Lễ Vu Quy Hồng Mai & Văn Phố",
  },
  {
    key: "07-me-trao-tay-co-dau",
    name: "QYN_7909 copy.jpg",
    id: "1C4OSEB5SZmSnWXLt1zjMdisN87y6iQm0",
    isLandscape: true,
    alt: "Khoảnh khắc người mẹ trao tay con gái cho chú rể Văn Phố",
  },
  {
    key: "08-chu-re-chuan-bi-nhan-cuoi",
    name: "QYN_8040 copy.jpg",
    id: "1rvR3C7DIzuuN-jJE5VyLEe2kci6r4JLQ",
    isLandscape: false,
    alt: "Chú rể cẩn thận nâng niu và kiểm tra đôi nhẫn cưới thiêng liêng",
  },
  {
    key: "09-khoanh-khac-trao-nhan",
    name: "QYN_8337 copy.jpg",
    id: "1LFbmQrl6Wt32qVk-Z-6wwMcjSE9cQd3B",
    isLandscape: false,
    alt: "Khoảnh khắc cô dâu chú rể trao nhau chiếc nhẫn trăm năm",
  },
  {
    key: "10-chu-re-hon-tay-co-dau",
    name: "QYN_7979 copy.jpg",
    id: "1Rb1XUf2CeRiQcvlfutegiv-pLwVfRkVA",
    isLandscape: true,
    alt: "Chú rể cúi hôn tay cô dâu trước sự chứng kiến và chúc phúc của hai bên gia đình",
  },
  {
    key: "11-nam-chat-tay-nhau",
    name: "QYN_7952 copy.jpg",
    id: "1kottKj7a8hXzJ2nBxTXAzjpbkErmTe_y",
    isLandscape: false,
    alt: "Bàn tay cô dâu chú rể đan chặt bên bó hoa cưới hồng pastel",
  },
  {
    key: "12-tieng-cuoi-ngay-vu-quy",
    name: "QYN_7721 copy.jpg",
    id: "15Dhbra_2uNHrAG8NJwHUe8DFPGFdv_dD",
    isLandscape: true,
    alt: "Tiếng cười rạng rỡ của cả gia đình trong ngày vui vu quy",
  },
  {
    key: "13-co-dau-va-me",
    name: "QYN_7677 copy.jpg",
    id: "10JAeNHcM12jSKI4LTi7BBI8Lh81Ki3bO",
    isLandscape: false,
    alt: "Nụ cười ấm áp và cái ôm hạnh phúc của cô dâu bên người mẹ kính yêu",
  },
  {
    key: "14-giot-nuoc-mat-hanh-phuc",
    name: "QYN_8270 copy.jpg",
    id: "1GJeweYlAezBhCvSdPS0yRXxBEqiE5gq2",
    isLandscape: false,
    alt: "Giọt nước mắt xúc động nghẹn ngào của đấng sinh thành trong giờ phút tiễn con",
  },
  {
    key: "15-nu-hon-ngot-ngao",
    name: "QYN_8343 copy.jpg",
    id: "134PBbegUff-vBNyspl9_zEjMmdQNplDQ",
    isLandscape: false,
    alt: "Nụ hôn má ngọt ngào và ánh mắt hạnh phúc của cặp đôi mới cưới",
  },
  {
    key: "16-niem-vui-tron-ven",
    name: "QYN_8357 copy.jpg",
    id: "1POyxWMlwrTsGDrBjxUKMyepeNEdqJH00",
    isLandscape: true,
    alt: "Niềm vui hân hoan rạng rỡ của Hồng Mai & Văn Phố trong ngày thành hôn",
  },
];

const albumDir = path.resolve("public/albums/hong-mai-van-pho");
const heroDir = path.resolve("public/hero");

if (!fs.existsSync(albumDir)) {
  fs.mkdirSync(albumDir, { recursive: true });
}
if (!fs.existsSync(heroDir)) {
  fs.mkdirSync(heroDir, { recursive: true });
}

async function fetchBufferWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        return Buffer.from(await res.arrayBuffer());
      }
      console.warn(`Fetch ${url} failed with status ${res.status}, attempt ${i + 1}`);
    } catch (err) {
      console.warn(`Fetch error: ${err.message}, attempt ${i + 1}`);
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`Failed to fetch ${url} after ${retries} attempts`);
}

async function processAll() {
  console.log("=== BẮT ĐẦU TẢI VÀ TỐI ƯU HÓA BỘ ẢNH THẬT CHO ALBUM HỒNG MAI & VĂN PHỐ ===");
  const results = [];

  for (let i = 0; i < selectedPhotos.length; i++) {
    const p = selectedPhotos[i];
    console.log(`[${i + 1}/${selectedPhotos.length}] Đang xử lý: ${p.key} (${p.name})...`);

    // Fetch high-res source (width 2048px for sharp detail)
    const cdnUrl = `https://lh3.googleusercontent.com/d/${p.id}=w2048`;
    const buf = await fetchBufferWithRetry(cdnUrl);

    // Save as standard gallery image
    const galleryTarget = path.join(albumDir, `${p.key}.webp`);
    let imgPipeline = sharp(buf);
    const meta = await imgPipeline.metadata();

    // Determine target dimensions (max 1600 on longest side, quality 85)
    let resizeOpts = {};
    if (meta.width > meta.height) {
      resizeOpts = { width: Math.min(meta.width, 1600) };
    } else {
      resizeOpts = { width: Math.min(meta.width, 1200) };
    }

    await sharp(buf)
      .resize(resizeOpts)
      .webp({ quality: 85, effort: 4 })
      .toFile(galleryTarget);

    const processedMeta = await sharp(galleryTarget).metadata();

    results.push({
      key: p.key,
      src: `/albums/hong-mai-van-pho/${p.key}.webp`,
      width: processedMeta.width,
      height: processedMeta.height,
      alt: p.alt,
      order: i + 1,
      isLandscape: p.isLandscape,
    });

    // Special roles: Cover
    if (p.isCover) {
      const coverTarget = path.join(albumDir, "cover.webp");
      await sharp(buf)
        .resize({ width: 848, height: 1264, fit: "cover" })
        .webp({ quality: 85, effort: 4 })
        .toFile(coverTarget);
      console.log(`  -> Đã tạo ảnh Cover chuẩn 848x1264 tại: ${coverTarget}`);
    }

    // Special roles: Album Hero
    if (p.isAlbumHero) {
      const heroTarget = path.join(albumDir, "hero.webp");
      await sharp(buf)
        .resize({ width: 1440, height: 960, fit: "cover" })
        .webp({ quality: 85, effort: 4 })
        .toFile(heroTarget);
      console.log(`  -> Đã tạo ảnh Album Hero 1440x960 tại: ${heroTarget}`);
    }

    // Special roles: Home Hero Banner
    if (p.isHomeHero) {
      const homeHeroTarget = path.join(heroDir, "home.webp");
      await sharp(buf)
        .resize({ width: 1920, height: 1280, fit: "cover" })
        .webp({ quality: 86, effort: 4 })
        .toFile(homeHeroTarget);
      console.log(`  -> Đã thay thế ảnh Hero trang chủ tại: ${homeHeroTarget}`);
    }
  }

  // Write manifest file for the real album
  const manifestData = {
    album: {
      id: "real-01",
      slug: "hong-mai-van-pho",
      title: "Hồng Mai & Văn Phố",
      category: "phong-su-cuoi",
      location: "Lễ Vu Quy",
      isDemo: false,
      featured: true,
      coverImage: {
        src: "/albums/hong-mai-van-pho/cover.webp",
        width: 848,
        height: 1264,
        alt: "Ảnh bìa album Hồng Mai & Văn Phố — Lễ Vu Quy",
        order: 1,
      },
      heroImage: {
        src: "/albums/hong-mai-van-pho/hero.webp",
        width: 1440,
        height: 960,
        alt: "Toàn cảnh Lễ Vu Quy Hồng Mai & Văn Phố",
        order: 1,
      },
      images: results,
    },
  };

  fs.writeFileSync(
    "src/data/real-album-manifest.json",
    JSON.stringify(manifestData, null, 2),
    "utf8"
  );
  console.log("\n=== HOÀN TẤT! Manifest đã lưu tại src/data/real-album-manifest.json ===");
}

processAll().catch((err) => {
  console.error("Lỗi xử lý:", err);
  process.exit(1);
});
