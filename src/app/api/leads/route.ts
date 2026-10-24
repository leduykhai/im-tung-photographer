import { randomUUID } from "node:crypto";
import { siteConfig } from "@/config/site";
import { getAlbumBySlug } from "@/lib/albums";
import { leadRequestSchema, type LeadApiResponse, type LeadRecord } from "@/lib/lead-schema";
import { rateLimit } from "@/lib/leads/rate-limit";
import { isLeadStorageConfigured, storeLead } from "@/lib/leads/storage";
import { normalizeVnPhone, toE164Vn } from "@/lib/phone";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16 * 1024;
/** 5 yêu cầu / 10 phút / IP. */
const RATE_LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 };

function json(body: LeadApiResponse, status: number, headers?: Record<string, string>) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/** Chặn request chéo nguồn (CSRF cơ bản) khi trình duyệt gửi Origin. */
function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function emptyToNull(value: string | undefined): string | null {
  const v = value?.trim();
  return v ? v : null;
}

/** Trạng thái cấu hình lưu lead — để UI biết đang ở chế độ demo hay không. */
export async function GET() {
  return Response.json(
    { enabled: isLeadStorageConfigured() },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return json({ ok: false, code: "FORBIDDEN", message: "Yêu cầu không hợp lệ." }, 403);
  }

  if (!isLeadStorageConfigured()) {
    return json(
      {
        ok: false,
        code: "NOT_CONFIGURED",
        message:
          "Website đang ở chế độ xem thử, chưa kết nối nơi lưu thông tin. Vui lòng gọi hoặc nhắn Zalo cho Tùng.",
      },
      503,
    );
  }

  const limited = rateLimit(`lead:${clientIp(request)}`, RATE_LIMIT);
  if (!limited.allowed) {
    return json(
      {
        ok: false,
        code: "RATE_LIMITED",
        message: "Bạn đã gửi quá nhiều lần. Vui lòng thử lại sau ít phút hoặc gọi trực tiếp cho Tùng.",
      },
      429,
      { "Retry-After": String(limited.retryAfterSeconds) },
    );
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return json({ ok: false, code: "BAD_REQUEST", message: "Không đọc được dữ liệu gửi lên." }, 400);
  }
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
    return json({ ok: false, code: "BAD_REQUEST", message: "Dữ liệu gửi lên quá lớn." }, 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, code: "BAD_REQUEST", message: "Dữ liệu gửi lên không hợp lệ." }, 400);
  }

  const parsed = leadRequestSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return json(
      {
        ok: false,
        code: "VALIDATION",
        message: "Vui lòng kiểm tra lại thông tin đã nhập.",
        fieldErrors,
      },
      422,
    );
  }

  const data = parsed.data;

  // Honeypot: người dùng thật không điền ô này.
  if (data.website !== "") {
    return json({ ok: false, code: "BAD_REQUEST", message: "Yêu cầu không hợp lệ." }, 400);
  }

  const phone = normalizeVnPhone(data.phone);
  if (!phone) {
    return json(
      {
        ok: false,
        code: "VALIDATION",
        message: "Vui lòng kiểm tra lại thông tin đã nhập.",
        fieldErrors: { phone: "Số điện thoại chưa đúng." },
      },
      422,
    );
  }

  const zaloNumber = data.zaloSameAsPhone
    ? phone
    : data.zaloNumber
      ? normalizeVnPhone(data.zaloNumber)
      : null;

  // Album do server tự tra cứu theo slug — không tin tên/URL do client gửi.
  const album = data.albumSlug ? getAlbumBySlug(data.albumSlug) : undefined;
  const albumPath = album ? `/album/${album.slug}` : null;
  const now = new Date().toISOString();

  const lead: LeadRecord = {
    id: randomUUID(),
    fullName: data.fullName,
    phone,
    phoneE164: toE164Vn(phone),
    weddingDate: emptyToNull(data.weddingDate),
    email: emptyToNull(data.email),
    zaloNumber,
    province: emptyToNull(data.province),
    venue: emptyToNull(data.venue),
    service: emptyToNull(data.service),
    preferredChannel: data.preferredChannel,
    message: emptyToNull(data.message),
    albumId: album?.id ?? null,
    albumSlug: album?.slug ?? null,
    albumTitle: album?.title ?? null,
    albumUrl: albumPath ? (siteConfig.siteUrl ? siteConfig.siteUrl + albumPath : albumPath) : null,
    sourcePage: emptyToNull(data.sourcePage),
    formLocation: emptyToNull(data.formLocation),
    utmSource: emptyToNull(data.utmSource),
    utmMedium: emptyToNull(data.utmMedium),
    utmCampaign: emptyToNull(data.utmCampaign),
    submittedAt: now,
    consentGiven: true,
    consentAt: now,
    privacyPolicyVersion: siteConfig.privacyPolicyVersion,
  };

  try {
    await storeLead(lead);
  } catch (error) {
    // Chỉ log thông điệp lỗi, không log dữ liệu cá nhân.
    console.error("[leads] Lưu lead thất bại:", (error as Error).message);
    return json(
      {
        ok: false,
        code: "STORAGE_FAILED",
        message:
          "Chưa gửi được thông tin của bạn. Dữ liệu bạn nhập vẫn được giữ lại — vui lòng thử lại hoặc gọi/nhắn Zalo cho Tùng.",
      },
      502,
    );
  }

  return json({ ok: true, id: lead.id }, 201);
}
