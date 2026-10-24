import fs from "fs";
import path from "path";
import sharp from "sharp";

// 45 photos from Google Drive folder
const photos = [
  { name: "1QYN_7375 (2) copy.jpg", id: "1LzXGN8uubVIPJcFobXB4nxJDKDO-1txB" },
  { name: "1QYN_7375 (4) copy.jpg", id: "1T4w0f-FmQ8KeX2exw5t_BxV4c_EmopTd" },
  { name: "1QYN_7375 (14) copy.jpg", id: "1q61Jde2pDzHABJicJDCD2lLFldigpQrJ" },
  { name: "1QYN_7375 (23) copy.jpg", id: "19MttcL9YO-uL84cDuZXrVLvzkbXA_mou" },
  { name: "1QYN_7375 (25) copy.jpg", id: "1dcZAxVElgeLZCldPvpxnNk5POXGDPIu6" },
  { name: "1QYN_7375 (33) copy.jpg", id: "1dBqtt4Ef71F8T1zK8uhkAf89KTIXPiem" },
  { name: "1QYN_7375 (51) copy.jpg", id: "1Gm1kaJtwzgcFh2mijMFaRhji2eh1FMeP" },
  { name: "1QYN_7375 (63) copy.jpg", id: "1ULYR3exaRRUFjz7ntlWnB0gjEWUVVluD" },
  { name: "1QYN_7375 (76) copy.jpg", id: "1nQF5Br_BbFdJdzjn2lV7b8isEq1PSrna" },
  { name: "1QYN_7375 (79) copy.jpg", id: "1bS7A-E27Lsgo8Oh0KtOO2YyQ7Q2a6yg8" },
  { name: "1QYN_7375 (92) copy.jpg", id: "1L6myb1lNvUnL55X7PhvMiaJJ5Vdm9Mnn" },
  { name: "1QYN_7375 (95) copy.jpg", id: "1Jsdpx7Po7s0exgkXPdhYjKrAWVCQNxdc" },
  { name: "1QYN_7375 (102) copy.jpg", id: "1s4aK7X6LFd2_KeXZpG5-vI3b82hylrsV" },
  { name: "1QYN_7375 (107) copy.jpg", id: "1GN0yN9yCab8JN5uOdFW0lZb_DLl_E9kn" },
  { name: "QYN_7148 copy.jpg", id: "1IcIvC539YF9-VjDdw86bUOlQNBLV0rAD" },
  { name: "QYN_7154 copy.jpg", id: "1ZV8Z_rdiec0riDbP5fIkdCrCAsqEX27t" },
  { name: "QYN_7159 copy.jpg", id: "1wfCcV4TNsaw2vcJxpB2JJFqqjE9gyvY9" },
  { name: "QYN_7168 copy.jpg", id: "17QwOgkugU_x4p4Bnk3YExOCzCsIYtMP3" },
  { name: "QYN_7178 copy.jpg", id: "1EcUfxjctjyiMyNfFzPUA07_PZHYdKRFe" },
  { name: "QYN_7206 copy.jpg", id: "1DShLtErrYrwEPdfOIRPIiShVB07j6HEz" },
  { name: "QYN_7212 copy.jpg", id: "1IjitP2Wib2BgZ-aY05k-Ix28V3aIjS4G" },
  { name: "QYN_7238 copy.jpg", id: "1BbqjRRTx9YenaY7bRSU_DM09gL9-dsL5" },
  { name: "QYN_7547 copy.jpg", id: "1pN66INwG-Dq8wDq-8ZC3Bw-QhAXFFSkO" },
  { name: "QYN_7661 copy.jpg", id: "12YCnw5VwuVGSu3pNwcXjUIgnZj75MC1U" },
  { name: "QYN_7677 copy.jpg", id: "10JAeNHcM12jSKI4LTi7BBI8Lh81Ki3bO" },
  { name: "QYN_7721 copy.jpg", id: "15Dhbra_2uNHrAG8NJwHUe8DFPGFdv_dD" },
  { name: "QYN_7812 copy.jpg", id: "1_wAzMnw33N6PdjbIZoLF5BIn8VqPHB6C" },
  { name: "QYN_7909 copy.jpg", id: "1C4OSEB5SZmSnWXLt1zjMdisN87y6iQm0" },
  { name: "QYN_7952 copy.jpg", id: "1kottKj7a8hXzJ2nBxTXAzjpbkErmTe_y" },
  { name: "QYN_7979 copy.jpg", id: "1Rb1XUf2CeRiQcvlfutegiv-pLwVfRkVA" },
  { name: "QYN_8023 copy.jpg", id: "1yTRuHetG2bemsKgsQv9FQ4U39miPdcMk" },
  { name: "QYN_8030 copy.jpg", id: "1WWFFQbtxT4S1eeK_9DeEcfC4pg4mXi7V" },
  { name: "QYN_8040 copy.jpg", id: "1rvR3C7DIzuuN-jJE5VyLEe2kci6r4JLQ" },
  { name: "QYN_8080 copy.jpg", id: "1w-QBZkQp8kGBmKSLqTKop0s3qz5NUhix" },
  { name: "QYN_8089 copy.jpg", id: "1xAN47jjqYn8rFpM1m1aku6TWi95XIQmC" },
  { name: "QYN_8149 copy.jpg", id: "1TTGHtcLUYr70-XI9l3XbNj1yBKpS3f2f" },
  { name: "QYN_8178 copy.jpg", id: "1fSTmQb2yUmL75CDtfNE2u6xgdctH7D15" },
  { name: "QYN_8181 copy.jpg", id: "1vqp4s6BEPUsT6cUO5KCApwAi8kK05bCU" },
  { name: "QYN_8211 copy.jpg", id: "1E_lT8sdj24mYEU1LbrPtRDLsw0WK__uC" },
  { name: "QYN_8270 copy.jpg", id: "1GJeweYlAezBhCvSdPS0yRXxBEqiE5gq2" },
  { name: "QYN_8280 copy.jpg", id: "16oglff1YXICiYsgTtiWP9cyk1enHJW58" },
  { name: "QYN_8337 copy.jpg", id: "1LFbmQrl6Wt32qVk-Z-6wwMcjSE9cQd3B" },
  { name: "QYN_8343 copy.jpg", id: "134PBbegUff-vBNyspl9_zEjMmdQNplDQ" },
  { name: "QYN_8346 copy.jpg", id: "1364_f0PoHHXQ0CO1lxondtNZTenX0o6R" },
  { name: "QYN_8357 copy.jpg", id: "1POyxWMlwrTsGDrBjxUKMyepeNEdqJH00" }
];

async function scanMetadata() {
  console.log(`Scanning metadata for ${photos.length} photos...`);
  const details = [];

  // Download small preview thumbnail (w=600) for fast analysis
  for (let i = 0; i < photos.length; i++) {
    const p = photos[i];
    try {
      const url = `https://lh3.googleusercontent.com/d/${p.id}=w600`;
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`Failed to fetch ${p.name}: ${res.status}`);
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      const meta = await sharp(buf).metadata();
      const isLandscape = meta.width > meta.height;
      details.push({
        index: i,
        name: p.name,
        id: p.id,
        origW: meta.width,
        origH: meta.height,
        ratio: (meta.width / meta.height).toFixed(2),
        isLandscape
      });
      process.stdout.write(`.`);
    } catch (err) {
      console.warn(`Error on ${p.name}:`, err.message);
    }
  }

  console.log(`\nSuccessfully scanned ${details.length} photos.`);
  fs.writeFileSync("scripts/photos-scanned.json", JSON.stringify(details, null, 2), "utf8");
  console.log(`Saved to scripts/photos-scanned.json`);
}

scanMetadata();
