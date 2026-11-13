import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import { useHomeMotion } from "@/components/HomeMotion";
import KakaoQr from "@/components/KakaoQr";
import { useDesktopPointer } from "@/hooks/useMediaQuery";
import { trackConversion } from "@/lib/analytics";
import {
  BUSINESS_HOURS,
  KAKAO_CHANNEL_URL,
  PHONE_DISPLAY,
  PHONE_HREF,
  PRICE_ANCHOR,
  QUOTE_PATH,
  onPhoneLinkClick,
} from "@/lib/contact";

// PC 홈 맨 아래 문의 밴드. PC에는 전화 앱이 없으니 번호를 글자로 보여주고(누르면 복사),
// 카톡은 휴대폰으로 QR을 찍어 열게 한다. 둘 다 번거로운 분을 위해 웹 견적 신청도 둔다.
export default function HomeFinalCta() {
  const { reveal } = useHomeMotion();
  const desktopPointer = useDesktopPointer();

  return (
    <section data-nav-theme="dark" className="bg-primary py-14 text-white md:py-20">
      <div className="container max-w-5xl">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
          <motion.div {...reveal()} className="text-center lg:text-left">
            <p className="mb-3 text-xs font-extrabold tracking-[0.3em] text-white/80">CONTACT</p>
            <h2 className="font-['GmarketSans'] break-keep text-3xl font-extrabold leading-tight md:text-4xl">
              건물 주소만 보내주세요.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl break-keep text-base font-semibold leading-relaxed text-white/85 md:text-lg lg:mx-0">
              확인 후 방문견적을 안내드립니다. 방문 견적은 무료이고, {PRICE_ANCHOR}입니다.
            </p>

            <motion.div {...reveal(0.14, 16)} className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <a
                href={KAKAO_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackConversion("kakao_click", { location: "home_final_cta", label: "카카오톡으로 사진 보내기" })}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#FEE500] px-6 py-3.5 text-sm font-extrabold text-[#191919] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#F4DC00]"
              >
                <MessageCircle className="h-5 w-5" />
                카카오톡으로 사진 보내기
              </a>
              <a
                href={PHONE_HREF}
                onClick={(event) => {
                  trackConversion("phone_click", { location: "home_final_cta", label: desktopPointer ? "번호 복사" : "전화" });
                  onPhoneLinkClick(event);
                }}
                title={desktopPointer ? "누르면 전화번호가 복사됩니다" : undefined}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-extrabold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                <Phone className="h-5 w-5" />
                <span className="tabular-nums tracking-wide">{PHONE_DISPLAY}</span>
              </a>
              <Link
                href={QUOTE_PATH}
                onClick={() => trackConversion("cta_click", { location: "home_final_cta", label: "1분 견적 신청" })}
                className="inline-flex min-h-14 items-center justify-center gap-1.5 px-2 text-sm font-bold text-white/85 underline decoration-white/35 underline-offset-4 transition hover:text-white hover:decoration-white"
              >
                1분 견적 신청
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
            <p className="mt-4 text-sm font-medium text-white/75">{BUSINESS_HOURS} · 견적 후 영업 전화는 드리지 않습니다</p>
          </motion.div>

          {/* PC: 휴대폰 카메라로 찍으면 로그인 없이 카톡 상담창이 열린다 */}
          <motion.div
            {...reveal(0.2, 16)}
            className="mx-auto hidden w-max items-center gap-5 rounded-2xl bg-white p-5 text-foreground shadow-[0_24px_60px_rgba(2,6,23,0.25)] lg:flex"
          >
            <div className="rounded-xl bg-white p-1 text-slate-900">
              <KakaoQr className="h-28 w-28" />
            </div>
            <div className="max-w-[11.5rem]">
              <p className="font-['GmarketSans'] text-base font-bold leading-snug">
                휴대폰으로 찍으면
                <br />
                카톡 상담이 열려요
              </p>
              <p className="mt-2 text-xs font-medium leading-relaxed text-slate-500">
                카메라 앱으로 QR을 비추고, 계단 사진과 주소를 보내주세요.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
