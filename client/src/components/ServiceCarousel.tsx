import { useRef, type MouseEvent as ReactMouseEvent } from "react";
import { flushSync } from "react-dom";
import { Link, useLocation } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { HOME_EASE } from "@/components/HomeMotion";
import { usePhotoCarousel } from "@/hooks/usePhotoCarousel";
import { responsiveImage } from "@/lib/responsiveImage";

export type ServiceCardItem = {
  /** 카드 아래 서비스명 (예: "계단청소") */
  title: string;
  /** 서비스명 옆 보조 영문 라벨 (예: "STAIR") */
  en: string;
  /** 서비스명 아래 짧은 설명 */
  subtitle: string;
  image: string;
  href: string;
  /** 카드 사진 비율(가로/세로). 카드마다 달리해 세로·가로 사진이 번갈아 보이게 한다 */
  aspect: number;
  /** 서비스 상세 페이지의 첫 화면 배경 사진. 카드에 마우스를 올리면 미리 받아 둔다 */
  heroImage: string;
};

type ServiceCarouselProps = {
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
// 서비스 4개를 두 벌 이어 붙여야 화면 양끝에서 카드가 갑자기 생기거나 사라지는 모습이 보이지 않는다
const LOOP_SETS = 2;
const PHOTO_TRANSITION_NAME = "service-photo";

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

// 데스크톱 전용 청소 서비스 섹션 (Codrops "Page Transitions with WebGPU" 데모를 CSS 3D와 View Transitions로 옮김).
// 사진 카드가 가로로 끝없이 이어지고(움직임은 usePhotoCarousel), 카드를 누르면 그 사진이 화면 가득 커지며
// 서비스 상세 페이지의 배경으로 이어진다.
export default function ServiceCarousel({ items, className = "" }: ServiceCarouselProps) {
  const reduced = useReducedMotion();
  const [, navigate] = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<Array<HTMLElement | null>>([]);
  const frameRefs = useRef<Array<HTMLDivElement | null>>([]);
  const transitioningRef = useRef(false);

  const slots = Array.from({ length: items.length * LOOP_SETS }, (_, index) => ({
    item: items[index % items.length],
    duplicate: index >= items.length,
  }));
  const { engineRef, suppressClickRef } = usePhotoCarousel({
    rootRef,
    cursorRef,
    slotRefs,
    aspects: slots.map(({ item }) => item.aspect),
    reduced,
  });

  const openService = async (
    event: ReactMouseEvent<HTMLAnchorElement>,
    item: ServiceCardItem,
    frame: HTMLDivElement | null
  ) => {
    if (suppressClickRef.current) {
      event.preventDefault();
      return;
    }
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
      // 하단 플로팅 버튼(전화·카톡, 맨 위로)이 카드 아래 글자를 가리지 않도록 이 섹션 위에서는 버튼을 줄인다
      data-floating-quiet
      className={`photo-carousel relative min-h-[560px] w-full select-none overflow-hidden ${className}`}
      style={{ backgroundColor: CANVAS, touchAction: "pan-y", perspective: "1000px" }}
    >
      {slots.map(({ item, duplicate }, index) => {
        const plainTitle = item.title.replace(/\s/g, "");
        return (
          <Link
            key={`${item.href}-${index}`}
            href={item.href}
            ref={(el: HTMLAnchorElement | null) => {
              slotRefs.current[index] = el;
            }}
            data-carousel-card
            draggable={false}
            // 끝없이 이어 보이려고 한 번 더 그린 카드는 화면에만 보이고, 스크린리더·키보드에서는 건너뛴다
            aria-hidden={duplicate || undefined}
            tabIndex={duplicate ? -1 : undefined}
            aria-label={duplicate ? undefined : `이천 ${plainTitle} 정기관리 상세 안내`}
            onPointerEnter={() => preloadService(item)}
            onFocus={(event) => {
              if (!duplicate && event.currentTarget.matches(":focus-visible")) engineRef.current?.centerSlot(index);
            }}
            onClick={(event) => openService(event, item, frameRefs.current[index])}
            className="group absolute left-0 top-0 block w-[min(22vw,40svh)] outline-none will-change-transform focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
          >
            <motion.div
              ref={(el: HTMLDivElement | null) => {
                frameRefs.current[index] = el;
              }}
              className="overflow-hidden rounded-lg bg-slate-200"
              style={{ aspectRatio: item.aspect }}
              initial={reduced ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: reduced ? 0 : 1, delay: reduced ? 0 : (index % items.length) * 0.08, ease: "easeOut" }}
            >
              <img
                src={item.image}
                alt={duplicate ? "" : `이천 ${plainTitle} 정기관리 서비스`}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
              />
            </motion.div>

            {/* 사진 아래 서비스명: 글줄이 아래에서 올라오며 나타난다 */}
            <div className="absolute inset-x-0 top-full pt-3">
              <div className="overflow-hidden">
                <motion.p
                  className="flex items-baseline gap-2 whitespace-nowrap"
                  initial={reduced ? false : { y: "105%" }}
                  whileInView={{ y: "0%" }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.7, delay: reduced ? 0 : 0.15 + (index % items.length) * 0.06, ease: HOME_EASE }}
                >
                  <span className="font-['GmarketSans'] text-[15px] font-bold text-foreground">{item.title}</span>
                  <span className="text-[11px] font-bold tracking-[0.22em] text-slate-400">{item.en}</span>
                </motion.p>
              </div>
              <div className="overflow-hidden">
                <motion.p
                  className="mt-1 whitespace-nowrap text-xs font-semibold text-slate-500"
                  initial={reduced ? false : { y: "105%" }}
                  whileInView={{ y: "0%" }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.7, delay: reduced ? 0 : 0.21 + (index % items.length) * 0.06, ease: HOME_EASE }}
                >
                  {item.subtitle}
                </motion.p>
              </div>
            </div>
          </Link>
        );
      })}

      {/* 참고 데모처럼 마우스를 따라다니는 작은 사각 테두리, 사진 위에서는 원으로 커진다 (마우스가 있는 PC에서만) */}
      <div ref={cursorRef} aria-hidden="true" className="photo-carousel-cursor">
        <span />
      </div>
    </div>
  );
}
