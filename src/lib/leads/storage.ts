import "server-only";
import type { LeadRecord } from "@/lib/lead-schema";

/**
 * Lớp lưu lead (server-only). Secrets chỉ đọc ở đây, không bao giờ gửi xuống client.
 *
 * Cấu hình qua biến môi trường (xem .env.example):
 *  - Supabase REST:  SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY [+ SUPABASE_LEADS_TABLE]
 *  - Webhook:        LEAD_WEBHOOK_URL [+ LEAD_WEBHOOK_SECRET]  (Google Sheets Apps Script, n8n, Make, Zapier...)
 *
 * Nếu cả hai cùng cấu hình: Supabase là nơi lưu chính (bắt buộc thành công),
 * webhook chỉ là thông báo bổ sung (lỗi webhook không làm hỏng yêu cầu).
 *
 * Nếu chưa cấu hình nơi lưu nào → isLeadStorageConfigured() = false và API trả 503.
 * KHÔNG có chế độ "giả lập thành công".
 */

const REQUEST_TIMEOUT_MS = 8000;

function supabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/+$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const table = process.env.SUPABASE_LEADS_TABLE || "leads";
  if (!url || !key) return null;
  return { url, key, table };
}

function webhookConfig() {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return null;
  return { url, secret: process.env.LEAD_WEBHOOK_SECRET || null };
}

function telegramConfig() {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) return null;
  return { token, chatId };
}

export type LeadStorageKind = "supabase" | "webhook" | "telegram";

export function getConfiguredStorage(): LeadStorageKind[] {
  const kinds: LeadStorageKind[] = [];
  if (supabaseConfig()) kinds.push("supabase");
  if (webhookConfig()) kinds.push("webhook");
  if (telegramConfig()) kinds.push("telegram");
  return kinds;
}

export function isLeadStorageConfigured(): boolean {
  return getConfiguredStorage().length > 0;
}

/** Ánh xạ record → cột snake_case của bảng `leads`. */
function toRow(lead: LeadRecord) {
  return {
    id: lead.id,
    full_name: lead.fullName,
    phone: lead.phone,
    phone_e164: lead.phoneE164,
    wedding_date: lead.weddingDate,
    email: lead.email,
    zalo_number: lead.zaloNumber,
    province: lead.province,
    venue: lead.venue,
    service: lead.service,
    preferred_channel: lead.preferredChannel,
    message: lead.message,
    album_id: lead.albumId,
    album_slug: lead.albumSlug,
    album_title: lead.albumTitle,
    album_url: lead.albumUrl,
    source_page: lead.sourcePage,
    form_location: lead.formLocation,
    utm_source: lead.utmSource,
    utm_medium: lead.utmMedium,
    utm_campaign: lead.utmCampaign,
    submitted_at: lead.submittedAt,
    consent_given: lead.consentGiven,
    consent_at: lead.consentAt,
    privacy_policy_version: lead.privacyPolicyVersion,
  };
}

async function saveToSupabase(lead: LeadRecord): Promise<void> {
  const cfg = supabaseConfig();
  if (!cfg) throw new Error("Supabase chưa được cấu hình");
  const res = await fetch(`${cfg.url}/rest/v1/${encodeURIComponent(cfg.table)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: cfg.key,
      Authorization: `Bearer ${cfg.key}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify(toRow(lead)),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    cache: "no-store",
  });
  if (!res.ok) {
    // Không log nội dung lead (dữ liệu cá nhân), chỉ log mã trạng thái.
    throw new Error(`Supabase trả về HTTP ${res.status}`);
  }
}

async function saveToWebhook(lead: LeadRecord): Promise<void> {
  const cfg = webhookConfig();
  if (!cfg) throw new Error("Webhook chưa được cấu hình");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (cfg.secret) headers["X-Webhook-Secret"] = cfg.secret;
  const res = await fetch(cfg.url, {
    method: "POST",
    headers,
    body: JSON.stringify({ event: "lead.created", lead }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Webhook trả về HTTP ${res.status}`);
}

function escapeTelegramHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function sendTelegramNotification(lead: LeadRecord): Promise<void> {
  const cfg = telegramConfig();
  if (!cfg) throw new Error("Telegram chưa được cấu hình");

  const lines = [
    `💌 <b>YÊU CẦU TƯ VẤN MỚI TỪ WEBSITE</b>`,
    `———————————————`,
    `👤 <b>Khách hàng:</b> ${escapeTelegramHtml(lead.fullName)}`,
    `📞 <b>Điện thoại:</b> <a href="tel:${escapeTelegramHtml(lead.phone)}">${escapeTelegramHtml(lead.phone)}</a>`,
  ];

  if (lead.zaloNumber) {
    lines.push(
      `💬 <b>Zalo:</b> <a href="https://zalo.me/${escapeTelegramHtml(lead.zaloNumber)}">${escapeTelegramHtml(lead.zaloNumber)}</a>`,
    );
  }
  if (lead.weddingDate) {
    lines.push(`📅 <b>Ngày cưới:</b> ${escapeTelegramHtml(lead.weddingDate)}`);
  }
  if (lead.province) {
    const venueText = lead.venue ? ` (${escapeTelegramHtml(lead.venue)})` : "";
    lines.push(`📍 <b>Địa điểm:</b> ${escapeTelegramHtml(lead.province)}${venueText}`);
  }
  if (lead.service) {
    lines.push(`📷 <b>Dịch vụ quan tâm:</b> ${escapeTelegramHtml(lead.service)}`);
  }
  if (lead.preferredChannel) {
    const channelMap: Record<string, string> = {
      zalo: "Nhắn qua Zalo",
      phone: "Gọi điện trực tiếp",
      email: "Gửi qua Email",
    };
    lines.push(
      `📱 <b>Kênh muốn liên hệ:</b> ${channelMap[lead.preferredChannel] || lead.preferredChannel}`,
    );
  }
  if (lead.email) {
    lines.push(`✉️ <b>Email:</b> ${escapeTelegramHtml(lead.email)}`);
  }
  if (lead.albumTitle) {
    const url = lead.albumUrl
      ? ` (<a href="${escapeTelegramHtml(lead.albumUrl)}">Xem album</a>)`
      : "";
    lines.push(`🖼️ <b>Album quan tâm:</b> ${escapeTelegramHtml(lead.albumTitle)}${url}`);
  }
  if (lead.message) {
    lines.push(`📝 <b>Lời nhắn:</b>\n<i>${escapeTelegramHtml(lead.message)}</i>`);
  }

  lines.push(`———————————————`);
  try {
    lines.push(
      `⏰ <i>${new Date(lead.submittedAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}</i>`,
    );
  } catch {
    lines.push(`⏰ <i>${escapeTelegramHtml(lead.submittedAt)}</i>`);
  }

  const text = lines.join("\n");

  const res = await fetch(`https://api.telegram.org/bot${cfg.token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: cfg.chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Telegram API trả về HTTP ${res.status}`);
  }
}

/**
 * Lưu lead và gửi thông báo.
 * Hỗ trợ đồng thời hoặc độc lập: Supabase, Webhook (Google Sheets/n8n/Make), Telegram Bot.
 * Bắt buộc ít nhất một nơi lưu chính thành công.
 */
export async function storeLead(lead: LeadRecord): Promise<void> {
  const hasSupabase = supabaseConfig() !== null;
  const hasWebhook = webhookConfig() !== null;
  const hasTelegram = telegramConfig() !== null;

  if (!hasSupabase && !hasWebhook && !hasTelegram) {
    throw new Error("Chưa cấu hình nơi lưu lead");
  }

  // Nếu có Supabase: Supabase là nơi lưu trữ cơ sở dữ liệu chính
  if (hasSupabase) {
    await saveToSupabase(lead);
    // Bắn thông báo phụ sang Webhook & Telegram nếu có cấu hình
    if (hasWebhook) {
      await saveToWebhook(lead).catch((err: unknown) => {
        console.error("[leads] Webhook thông báo thất bại:", (err as Error).message);
      });
    }
    if (hasTelegram) {
      await sendTelegramNotification(lead).catch((err: unknown) => {
        console.error("[leads] Telegram thông báo thất bại:", (err as Error).message);
      });
    }
    return;
  }

  // Nếu không dùng Supabase mà có Webhook:
  if (hasWebhook) {
    await saveToWebhook(lead);
    if (hasTelegram) {
      await sendTelegramNotification(lead).catch((err: unknown) => {
        console.error("[leads] Telegram thông báo thất bại:", (err as Error).message);
      });
    }
    return;
  }

  // Nếu chỉ cấu hình Telegram: Telegram là kênh nhận trực tiếp chính
  if (hasTelegram) {
    await sendTelegramNotification(lead);
    return;
  }
}
