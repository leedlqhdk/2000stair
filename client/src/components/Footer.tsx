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
  { href: "#how-it-works", label: "상담 절차" },
  { href: "#box-preview", label: "관리 방식" },
  { href: "#gallery", label: "청소 전후" },
  { href: "#pricing", label: "청소 비용" },
];

const archiveLinks = [
  { href: "/areas", label: "관리 가능 지역" },
  { href: "/ops", label: "운영 · 배포 상태" },
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
    label: "카카오톡 상담",
    value: "사진 보내주시면 빠르게 답변드려요",
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
    <details className="group border-t border-white/10 py-3">
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold text-white [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="h-4 w-4 text-white/45 transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-white/60">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="rounded-lg bg-white/[0.06] px-3 py-2 transition-colors hover:bg-white/10 hover:text-white"
            {...linkTarget(link.external)}
          >
            {link.label}
          </a>
        ))}
      </div>
    </details>
  );
}

export default function Footer() {
  return (
    <footer className="bg-foreground text-white py-10 md:py-20">
      <motion.div
        className="container max-w-7xl"
        initial={{ opacity: 0, y: 34 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="md:hidden">
          <div className="flex items-start justify-between gap-5">
            <div>
              <a href="/" className="inline-flex" aria-label="이천계단지기 홈으로 이동">
                <img
                  src="/images/icheon-logo-white.png"
                  alt="이천계단지기"
                  className="h-9 w-auto max-w-[180px] object-contain"
                />
              </a>
              <p className="mt-3 max-w-[220px] text-sm leading-6 text-white/62">
                이천 빌라·상가 공용공간을 부부가 직접 관리합니다.
              </p>
            </div>

            <div className="flex shrink-0 gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 transition-colors hover:bg-white/15"
                    aria-label={social.label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <a
            href="https://pf.kakao.com/_IiNfn/chat"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#FEE500] px-4 text-sm font-extrabold text-[#191919] shadow-sm transition-colors hover:bg-[#F4DC00]"
          >
            <MessageCircle className="h-4 w-4" />
            카톡 상담을 먼저 시작하기
          </a>

          <div className="mt-5 rounded-xl bg-white/[0.06] px-4 py-3 text-sm text-white/68">
            <p className="mb-3 text-xs font-extrabold tracking-[0.18em] text-white/45">CONTACT</p>
            <div className="space-y-3">
              {contactItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-start gap-2.5 hover:text-white"
                    {...linkTarget(item.external)}
                  >
                    <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>
                      <strong className="block text-white">{item.label}</strong>
                      <span>{item.value}</span>
                    </span>
                  </a>
                );
              })}
              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>
                  <strong className="block text-white">방문 주소</strong>
                  <span>경기도 이천시 경충대로3160번길 21</span>
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 border-b border-white/10">
            <MobileLinkGroup title="서비스 바로가기" links={serviceLinks} />
            <MobileLinkGroup title="후기와 채널" links={archiveLinks} />
          </div>

          <div className="mt-5 space-y-1 text-xs leading-5 text-white/42">
            <p>© {new Date().getFullYear()} 이천계단지기. All rights reserved.</p>
            <p>사업자등록번호 234-23-02318 · 이천 계단청소 정기관리</p>
          </div>
        </div>

        <div className="hidden md:grid lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.95fr] gap-10 lg:gap-14">
          <div>
            <a href="/" className="inline-flex items-center mb-5 group" aria-label="이천계단지기 홈으로 이동">
              <img
                src="/images/icheon-logo-white.png"
                alt="이천계단지기"
                className="h-10 md:h-11 w-auto max-w-[220px] object-contain"
              />
            </a>

            <p className="text-white/65 text-sm leading-relaxed max-w-sm mb-6">
              이천 빌라·상가 공용공간을 부부가 직접 관리합니다.
            </p>

            <div className="space-y-2.5 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                경기도 이천시 경충대로3160번길 21
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-white">Service</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-white">Archive</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              {archiveLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="hover:text-white transition-colors"
                    {...linkTarget(link.external)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-white">Contact</h4>
            <div className="flex flex-col gap-3">
              <a
                href="https://pf.kakao.com/_IiNfn/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FEE500] px-4 py-3 text-sm font-bold text-[#191919] transition-colors hover:bg-[#F4DC00]"
              >
                <MessageCircle className="w-4 h-4" />
                카톡 상담을 먼저 시작하기
              </a>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="space-y-3 text-sm text-white/68">
                  {contactItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        className="flex items-start gap-2.5 hover:text-white transition-colors"
                        {...linkTarget(item.external)}
                      >
                        <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>
                          <strong className="block text-white">{item.label}</strong>
                          <span>{item.value}</span>
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.href}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/15 flex items-center justify-center transition-colors"
                      aria-label={social.label}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}

                <a
                  href="https://blog.naver.com/icheonstair"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/15 flex items-center justify-center text-xs font-bold transition-colors"
                  aria-label="Naver Blog"
                >
                  B
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden border-t border-white/10 mt-12 pt-8 md:flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
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
