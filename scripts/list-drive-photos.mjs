import fs from "fs";

const content = fs.readFileSync(
  "C:/Users/leduy/.gemini/antigravity-ide/brain/471b13f8-a479-4ee1-98ed-90bb19a0b8a4/.system_generated/steps/595/content.md",
  "utf8"
);

// Regex matching aria-label="... copy.jpg Image Shared" ... ssk='5:auSv138:ID-0-16'
const regex = /aria-label="([^"]+\.jpg) Image Shared"[^>]*ssk='5:auSv138:([a-zA-Z0-9_\-]+)-[0-9]+-[0-9]+'/g;
let m;
const files = [];
const seen = new Set();
while ((m = regex.exec(content)) !== null) {
  const name = m[1];
  const id = m[2];
  if (!seen.has(name)) {
    seen.add(name);
    files.push({ name, id });
  }
}

console.log("Total unique photos found:", files.length);
console.log(JSON.stringify(files, null, 2));
