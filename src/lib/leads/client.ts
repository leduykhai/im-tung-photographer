import type { ConsultationFormValues, LeadApiResponse } from "@/lib/lead-schema";

export interface LeadMeta {
  albumSlug?: string;
  formLocation: string;
}

const UTM_KEY = "imtung:utm";

interface Utm {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

/** Lấy UTM từ URL (và lưu tạm trong sessionStorage để giữ khi khách chuyển trang). */
export function readUtm(): Utm {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const fromUrl: Utm = {
    utmSource: params.get("utm_source")?.slice(0, 100) || undefined,
    utmMedium: params.get("utm_medium")?.slice(0, 100) || undefined,
    utmCampaign: params.get("utm_campaign")?.slice(0, 100) || undefined,
  };
  try {
    if (fromUrl.utmSource || fromUrl.utmMedium || fromUrl.utmCampaign) {
      sessionStorage.setItem(UTM_KEY, JSON.stringify(fromUrl));
      return fromUrl;
    }
    const stored = sessionStorage.getItem(UTM_KEY);
    if (stored) return JSON.parse(stored) as Utm;
  } catch {
    // sessionStorage có thể bị chặn — bỏ qua.
  }
  return {};
}

export type SubmitResult =
  | { ok: true }
  | {
      ok: false;
      code: string;
      message: string;
      fieldErrors?: Record<string, string>;
    };

/** Lớp service phía client: gửi lead tới API. Không lưu lead vào localStorage. */
export async function submitLead(
  values: ConsultationFormValues,
  meta: LeadMeta,
): Promise<SubmitResult> {
  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        albumSlug: meta.albumSlug,
        formLocation: meta.formLocation,
        sourcePage: window.location.pathname,
        ...readUtm(),
      }),
    });
    const data = (await res.json().catch(() => null)) as LeadApiResponse | null;
    if (data && data.ok === true) return { ok: true };
    if (data && data.ok === false) {
      return {
        ok: false,
        code: data.code,
        message: data.message,
        fieldErrors: data.fieldErrors,
      };
    }
    return {
      ok: false,
      code: "UNKNOWN",
      message: "Chưa gửi được thông tin. Vui lòng thử lại hoặc gọi/nhắn Zalo cho Tùng.",
    };
  } catch {
    return {
      ok: false,
      code: "NETWORK",
      message:
        "Không kết nối được tới máy chủ. Vui lòng kiểm tra mạng và thử lại — thông tin bạn nhập vẫn được giữ lại.",
    };
  }
}

/** Hỏi server xem đã cấu hình nơi lưu lead chưa (để hiển thị chế độ demo). */
export async function fetchLeadStatus(): Promise<boolean> {
  try {
    const res = await fetch("/api/leads", { cache: "no-store" });
    if (!res.ok) return false;
    const data = (await res.json()) as { enabled?: boolean };
    return data.enabled === true;
  } catch {
    return false;
  }
}
