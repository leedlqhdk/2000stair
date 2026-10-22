import { HOME_EASE, useHomeMotion } from "@/components/HomeMotion";
import { motion } from "framer-motion";
import { Check, MessageCircle, Phone } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import VisitorCounter from "@/components/VisitorCounter";
import { notifyFloatingQuietChange } from "@/lib/floatingQuiet";
import { trackConversion } from "@/lib/analytics";

interface HeroSectionProps {
  isAuthenticated: boolean;
}

const KAKAO_CHANNEL_URL = "https://pf.kakao.com/_IiNfn/chat";
const PHONE_NUMBER = "01084381887";

const heroBadges = ["무료 방문 견적", "초도청소 전후 사진", "세금계산서 발행", "계약서 제공"];

// 스크롤하면 한 장면씩 넘어가는 풀스크린 사진과 문구
const heroSlides = [
  {
    title: "이천 계단청소 전문업체",
    text: "주소와 건물 사진을 보내주시면 관리 범위와 방문 가능 여부를 안내해드립니다.",
    image: "/images/hero-full-1",
    // 받은 사진이 가로 2000px이라 2000px까지 (4K 원본을 받으면 2560·3840 추가)
    widths: [1280, 1920, 2000],
    alt: "이천 빌라 계단 난간을 직접 청소하는 이천계단지기",
  },
  {
    title: "빌라·상가·원룸 정기관리",
    text: "현장 상황과 오염 상태를 확인해 관리 범위와 주기를 안내드립니다.",
    image: "/images/hero-full-2",
    widths: [1280, 1920, 2560, 3840],
    alt: "이천 상가 출입문 유리를 청소하는 이천계단지기",
  },
  {
    title: "하청 없이 부부가 직접 방문",
    text: "약속한 일정에 맞춰 부부가 직접 방문해 꾸준히 관리합니다.",
    image: "/images/hero-full-3",
    widths: [1280, 1920, 2560, 3840],
    alt: "청소 장비를 챙겨 직접 방문하는 이천계단지기",
  },
];

// 화면 높이가 이보다 낮으면(가로로 눕힌 태블릿 등) 고정 효과 없이 사진을 차례로 보여준다
const REVEAL_QUERY = "(min-height: 640px)";
// 이 첫 화면은 PC 전용이다. 모바일에서는 숨겨진 채 사진을 내려받지 않도록 사진 자체를 그리지 않는다
const DESKTOP_QUERY = "(min-width: 768px)";
// 투명 상단 바 아래까지 사진이 화면 전체를 채운다
const SLIDE_HEIGHT = "h-svh min-h-[560px]";
// 상담 버튼·배지 묶음의 바닥 여백. 창이 세로로 길어질수록(창을 좁히거나 태블릿을 세로로 세우면)
// 글자·버튼이 화면 맨 아래에 몰리지 않도록 묶음 전체를 위로 올린다. 보통 PC 화면(가로가 세로의 4/3배 이상)은 3rem 그대로다.
const CTA_BOTTOM = "calc(3rem + max(0px, 100svh - 75vw) * 0.35)";
// 장면 문구는 상담 버튼·배지 묶음(실제 높이는 --hero-cta-h) 위로 3.75rem 띄워 서로 겹치지 않게 한다
const TEXT_BOTTOM = `calc(${CTA_BOTTOM} + var(--hero-cta-h, 5.75rem) + 3.75rem)`;

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const list = window.matchMedia(query);
    const update = () => setMatches(list.matches);
    update();
    list.addEventListener("change", update);
    return () => list.removeEventListener("change", update);
  }, [query]);

  return matches;
}

// 데스크톱 첫 화면: 사진은 제자리에 고정되어 있고, 스크롤하면 다음 장면이 아래에서 위로 드러난다.
// 각 장면은 자기 영역만큼만 보이도록 잘라내고(clip-path), 그 안의 사진·문구는 화면에 고정한다.
export default function HeroSection({ isAuthenticated }: HeroSectionProps) {
  void isAuthenticated;
  const { reduced } = useHomeMotion();
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const tallEnough = useMediaQuery(REVEAL_QUERY);
  const reveal = !reduced && tallEnough;
  // 첫 사진(LCP)을 먼저 받고 나서 나머지 두 장을 받는다
  const [restReady, setRestReady] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // 상담 버튼·배지 묶음의 실제 높이를 재서 --hero-cta-h로 넘긴다 (창 너비에 따라 배지가 두 줄이 되어도 문구와 겹치지 않게)
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const cta = ctaRef.current;
    if (!section || !cta) return;
    const update = () => section.style.setProperty("--hero-cta-h", `${cta.offsetHeight}px`);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(cta);
    return () => observer.disconnect();
  }, []);

  // 첫 화면이 그려지거나 효과 여부가 바뀌면 오른쪽 아래 상담 버튼이 다시 확인하도록 알린다
  useEffect(() => {
    notifyFloatingQuietChange();
  }, [reveal]);

  const slideLayer = reveal ? "fixed inset-0" : "absolute inset-0";
  const ctaLayer = reveal ? "fixed inset-0" : `absolute inset-x-0 top-0 ${SLIDE_HEIGHT}`;

  return (
    <div>
      <section
        ref={sectionRef}
        // 첫 화면에는 상담 버튼이 이미 있으므로, 오른쪽 아래 상담 버튼은 아이콘으로 줄여 사진을 가리지 않게 한다
        data-floating-quiet
        // 투명 상단 바가 이 위에서는 흰 로고·흰 버튼으로 바뀐다
        data-nav-theme="dark"
        className="relative bg-slate-950 [clip-path:inset(0)]"
      >
        {heroSlides.map((slide, index) => {
          const TitleTag = index === 0 ? "h1" : "p";
          return (
            <div key={slide.image} className={`relative ${SLIDE_HEIGHT} [clip-path:inset(0)]`}>
              <div className={slideLayer}>
                {isDesktop && (index === 0 || restReady) && (
                  <img
                    src={`${slide.image}-1920.webp`}
                    // 큰 모니터·고해상도 노트북은 2560·3840px, 일반 화면은 1280·1920px를 고른다
                    srcSet={slide.widths.map((width) => `${slide.image}-${width}.webp ${width}w`).join(", ")}
                    sizes="100vw"
                    alt={slide.alt}
                    width={1920}
                    height={1080}
                    // 2·3번 사진은 첫 사진을 받은 뒤에 붙이므로, 붙는 즉시 받아 두어 장면이 바뀔 때 비어 보이지 않게 한다
                    loading="eager"
                    fetchPriority={index === 0 ? "high" : "low"}
                    decoding="async"
                    ref={
                      index === 0
                        ? (el) => {
                            if (el?.complete) setRestReady(true);
                          }
                        : undefined
                    }
                    onLoad={index === 0 ? () => setRestReady(true) : undefined}
                    onError={index === 0 ? () => setRestReady(true) : undefined}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}

                {/* 사진 위 글자가 잘 읽히도록 왼쪽과 아래를 어둡게 */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/30 to-transparent" />
                {/* 투명 상단 바의 흰 로고·버튼이 밝은 사진 위에서도 보이도록 위쪽을 살짝 어둡게 */}
                <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-slate-950/55 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-slate-950/80 via-slate-950/35 to-transparent" />

                <div
                  className="container relative flex h-full max-w-6xl flex-col justify-end"
                  style={{ paddingBottom: TEXT_BOTTOM }}
                >
                  <TitleTag className="break-keep font-['GmarketSans'] text-[clamp(2.25rem,4.6vw,4rem)] font-bold leading-[1.15] text-white drop-shadow-[0_2px_16px_rgba(2,6,23,0.35)]">
                    {index === 0 ? (
                      <span className="block overflow-hidden py-[0.06em]">
                        <motion.span
                          className="block"
                          initial={reduced ? false : { y: "105%" }}
                          animate={{ y: "0%" }}
                          transition={{ duration: 0.85, delay: 0.1, ease: HOME_EASE }}
                        >
                          {slide.title}
                        </motion.span>
                      </span>
                    ) : (
                      slide.title
                    )}
                  </TitleTag>
                  <p className="mt-4 max-w-2xl break-keep text-base font-semibold leading-relaxed text-white/85 lg:text-lg">
                    {slide.text}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* 상담 버튼과 신뢰 배지는 세 장면 내내 같은 자리에 둔다 */}
        <div className={`${ctaLayer} pointer-events-none z-10`}>
          <motion.div
            className="container flex h-full max-w-6xl flex-col justify-end"
            style={{ paddingBottom: CTA_BOTTOM }}
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: HOME_EASE }}
          >
            <div ref={ctaRef}>
              {/* 좁은 창에서도 두 버튼을 한 줄로 둔다 (세로로 쌓으면 묶음이 높아져 문구를 가린다) */}
              <div className="pointer-events-auto flex max-w-xl gap-3">
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
                  className="inline-flex min-h-14 flex-[1.35] items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-slate-950/30 transition hover:-translate-y-0.5 hover:bg-primary/90"
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
                  className="inline-flex min-h-14 flex-1 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-extrabold text-foreground shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-blue-50"
                >
                  <Phone className="h-5 w-5 shrink-0 text-primary" />
                  전화로 방문견적 문의
                </a>
              </div>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5">
                {heroBadges.map((badge) => (
                  <span key={badge} className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/85">
                    <Check className="h-3.5 w-3.5 flex-shrink-0 text-sky-300" />
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 방문자 수 신뢰 바 (PC 전용 — 모바일은 MobileHome 히어로에 표시) */}
      <div className="border-b border-blue-100/60 bg-white py-3.5">
        <div className="container flex max-w-6xl justify-center">
          <VisitorCounter />
        </div>
      </div>
    </div>
  );
}
