import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function IntroSection() {
  return (
    <section aria-labelledby="intro-title" className="py-14 sm:py-16 lg:py-20">
      <div className="container-site">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <h2 id="intro-title" className="text-[2rem] sm:text-4xl lg:text-[2.75rem]">
            Những khoảnh khắc thật, dành riêng cho hai bạn.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-[1.8] text-muted sm:text-lg">
            Với I&apos;m Tung Photographer, mỗi album là một câu chuyện được kể bằng cảm
            xúc và những chi tiết nhỏ. Một ánh nhìn, cái nắm tay hay nụ cười bất chợt đều
            có thể trở thành điều bạn muốn giữ lại thật lâu.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
