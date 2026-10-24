/** Serialize JSON-LD an toàn để nhúng vào <script> (tránh đóng thẻ sớm bằng `<`). */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
