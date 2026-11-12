import { useEffect, type RefObject } from "react";

const CURSOR_LERP = 0.2;

/**
 * 참고 데모처럼 마우스를 따라다니는 작은 사각 테두리 커서 (클래스 photo-carousel-cursor, 스타일은 index.css).
 * rootRef 안에서만 보이고, [data-carousel-card] 위에서는 원으로 커진다. 마우스가 있는 PC에서만 움직인다.
 */
export function useFollowCursor(rootRef: RefObject<HTMLElement | null>, cursorRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const cursor = { x: 0, y: 0, tx: 0, ty: 0, visible: false };
    let raf = 0;
    let running = false;

    const tick = () => {
      cursor.x += (cursor.tx - cursor.x) * CURSOR_LERP;
      cursor.y += (cursor.ty - cursor.y) * CURSOR_LERP;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursor.x}px, ${cursor.y}px, 0) translate(-50%, -50%)`;
      }
      if (!cursor.visible || (Math.abs(cursor.tx - cursor.x) < 0.3 && Math.abs(cursor.ty - cursor.y) < 0.3)) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = root.getBoundingClientRect();
      cursor.tx = event.clientX - rect.left;
      cursor.ty = event.clientY - rect.top;
      if (!cursor.visible) {
        cursor.visible = true;
        cursor.x = cursor.tx;
        cursor.y = cursor.ty;
        cursorRef.current?.classList.add("is-visible");
      }
      const overCard = Boolean((event.target as Element | null)?.closest?.("[data-carousel-card]"));
      cursorRef.current?.classList.toggle("is-hover", overCard);
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };
    const onPointerLeave = () => {
      cursor.visible = false;
      cursorRef.current?.classList.remove("is-visible", "is-hover");
    };

    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerleave", onPointerLeave);
    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [rootRef, cursorRef]);
}
