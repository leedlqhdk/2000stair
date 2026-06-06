import {
  ChevronDown,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Youtube,
} from "lucide-react";
import { motion } from "framer-motion";

const serviceLinks = [
  { href: "/#how-it-works", label: "상담 절차" },
  { href: "/#box-preview", label: "관리 방식" },
  { href: "/#gallery", label: "청소 전후" },
  { href: "/#pricing", label: "청소 비용" },
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
    <footer id="site-footer" className="bg-foreground py-8 text-white md:py-20">
      <motion.div
        className="container max-w-7xl"
        initial={{ opacity: 0, y: 34 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="md:hidden">
          <div className="flex items-start justify-between gap-4">
            <div>
              <a href="/" className="inline-flex" aria-label="이천계단지기 홈으로 이동">
                <img
                  src="/images/icheon-logo-white.png"
                  alt="이천계단지기"
                  className="h-8 w-auto max-w-[156px] object-contain"
                />
              </a>
              <p className="mt-2 max-w-[210px] text-xs leading-5 text-white/56">
                이천 빌라·상가 공용공간을 부부가 직접 관리합니다.
              </p>
            </div>

            <div className="flex shrink-0 gap-1.5">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative flex h-8 w-8 items-center justify-center rounded-md bg-white/8 transition-colors before:absolute before:-inset-1.5 before:content-[''] hover:bg-white/14 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/45 focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
                    aria-label={social.label}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="mt-5">
            <ContactCard compact />
          </div>

          <div className="mt-3 border-b border-white/10">
            <MobileLinkGroup title="서비스 바로가기" links={serviceLinks} />
            <MobileLinkGroup title="후기와 채널" links={archiveLinks} />
          </div>

          <div className="mt-4 space-y-1 text-[11px] leading-5 text-white/38">
            <p>© {new Date().getFullYear()} 이천계단지기. All rights reserved.</p>
            <p>사업자등록번호 234-23-02318 · 이천 계단청소 정기관리</p>
          </div>
        </div>

        <div className="hidden gap-10 md:grid lg:grid-cols-[1.2fr_0.78fr_0.78fr_0.9fr] lg:gap-12">
          <div>
            <a href="/" className="group mb-5 inline-flex items-center" aria-label="이천계단지기 홈으로 이동">
              <img
                src="/images/icheon-logo-white.png"
                alt="이천계단지기"
                className="h-10 w-auto max-w-[220px] object-contain md:h-11"
              />
            </a>

            <p className="mb-6 max-w-sm text-sm leading-relaxed text-white/65">
              이천 빌라·상가 공용공간을 부부가 직접 관리합니다.
            </p>

            <div className="space-y-2.5 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" />
                경기도 이천시 경충대로3160번길 21
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-[1.45rem] font-bold tracking-tight text-white">Service</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="transition-colors hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[1.45rem] font-bold tracking-tight text-white">Archive</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              {archiveLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="transition-colors hover:text-white"
                    {...linkTarget(link.external)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <ContactCard />

            <div className="flex gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 transition-colors hover:bg-white/15"
                    aria-label={social.label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}

              <a
                href="https://blog.naver.com/icheonstair"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-xs font-bold transition-colors hover:bg-white/15"
                aria-label="Naver Blog"
              >
                B
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 hidden flex-col items-start justify-between gap-3 border-t border-white/10 pt-8 md:flex md:flex-row md:items-center">
          <p className="text-sm text-white/45">
            © {new Date().getFullYear()} 이천계단지기. All rights reserved.
          </p>

          <p className="text-sm text-white/45">
            사업자등록번호 234-23-02318 · 이천 계단청소 정기관리
          </p>
        </div>
      </motion.div>
    </footer>
  );
}
