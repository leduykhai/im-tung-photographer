"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useId, useRef, useState } from "react";
import { useForm, useWatch, type FieldErrors, type Path } from "react-hook-form";
import { siteConfig } from "@/config/site";
import { track } from "@/lib/analytics";
import {
  CONTACT_CHANNELS,
  SERVICE_OPTIONS,
  consultationFormSchema,
  defaultFormValues,
  type ConsultationFormValues,
} from "@/lib/lead-schema";
import { fetchLeadStatus, submitLead } from "@/lib/leads/client";
import {
  ArrowRightIcon,
  ChevronDownIcon,
  MailIcon,
  PhoneIcon,
  ZaloIcon,
} from "@/components/ui/icons";

export interface ConsultationAlbumRef {
  slug: string;
  title: string;
}

interface ConsultationFormProps {
  /** Vị trí của form — lưu cùng lead để biết yêu cầu phát sinh từ đâu. */
  location: string;
  /** Album khách đang xem (nếu có) — tự gắn vào lead. */
  album?: ConsultationAlbumRef | null;
  /** Trong dialog, tiêu đề do dialog đảm nhiệm nên form không in lại. */
  onClose?: () => void;
}

type Status = "idle" | "submitting" | "success" | "error";

const extendedFields: Array<Path<ConsultationFormValues>> = [
  "email",
  "zaloNumber",
  "province",
  "venue",
  "service",
  "preferredChannel",
  "message",
];

function todayIso(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function ConsultationForm({ location, album, onClose }: ConsultationFormProps) {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    setFocus,
    setValue,
    formState: { errors },
  } = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationFormSchema),
    defaultValues: defaultFormValues,
    mode: "onTouched",
  });

  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [extOpen, setExtOpen] = useState(false);
  const [leadEnabled, setLeadEnabled] = useState<boolean | null>(null);
  const [minDate, setMinDate] = useState<string | undefined>(undefined);
  const successRef = useRef<HTMLHeadingElement>(null);

  const zaloSame = useWatch({ control, name: "zaloSameAsPhone" });
  const zaloNumber = useWatch({ control, name: "zaloNumber" });
  const channel = useWatch({ control, name: "preferredChannel" });

  useEffect(() => {
    let active = true;
    fetchLeadStatus().then((enabled) => {
      if (active) {
        setLeadEnabled(enabled);
        setMinDate(todayIso());
      }
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  function expandAndFocus(name: Path<ConsultationFormValues>) {
    setExtOpen(true);
    // Chờ panel hiển thị rồi mới focus.
    requestAnimationFrame(() => setFocus(name));
  }

  function onInvalid(errs: FieldErrors<ConsultationFormValues>) {
    const mainInvalid = ["fullName", "phone", "weddingDate", "consent"].some(
      (f) => f in errs,
    );
    if (mainInvalid) {
      // Nếu có cả lỗi ở phần mở rộng thì vẫn mở ra để khách thấy.
      if (extendedFields.some((f) => f in errs)) setExtOpen(true);
      return;
    }
    const first = extendedFields.find((f) => f in errs);
    if (first) expandAndFocus(first);
  }

  async function onSubmit(values: ConsultationFormValues) {
    if (status === "submitting") return; // Chống gửi liên tục
    setStatus("submitting");
    setServerError(null);

    const result = await submitLead(values, {
      albumSlug: album?.slug,
      formLocation: location,
    });

    if (result.ok) {
      setStatus("success");
      track("submit_lead_success", {
        form_location: location,
        album_slug: album?.slug,
      });
      reset(defaultFormValues);
      setExtOpen(false);
      return;
    }

    setStatus("error");
    setServerError(result.message);
    if (result.fieldErrors) {
      for (const [field, message] of Object.entries(result.fieldErrors)) {
        if (field in defaultFormValues) {
          setError(field as Path<ConsultationFormValues>, { message });
          if (extendedFields.includes(field as Path<ConsultationFormValues>)) {
            setExtOpen(true);
          }
        }
      }
    }
  }

  const submitting = status === "submitting";

  if (status === "success") {
    return (
      <div role="status" className="animate-fade-in py-5 text-center sm:py-8">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent/25 bg-accent/10 text-accent">
          <svg
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h3
          ref={successRef}
          tabIndex={-1}
          className="font-serif text-2xl font-medium text-ink outline-none sm:text-3xl lg:text-4xl"
        >
          Tùng đã nhận được thông tin!
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted sm:text-base">
          Cảm ơn hai bạn đã tin tưởng chia sẻ. Tùng sẽ xem lại thông tin và chủ động liên hệ sớm nhất qua kênh bạn đã chọn.
        </p>

        <div className="mx-auto mt-6 max-w-md rounded-xl border border-line bg-surface/70 p-4 text-left">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            Cần trao đổi gấp?
          </p>
          <p className="mt-1 text-xs text-muted sm:text-sm">
            Bạn có thể bấm gọi trực tiếp hoặc gửi tin nhắn Zalo kèm ảnh/link album yêu thích để Tùng trả lời ngay.
          </p>
        </div>

        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={siteConfig.contact.zaloHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary w-full gap-2 sm:w-auto"
            data-track="click_zalo"
            data-track-location="consultation-success"
          >
            <ZaloIcon className="h-4 w-4" />
            <span>Nhắn Zalo cho Tùng ngay</span>
          </a>
          {onClose ? (
            <button
              type="button"
              className="btn btn-outline w-full sm:w-auto"
              onClick={onClose}
            >
              Hoàn tất &amp; Đóng
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-outline w-full sm:w-auto"
              onClick={() => setStatus("idle")}
            >
              Gửi thêm một yêu cầu khác
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      noValidate
      aria-describedby={serverError ? id("server-error") : undefined}
      className="space-y-5"
    >
      {album && (
        <div className="flex items-center gap-3.5 rounded-xl border border-accent/25 bg-accent/[0.04] p-3.5 transition-all">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-[0.6875rem] font-semibold uppercase tracking-wider text-accent">
              Album bạn đang quan tâm
            </span>
            <span className="block truncate font-serif text-base font-medium text-ink sm:text-lg">
              {album.title}
            </span>
          </div>
          <span className="hidden sm:inline-flex shrink-0 items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
            Đã đính kèm
          </span>
        </div>
      )}

      {leadEnabled === false && (
        <div
          role="note"
          className="rounded-lg border border-line bg-surface p-4 text-[0.9375rem] text-muted shadow-sm"
        >
          <strong className="font-semibold text-ink">Chế độ xem thử.</strong> Website
          chưa kết nối nơi lưu thông tin nên chưa thể gửi form. Bạn vẫn có thể{" "}
          <a
            className="font-semibold text-accent underline underline-offset-2"
            href={siteConfig.contact.phoneHref}
            data-track="click_phone"
            data-track-location="form-demo-note"
          >
            gọi {siteConfig.contact.phoneDisplay}
          </a>{" "}
          hoặc{" "}
          <a
            className="font-semibold text-accent underline underline-offset-2"
            href={siteConfig.contact.zaloHref}
            target="_blank"
            rel="noopener noreferrer"
            data-track="click_zalo"
            data-track-location="form-demo-note"
          >
            nhắn Zalo
          </a>{" "}
          cho Tùng.
        </div>
      )}

      {/* Honeypot — ẩn với người dùng thật */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={id("website")}>Để trống ô này</label>
        <input
          id={id("website")}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        <div>
          <label className="field-label" htmlFor={id("fullName")}>
            Họ và tên <span className="text-accent">*</span>
          </label>
          <input
            id={id("fullName")}
            type="text"
            autoComplete="name"
            className="field-input"
            placeholder="Nguyễn Văn A"
            aria-required="true"
            aria-invalid={errors.fullName ? "true" : "false"}
            aria-describedby={errors.fullName ? id("fullName-err") : undefined}
            {...register("fullName")}
          />
          {errors.fullName && (
            <p id={id("fullName-err")} className="field-error" role="alert">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <label className="field-label" htmlFor={id("phone")}>
            Số điện thoại <span className="text-accent">*</span>
          </label>
          <input
            id={id("phone")}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            className="field-input"
            placeholder="0352 942 502"
            aria-required="true"
            aria-invalid={errors.phone ? "true" : "false"}
            aria-describedby={errors.phone ? id("phone-err") : undefined}
            {...register("phone")}
          />
          {errors.phone && (
            <p id={id("phone-err")} className="field-error" role="alert">
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      <div className="sm:max-w-[calc(50%-0.625rem)]">
        <label className="field-label" htmlFor={id("weddingDate")}>
          Ngày cưới dự kiến{" "}
          <span className="font-normal text-muted">(không bắt buộc)</span>
        </label>
        <input
          id={id("weddingDate")}
          type="date"
          min={minDate}
          className="field-input"
          aria-invalid={errors.weddingDate ? "true" : "false"}
          aria-describedby={errors.weddingDate ? id("weddingDate-err") : undefined}
          {...register("weddingDate")}
        />
        {errors.weddingDate && (
          <p id={id("weddingDate-err")} className="field-error" role="alert">
            {errors.weddingDate.message}
          </p>
        )}
      </div>

      {/* Phần mở rộng với container bo góc và nút gập/mở hiện đại */}
      <div className="rounded-xl border border-line bg-surface/40 p-4 transition-colors hover:border-line/90 sm:p-5">
        <button
          type="button"
          className="group flex min-h-11 w-full items-center justify-between gap-3 text-left font-medium text-ink transition-colors hover:text-accent"
          aria-expanded={extOpen}
          aria-controls={id("extended")}
          onClick={() => setExtOpen((v) => !v)}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-semibold sm:text-base">
              Chia sẻ thêm về kế hoạch ngày cưới
            </span>
            <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-normal text-accent">
              Tuỳ chọn
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted transition-colors group-hover:text-accent">
              {extOpen ? "Thu lại" : "Mở rộng"}
            </span>
            <span
              aria-hidden="true"
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                extOpen
                  ? "border-accent bg-accent text-white rotate-180 shadow-sm"
                  : "border-line bg-surface text-accent group-hover:border-accent group-hover:bg-accent/10"
              }`}
            >
              <ChevronDownIcon className="h-4 w-4" strokeWidth={2.2} />
            </span>
          </div>
        </button>

        <div
          id={id("extended")}
          hidden={!extOpen}
          className="space-y-4 pt-4 animate-fade-in"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor={id("email")}>
                Email
              </label>
              <input
                id={id("email")}
                type="email"
                inputMode="email"
                autoComplete="email"
                className="field-input"
                placeholder="ban@email.com"
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? id("email-err") : undefined}
                {...register("email")}
              />
              {errors.email && (
                <p id={id("email-err")} className="field-error" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="field-label" htmlFor={id("zaloNumber")}>
                Số Zalo
              </label>
              <input
                id={id("zaloNumber")}
                type="tel"
                inputMode="tel"
                className="field-input read-only:bg-ivory read-only:text-muted"
                placeholder="0352 942 502"
                readOnly={zaloSame}
                aria-readonly={zaloSame}
                tabIndex={zaloSame ? -1 : undefined}
                aria-invalid={errors.zaloNumber ? "true" : "false"}
                aria-describedby={errors.zaloNumber ? id("zaloNumber-err") : undefined}
                {...register("zaloNumber")}
              />
              {errors.zaloNumber && (
                <p id={id("zaloNumber-err")} className="field-error" role="alert">
                  {errors.zaloNumber.message}
                </p>
              )}
              <label className="mt-2 flex min-h-8 cursor-pointer items-center gap-2.5 text-[0.9375rem] text-ink select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 shrink-0 rounded accent-accent"
                  {...register("zaloSameAsPhone")}
                />
                Zalo dùng cùng số điện thoại
              </label>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor={id("province")}>
                Tỉnh/thành tổ chức
              </label>
              <input
                id={id("province")}
                type="text"
                autoComplete="address-level1"
                className="field-input"
                placeholder="Ví dụ: Hà Nội, Ninh Bình..."
                aria-invalid={errors.province ? "true" : "false"}
                {...register("province")}
              />
              {errors.province && (
                <p className="field-error" role="alert">
                  {errors.province.message}
                </p>
              )}
            </div>
            <div>
              <label className="field-label" htmlFor={id("service")}>
                Dịch vụ quan tâm
              </label>
              <select
                id={id("service")}
                className="field-input cursor-pointer"
                aria-invalid={errors.service ? "true" : "false"}
                {...register("service")}
              >
                <option value="">Chọn dịch vụ</option>
                {SERVICE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="field-label" htmlFor={id("venue")}>
              Địa điểm dự kiến
            </label>
            <input
              id={id("venue")}
              type="text"
              className="field-input"
              placeholder="Nhà hàng, nhà thờ, khu resort, tư gia..."
              aria-invalid={errors.venue ? "true" : "false"}
              {...register("venue")}
            />
            {errors.venue && (
              <p className="field-error" role="alert">
                {errors.venue.message}
              </p>
            )}
          </div>

          <fieldset>
            <legend className="sr-only">Kênh liên hệ bạn muốn Tùng phản hồi</legend>
            <div className="field-label flex items-center justify-between">
              <span>Kênh liên hệ bạn muốn Tùng phản hồi</span>
              <span className="text-xs font-normal text-muted">Ưu tiên Zalo / Gọi</span>
            </div>
            <input type="hidden" {...register("preferredChannel")} />

            <div className="mt-1.5 grid grid-cols-3 gap-2 sm:gap-2.5">
              {CONTACT_CHANNELS.map((option) => {
                const isSelected = channel === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setValue("preferredChannel", option.value, {
                        shouldValidate: false,
                        shouldDirty: true,
                        shouldTouch: false,
                      });
                      if (option.value === "zalo" && !zaloNumber) {
                        setValue("zaloSameAsPhone", true, { shouldValidate: false });
                      }
                    }}
                    className={`flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border px-2 py-2 text-xs font-medium transition-all duration-200 select-none sm:text-sm ${
                      isSelected
                        ? "border-accent bg-accent text-white shadow-sm ring-1 ring-accent"
                        : "border-line bg-surface text-ink hover:border-accent/60 hover:bg-accent/[0.03]"
                    }`}
                  >
                    {option.value === "zalo" && <ZaloIcon className="h-4 w-4 shrink-0" />}
                    {option.value === "phone" && <PhoneIcon className="h-4 w-4 shrink-0" />}
                    {option.value === "email" && <MailIcon className="h-4 w-4 shrink-0" />}
                    <span className="truncate">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div>
            <label className="field-label" htmlFor={id("message")}>
              Lời nhắn gửi đến Tùng
            </label>
            <textarea
              id={id("message")}
              rows={3}
              className="field-input resize-y"
              placeholder="Phong cách bạn thích, những khoảnh khắc đặc biệt hoặc băn khoăn của hai bạn..."
              aria-invalid={errors.message ? "true" : "false"}
              {...register("message")}
            />
            {errors.message && (
              <p className="field-error" role="alert">
                {errors.message.message}
              </p>
            )}
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => setExtOpen(false)}
              className="group inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface/80 px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent/40 hover:text-accent"
            >
              <span>Thu lại phần chia sẻ thêm</span>
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/10 text-accent transition-transform group-hover:bg-accent group-hover:text-white">
                <ChevronDownIcon className="h-3 w-3 rotate-180" strokeWidth={2.5} />
              </span>
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-[0.9375rem] leading-relaxed text-ink select-none">
          <input
            type="checkbox"
            className="mt-1 h-5 w-5 shrink-0 rounded accent-accent"
            aria-invalid={errors.consent ? "true" : "false"}
            aria-describedby={errors.consent ? id("consent-err") : undefined}
            {...register("consent")}
          />
          <span>
            Tôi đồng ý để I&apos;m Tung Photographer sử dụng thông tin đã cung cấp để
            liên hệ tư vấn.{" "}
            <a
              href="/chinh-sach-bao-mat"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent underline underline-offset-2"
            >
              Chính sách bảo mật
            </a>
          </span>
        </label>
        {errors.consent && (
          <p id={id("consent-err")} className="field-error" role="alert">
            {errors.consent.message}
          </p>
        )}
      </div>

      {serverError && (
        <div
          id={id("server-error")}
          role="alert"
          className="rounded-lg border border-[#d9b3b0] bg-[#fbf1f0] p-4 text-[0.9375rem] text-[#7d2420]"
        >
          <p>{serverError}</p>
          <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-semibold">
            <a
              className="underline underline-offset-2"
              href={siteConfig.contact.phoneHref}
              data-track="click_phone"
              data-track-location="form-error"
            >
              Gọi {siteConfig.contact.phoneDisplay}
            </a>
            <a
              className="underline underline-offset-2"
              href={siteConfig.contact.zaloHref}
              target="_blank"
              rel="noopener noreferrer"
              data-track="click_zalo"
              data-track-location="form-error"
            >
              Nhắn Zalo
            </a>
          </p>
        </div>
      )}

      <div className="pt-1">
        <button
          type="submit"
          className="btn btn-primary group w-full gap-2.5 transition-all sm:w-auto sm:min-w-64"
          disabled={submitting}
          aria-busy={submitting}
        >
          {submitting ? (
            <>
              <svg
                className="h-4 w-4 animate-spin text-white"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Đang gửi thông tin...</span>
            </>
          ) : (
            <>
              <span>Gửi yêu cầu tư vấn</span>
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
        <p className="mt-3.5 text-xs text-muted sm:text-sm">
          Bạn cần trao đổi gấp? Gọi{" "}
          <a
            className="font-semibold text-accent underline underline-offset-2"
            href={siteConfig.contact.phoneHref}
            data-track="click_phone"
            data-track-location="form-footer"
          >
            {siteConfig.contact.phoneDisplay}
          </a>{" "}
          hoặc nhắn{" "}
          <a
            className="font-semibold text-accent underline underline-offset-2"
            href={siteConfig.contact.zaloHref}
            target="_blank"
            rel="noopener noreferrer"
            data-track="click_zalo"
            data-track-location="form-footer"
          >
            Zalo cho Tùng
          </a>
          .
        </p>
      </div>
    </form>
  );
}
