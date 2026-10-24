import Image from "next/image";
import { siteConfig } from "@/config/site";
import { homeImages } from "@/data/albums";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function AboutSection() {
  const image = homeImages.about;
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="scroll-mt-(--header-h) border-y border-line bg-surface"
    >
      <div className="container-site grid items-center gap-10 py-14 md:grid-cols-2 md:gap-14 lg:gap-20 lg:py-20">
        <ScrollReveal direction="left" delay={50} className="w-full">
          <figure className="mx-auto w-full max-w-lg md:max-w-none">
            <div className="img-skeleton relative aspect-square overflow-hidden shadow-sm transition-shadow duration-500 hover:shadow-md">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover transition-transform duration-850 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03]"
              />
            </div>
            <figcaption className="mt-2 text-sm text-muted">
              Ảnh chi tiết minh hoạ. Ảnh chân dung và hậu trường sẽ được bổ sung.
            </figcaption>
          </figure>
        </ScrollReveal>

        <ScrollReveal direction="right" delay={120} className="w-full">
          <div>
            <p className="eyebrow">Về Tùng</p>
            <h2 id="about-title" className="mt-3 text-[2rem] sm:text-4xl lg:text-5xl">
              Đằng sau những khung hình
            </h2>
            <p className="mt-5 max-w-xl text-base leading-[1.85] text-muted sm:text-lg">
              Tùng muốn cùng hai bạn lưu giữ ngày cưới bằng những hình ảnh tự nhiên và gần
              gũi. Hãy chia sẻ câu chuyện, điều bạn mong đợi và những khoảnh khắc quan trọng
              — để album mang dấu ấn của chính hai bạn.
            </p>
            <a
              href={siteConfig.contact.zaloHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline mt-8 shadow-sm hover:shadow-md"
              data-track="click_zalo"
              data-track-location="about"
            >
              Trò chuyện cùng Tùng
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
