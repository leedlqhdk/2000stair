import { useEffect, useRef } from "react";

const LERP = 0.22;

/**
 * 사이트 전체(PC 마우스)에서 하나로 쓰는 따라다니는 커서 (스타일은 index.css의 .site-cursor).
 * 평소에는 작은 사각 테두리이고, 마우스 아래 요소의 data-cursor에 따라 모양만 바뀐다.
 * - data-cursor="card": 사진 카드 위 → 큰 원 + 안쪽 원 (참고: Codrops WebGPU 페이지 전환 데모)
 * - data-cursor="brush": 첫 화면 바닥 닦기 → 붓 크기(data-cursor-size, px) 원 + 가운데 점
 * 흰 테두리에 mix-blend-mode: difference를 써서 밝은 바탕에선 어둡게, 어두운 사진 위에선 밝게 보인다.
 */
export default function SiteCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pos = { x: 0, y: 0, tx: 0, ty: 0 };
    let visible = false;
    let running = false;
    let raf = 0;
    let mode = "";

    const tick = () => {
      const lerp = reduced ? 1 : LERP;
      pos.x += (pos.tx - pos.x) * lerp;
      pos.y += (pos.ty - pos.y) * lerp;
      cursor.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      if (Math.abs(pos.tx - pos.x) < 0.2 && Math.abs(pos.ty - pos.y) < 0.2) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const hide = () => {
      visible = false;
      cursor.classList.remove("is-visible");
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        hide();
        return;
      }
      pos.tx = event.clientX;
      pos.ty = event.clientY;
      if (!visible) {
        visible = true;
        pos.x = pos.tx;
        pos.y = pos.ty;
        cursor.classList.add("is-visible");
      }

      const target = (event.target as Element | null)?.closest?.<HTMLElement>("[data-cursor]") ?? null;
      const next = target?.dataset.cursor ?? "";
      if (next !== mode) {
        cursor.classList.toggle("is-card", next === "card");
        cursor.classList.toggle("is-brush", next === "brush");
        mode = next;
      }
      if (next === "brush" && target?.dataset.cursorSize) {
        cursor.style.setProperty("--cursor-brush", `${target.dataset.cursorSize}px`);
      }

      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    // 창 밖으로 나가면 숨긴다
    const onPointerOut = (event: PointerEvent) => {
      if (!event.relatedTarget) hide();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerout", onPointerOut);
    window.addEventListener("blur", hide);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("blur", hide);
    };
  }, []);

  return (
    <div ref={cursorRef} aria-hidden="true" className="site-cursor">
      <span />
    </div>
  );
}
