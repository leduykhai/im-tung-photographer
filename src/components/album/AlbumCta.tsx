import { OpenConsultationButton } from "@/components/consult/OpenConsultationButton";
import { siteConfig } from "@/config/site";

export function AlbumCta({ albumTitle }: { albumTitle: string }) {
  return (
    <section
      aria-labelledby="album-cta-title"
      className="border-y border-line bg-surface"
    >
      <div className="container-site py-14 text-center sm:py-16 lg:py-20">
        <h2
          id="album-cta-title"
          className="mx-auto max-w-2xl text-[1.9rem] sm:text-4xl lg:text-[2.6rem]"
        >
          Bạn muốn lưu giữ ngày cưới theo phong cách này?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-[1.8] text-muted sm:text-lg">
          Chia sẻ kế hoạch của hai bạn để Tùng tư vấn thêm về concept và cách ghi lại
          những khoảnh khắc quan trọng.
        </p>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <OpenConsultationButton
            location="dialog-album"
            className="btn btn-primary sm:min-w-56"
          >
            Tư vấn album tương tự
          </OpenConsultationButton>
          <a
            href={siteConfig.contact.zaloHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline sm:min-w-56"
            data-track="click_zalo"
            data-track-location="album-cta"
          >
            Nhắn Zalo cho Tùng
          </a>
        </div>
        <p className="mt-5 text-sm text-muted">
          Yêu cầu tư vấn sẽ được gắn với album <strong className="font-semibold text-ink">{albumTitle}</strong>.
        </p>
      </div>
    </section>
  );
}
