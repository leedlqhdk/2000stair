import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, MapPin } from "lucide-react";
import { Link } from "wouter";
import { trackConversion } from "@/lib/analytics";
import VisitorCounter from "@/components/VisitorCounter";
import DesktopHomeConcerns from "@/components/DesktopHomeConcerns";

interface HeroSectionProps {
  isAuthenticated: boolean;
  onConcernsComplete?: () => void;
}

const KAKAO_CHANNEL_URL = "https://pf.kakao.com/_IiNfn/chat";

const areaSectionItems = [
  { src: "/images/icheon-sindun-stair-cleaning.webp", title: "신둔면", subtitle: "공동현관 관리", slug: "sindun" },
  { src: "/images/icheon-bubal-store-cleaning.webp", title: "부발읍", subtitle: "상가 공용부 관리", slug: "bubal" },
  { src: "/images/icheon-downtown-stair-cleaning.webp", title: "창전동", subtitle: "계단 · 복도 관리", slug: "changjeon" },
  { src: "/images/icheon-majang-villa-cleaning.webp", title: "마장면", subtitle: "빌라 정기관리", slug: "majang" },
  { src: "/images/icheon-gwango-building-cleaning.webp", title: "관고동", subtitle: "건물 공용부 관리", slug: "gwango" },
  { src: "/images/before-after/stair-railing-after.webp", title: "중리동", subtitle: "현관 · 복도 관리", slug: "jungni" },
];

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
                이천 건물
                <br />
                <motion.span
                  className="inline-block font-bold text-primary"
                  initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.9, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
                >
                  정기 청소관리
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
              계단청소 · 사무실청소 · 화장실청소 · 유리청소
              <br />
              주소만 보내주시면 빠르게 안내드립니다.
            </motion.p>

            <div className="mt-5 flex max-w-md flex-col gap-3 sm:mt-6 sm:flex-row sm:flex-wrap">
              <a
                href={KAKAO_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackConversion("kakao_click", { location: "home_hero", label: "카톡으로 주소 보내기" })}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-primary/25 transition hover:-translate-y-0.5 sm:w-auto"
              >
                카톡으로 주소 보내기
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/quote"
                onClick={() => trackConversion("quote_form_view", { location: "home_hero", label: "법인 견적 폼 보기" })}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/20 bg-white px-5 py-3 text-sm font-extrabold text-primary shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-50 sm:w-auto"
              >
                무료 견적 폼 보기
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-4 grid max-w-xl grid-cols-2 gap-x-6 gap-y-2">
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

          <div className="overflow-hidden border-y border-blue-100/60 bg-[#f4f8ff] py-9 md:py-12">
            <div className="container max-w-7xl">
              <div className="grid items-center gap-5 lg:grid-cols-[0.25fr_0.75fr] lg:gap-7">
                <motion.div
                  initial={{ opacity: 0, x: -18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-extrabold tracking-[0.16em] text-primary md:text-sm">
                    <MapPin className="h-4 w-4 text-primary stroke-[3]" />
                    MAP
                  </p>

                  <h2 className="mb-3 text-2xl font-extrabold leading-tight text-foreground md:text-3xl">
                    실제 관리 지역
                  </h2>

                  <p className="max-w-xs text-sm leading-relaxed text-gray-600 line-clamp-2 md:text-base md:line-clamp-none">
                    이천 북부 지역을 부부가 직접 관리합니다.
                  </p>
                </motion.div>

                <div className="relative overflow-hidden pb-3 pt-1 md:pb-2 md:pt-0">
                  <div className="flex w-max gap-3 md:gap-4" style={{ animation: "slideLeft 26s linear infinite" }}>
                    {[...areaSectionItems, ...areaSectionItems].map((item, index) => (
                      <motion.div
                        key={`${item.src}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: (index % areaSectionItems.length) * 0.04 }}
                      >
                        <div className="relative block h-48 w-40 overflow-hidden rounded-xl border border-white/70 bg-white shadow-[0_4px_12px_rgba(15,23,42,0.08)] md:h-52 md:w-44">
                          <img
                            src={item.src}
                            alt={`${item.title} 관리 현장`}
                            className="h-full w-full scale-[1.22] object-cover object-[center_96%] brightness-[1.05] contrast-[0.96] saturate-[0.88]"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-[#f5f9ff]/10" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/64 via-black/10 to-white/6" />
                          <div className="absolute bottom-0 left-0 right-0 p-2.5 text-white">
                            <MapPin className="mb-1 h-4 w-4 text-white drop-shadow" />
                            <h3 className="text-sm font-extrabold leading-tight md:text-base">
                              {item.title}
                            </h3>
                            <p className="mt-0.5 text-[0.62rem] font-semibold text-white/78 md:text-xs">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
