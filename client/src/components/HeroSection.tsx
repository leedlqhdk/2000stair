import { HOME_EASE, useHomeMotion } from "@/components/HomeMotion";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Check, MessageCircle, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import VisitorCounter from "@/components/VisitorCounter";
import { notifyFloatingQuietChange } from "@/lib/floatingQuiet";
import { trackConversion } from "@/lib/analytics";

interface HeroSectionProps {
  isAuthenticated: boolean;
}

const KAKAO_CHANNEL_URL = "https://pf.kakao.com/_IiNfn/chat";
const PHONE_NUMBER = "01084381887";

const heroBadges = ["무료 방문 견적", "초도청소 전후 사진", "세금계산서 발행", "계약서 제공"];

// 스크롤에 따라 강조가 옮겨가는 세 문장과, 문장마다 바뀌는 오른쪽 사진
const heroSteps = [
  {
    line: "이천 계단청소 전문업체",
    image: "/images/hero-pin-1.webp",
    width: 864,
    height: 1080,
    alt: "이천 빌라 계단 난간을 직접 청소하는 이천계단지기",
  },
  {
    line: "빌라·상가·원룸 정기관리",
    image: "/images/hero-pin-2.webp",
    width: 960,
    height: 1200,
    alt: "이천 빌라 공용 복도를 정기 청소하는 이천계단지기",
  },
  {
    line: "하청 없이 부부가 직접 방문",
    image: "/images/hero-pin-3.webp",
    width: 960,
    height: 1200,
    alt: "하청 없이 직접 방문해 관리하는 이천계단지기 부부",
  },
];

// 화면 높이가 이보다 낮으면(가로로 눕힌 태블릿 등) 고정하지 않고 일반 히어로로 보여준다
const PIN_QUERY = "(min-height: 640px)";

// 데스크톱 첫 화면: 화면 한 장 분량만큼 고정된 채 스크롤에 따라 세 문장의 강조와 사진이 바뀐다.
export default function HeroSection({ isAuthenticated }: HeroSectionProps) {
  void isAuthenticated;
  const { reduced } = useHomeMotion();
  const trackRef = useRef<HTMLElement>(null);
  const [tallEnough, setTallEnough] = useState(() => window.matchMedia(PIN_QUERY).matches);
  const [step, setStep] = useState(0);
  const pinned = !reduced && tallEnough;
  const activeStep = pinned ? step : 0;

  useEffect(() => {
    const query = window.matchMedia(PIN_QUERY);
    const update = () => setTallEnough(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // 첫 화면이 그려지거나 고정 여부가 바뀌면 오른쪽 아래 상담 버튼이 다시 확인하도록 알린다
  useEffect(() => {
    notifyFloatingQuietChange();
  }, [pinned]);

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = value < 0.3 ? 0 : value < 0.65 ? 1 : 2;
    setStep((prev) => (prev === next ? prev : next));
  });

  // 지금 문장은 파란색, 지나온 문장은 진하게, 아직 안 온 문장은 연하게
  const lineColor = (index: number) => {
    if (!pinned) return index === 0 ? "text-primary" : "text-foreground";
    if (index === step) return "text-primary";
    return index < step ? "text-foreground" : "text-slate-300";
  };

  return (
    <section
      ref={trackRef}
      // 첫 화면에는 상담 버튼이 이미 있으므로, 오른쪽 아래 상담 버튼은 아이콘으로 줄여 사진을 가리지 않게 한다
      data-floating-quiet
      className="relative bg-white"
      style={pinned ? { height: "calc(200svh - 3.5rem)" } : undefined}
    >
      <div className={`flex flex-col ${pinned ? "sticky top-14 h-[calc(100svh-3.5rem)]" : ""}`}>
        <div className="container flex max-w-6xl flex-1 items-center py-8 lg:py-10">
          <div className="grid w-full grid-cols-[minmax(0,1.18fr)_minmax(0,0.82fr)] items-center gap-10 lg:gap-14">
            <div className="min-w-0">
              <div className="flex gap-5 lg:gap-7">
                {pinned && (
                  <div aria-hidden="true" className="relative w-[3px] shrink-0 overflow-hidden rounded-full bg-slate-100">
                    <motion.div className="absolute inset-0 origin-top rounded-full bg-primary" style={{ scaleY: scrollYProgress }} />
                  </div>
                )}

                <div className="min-w-0">
                  {heroSteps.map((item, index) => {
                    const Tag = index === 0 ? "h1" : "p";
                    return (
                      <Tag
                        key={item.line}
                        className={`overflow-hidden break-keep py-[0.06em] font-['GmarketSans'] text-[clamp(1.6rem,3.7vw,2.75rem)] font-bold leading-[1.24] transition-colors duration-500 ${lineColor(index)}`}
                      >
                        <motion.span
                          className="block"
                          initial={reduced ? false : { y: "105%" }}
                          animate={{ y: "0%" }}
                          transition={{ duration: 0.8, delay: 0.1 + index * 0.09, ease: HOME_EASE }}
                        >
                          {item.line}
                        </motion.span>
                      </Tag>
                    );
                  })}
                </div>
              </div>

              <motion.div
                initial={reduced ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: HOME_EASE }}
              >
                <p className="mt-6 max-w-xl text-sm font-semibold leading-relaxed text-muted-foreground lg:mt-7 lg:text-base">
                  주소와 건물 사진을 보내주시면 관리 범위와 방문 가능 여부를 안내해드립니다.
                </p>

                <div className="mt-6 flex max-w-xl flex-col gap-3 xl:flex-row">
                  <a
                    href={KAKAO_CHANNEL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackConversion("kakao_click", {
                        location: "desktop_hero",
                        label: "주소·사진 보내고 무료 견적받기",
                      })
                    }
                    className="inline-flex min-h-14 flex-[1.35] items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90"
                  >
                    <MessageCircle className="h-5 w-5 shrink-0" />
                    주소·사진 보내고 무료 견적받기
                  </a>
                  <a
                    href={`tel:${PHONE_NUMBER}`}
                    onClick={() =>
                      trackConversion("phone_click", {
                        location: "desktop_hero",
                        label: "전화로 방문견적 문의",
                      })
                    }
                    className="inline-flex min-h-14 flex-1 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-5 py-3.5 text-sm font-extrabold text-foreground transition hover:-translate-y-0.5 hover:bg-blue-50"
                  >
                    <Phone className="h-5 w-5 shrink-0 text-primary" />
                    전화로 방문견적 문의
                  </a>
                </div>

                <div className="mt-5 grid max-w-xl grid-cols-2 gap-x-6 gap-y-2">
                  {heroBadges.map((badge) => (
                    <span key={badge} className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
                      <Check className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
                      {badge}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>

            <Link
              href="/about"
              aria-label="이천계단지기 부부 소개 페이지 보기"
              onClick={() =>
                trackConversion("cta_click", {
                  location: "desktop_hero",
                  label: "히어로 사진 → 소개 페이지",
                })
              }
              className="group relative mx-auto block aspect-[4/5] h-[min(50svh,460px)] max-w-full overflow-hidden rounded-[1.75rem] bg-slate-100 shadow-[0_24px_60px_rgba(15,23,42,0.14)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_64px_rgba(15,23,42,0.18)] lg:h-[min(62svh,560px)]"
            >
              {heroSteps.map((item, index) => (
                // 다음 사진은 아래에서 위로 차오르고, 되돌아가면 아래로 걷힌다
                <div
                  key={item.image}
                  className="absolute inset-0 transition-[clip-path] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                  style={{ clipPath: index <= activeStep ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)" }}
                >
                  <img
                    src={item.image}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "low"}
                    decoding="async"
                    className={`h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                      index === activeStep ? "scale-100" : "scale-[1.06]"
                    }`}
                  />
                </div>
              ))}

              <span className="absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/60 px-3 py-1.5 text-xs font-extrabold text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                소개 보기
                <span aria-hidden="true">→</span>
              </span>
            </Link>
          </div>
        </div>

        {/* 방문자 수 신뢰 바 (PC 전용 — 모바일은 MobileHome 히어로에 표시) */}
        <div className="border-t border-blue-100/60 bg-white py-3.5">
          <div className="container flex max-w-6xl justify-center">
            <VisitorCounter />
          </div>
        </div>
      </div>
    </section>
  );
}
