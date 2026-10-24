/**
 * Chuẩn hoá số điện thoại Việt Nam.
 * Chấp nhận: 0352942502, 0352 942 502, +84352942502, 84352942502, 0352.942.502
 * Trả về dạng quốc gia bắt đầu bằng 0 (vd 0352942502) hoặc null nếu không hợp lệ.
 *
 * Dùng chung cho client và server.
 */
export function normalizeVnPhone(input: string): string | null {
  if (!input) return null;
  let digits = input.replace(/[\s.\-()]/g, "");
  if (!/^\+?\d+$/.test(digits)) return null;

  if (digits.startsWith("+84")) digits = "0" + digits.slice(3);
  else if (digits.startsWith("0084")) digits = "0" + digits.slice(4);
  else if (digits.startsWith("84") && digits.length === 11) digits = "0" + digits.slice(2);

  // Di động VN: 0 + (3|5|7|8|9) + 8 chữ số. Cố định: 02x + 8–9 chữ số.
  if (/^0[35789]\d{8}$/.test(digits)) return digits;
  if (/^02\d{9}$/.test(digits)) return digits;
  return null;
}

/** Dạng quốc tế: +84352942502 */
export function toE164Vn(national: string): string {
  return "+84" + national.slice(1);
}

/** Dạng hiển thị: 0352 942 502 */
export function formatVnPhone(national: string): string {
  if (national.length === 10) {
    return `${national.slice(0, 4)} ${national.slice(4, 7)} ${national.slice(7)}`;
  }
  return national;
}
