import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import VisitorCounter from "@/components/VisitorCounter";
import DesktopHomeConcerns from "@/components/DesktopHomeConcerns";

interface HeroSectionProps {
  isAuthenticated: boolean;
  onConcernsComplete?: () => void;
}

const heroBadges = ["하청 없이 부부가 직접", "무료 방문 견적", "세금계산서 발행", "계약서 제공"];

export default function HeroSection({ isAuthenticated, onConcernsComplete }: HeroSectionProps) {
  void isAuthenticated;
  const [concernsDone, setConcernsDone] = useState(false);

  const handleConcernsComplete = () => {
    setConcernsDone(true);
    onConcernsComplete?.();
  };

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
                  정기관리
                </motion.span>
                <br />
                전문입니다
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
              빌라·상가·원룸 계단, 복도, 공동현관을
              <br />
              주소와 사진 기준으로 빠르게 안내드립니다.
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
            <DesktopHomeConcerns onComplete={handleConcernsComplete} />
          </motion.div>
        </div>
      </div>

      <div
        className={`grid transition-[grid-template-rows,opacity] delay-150 duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          concernsDone ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden" key={concernsDone ? "desktop-hero-revealed" : "desktop-hero-hidden"}>
          {/* 방문자 수 신뢰 바 (PC 전용 — 모바일은 MobileHome 히어로에 표시) */}
          <motion.div
            className="border-t border-blue-100/60 bg-white py-3.5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="container flex max-w-6xl justify-center">
              <VisitorCounter />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
