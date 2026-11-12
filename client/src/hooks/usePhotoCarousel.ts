import { useEffect, useRef, type RefObject } from "react";

const GAP_PX = 48;
const LERP = 0.1;
// 페이지를 세로로 스크롤한 만큼 카드 줄이 옆으로 흐르는 비율
const SCROLL_TO_X = 0.9;
// 빨리 움직일수록 카드가 원근감 있게 기운다 (한 프레임 이동량 1px당 라디안, 최대 약 7도)
const TILT_PER_PX = 0.006;
const TILT_MAX = 0.12;
const TILT_LERP = 0.09;
const DRAG_THRESHOLD = 6;
// 사진 아래 글줄 높이만큼 사진을 살짝 올려 카드 전체가 가운데에 오게 한다
const CAPTION_OFFSET = 24;

function wrap(value: number, period: number) {
  const half = period / 2;
  let rel = ((value % period) + period) % period;
  if (rel >= half) rel -= period;
  return rel;
}

type PhotoCarouselOptions = {
  rootRef: RefObject<HTMLDivElement | null>;
  /** 카드 요소들 (가로로 늘어설 순서대로) */
  slotRefs: RefObject<Array<HTMLElement | null>>;
  /** 카드 순서대로 사진 비율(가로/세로) */
  aspects: number[];
  reduced: boolean | null;
  /** 섹션 위쪽에 제목을 둘 때 비워 둘 높이(px). 카드는 그 아래 공간의 가운데에 온다 */
  topInset?: number;
};

/**
 * 가로로 끝없이 이어지는 사진 카드 줄의 움직임 (청소 서비스·전후 사진 카드 줄이 함께 쓴다).
 * 페이지를 스크롤한 만큼 옆으로 흐르고, 빠를수록 원근감 있게 기울었다가 멈추면 평평해진다.
 * 트랙패드로 옆으로 밀거나 끌어도 넘어가며, 끌고 놓을 때는 카드가 눌린 것으로 처리하지 않는다.
 * 마우스를 따라다니는 커서는 사이트 공통 SiteCursor가 맡는다 (카드에 data-cursor="card").
 * 카드 위치는 매 프레임 transform으로 직접 바꾸고(리렌더 없음), 움직임이 멈추면 다음 입력까지 쉰다.
 */
export function usePhotoCarousel({ rootRef, slotRefs, aspects, reduced, topInset = 0 }: PhotoCarouselOptions) {
  const engineRef = useRef<{ centerSlot: (index: number) => void } | null>(null);
  // 끌어서 넘긴 직후의 클릭은 무시한다
  const suppressClickRef = useRef(false);
  const aspectsKey = aspects.join(",");

  useEffect(() => {
    const root = rootRef.current;
    const count = aspects.length;
    if (!root || count === 0) return;

    const center = Math.floor(count / 2);
    const state = { scrollX: 0, targetX: 0, tilt: 0 };
    let cellW = 0;
    let step = 0;
    let period = 0;
    let inView = false;
    let running = false;
    let raf = 0;
    let lastScrollY = window.scrollY;
    let drag: { x: number; startTarget: number; moved: boolean; pointerId: number } | null = null;

    const measure = () => {
      cellW = slotRefs.current?.[0]?.offsetWidth ?? 0;
      step = cellW + GAP_PX;
      period = count * step;
    };

    const apply = () => {
      if (!period) return;
      const width = root.clientWidth;
      const height = root.clientHeight;
      for (let i = 0; i < count; i++) {
        const slot = slotRefs.current?.[i];
        if (!slot) continue;
        const relX = wrap((i - center) * step - state.scrollX, period);
        const x = width / 2 + relX - cellW / 2;
        const y = topInset + (height - topInset) / 2 - cellW / aspects[i] / 2 - CAPTION_OFFSET;
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

      const settled = Math.abs(state.targetX - state.scrollX) < 0.05 && Math.abs(state.tilt) < 0.0005;
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

    engineRef.current = {
      // 키보드로 화면 밖 카드에 들어가면 그 카드를 가운데로 데려온다
      centerSlot: (index: number) => {
        state.targetX = state.scrollX + wrap((index - center) * step - state.scrollX, period);
        wake();
      },
    };

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
        suppressClickRef.current = true;
        window.setTimeout(() => {
          suppressClickRef.current = false;
        }, 0);
      }
      drag = null;
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
    };
    // aspects는 배열이 새로 만들어져도 내용(aspectsKey)이 같으면 다시 설정하지 않는다
  }, [aspectsKey, reduced, topInset, rootRef, slotRefs]);

  return { engineRef, suppressClickRef };
}
