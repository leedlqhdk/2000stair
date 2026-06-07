import {
  ChevronDown,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
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

const contactItems = [
  {
    href: "https://pf.kakao.com/_IiNfn/chat",
    label: "카톡 상담",
    value: "카톡 상담을 먼저 시작하기",
    icon: MessageCircle,
    external: true,
  },
  {
    href: "tel:01084381887",
    label: "전화 문의",
    value: "010-8438-1887",
    icon: Phone,
  },
  {
    href: "mailto:rbska3308@naver.com",
    label: "이메일",
    value: "rbska3308@naver.com",
    icon: Mail,
  },
];

function linkTarget(external?: boolean) {
  return external ? { target: "_blank", rel: "noopener noreferrer" } : {};
}

function MobileLinkGroup({
  title,
  links,
}: {
  title: string;
  links: Array<{ href: string; label: string; external?: boolean }>;
}) {
  return (
    <details className="group border-t border-white/10 py-1.5">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-xs font-bold text-white/90 [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="h-3.5 w-3.5 text-white/38 transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-2 grid grid-cols-2 gap-1.5 text-xs text-white/58">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="flex min-h-10 items-center rounded-md bg-white/[0.045] px-2.5 py-1.5 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/45 focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
            {...linkTarget(link.external)}
          >
            {link.label}
          </a>
        ))}
      </div>
    </details>
  );
}

function ContactCard({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 shadow-[0_16px_36px_rgba(0,0,0,0.18)]">
        <h4 className="text-lg font-extrabold tracking-tight text-white">Contact</h4>
        <div className="mt-3 border-t border-white/10">
          {contactItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                className={`flex min-h-14 items-center gap-3 py-3 transition-colors hover:text-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/45 focus-visible:ring-offset-2 focus-visible:ring-offset-foreground ${
                  index !== contactItems.length - 1 ? "border-b border-white/10" : ""
                }`}
                aria-label={`${item.label}: ${item.value}`}
                {...linkTarget(item.external)}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.045] text-white ring-1 ring-white/8">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-extrabold text-white">{item.label}</p>
                  <p className="mt-0.5 break-words text-xs leading-5 text-white/52">{item.value}</p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h4 className="mb-4 text-[1.45rem] font-bold tracking-tight text-white">Contact</h4>
      <div className="border-t border-white/10">
        {contactItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <a
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3.5 py-3.5 transition-colors hover:text-white/90 ${
                index !== contactItems.length - 1 ? "border-b border-white/10" : ""
              }`}
              {...linkTarget(item.external)}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[1rem] bg-white/[0.04] text-white ring-1 ring-white/8">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white">{item.label}</p>
                <p className="mt-0.5 text-sm leading-5 text-white/58">{item.value}</p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer id="site-footer" className="bg-[#1B2F57] text-white">
      <div className="border-b border-white/10">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between md:py-10">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">궁금한 점이 있으신가요?</h2>
            <p className="mt-1 text-sm text-white/60">건물 사진 한 장이면 관리 범위와 비용을 빠르게 안내드립니다.</p>
          </div>
          <a
            href="https://pf.kakao.com/_IiNfn/chat"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-yellow-400 px-6 py-3 text-sm font-extrabold text-gray-900 transition hover:bg-yellow-300"
          >
            <MessageCircle className="h-4 w-4" />
            카톡으로 사진 보내기
          </a>
        </div>
      </div>

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
              이천 빌라·상가의 공용공간을<br />부부가 직접 방문해 꾸준히 관리합니다.
            </p>
            <p className="mt-3 flex items-start gap-1.5 text-xs text-white/45">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              경기도 이천시 경충대로3160번길 21
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-white/40">서비스</h3>
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
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-white/40">둘러보기</h3>
            <ul className="space-y-2.5">
              {archiveLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-white/65 transition hover:text-white" {...linkTarget(link.external)}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-white/40">문의처</h3>
            <div className="space-y-3">
              <div>
                <p className="text-[11px] text-white/40">전화 문의</p>
                <a href="tel:01084381887" className="mt-0.5 flex items-center gap-1.5 text-lg font-extrabold tracking-tight text-white hover:text-white/80">
                  <Phone className="h-4 w-4" />
                  010-8438-1887
                </a>
              </div>
              <a href="mailto:rbska3308@naver.com" className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white">
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

      <div className="hidden md:block">
        <div className="container mx-auto px-4 pb-4">
          <div className="grid grid-cols-2 gap-3">
            <MobileLinkGroup title="서비스" links={serviceLinks} />
            <ContactCard compact />
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
