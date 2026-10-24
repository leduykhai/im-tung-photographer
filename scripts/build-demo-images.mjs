/**
 * Build ảnh DEMO cho website.
 *
 * - Nguồn: scripts/demo-src/*.jpg (ảnh minh hoạ do AI tạo, KHÔNG phải ảnh của Tung).
 * - Đầu ra: public/albums/<slug>/*.webp + public/hero/home.webp + public/about/details.webp
 * - Manifest kích thước: src/data/demo-manifest.json (dùng bởi src/data/albums.ts)
 *
 * Khi có ảnh thật: không cần chạy script này. Hãy đặt ảnh vào public/albums/<slug>/
 * và cập nhật src/data/albums.ts (xem README).
 *
 * Chạy: pnpm demo:images
 */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(root, "scripts", "demo-src");
const publicDir = path.join(root, "public");

const W = 848;
const H = 1264;

/** Crop tổng quát cho 12 ảnh bìa (kích thước gốc 848x1264). */
const generic = {
  "01": { slug: "gia-han-minh-quan", heroY: 420, close: [112, 416] },
  "02": { slug: "ngoc-lan-hoang-nam", heroY: 330, close: [60, 250] },
  "03": { slug: "thu-ha-duc-anh", heroY: 380, close: [110, 300] },
  "04": { slug: "khanh-linh-tuan-kiet", heroY: 250, close: [110, 360] },
  "05": { slug: "bao-ngoc-quoc-viet", heroY: 400, close: [80, 300] },
  "06": { slug: "phuong-thao-viet-hoang", heroY: 420, close: [150, 350] },
  "07": { slug: "mai-anh-thanh-dat", heroY: 400, close: [110, 350] },
  "08": { slug: "dieu-linh-hai-dang", heroY: 520, close: [190, 410] },
  "09": { slug: "hong-nhung-gia-bao", heroY: 450, close: [110, 300] },
  "10": { slug: "thanh-truc-anh-khoa", heroY: 420, close: [110, 380] },
  "11": { slug: "yen-nhi-trong-nghia", heroY: 420, close: [110, 350] },
  "12": { slug: "cam-tu-dinh-phong", heroY: 350, close: [60, 300] },
};

const manifest = {};

async function emit(key, input, region, outRel) {
  let img = sharp(input);
  if (region) {
    const [left, top, width, height] = region;
    img = img.extract({ left, top, width, height });
  }
  const outPath = path.join(publicDir, outRel);
  await mkdir(path.dirname(outPath), { recursive: true });
  const { data, info } = await img
    .webp({ quality: 82 })
    .toBuffer({ resolveWithObject: true });
  await writeFile(outPath, data);
  manifest[key] = {
    src: "/" + outRel.replaceAll("\\", "/"),
    width: info.width,
    height: info.height,
  };
  console.log(`✓ ${key} → ${outRel} (${info.width}x${info.height})`);
}

for (const [num, cfg] of Object.entries(generic)) {
  const input = path.join(srcDir, `cover_${num}.jpg`);
  const dir = `albums/${cfg.slug}`;
  await emit(`${cfg.slug}/cover`, input, null, `${dir}/cover.webp`);
  await emit(`${cfg.slug}/hero`, input, [0, cfg.heroY, W, 565], `${dir}/hero.webp`);
  await emit(`${cfg.slug}/scenery`, input, [0, 0, W, 565], `${dir}/scenery.webp`);
  await emit(
    `${cfg.slug}/close`,
    input,
    [cfg.close[0], cfg.close[1], 636, 848],
    `${dir}/close.webp`,
  );
  await emit(`${cfg.slug}/detail`, input, [0, H - 565, W, 565], `${dir}/detail.webp`);
}

// Album 01 — bổ sung từ ảnh toàn cảnh đồi núi (ngang)
const heroHome = path.join(srcDir, "hero_home.jpg");
{
  const dir = "albums/gia-han-minh-quan";
  await emit("gia-han-minh-quan/wide", heroHome, null, `${dir}/wide.webp`);
  await emit("gia-han-minh-quan/valley", heroHome, [0, 120, 900, 600], `${dir}/valley.webp`);
  await emit("gia-han-minh-quan/nearer", heroHome, [700, 100, 676, 451], `${dir}/nearer.webp`);
}

// Album 02 — lễ gia tiên: nhiều khung chi tiết hơn
{
  const input = path.join(srcDir, "cover_02.jpg");
  const dir = "albums/ngoc-lan-hoang-nam";
  await emit("ngoc-lan-hoang-nam/couple", input, [60, 300, 720, 480], `${dir}/couple.webp`);
  await emit("ngoc-lan-hoang-nam/bride", input, [60, 330, 450, 600], `${dir}/bride.webp`);
  await emit("ngoc-lan-hoang-nam/groom", input, [480, 320, 368, 490], `${dir}/groom.webp`);
  await emit("ngoc-lan-hoang-nam/altar", input, [460, 100, 388, 517], `${dir}/altar.webp`);
  await emit("ngoc-lan-hoang-nam/tray", input, [250, 520, 598, 399], `${dir}/tray.webp`);
}

// Ảnh hero trang chủ + ảnh chi tiết cho mục "Về Tung" (không có người)
await emit("home/hero", heroHome, null, "hero/home.webp");
await emit(
  "home/about",
  path.join(srcDir, "cover_04.jpg"),
  [100, 664, 600, 600],
  "about/details.webp",
);

await mkdir(path.join(root, "src", "data"), { recursive: true });
await writeFile(
  path.join(root, "src", "data", "demo-manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log("Manifest written: src/data/demo-manifest.json");
