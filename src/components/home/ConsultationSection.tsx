import { ConsultationForm } from "@/components/consult/ConsultationForm";
import { MailIcon, PhoneIcon, ZaloIcon, FacebookIcon } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function ConsultationSection() {
  const { contact } = siteConfig;
  const rowClass =
    "group flex min-h-11 items-center gap-3 text-base text-ink transition-all duration-300 hover:text-accent hover:translate-x-1";

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="scroll-mt-(--header-h) py-14 sm:py-16 lg:py-20"
    >
      <div className="container-site grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <ScrollReveal direction="left" delay={60}>
          <div>
            <p className="eyebrow">Liên hệ</p>
            <h2 id="contact-title" className="mt-3 text-[2rem] sm:text-4xl lg:text-5xl">
              Kể Tùng nghe về ngày cưới của bạn
            </h2>
            <p className="mt-5 max-w-md text-base leading-[1.8] text-muted sm:text-lg">
              Để lại một vài thông tin, Tùng sẽ liên hệ để trao đổi về phong cách chụp và
              kế hoạch phù hợp với hai bạn.
            </p>

            <ul className="mt-8 space-y-1 border-t border-line pt-6">
              <li>
                <a
                  href={contact.phoneHref}
                  className={rowClass}
                  data-track="click_phone"
                  data-track-location="contact-section"
                >
                  <PhoneIcon className="shrink-0 text-accent transition-transform duration-300 group-hover:scale-110" />
                  <span>{contact.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={contact.zaloHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={rowClass}
                  data-track="click_zalo"
                  data-track-location="contact-section"
                >
                  <ZaloIcon className="shrink-0 text-accent transition-transform duration-300 group-hover:scale-110" />
                  <span>Nhắn Zalo cho Tùng</span>
                </a>
              </li>
              <li>
                <a href={contact.emailHref} className={rowClass}>
                  <MailIcon className="shrink-0 text-accent transition-transform duration-300 group-hover:scale-110" />
                  <span>{contact.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={contact.facebookHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={rowClass}
                  data-track="click_facebook"
                  data-track-location="contact-section"
                >
                  <FacebookIcon className="shrink-0 text-accent transition-transform duration-300 group-hover:scale-110" />
                  <span>Facebook</span>
                </a>
              </li>
            </ul>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right" delay={120}>
          <div className="border border-line bg-surface p-5 shadow-sm transition-shadow duration-500 hover:shadow-md sm:p-8 lg:p-10">
            <ConsultationForm location="home-section" />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

