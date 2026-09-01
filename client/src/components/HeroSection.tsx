import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Link } from "wouter";
import VisitorCounter from "@/components/VisitorCounter";
import { trackConversion } from "@/lib/analytics";

interface HeroSectionProps {
  isAuthenticated: boolean;
}

const heroBadges = ["하청 없이 부부가 직접", "무료 방문 견적", "세금계산서 발행", "계약서 제공"];

export default function HeroSection({ isAuthenticated }: HeroSectionProps) {
  void isAuthenticated;

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="container max-w-6xl pb-8 pt-6 sm:pt-7 md:pb-10 md:pt-9">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-8 lg:gap-10">
          <motion.div
            className="min-w-0 pt-3 text-left sm:pt-4 md:pt-0"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 md:block">
              <h1 className="mb-3 min-w-0 flex-1 font-['GmarketSans'] text-[clamp(2.15rem,5.2vw,4.45rem)] font-medium leading-[1.08] tracking-[0.02em] text-foreground sm:mb-4 md:mb-5 md:text-[clamp(2.5rem,4.8vw,4.2rem)]">
                이천 계단청소
                <br />
                <motion.span
                  className="inline-block font-bold text-primary"
                  initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.9, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
                >
                  부부가 직접
                </motion.span>
                <br />
                관리합니다
              </h1>
              <div className="w-[45%] shrink-0 md:hidden">
                <img
                  src="/images/main-phone.webp"
                  alt="카카오톡으로 계단 주소를 보내는 상담 화면"
                  className="w-full object-contain"
                />
              </div>
            </div>

            <motion.p
              className="text-[clamp(0.95rem,2vw,1.22rem)] font-semibold leading-relaxed text-gray-700"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              이천 계단청소 비용·범위·관리주기 | 이천계단지기
            </motion.p>

            <div className="mt-5 grid max-w-xl grid-cols-2 gap-x-6 gap-y-2">
              {heroBadges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground sm:text-sm"
                >
                  <Check className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
                  {badge}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative mx-auto hidden w-full md:block"
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href="/about"
              aria-label="이천계단지기 부부 소개 페이지 보기"
              onClick={() =>
                trackConversion("cta_click", {
                  location: "desktop_hero",
                  label: "부부사진 → 소개 페이지",
                })
              }
              className="group relative mx-auto block aspect-[4/5] max-h-[520px] w-full max-w-[430px] overflow-hidden rounded-[1.75rem] bg-slate-100 shadow-[0_24px_60px_rgba(15,23,42,0.14)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_64px_rgba(15,23,42,0.18)] active:scale-[0.99]"
            >
              <img
                src="/images/couple-profile.jpg"
                alt="하청 없이 직접 관리하는 이천계단지기 부부"
                className="h-full w-full object-cover object-[50%_42%]"
              />
              <span className="absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/60 px-3 py-1.5 text-xs font-extrabold text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                소개 보기
                <span aria-hidden="true">→</span>
              </span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* 방문자 수 신뢰 바 (PC 전용 — 모바일은 MobileHome 히어로에 표시) */}
      <motion.div
        className="border-t border-blue-100/60 bg-white py-3.5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="container flex max-w-6xl justify-center">
          <VisitorCounter />
        </div>
      </motion.div>
    </section>
  );
}
