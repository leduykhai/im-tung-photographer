import fs from "fs";
import path from "path";
import sharp from "sharp";

const photos = JSON.parse(fs.readFileSync("scripts/photos-scanned.json", "utf8"));
const landscapes = photos.filter(p => p.isLandscape);

const outDir = "scripts/previews";
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function downloadPreviews() {
  console.log("Downloading previews of 11 landscape photos...");
  for (const p of landscapes) {
    const url = `https://lh3.googleusercontent.com/d/${p.id}=w800`;
    const res = await fetch(url);
    const buf = Buffer.from(await res.arrayBuffer());
    const dest = path.join(outDir, `landscape_${p.index}_${p.name.replace(/\s+/g, "_")}`);
    fs.writeFileSync(dest, buf);
    console.log(`Saved ${dest}`);
  }

  // Also download 4 sample portraits
  const portraits = photos.filter(p => !p.isLandscape).slice(0, 5);
  for (const p of portraits) {
    const url = `https://lh3.googleusercontent.com/d/${p.id}=w800`;
    const res = await fetch(url);
    const buf = Buffer.from(await res.arrayBuffer());
    const dest = path.join(outDir, `portrait_${p.index}_${p.name.replace(/\s+/g, "_")}`);
    fs.writeFileSync(dest, buf);
    console.log(`Saved ${dest}`);
  }
}

downloadPreviews();
