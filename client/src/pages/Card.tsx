import { useEffect } from "react";
import { Link } from "wouter";
import { Check, Globe, Instagram, MapPin, MessageCircle, Phone, Youtube } from "lucide-react";
import { trackConversion } from "@/lib/analytics";

const PHONE_NUMBER = "010-8438-1887";
const KAKAO_CHANNEL_URL = "https://pf.kakao.com/_IiNfn/chat";
const BLOG_URL = "https://blog.naver.com/icheonstair";
const INSTAGRAM_URL = "https://www.instagram.com/2000stair?igsh=MW9icHh5Nmg4YW01Mw==";
const YOUTUBE_URL = "https://youtube.com/@2000stair?si=UxYmvQPywQSOj3DU";
const NAVER_PLACE_URL = "https://map.naver.com/p/entry/place/2097250452";

const services = [
  { label: "계단청소", href: "/services/stair" },
  { label: "유리청소", href: "/services/glass" },
  { label: "화장실청소", href: "/services/bathroom" },
];

const trustPoints = ["대표 직접 관리", "하청·용역 미사용", "초도청소 후 청소 전후 사진 제공", "세금계산서 발행"];

const socials = [
  { label: "전화", href: `tel:${PHONE_NUMBER.replace(/-/g, "")}`, icon: Phone, external: false },
  { label: "카카오톡", href: KAKAO_CHANNEL_URL, icon: MessageCircle, external: true },
  { label: "인스타그램", href: INSTAGRAM_URL, icon: Instagram, external: true },
  { label: "네이버 플레이스", href: NAVER_PLACE_URL, icon: MapPin, external: true },
  { label: "유튜브", href: YOUTUBE_URL, icon: Youtube, external: true },
];

export default function Card() {
  useEffect(() => {
    const prev = document.title;
    document.title = "이천계단지기 디지털 명함 | 김규남 대표";
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#2a3f86] via-[#233571] to-[#1b2f57] px-5 pb-12 pt-10 text-white">
      <div className="mx-auto flex w-full max-w-[420px] flex-col items-center">
        {/* 프로필 */}
        <div className="relative">
          <img
            src="/images/husband-profile-main.webp"
            alt="이천계단지기 대표 김규남"
            className="h-28 w-28 rounded-full border-[3px] border-white/90 bg-white object-cover object-[center_16%] shadow-xl shadow-black/20"
            loading="eager"
          />
        </div>
        <h1 className="mt-4 font-['GmarketSans'] text-2xl font-extrabold tracking-tight">
          김규남 <span className="mx-0.5 font-bold text-white/50">｜</span> 대표
        </h1>
        <p className="mt-2 text-sm font-semibold text-white/75">계단청소 · 유리청소 · 화장실청소</p>
        <p className="mt-1 text-xs font-bold tracking-[0.28em] text-white/45">ICHEON STAIR</p>

        {/* 메인 버튼 */}
        <div className="mt-7 flex w-full flex-col gap-3">
          <a
            href={`tel:${PHONE_NUMBER.replace(/-/g, "")}`}
            onClick={() => trackConversion("phone_click", { location: "digital_card", label: "전화하기" })}
            className="flex h-[58px] items-center gap-3 rounded-2xl bg-white px-5 text-[#1b2f57] shadow-lg shadow-black/10 transition active:scale-[0.99]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1b2f57] text-white">
              <Phone className="h-[18px] w-[18px]" />
            </span>
            <span className="flex-1 text-[15px] font-extrabold">전화하기</span>
            <span className="text-[13px] font-bold text-[#1b2f57]/60">{PHONE_NUMBER}</span>
          </a>

          <a
            href={KAKAO_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackConversion("kakao_click", { location: "digital_card", label: "카카오톡 상담" })}
            className="flex h-[58px] items-center gap-3 rounded-2xl bg-[#FEE500] px-5 text-[#191600] shadow-lg shadow-black/10 transition active:scale-[0.99]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#191600]/10 text-[#191600]">
              <MessageCircle className="h-[18px] w-[18px]" />
            </span>
            <span className="flex-1 text-[15px] font-extrabold">카카오톡 상담</span>
          </a>

          <Link
            href="/"
            onClick={() => trackConversion("cta_click", { location: "digital_card", label: "홈페이지 방문" })}
            className="flex h-[58px] items-center gap-3 rounded-2xl border border-white/25 bg-white/10 px-5 text-white shadow-lg shadow-black/10 backdrop-blur transition active:scale-[0.99]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white">
              <Globe className="h-[18px] w-[18px]" />
            </span>
            <span className="flex-1 text-[15px] font-extrabold">홈페이지 방문</span>
            <span className="text-[13px] font-bold text-white/55">2000stair.kr</span>
          </Link>
        </div>

        {/* 서비스 */}
        <div className="mt-7 w-full">
          <p className="mb-2.5 text-center text-[11px] font-extrabold tracking-[0.22em] text-white/45">SERVICE</p>
          <div className="flex gap-2">
            {services.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="flex-1 rounded-xl border border-white/15 bg-white/10 py-3 text-center text-[13px] font-bold text-white transition active:scale-[0.97]"
              >
                {service.label}
              </Link>
            ))}
          </div>
        </div>

        {/* 신뢰 포인트 */}
        <div className="mt-4 grid w-full grid-cols-2 gap-2.5 rounded-2xl border border-white/15 bg-white/[0.07] p-4">
          {trustPoints.map((point) => (
            <div key={point} className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-[#1b2f57]">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
              <span className="text-[13px] font-semibold text-white/90">{point}</span>
            </div>
          ))}
        </div>

        {/* 소셜 아이콘 */}
        <div className="mt-7 flex items-center gap-3">
          {socials.map(({ label, href, icon: Icon, external }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white/80 ring-1 ring-white/15 transition hover:bg-white/20 hover:text-white"
            >
              <Icon className="h-[18px] w-[18px]" />
            </a>
          ))}
        </div>

        {/* 푸터 */}
        <div className="mt-9 text-center text-[11px] leading-relaxed text-white/40">
          <p>이천계단지기 · 대표 김규남</p>
          <p className="mt-0.5">사업자등록번호 234-23-02318</p>
          <p className="mt-0.5">경기도 이천시 경충대로3160번길 21</p>
        </div>
      </div>
    </div>
  );
}
