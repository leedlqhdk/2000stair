import { useEffect, useRef, type MouseEvent as ReactMouseEvent } from "react";
import { flushSync } from "react-dom";
import { Link, useLocation } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { HOME_EASE } from "@/components/HomeMotion";
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
const GAP_PX = 48;
// 서비스 4개를 두 벌 이어 붙여야 화면 양끝에서 카드가 갑자기 생기거나 사라지는 모습이 보이지 않는다
const LOOP_SETS = 2;
const LERP = 0.1;
// 페이지를 세로로 스크롤한 만큼 카드 줄이 옆으로 흐르는 비율
const SCROLL_TO_X = 0.9;
// 빨리 움직일수록 카드가 원근감 있게 기운다 (한 프레임 이동량 1px당 라디안, 최대 약 7도)
const TILT_PER_PX = 0.006;
const TILT_MAX = 0.12;
const TILT_LERP = 0.09;
const CURSOR_LERP = 0.2;
const DRAG_THRESHOLD = 6;
// 사진 아래 서비스명 높이만큼 사진을 살짝 올려 카드 전체가 가운데에 오게 한다
const CAPTION_OFFSET = 24;
const PHOTO_TRANSITION_NAME = "service-photo";

function wrap(value: number, period: number) {
  const half = period / 2;
  let rel = ((value % period) + period) % period;
  if (rel >= half) rel -= period;
  return rel;
}

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
// 사진 카드가 가로로 끝없이 이어지고, 페이지를 스크롤하거나 옆으로 밀면 흐르며 빠를수록 살짝 기운다.
// 카드를 누르면 그 사진이 화면 가득 커지며 서비스 상세 페이지의 배경으로 이어진다.
export default function ServiceCarousel({ items, className = "" }: ServiceCarouselProps) {
  const reduced = useReducedMotion();
  const [, navigate] = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const frameRefs = useRef<Array<HTMLDivElement | null>>([]);
  const engineRef = useRef<{ wake: () => void; centerSlot: (index: number) => void } | null>(null);
  const suppressClickRef = useRef(false);
  const transitioningRef = useRef(false);

  const slots = Array.from({ length: items.length * LOOP_SETS }, (_, index) => ({
    item: items[index % items.length],
    duplicate: index >= items.length,
  }));

  useEffect(() => {
    const root = rootRef.current;
    if (!root || items.length === 0) return;

    const count = items.length * LOOP_SETS;
    const center = Math.floor(count / 2);
    const fineHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const state = { scrollX: 0, targetX: 0, tilt: 0 };
    const cursor = { x: 0, y: 0, tx: 0, ty: 0, visible: false };
    let cellW = 0;
    let step = 0;
    let period = 0;
    let frameHeights: number[] = [];
    let inView = false;
    let running = false;
    let raf = 0;
    let lastScrollY = window.scrollY;
    let drag: { x: number; startTarget: number; moved: boolean; pointerId: number } | null = null;

    const measure = () => {
      cellW = slotRefs.current[0]?.offsetWidth ?? 0;
      step = cellW + GAP_PX;
      period = count * step;
      frameHeights = Array.from({ length: count }, (_, i) => cellW / items[i % items.length].aspect);
    };

    const apply = () => {
      if (!period) return;
      const width = root.clientWidth;
      const height = root.clientHeight;
      for (let i = 0; i < count; i++) {
        const slot = slotRefs.current[i];
        if (!slot) continue;
        const relX = wrap((i - center) * step - state.scrollX, period);
        const x = width / 2 + relX - cellW / 2;
        const y = height / 2 - frameHeights[i] / 2 - CAPTION_OFFSET;
        slot.style.transform = `translate3d(${x}px, ${y}px, 0) rotateY(${state.tilt}rad)`;
      }
    };

    const tick = () => {
      const prev = state.scrollX;
      state.scrollX += (state.targetX - state.scrollX) * (reduced ? 1 : LERP);
      const velocity = state.scrollX - prev;
      const tiltTarget = reduced ? 0 : Math.max(-TILT_MAX, Math.min(TILT_MAX, velocity * TILT_PER_PX));
      state.tilt += (tiltTarget - state.tilt) * TILT_LERP;
      apply();

      if (cursorRef.current && cursor.visible) {
        cursor.x += (cursor.tx - cursor.x) * CURSOR_LERP;
        cursor.y += (cursor.ty - cursor.y) * CURSOR_LERP;
        cursorRef.current.style.transform = `translate3d(${cursor.x}px, ${cursor.y}px, 0) translate(-50%, -50%)`;
      }

      const settled =
        Math.abs(state.targetX - state.scrollX) < 0.05 &&
        Math.abs(state.tilt) < 0.0005 &&
        (!cursor.visible || (Math.abs(cursor.tx - cursor.x) < 0.3 && Math.abs(cursor.ty - cursor.y) < 0.3));
      // 움직임이 멈추면 다음 입력이 올 때까지 쉰다
      if (settled) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    const centerSlot = (index: number) => {
      // 키보드로 화면 밖 카드에 들어가면 그 카드를 가운데로 데려온다
      state.targetX = state.scrollX + wrap((index - center) * step - state.scrollX, period);
      wake();
    };
    engineRef.current = { wake, centerSlot };

    const onScroll = () => {
      const y = window.scrollY;
      if (inView && !reduced) {
        state.targetX += (y - lastScrollY) * SCROLL_TO_X;
        wake();
      }
      lastScrollY = y;
    };

    // 트랙패드로 옆으로 밀 때만 가로로 움직인다 (세로 휠은 페이지 스크롤로 그대로 둔다)
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      state.targetX += event.deltaX;
      wake();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      drag = { x: event.clientX, startTarget: state.targetX, moved: false, pointerId: event.pointerId };
    };
    const onPointerMove = (event: PointerEvent) => {
      if (fineHover && event.pointerType === "mouse") {
        const rect = root.getBoundingClientRect();
        cursor.tx = event.clientX - rect.left;
        cursor.ty = event.clientY - rect.top;
        if (!cursor.visible) {
          cursor.visible = true;
          cursor.x = cursor.tx;
          cursor.y = cursor.ty;
          cursorRef.current?.classList.add("is-visible");
        }
        const overCard = Boolean((event.target as Element | null)?.closest?.("[data-service-card]"));
        cursorRef.current?.classList.toggle("is-hover", overCard);
        wake();
      }
      if (!drag) return;
      const dx = event.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > DRAG_THRESHOLD) {
        drag.moved = true;
        root.setPointerCapture(drag.pointerId);
      }
      if (drag.moved) {
        state.targetX = drag.startTarget - dx;
        wake();
      }
    };
    const onPointerUp = () => {
      if (drag?.moved) {
        // 끌어서 넘긴 직후 손을 뗄 때 카드가 눌린 것으로 처리되지 않게 한다
        suppressClickRef.current = true;
        window.setTimeout(() => {
          suppressClickRef.current = false;
        }, 0);
      }
      drag = null;
    };
    const onPointerLeave = () => {
      cursor.visible = false;
      cursorRef.current?.classList.remove("is-visible", "is-hover");
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        lastScrollY = window.scrollY;
      },
      { rootMargin: "200px 0px" }
    );
    const ro = new ResizeObserver(() => {
      measure();
      apply();
    });

    measure();
    apply();
    io.observe(root);
    ro.observe(root);
    window.addEventListener("scroll", onScroll, { passive: true });
    root.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("pointerdown", onPointerDown);
    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerup", onPointerUp);
    root.addEventListener("pointercancel", onPointerUp);
    root.addEventListener("pointerleave", onPointerLeave);

    return () => {
      cancelAnimationFrame(raf);
      engineRef.current = null;
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      root.removeEventListener("wheel", onWheel);
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerup", onPointerUp);
      root.removeEventListener("pointercancel", onPointerUp);
      root.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [items, reduced]);

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
      className={`service-carousel relative min-h-[560px] w-full select-none overflow-hidden ${className}`}
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
            data-service-card
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
      <div ref={cursorRef} aria-hidden="true" className="service-carousel-cursor">
        <span />
      </div>
    </div>
  );
}
