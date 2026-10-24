/**
 * Đo lường sự kiện — KHÔNG gửi dữ liệu cá nhân (họ tên, SĐT, email, địa chỉ, lời nhắn).
 *
 * Hỗ trợ dataLayer (GTM) và gtag nếu đã được nhúng bởi chủ website; nếu không có thì
 * chỉ log ở môi trường dev. Chưa nhúng script analytics nào theo mặc định.
 */

export type AnalyticsEventName =
  | "view_album"
  | "click_phone"
  | "click_zalo"
  | "click_facebook"
  | "click_scroll_to_top"
  | "open_consultation_form"
  | "submit_lead_success";

/** Chỉ cho phép giá trị đơn giản, không PII. */
export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: AnalyticsEventName, params: AnalyticsParams = {}): void {
  if (typeof window === "undefined") return;
  const safe: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) safe[key] = value;
  }
  try {
    window.dataLayer?.push({ event, ...safe });
    window.gtag?.("event", event, safe);
    if (process.env.NODE_ENV !== "production") {
      console.debug("[analytics]", event, safe);
    }
  } catch {
    // Đo lường không bao giờ được làm hỏng trải nghiệm.
  }
}
