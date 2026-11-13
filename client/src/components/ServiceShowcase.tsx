import { useEffect, useRef, type MouseEvent as ReactMouseEvent, type RefObject } from "react";
import { flushSync } from "react-dom";
import { Link, useLocation } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { HOME_EASE } from "@/components/HomeMotion";
import { responsiveImage } from "@/lib/responsiveImage";

export type ServiceCardItem = {
  /** 서비스명 (예: "계단청소") */
  title: string;
  /** 서비스명 옆 보조 영문 라벨 (예: "STAIR") */
  en: string;
  /** 어떤 건물·공간을 관리하는지 한 줄 설명 (모바일 카드에 쓴다) */
  subtitle: string;
  image: string;
  href: string;
  /** 서비스 상세 페이지의 첫 화면 배경 사진. 카드에 마우스를 올리면 미리 받아 둔다 */
  heroImage: string;
};

type ServiceShowcaseProps = {
  items: ServiceCardItem[];
  /** 높이 지정용 클래스 */
  className?: string;
};

// 서비스 상세 페이지 코드를 미리 받아 두어, 누르는 순간 사진이 곧바로 상세 첫 화면으로 커지게 한다
const SERVICE_PAGES: Record<string, () => Promise<unknown>> = {
  "/services/stair": () => import("@/pages/StairCleaning"),
  "/services/office": () => import("@/pages/OfficeCleaning"),
  "/services/bathroom": () => import("@/pages/BathroomCleaning"),
  "/services/glass": () => import("@/pages/GlassCleaning"),
};

const CANVAS = "#f7f9fc";
const PHOTO_TRANSITION_NAME = "service-photo";
// 스크롤 속도만큼 사진이 앞뒤로 살짝 기울었다가 멈추면 평평해진다 (참고 데모의 상세 페이지처럼 가로축 기준, 최대 약 4도)
const TILT_PER_PX = 0.004;
const TILT_MAX = 0.07;
const TILT_LERP = 0.1;
// 사진은 네 장 모두 세로로 긴 2:3으로 맞춘다. 화면이 낮으면 섹션 제목·서비스명(약 19rem)을 뺀 높이에 맞춰 카드 줄 전체를 줄여
// 네 장과 설명이 한 화면에 다 들어오게 한다. 7.5rem은 카드 사이 간격 3개(2.5rem)
const ROW_WIDTH = "min(100%, calc((100svh - 3.5rem - 19rem) / 1.5 * 4 + 7.5rem))";

/** 새 페이지에서 표시가 끝났는지 기다린다. 전환 중에는 화면 그리기가 멈춰 requestAnimationFrame 대신 타이머로 확인한다 */
function waitForElement(selector: string, timeoutMs: number) {
  return new Promise<void>((resolve) => {
    const startedAt = performance.now();
    const check = () => {
      if (document.querySelector(selector) || performance.now() - startedAt > timeoutMs) resolve();
      else window.setTimeout(check, 16);
    };
    check();
  });
}

function preloadService(item: ServiceCardItem) {
  SERVICE_PAGES[item.href]?.().catch(() => undefined);
  // 상세 첫 화면과 같은 후보(100vw)를 받아 두면 커지는 사진이 끝나자마자 배경 사진이 바로 보인다
  const hero = new Image();
  const { src, srcSet } = responsiveImage(item.heroImage);
  if (srcSet) hero.srcset = srcSet;
  hero.sizes = "100vw";
  hero.src = src ?? item.heroImage;
}

function useScrollTilt(rootRef: RefObject<HTMLElement | null>, tiltRefs: RefObject<Array<HTMLElement | null>>, reduced: boolean | null) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    let inView = false;
    let running = false;
    let raf = 0;
    let lastY = window.scrollY;
    let pending = 0;
    let tilt = 0;

    const apply = () => {
      for (const el of tiltRefs.current ?? []) {
        // 원근(perspective)은 transform 안에 넣어야 몇 단계 안쪽 요소에도 입체로 보인다
        if (el) el.style.transform = tilt ? `perspective(1200px) rotateX(${-tilt}rad)` : "";
      }
    };
    const tick = () => {
      const target = Math.max(-TILT_MAX, Math.min(TILT_MAX, pending * TILT_PER_PX));
      pending = 0;
      tilt += (target - tilt) * TILT_LERP;
      if (target === 0 && Math.abs(tilt) < 0.0005) {
        tilt = 0;
        apply();
        running = false;
        return;
      }
      apply();
      raf = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      const y = window.scrollY;
      if (inView) {
        pending += y - lastY;
        if (!running) {
          running = true;
          raf = requestAnimationFrame(tick);
        }
      }
      lastY = y;
    };

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      lastY = window.scrollY;
    });
    io.observe(root);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [rootRef, tiltRefs, reduced]);
}

// 데스크톱 전용 청소 서비스 섹션: 네 가지 서비스 사진을 한 줄에 모두 보여주고, 사진 아래에 서비스명을 적는다.
// 사진은 모두 세로로 긴 2:3으로 맞추고, 스크롤하면 살짝 기울었다가 멈추면 평평해진다(참고: Codrops WebGPU 페이지 전환 데모).
// 카드를 누르면 그 사진이 화면 가득 커지며 서비스 상세 페이지의 배경으로 이어진다(View Transitions).
export default function ServiceShowcase({ items, className = "" }: ServiceShowcaseProps) {
  const reduced = useReducedMotion();
  const [, navigate] = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);
  const tiltRefs = useRef<Array<HTMLDivElement | null>>([]);
  const frameRefs = useRef<Array<HTMLDivElement | null>>([]);
  const transitioningRef = useRef(false);

  useScrollTilt(rootRef, tiltRefs, reduced);

  const openService = async (
    event: ReactMouseEvent<HTMLAnchorElement>,
    item: ServiceCardItem,
    frame: HTMLDivElement | null
  ) => {
    // 새 탭 열기 등은 브라우저 기본 동작, 전환을 지원하지 않거나 움직임 줄이기 설정이면 바로 이동한다
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (reduced || typeof document.startViewTransition !== "function" || !frame) return;

    event.preventDefault();
    if (transitioningRef.current) return;
    transitioningRef.current = true;

    try {
      await SERVICE_PAGES[item.href]?.();
    } catch {
      // 코드를 미리 못 받아도 전환 중에 받으면 된다
    }

    // 누른 카드 사진과 상세 페이지 배경(.vt-service-photo)을 같은 이름으로 묶어, 브라우저가 위치·크기를 이어서 움직이게 한다
    frame.style.viewTransitionName = PHOTO_TRANSITION_NAME;
    document.documentElement.classList.add("vt-service");
    const transition = document.startViewTransition(async () => {
      flushSync(() => navigate(item.href));
      await waitForElement(".vt-service-photo", 2500);
    });
    transition.finished.finally(() => {
      document.documentElement.classList.remove("vt-service");
      frame.style.viewTransitionName = "";
      transitioningRef.current = false;
    });
  };

  return (
    <div
      ref={rootRef}
      // 하단 플로팅 버튼(전화·카톡, 맨 위로)이 카드 아래 설명을 가리지 않도록 이 섹션 위에서는 버튼을 줄인다
      data-floating-quiet
      className={`relative flex w-full flex-col justify-center overflow-hidden py-10 ${className}`}
      style={{ backgroundColor: CANVAS }}
    >
      {/* 오른쪽 아래 전화·카톡 버튼과 오른쪽 섹션 메뉴가 카드·설명을 가리지 않도록 좌우를 넉넉히 비운다 */}
      <div className="mx-auto w-full max-w-[1560px] px-8 lg:px-16 xl:px-28">
        <div className="mx-auto" style={{ width: ROW_WIDTH }}>
          <motion.div
            className="mb-12 flex items-end justify-between gap-10"
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: reduced ? 0 : 0.7, ease: HOME_EASE }}
          >
            <div>
              <p className="text-xs font-extrabold tracking-[0.28em] text-primary">SERVICES</p>
              <h2 className="mt-3 font-['GmarketSans'] text-3xl font-bold leading-tight text-foreground lg:text-4xl">
                어떤 청소를 맡길 수 있나요?
              </h2>
              <p className="mt-3 text-base font-medium text-slate-500">
                빌라·상가·사무실 공용공간을 하청 없이 부부가 직접 방문해 정기관리합니다.
              </p>
            </div>
            <p className="hidden shrink-0 pb-1 text-sm font-semibold text-slate-500 xl:block">
              사진을 누르면 서비스별 자세한 안내로 이어져요
            </p>
          </motion.div>

          <ul className="grid grid-cols-4 gap-10">
            {items.map((item, index) => {
              const plainTitle = item.title.replace(/\s/g, "");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    // 사이트 공통 커서가 이 카드 위에서 원으로 바뀐다
                    data-cursor="card"
                    draggable={false}
                    aria-label={`이천 ${plainTitle} 정기관리 상세 안내`}
                    onPointerEnter={() => preloadService(item)}
                    onClick={(event) => openService(event, item, frameRefs.current[index])}
                    className="group block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
                  >
                    <div
                      ref={(el) => {
                        tiltRefs.current[index] = el;
                      }}
                    >
                      <motion.div
                        ref={(el: HTMLDivElement | null) => {
                          frameRefs.current[index] = el;
                        }}
                        className="aspect-[2/3] overflow-hidden rounded-lg bg-slate-200"
                        initial={reduced ? false : { opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: reduced ? 0 : 0.9, delay: reduced ? 0 : index * 0.08, ease: HOME_EASE }}
                      >
                        <img
                          src={item.image}
                          alt={`이천 ${plainTitle} 정기관리 서비스`}
                          loading="lazy"
                          decoding="async"
                          draggable={false}
                          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                        />
                      </motion.div>
                    </div>

                    <motion.div
                      className="mt-5"
                      initial={reduced ? false : { opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: reduced ? 0 : 0.7, delay: reduced ? 0 : 0.15 + index * 0.08, ease: HOME_EASE }}
                    >
                      <p className="flex items-center gap-2">
                        <span className="font-['GmarketSans'] text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                          {item.title}
                        </span>
                        <span className="text-[11px] font-bold tracking-[0.22em] text-slate-500">{item.en}</span>
                        <ArrowRight
                          aria-hidden="true"
                          className="ml-auto h-4 w-4 shrink-0 -translate-x-1 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                        />
                      </p>
                    </motion.div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
