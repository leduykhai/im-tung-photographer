import Image from "next/image";
import Link from "next/link";
import { OpenConsultationButton } from "@/components/consult/OpenConsultationButton";
import { homeImages } from "@/data/albums";

export function HeroSection() {
  const hero = homeImages.hero;
  return (
    <section
      aria-labelledby="hero-title"
      className="on-dark relative isolate flex min-h-[34rem] items-center overflow-hidden bg-ink text-white md:min-h-[38rem] lg:min-h-[42rem]"
    >
      <Image
        src={hero.src}
        alt={hero.alt}
        fill
        priority
        quality={85}
        sizes="100vw"
        className="-z-20 object-cover object-[65%_35%] md:object-[68%_38%] animate-ambient-zoom"
      />
      {/* Overlay nhẹ trung tính để chữ luôn dễ đọc */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[#1c1815]/45 md:bg-transparent md:[background-image:linear-gradient(90deg,rgb(28_24_21/0.68)_0%,rgb(28_24_21/0.4)_42%,rgb(28_24_21/0.05)_78%)]"
      />

      <div className="container-site pt-[calc(var(--header-h)+2rem)] pb-12 sm:pt-[calc(var(--header-h)+3rem)] sm:pb-16">
        <div className="max-w-xl">
          <p className="animate-rise-in text-[0.8125rem] font-semibold tracking-[0.24em] text-white/80 uppercase">
            Album cưới &amp; Phóng sự cưới
          </p>
          <h1 className="animate-rise-in mt-4 text-[2.4rem] leading-[1.08] [animation-delay:100ms] sm:text-5xl lg:text-6xl">
            <span className="block">Ngày của hai bạn.</span>
            <span className="block">Câu chuyện qua từng khung hình.</span>
          </h1>
          <p className="animate-rise-in mt-5 max-w-md text-base leading-relaxed text-white/90 [animation-delay:200ms] sm:text-lg">
            Lưu giữ những khoảnh khắc tự nhiên, những cái ôm và ánh nhìn để mỗi lần xem
            lại, cảm xúc ngày cưới vẫn còn nguyên.
          </p>
          <div className="animate-rise-in mt-7 flex flex-col gap-3 [animation-delay:300ms] min-[26rem]:flex-row">
            <Link href="/#albums" className="btn btn-light shadow-md hover:shadow-xl">
              Khám phá album
            </Link>
            <OpenConsultationButton location="dialog-hero" className="btn btn-ghost-light">
              Nhận tư vấn
            </OpenConsultationButton>
          </div>
        </div>
      </div>
    </section>
  );
}
