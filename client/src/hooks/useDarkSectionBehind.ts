import { useEffect, useRef, useState } from "react";
import { FLOATING_QUIET_EVENT } from "@/lib/floatingQuiet";

type Options = {
  enabled?: boolean;
  /** 처음 그릴 때의 값 (첫 화면이 어두운 사진이면 true) */
  initial?: boolean;
};

/**
 * 화면의 특정 높이(probeY) 바로 뒤에 어두운 섹션(data-nav-theme="dark")이 있는지 알려준다.
 * 투명 상단 바, 섹션 점 메뉴처럼 배경 위에 떠 있는 요소의 색을 바꿀 때 쓴다.
 */
export function useDarkSectionBehind(getProbeY: () => number, { enabled = true, initial = false }: Options = {}) {
  const [onDark, setOnDark] = useState(initial);
  const probeRef = useRef(getProbeY);
  probeRef.current = getProbeY;

  useEffect(() => {
    if (!enabled) return;
    let frame: number | null = null;

    const update = () => {
      frame = null;
      const y = probeRef.current();
      const dark = Array.from(document.querySelectorAll('[data-nav-theme="dark"]')).some((section) => {
        const rect = section.getBoundingClientRect();
        return rect.height > 0 && rect.top <= y && rect.bottom >= y;
      });
      setOnDark(dark);
    };
    const schedule = () => {
      if (frame === null) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // 첫 화면이 늦게 그려져도(인트로 등) 바로 반영한다
    window.addEventListener(FLOATING_QUIET_EVENT, schedule);
    // 사진이 늦게 로드되며 페이지 길이가 바뀌면 스크롤 없이도 섹션 위치가 달라지므로 다시 확인한다
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener(FLOATING_QUIET_EVENT, schedule);
      resizeObserver.disconnect();
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [enabled]);

  return onDark;
}
