import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Chính sách bảo mật",
  description: `Cách ${siteConfig.name} sử dụng thông tin bạn cung cấp khi đăng ký tư vấn album cưới.`,
  alternates: siteConfig.siteUrl ? { canonical: "/chinh-sach-bao-mat" } : undefined,
};

const sections: Array<{ title: string; body: React.ReactNode }> = [
  {
    title: "1. Thông tin chúng tôi thu thập",
    body: (
      <>
        <p>Khi bạn gửi form “Gửi yêu cầu tư vấn”, chúng tôi lưu những thông tin bạn nhập:</p>
        <ul>
          <li>Họ và tên, số điện thoại (bắt buộc);</li>
          <li>Ngày cưới dự kiến, email, số Zalo, tỉnh/thành, địa điểm tổ chức dự kiến, dịch vụ quan tâm, kênh liên hệ mong muốn và lời nhắn (nếu bạn điền);</li>
          <li>Album bạn đang xem khi gửi yêu cầu (nếu có), trang và vị trí form phát sinh yêu cầu;</li>
          <li>Thông tin nguồn truy cập dạng UTM (source, medium, campaign) nếu đường dẫn có kèm;</li>
          <li>Thời điểm gửi, thời điểm bạn đồng ý để chúng tôi liên hệ và phiên bản chính sách tại thời điểm đó.</li>
        </ul>
        <p>Chúng tôi không yêu cầu địa chỉ nhà chi tiết để nhận tư vấn.</p>
      </>
    ),
  },
  {
    title: "2. Mục đích sử dụng",
    body: (
      <p>
        Thông tin chỉ được dùng để liên hệ, trao đổi và tư vấn về dịch vụ chụp ảnh cưới
        của {siteConfig.name} theo kênh bạn lựa chọn (điện thoại, Zalo hoặc email). Chúng
        tôi không bán thông tin của bạn.
      </p>
    ),
  },
  {
    title: "3. Sự đồng ý của bạn",
    body: (
      <p>
        Ô đồng ý trên form không được tích sẵn. Chúng tôi chỉ tiếp nhận yêu cầu khi bạn
        chủ động tích chọn đồng ý để {siteConfig.name} sử dụng thông tin đã cung cấp để
        liên hệ tư vấn.
      </p>
    ),
  },
  {
    title: "4. Lưu trữ và bảo mật",
    body: (
      <p>
        Thông tin được gửi tới máy chủ của website và lưu vào hệ thống lưu trữ do{" "}
        {siteConfig.name} cấu hình. Chúng tôi áp dụng các biện pháp kỹ thuật hợp lý để hạn
        chế truy cập trái phép, trong đó khoá truy cập hệ thống lưu trữ chỉ được dùng ở
        phía máy chủ.
      </p>
    ),
  },
  {
    title: "5. Chia sẻ thông tin",
    body: (
      <p>
        Chúng tôi không chia sẻ thông tin cá nhân của bạn cho bên thứ ba, ngoại trừ nhà
        cung cấp dịch vụ lưu trữ cần thiết để vận hành form tư vấn hoặc khi pháp luật
        yêu cầu.
      </p>
    ),
  },
  {
    title: "6. Thời gian lưu trữ",
    body: (
      <p>
        Thông tin được lưu trong thời gian cần thiết để tư vấn và trao đổi về dịch vụ,
        hoặc đến khi bạn yêu cầu xoá.
      </p>
    ),
  },
  {
    title: "7. Quyền của bạn",
    body: (
      <p>
        Bạn có thể yêu cầu xem, chỉnh sửa, xoá thông tin hoặc rút lại sự đồng ý bất cứ lúc
        nào bằng cách liên hệ với chúng tôi theo thông tin ở mục 9.
      </p>
    ),
  },
  {
    title: "8. Đo lường truy cập",
    body: (
      <p>
        Website chỉ ghi nhận các sự kiện sử dụng ở mức tổng quát như xem album, bấm gọi
        điện, Zalo, Facebook, mở form hoặc gửi form thành công. Họ tên, số điện thoại,
        email, địa chỉ và lời nhắn của bạn không được gửi vào công cụ đo lường.
      </p>
    ),
  },
  {
    title: "9. Liên hệ về chính sách",
    body: (
      <ul>
        <li>
          Điện thoại:{" "}
          <a href={siteConfig.contact.phoneHref}>{siteConfig.contact.phoneDisplay}</a>
        </li>
        <li>
          Email: <a href={siteConfig.contact.emailHref}>{siteConfig.contact.email}</a>
        </li>
        <li>
          Zalo:{" "}
          <a href={siteConfig.contact.zaloHref} target="_blank" rel="noopener noreferrer">
            zalo.me/0352942502
          </a>
        </li>
      </ul>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <article className="pt-(--header-h)">
      <div className="container-site py-12 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow">Pháp lý</p>
          <h1 className="mt-3 text-[2.5rem] sm:text-5xl">Chính sách bảo mật</h1>
          <p className="mt-4 text-base text-muted">
            Phiên bản {siteConfig.privacyPolicyVersion} · Cập nhật ngày{" "}
            {siteConfig.privacyPolicyUpdatedAt}
          </p>
          <p className="mt-6 text-base leading-[1.85] text-ink sm:text-lg">
            Trang này giải thích cách {siteConfig.name} sử dụng thông tin bạn cung cấp khi
            đăng ký tư vấn album cưới trên website.
          </p>

          <div className="mt-10 space-y-10">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-[1.6rem] sm:text-3xl">{section.title}</h2>
                <div className="policy-prose mt-3 space-y-3 text-base leading-[1.85] text-muted sm:text-[1.0625rem]">
                  {section.body}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-14 border-t border-line pt-8">
            <Link href="/" className="btn btn-outline">
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
