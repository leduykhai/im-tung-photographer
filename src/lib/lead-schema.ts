/**
 * Schema và kiểu dữ liệu của form tư vấn — dùng CHUNG cho client (React Hook Form)
 * và server (route /api/leads) để quy tắc kiểm tra luôn giống nhau.
 */
import { z } from "zod";
import { normalizeVnPhone } from "@/lib/phone";

export const SERVICE_OPTIONS = [
  { value: "phong-su-cuoi", label: "Album phóng sự cưới" },
  { value: "le-gia-tien", label: "Lễ gia tiên" },
  { value: "tiec-cuoi", label: "Tiệc cưới" },
  { value: "pre-wedding", label: "Pre-wedding" },
  { value: "chua-chac", label: "Chưa chắc, cần tư vấn thêm" },
] as const;

export const CONTACT_CHANNELS = [
  { value: "phone", label: "Điện thoại" },
  { value: "zalo", label: "Zalo" },
  { value: "email", label: "Email" },
] as const;

export type ContactChannel = (typeof CONTACT_CHANNELS)[number]["value"];

const serviceValues = SERVICE_OPTIONS.map((o) => o.value) as string[];
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Vị trí của form: dùng để biết yêu cầu phát sinh từ đâu. */
export const FORM_LOCATIONS = [
  "home-section",
  "dialog-header",
  "dialog-hero",
  "dialog-about",
  "dialog-mobile-bar",
  "dialog-album",
  "dialog-other",
  "album-page",
] as const;

const shape = {
  fullName: z
    .string()
    .trim()
    .min(2, "Vui lòng nhập họ và tên (ít nhất 2 ký tự).")
    .max(80, "Họ và tên tối đa 80 ký tự."),
  phone: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập số điện thoại.")
    .max(20, "Số điện thoại quá dài.")
    .refine(
      (v) => v === "" || normalizeVnPhone(v) !== null,
      "Số điện thoại chưa đúng. Ví dụ: 0352 942 502 hoặc +84 352 942 502.",
    ),
  weddingDate: z
    .string()
    .trim()
    .max(10)
    .refine((v) => v === "" || isReasonableDate(v), "Ngày cưới chưa hợp lệ."),
  email: z
    .string()
    .trim()
    .max(120, "Email tối đa 120 ký tự.")
    .refine((v) => v === "" || emailRegex.test(v), "Email chưa đúng định dạng."),
  zaloSameAsPhone: z.boolean(),
  zaloNumber: z
    .string()
    .trim()
    .max(20, "Số Zalo quá dài.")
    .refine(
      (v) => v === "" || normalizeVnPhone(v) !== null,
      "Số Zalo chưa đúng. Ví dụ: 0352 942 502.",
    ),
  province: z.string().trim().max(60, "Tỉnh/thành tối đa 60 ký tự."),
  venue: z.string().trim().max(160, "Địa điểm tối đa 160 ký tự."),
  service: z
    .string()
    .trim()
    .refine((v) => v === "" || serviceValues.includes(v), "Dịch vụ chưa hợp lệ."),
  preferredChannel: z.enum(["phone", "zalo", "email"]),
  message: z.string().trim().max(1000, "Lời nhắn tối đa 1000 ký tự."),
  consent: z.boolean().refine((v) => v === true, {
    message: "Vui lòng đồng ý để Tùng có thể liên hệ tư vấn.",
  }),
  /** Honeypot — người dùng thật không thấy ô này. */
  website: z.string().max(200),
};

type FormShape = {
  email: string;
  zaloSameAsPhone: boolean;
  zaloNumber: string;
  preferredChannel: ContactChannel;
  phone: string;
};

/** Quy tắc liên quan giữa nhiều trường. */
function crossFieldRules(data: FormShape, ctx: z.RefinementCtx) {
  if (data.preferredChannel === "email" && data.email === "") {
    ctx.addIssue({
      code: "custom",
      path: ["email"],
      message: "Bạn chọn liên hệ qua email, vui lòng nhập địa chỉ email.",
    });
  }
  if (
    data.preferredChannel === "zalo" &&
    !data.zaloSameAsPhone &&
    data.zaloNumber === ""
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["zaloNumber"],
      message:
        "Bạn chọn liên hệ qua Zalo, vui lòng nhập số Zalo hoặc chọn “Zalo dùng cùng số điện thoại”.",
    });
  }
}

function isReasonableDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + "T00:00:00");
  if (Number.isNaN(date.getTime())) return false;
  const now = new Date();
  const earliest = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const latest = new Date(now.getFullYear() + 6, now.getMonth(), now.getDate());
  return date >= earliest && date <= latest;
}

/** Schema cho form (client). */
export const consultationFormSchema = z.object(shape).superRefine(crossFieldRules);
export type ConsultationFormValues = z.infer<typeof consultationFormSchema>;

/** Metadata đi kèm lead — do client gắn, server kiểm tra lại. */
const metaShape = {
  albumSlug: z.string().trim().max(120).optional(),
  formLocation: z.string().trim().max(40).optional(),
  sourcePage: z.string().trim().max(300).optional(),
  utmSource: z.string().trim().max(100).optional(),
  utmMedium: z.string().trim().max(100).optional(),
  utmCampaign: z.string().trim().max(100).optional(),
};

/** Schema payload gửi lên /api/leads. */
export const leadRequestSchema = z
  .object({ ...shape, ...metaShape })
  .superRefine(crossFieldRules);
export type LeadRequest = z.infer<typeof leadRequestSchema>;

export const defaultFormValues: ConsultationFormValues = {
  fullName: "",
  phone: "",
  weddingDate: "",
  email: "",
  zaloSameAsPhone: true,
  zaloNumber: "",
  province: "",
  venue: "",
  service: "",
  preferredChannel: "phone",
  message: "",
  consent: false,
  website: "",
};

/** Bản ghi lead đã được xử lý và sẽ được lưu (server). */
export interface LeadRecord {
  id: string;
  fullName: string;
  /** Dạng 0xxxxxxxxx */
  phone: string;
  /** Dạng +84xxxxxxxxx */
  phoneE164: string;
  weddingDate: string | null;
  email: string | null;
  /** Số Zalo thực tế dùng để liên hệ (nếu chọn cùng số điện thoại thì bằng phone). */
  zaloNumber: string | null;
  province: string | null;
  venue: string | null;
  service: string | null;
  preferredChannel: ContactChannel;
  message: string | null;
  albumId: string | null;
  albumSlug: string | null;
  albumTitle: string | null;
  albumUrl: string | null;
  sourcePage: string | null;
  formLocation: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  submittedAt: string;
  consentGiven: true;
  consentAt: string;
  privacyPolicyVersion: string;
}

/** Hợp đồng phản hồi của POST /api/leads. */
export type LeadApiResponse =
  | { ok: true; id: string }
  | {
      ok: false;
      code:
        | "VALIDATION"
        | "RATE_LIMITED"
        | "NOT_CONFIGURED"
        | "STORAGE_FAILED"
        | "BAD_REQUEST"
        | "FORBIDDEN";
      message: string;
      fieldErrors?: Record<string, string>;
    };
