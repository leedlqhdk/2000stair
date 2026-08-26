import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

const SHOW_AFTER_PX = 600;

function browserHasNativeScrollTop() {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;

  const isSamsungInternet = /SamsungBrowser/i.test(navigator.userAgent);
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  // 삼성 인터넷은 모바일 화면 하단에 자체 '맨 위로' 버튼을 제공하므로
  // 같은 위치에 홈페이지 버튼을 중복 노출하지 않습니다.
  return isSamsungInternet && isTouchDevice;
}

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasNativeButton, setHasNativeButton] = useState(false);

  useEffect(() => {
    let frameId: number | null = null;

    const updateState = () => {
      setIsVisible(window.scrollY >= SHOW_AFTER_PX);
      setHasNativeButton(browserHasNativeScrollTop());
      frameId = null;
    };

    const handleUpdate = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(updateState);
    };

    updateState();
    window.addEventListener("scroll", handleUpdate, { passive: true });
    window.addEventListener("resize", handleUpdate);

    return () => {
      window.removeEventListener("scroll", handleUpdate);
      window.removeEventListener("resize", handleUpdate);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, []);

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const shouldShow = isVisible && !hasNativeButton;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="페이지 맨 위로 이동"
      title="맨 위로"
      className={`fixed bottom-[4.5rem] left-1/2 z-40 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-white/80 bg-white/72 text-slate-800 shadow-[0_5px_18px_rgba(15,23,42,0.14)] backdrop-blur-md transition-[opacity,transform,background-color,border-color] duration-300 hover:-translate-y-0.5 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 md:bottom-8 md:h-14 md:w-14 md:border-slate-200/70 md:bg-white/68 ${
        shouldShow
          ? "pointer-events-auto -translate-x-1/2 translate-y-0 opacity-100"
          : "pointer-events-none -translate-x-1/2 translate-y-3 opacity-0"
      }`}
    >
      <ChevronUp className="h-6 w-6 stroke-[2.3] md:h-7 md:w-7" />
    </button>
  );
}
