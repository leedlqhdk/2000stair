import {
  Instagram,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from "lucide-react";

const serviceLinks = [
  { href: "/services/stair", label: "계단청소" },
  { href: "/services/glass", label: "유리청소" },
  { href: "/services/bathroom", label: "화장실청소" },
  { href: "/services/office", label: "사무실청소" },
];

const archiveLinks = [
  { href: "/areas", label: "관리 가능 지역" },
  {
    href: "https://blog.naver.com/icheonstair",
    label: "네이버 블로그",
    external: true,
  },
  {
    href: "https://www.daangn.com/kr/local-profile/%EC%9D%B4%EC%B2%9C%EA%B3%84%EB%8B%A8%EC%A7%80%EA%B8%B0-umrc7zg26w1h/",
    label: "당근마켓",
    external: true,
  },
  {
    href: "https://youtube.com/@2000stair?si=UxYmvQPywQSOj3DU",
    label: "유튜브 채널",
    external: true,
  },
];

const socialLinks = [
  {
    href: "https://www.instagram.com/icheon_stair/",
    label: "Instagram",
    icon: Instagram,
  },
  {
    href: "https://youtube.com/@2000stair?si=UxYmvQPywQSOj3DU",
    label: "YouTube",
    icon: Youtube,
  },
];

function linkTarget(external?: boolean) {
  return external ? { target: "_blank", rel: "noopener noreferrer" } : {};
}

export default function Footer() {
  return (
    <footer id="site-footer" className="relative z-10 hidden bg-[#1B2F57] text-white md:block">
      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="inline-flex items-center" aria-label="이천계단지기 홈으로 이동">
              <img
                src="/images/icheon-logo-main.png"
                alt="이천계단지기 로고"
                className="h-12 w-auto max-w-[190px] object-contain brightness-0 invert"
              />
            </a>

            <p className="mt-3 text-sm leading-relaxed text-white/55">
              이천 빌라·상가의 공용공간을<br />
              부부가 직접 방문해 꾸준히 관리합니다.
            </p>

            <p className="mt-3 flex items-start gap-1.5 text-xs text-white/45">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              경기도 이천시 경충대로3160번길 21
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-white/40">
              서비스
            </h3>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-white/65 transition hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-white/40">
              둘러보기
            </h3>
            <ul className="space-y-2.5">
              {archiveLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-white/65 transition hover:text-white"
                    {...linkTarget(link.external)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-white/40">
              문의처
            </h3>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-white/50">전화 문의</p>
                <a
                  href="tel:01084381887"
                  className="mt-0.5 flex items-center gap-1.5 whitespace-nowrap text-base font-extrabold tracking-tight text-white hover:text-white/80 md:text-lg"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  010-8438-1887
                </a>
              </div>

              <a
                href="mailto:rbska3308@naver.com"
                className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white"
              >
                <Mail className="h-3.5 w-3.5" />
                rbska3308@naver.com
              </a>
            </div>

            <div className="mt-5 flex gap-2">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto flex flex-col gap-1 px-4 py-5 text-[11px] text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} 이천계단지기. All rights reserved.</p>
          <p>사업자등록번호 234-23-02318 · 대표 김규남</p>
        </div>
      </div>
    </footer>
  );
}
