"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Wordmark } from "./Wordmark";
import { CurrentYear } from "./CurrentYear";

export function SiteFooter() {
  const { contact, optional } = siteConfig;
  const linkClass =
    "inline-flex min-h-8 items-center text-ink underline-offset-4 transition-colors hover:text-accent hover:underline";

  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-site grid gap-10 py-12 md:grid-cols-[1.2fr_1fr_1fr] lg:py-16">
        <div>
          <Wordmark size="lg" />
          <p className="mt-5 max-w-xs font-serif text-xl leading-snug text-muted">
            {siteConfig.tagline}
          </p>
        </div>

        <div>
          <h2 className="eyebrow !text-ink">Liên hệ</h2>
          <ul className="mt-4 space-y-2 text-base">
            <li>
              <a
                href={contact.phoneHref}
                className={linkClass}
                data-track="click_phone"
                data-track-location="footer"
              >
                {contact.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={contact.emailHref} className={linkClass}>
                {contact.email}
              </a>
            </li>
            {optional.address && <li className="text-muted">{optional.address}</li>}
            {optional.openingHours && <li className="text-muted">{optional.openingHours}</li>}
          </ul>
        </div>

        <div>
          <h2 className="eyebrow !text-ink">Kết nối</h2>
          <ul className="mt-4 space-y-2 text-base">
            <li>
              <a
                href={contact.facebookHref}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
                data-track="click_facebook"
                data-track-location="footer"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href={contact.zaloHref}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
                data-track="click_zalo"
                data-track-location="footer"
              >
                Zalo
              </a>
            </li>
            {optional.instagramHref && (
              <li>
                <a href={optional.instagramHref} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  Instagram
                </a>
              </li>
            )}
            {optional.tiktokHref && (
              <li>
                <a href={optional.tiktokHref} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  TikTok
                </a>
              </li>
            )}
            <li>
              <Link href="/chinh-sach-bao-mat" className={linkClass}>
                Chính sách bảo mật
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-site flex flex-col gap-3 py-5 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CurrentYear /> {siteConfig.name}. Bảo lưu mọi quyền.
          </p>
          <p>Bản xem trước: ảnh và tên cặp đôi chỉ là minh hoạ.</p>
        </div>
      </div>
    </footer>
  );
}
