import { useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { flushSync } from "react-dom";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronsLeftRight, X } from "lucide-react";
import { HOME_EASE } from "@/components/HomeMotion";
import { beforeAfterSrcSet, type BeforeAfterItem } from "@/data/beforeAfter";
import { usePhotoCarousel } from "@/hooks/usePhotoCarousel";

type BeforeAfterCarouselProps = {
  items: BeforeAfterItem[];
  /** 높이 지정용 클래스 */
  className?: string;
};

const CANVAS = "#f7f9fc";
// 6세트를 두 벌 이어 붙여 넓은 화면에서도 양끝에서 카드가 튀어 보이지 않게 끝없이 돈다
const LOOP_SETS = 2;
// 섹션 제목 자리. 카드는 그 아래 공간의 가운데에 온다
const HEADING_SPACE = 132;
const CARD_SIZES = "(min-width: 768px) 22vw, 60vw";
const VIEWER_SIZES = "(min-width: 768px) 70vw, 100vw";
// 카드를 누르면 같은 비율·같은 반반 모습의 크게 보기 화면으로 사진이 커지며 이어진다
const PHOTO_TRANSITION_NAME = "ba-photo";

const aspectOf = (item: BeforeAfterItem) => item.aspect ?? 1;

/** 크게 보기용 1600px 사진을 미리 받아 둔다. 전환 전에 잠깐(최대 0.4초) 기다려 커지는 동안 사진이 비어 보이지 않게 한다 */
function preloadLarge(item: BeforeAfterItem) {
  const decode = (src: string) => {
    const image = new Image();
    image.src = src;
    return image.decode().catch(() => undefined);
  };
  return Promise.race([
    Promise.all([decode(item.before), decode(item.after)]),
    new Promise((resolve) => window.setTimeout(resolve, 400)),
  ]);
}

/** 같은 장면의 청소 전(왼쪽)·후(오른쪽)를 pos% 위치에서 나눠 보여준다 */
function SplitPhoto({ item, pos, sizes, eager = false }: { item: BeforeAfterItem; pos: number; sizes: string; eager?: boolean }) {
  return (
    <>
      <img
        src={item.after}
        srcSet={beforeAfterSrcSet(item.after)}
        sizes={sizes}
        alt={`${item.title} 청소 후`}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
      <img
        src={item.before}
        srcSet={beforeAfterSrcSet(item.before)}
        sizes={sizes}
        alt={`${item.title} 청소 전`}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />
      <span className="pointer-events-none absolute inset-y-0 w-px -translate-x-1/2 bg-white/90" style={{ left: `${pos}%` }} />
      <span className="pointer-events-none absolute left-2.5 top-2.5 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-bold tracking-[0.18em] text-white">
        BEFORE
      </span>
      <span className="pointer-events-none absolute right-2.5 top-2.5 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold tracking-[0.18em] text-white">
        AFTER
      </span>
    </>
  );
}

/** 크게 보기 화면의 비교 사진: 가운데 선을 끌거나, 선 손잡이에 들어가 ←/→ 키로 옮긴다 */
function CompareViewer({ item }: { item: BeforeAfterItem }) {
  const [pos, setPos] = useState(50);
  const frameRef = useRef<HTMLDivElement>(null);
  const aspect = aspectOf(item);

  const moveTo = (clientX: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    const { left, width } = frame.getBoundingClientRect();
    setPos(Math.max(2, Math.min(98, ((clientX - left) / width) * 100)));
  };

  return (
    <div
      ref={frameRef}
      // vt-ba-photo: 누른 카드 사진이 이 자리로 커지며 이어진다 (닫으면 다시 카드로 줄어든다)
      className="vt-ba-photo relative cursor-col-resize select-none overflow-hidden rounded-lg bg-slate-800"
      style={{
        aspectRatio: aspect,
        height: `min(calc(100svh - 13rem), calc((100vw - 12rem) / ${aspect}))`,
        touchAction: "none",
      }}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        moveTo(event.clientX);
      }}
      onPointerMove={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) moveTo(event.clientX);
      }}
    >
      <SplitPhoto item={item} pos={pos} sizes={VIEWER_SIZES} eager />
      <span
        role="slider"
        tabIndex={0}
        aria-label="청소 전후 비교 위치"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        onKeyDown={(event) => {
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
          // 손잡이에 들어가 있을 때의 ←/→는 사진 넘기기 대신 선을 옮긴다
          event.stopPropagation();
          event.preventDefault();
          setPos((value) => Math.max(2, Math.min(98, value + (event.key === "ArrowLeft" ? -5 : 5))));
        }}
        className="absolute top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-primary shadow-[0_6px_16px_rgba(15,23,42,0.3)] outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
        style={{ left: `${pos}%` }}
      >
        <ChevronsLeftRight className="h-5 w-5" strokeWidth={2.6} />
      </span>
    </div>
  );
}

// PC 홈 '청소 전후 사진': 청소 서비스와 같은 가로 사진 카드 줄(usePhotoCarousel).
// 카드는 같은 장면을 반반(청소 전 | 청소 후)으로 보여주고, 누르면 그 모습 그대로 화면 가득 커지며
// 가운데 선을 끌어 비교하는 크게 보기 화면으로 이어진다. 닫으면 다시 카드로 줄어든다.
export default function BeforeAfterCarousel({ items, className = "" }: BeforeAfterCarouselProps) {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<Array<HTMLElement | null>>([]);
  const frameRefs = useRef<Array<HTMLDivElement | null>>([]);
  const clickedSlotRef = useRef<number | null>(null);
  const busyRef = useRef(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const slots = Array.from({ length: items.length * LOOP_SETS }, (_, index) => ({
    item: items[index % items.length],
    duplicate: index >= items.length,
  }));
  const { engineRef, suppressClickRef } = usePhotoCarousel({
    rootRef,
    slotRefs,
    aspects: slots.map(({ item }) => aspectOf(item)),
    reduced,
    topInset: HEADING_SPACE,
  });

  const canTransition = () => !reduced && typeof document.startViewTransition === "function";

  // 둘이 동시에 같은 이름을 가지면 전환이 취소되므로, 화면이 바뀌는 순간 이름을 카드 ↔ 크게 보기 사이에서 넘긴다
  const runTransition = (update: () => void) => {
    busyRef.current = true;
    document.documentElement.classList.add("vt-ba");
    const transition = document.startViewTransition(update);
    transition.finished.finally(() => {
      document.documentElement.classList.remove("vt-ba");
      busyRef.current = false;
    });
    return transition;
  };

  const open = async (slotIndex: number) => {
    if (suppressClickRef.current || busyRef.current) return;
    const itemIndex = slotIndex % items.length;
    const frame = frameRefs.current[slotIndex];
    clickedSlotRef.current = slotIndex;
    if (!canTransition() || !frame) {
      setOpenIndex(itemIndex);
      return;
    }
    busyRef.current = true;
    await preloadLarge(items[itemIndex]);
    frame.style.viewTransitionName = PHOTO_TRANSITION_NAME;
    runTransition(() => {
      frame.style.viewTransitionName = "";
      flushSync(() => setOpenIndex(itemIndex));
    });
  };

  // 지금 보고 있는 사진의 카드 가운데 화면에 보이는 것 (처음 누른 카드를 먼저 고른다)
  const visibleFrameFor = (itemIndex: number) => {
    const root = rootRef.current?.getBoundingClientRect();
    if (!root) return null;
    const candidates = [clickedSlotRef.current, ...slots.map((_, index) => index)].filter(
      (index): index is number => index !== null && index % items.length === itemIndex
    );
    for (const index of candidates) {
      const frame = frameRefs.current[index];
      const rect = frame?.getBoundingClientRect();
      if (frame && rect && rect.right > root.left && rect.left < root.right) return frame;
    }
    return null;
  };

  const close = () => {
    if (openIndex === null || busyRef.current) return;
    const frame = visibleFrameFor(openIndex);
    if (!canTransition()) {
      setOpenIndex(null);
      return;
    }
    runTransition(() => {
      flushSync(() => setOpenIndex(null));
      if (frame) frame.style.viewTransitionName = PHOTO_TRANSITION_NAME;
    }).finished.finally(() => {
      if (frame) frame.style.viewTransitionName = "";
    });
  };

  const stepItem = (direction: number) => {
    setOpenIndex((index) => (index === null ? index : (index + direction + items.length) % items.length));
  };

  const onViewerKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") stepItem(1);
    if (event.key === "ArrowLeft") stepItem(-1);
  };

  const current = openIndex === null ? null : items[openIndex];

  return (
    <div
      ref={rootRef}
      // 하단 플로팅 버튼(전화·카톡, 맨 위로)이 카드 아래 글자를 가리지 않도록 이 섹션 위에서는 버튼을 줄인다
      data-floating-quiet
      className={`photo-carousel relative min-h-[600px] w-full select-none overflow-hidden ${className}`}
      style={{ backgroundColor: CANVAS, touchAction: "pan-y", perspective: "1000px" }}
    >
      {/* 섹션 제목: 왼쪽 위에 작게 두고 사진 카드가 주인공이 되게 한다 */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10">
        <div className="container max-w-6xl pt-10">
          <p className="text-xs font-extrabold tracking-[0.28em] text-primary">BEFORE / AFTER</p>
          <h2 className="mt-2 font-['GmarketSans'] text-2xl font-bold leading-tight text-foreground">
            눈으로 확인하는 관리 결과
          </h2>
          <p className="mt-1.5 text-sm font-semibold text-slate-500">
            실제 작업 현장 사진입니다. 사진을 누르면 크게 비교할 수 있어요.
          </p>
        </div>
      </div>

      {slots.map(({ item, duplicate }, index) => (
        <button
          key={`${item.id}-${index}`}
          type="button"
          ref={(el) => {
            slotRefs.current[index] = el;
          }}
          // 사이트 공통 커서가 이 카드 위에서 원으로 바뀐다
          data-cursor="card"
          draggable={false}
          // 끝없이 이어 보이려고 한 번 더 그린 카드는 화면에만 보이고, 스크린리더·키보드에서는 건너뛴다
          aria-hidden={duplicate || undefined}
          tabIndex={duplicate ? -1 : undefined}
          aria-label={duplicate ? undefined : `${item.title} 청소 전후 크게 비교하기`}
          onPointerEnter={() => void preloadLarge(item)}
          onFocus={(event) => {
            if (!duplicate && event.currentTarget.matches(":focus-visible")) engineRef.current?.centerSlot(index);
          }}
          onClick={() => open(index)}
          className="group absolute left-0 top-0 block w-[min(20vw,36svh)] text-left outline-none will-change-transform focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
        >
          <motion.div
            ref={(el: HTMLDivElement | null) => {
              frameRefs.current[index] = el;
            }}
            className="relative overflow-hidden rounded-lg bg-slate-200"
            style={{ aspectRatio: aspectOf(item) }}
            initial={reduced ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: reduced ? 0 : 1, delay: reduced ? 0 : (index % items.length) * 0.08, ease: "easeOut" }}
          >
            {/* 청소 서비스 카드와 같이, 마우스를 올리면 사진이 살짝 커진다 */}
            <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]">
              <SplitPhoto item={item} pos={50} sizes={CARD_SIZES} />
            </div>
          </motion.div>

          {/* 사진 아래 제목: 글줄이 아래에서 올라오며 나타난다 */}
          <div className="absolute inset-x-0 top-full pt-3">
            <div className="overflow-hidden">
              <motion.p
                className="whitespace-nowrap font-['GmarketSans'] text-[15px] font-bold text-foreground"
                initial={reduced ? false : { y: "105%" }}
                whileInView={{ y: "0%" }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, delay: reduced ? 0 : 0.15 + (index % items.length) * 0.06, ease: HOME_EASE }}
              >
                {item.title}
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
                {item.category}
              </motion.p>
            </div>
          </div>
        </button>
      ))}

      <DialogPrimitive.Root
        open={current !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) close();
        }}
      >
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-[90] bg-slate-950/95" />
          <DialogPrimitive.Content
            aria-describedby={undefined}
            onKeyDown={onViewerKeyDown}
            className="fixed inset-0 z-[91] flex flex-col items-center justify-center gap-6 px-6 text-white outline-none"
          >
            {current && openIndex !== null ? (
              <>
                <div className="absolute inset-x-0 top-0 flex items-start justify-between px-8 py-6">
                  <div>
                    <p className="text-xs font-bold tracking-[0.22em] text-white/50">{current.category}</p>
                    <DialogPrimitive.Title className="mt-1 font-['GmarketSans'] text-xl font-bold">
                      {current.title}
                    </DialogPrimitive.Title>
                  </div>
                  <div className="flex items-center gap-5">
                    <span className="text-sm font-bold tabular-nums text-white/60">
                      {openIndex + 1} / {items.length}
                    </span>
                    <DialogPrimitive.Close
                      aria-label="크게 보기 닫기"
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                    >
                      <X className="h-5 w-5" />
                    </DialogPrimitive.Close>
                  </div>
                </div>

                <CompareViewer key={current.id} item={current} />

                <div className="flex items-center gap-5">
                  <button
                    type="button"
                    onClick={() => stepItem(-1)}
                    aria-label="이전 전후 사진"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <p className="text-sm font-semibold text-white/60">가운데 선을 좌우로 끌어 청소 전후를 비교해 보세요</p>
                  <button
                    type="button"
                    onClick={() => stepItem(1)}
                    aria-label="다음 전후 사진"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : null}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  );
}
