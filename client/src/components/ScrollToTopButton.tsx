import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { FLOATING_QUIET_EVENT, isQuietSectionBehind } from "@/lib/floatingQuiet";

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
  const [isOverQuietSection, setIsOverQuietSection] = useState(false);

  useEffect(() => {
    let frameId: number | null = null;

    const updateState = () => {
      setIsVisible(window.scrollY >= SHOW_AFTER_PX);
      setIsOverQuietSection(isQuietSectionBehind(96));
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
    window.addEventListener(FLOATING_QUIET_EVENT, handleUpdate);

    return () => {
      window.removeEventListener("scroll", handleUpdate);
      window.removeEventListener("resize", handleUpdate);
      window.removeEventListener(FLOATING_QUIET_EVENT, handleUpdate);
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

  // 전체화면 섹션 하단 글자 위에서는 잠시 숨긴다
  const shouldShow = isVisible && !hasNativeButton && !isOverQuietSection;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="페이지 맨 위로 이동"
      title="맨 위로"
      // 모바일에서는 화면 가운데 글·카드를 가리지 않도록 왼쪽 아래(하단 전화·카톡 바 위)에 작게 둔다. PC는 아래 가운데
      className={`fixed bottom-[4.5rem] left-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/72 text-slate-800 shadow-[0_5px_18px_rgba(15,23,42,0.14)] backdrop-blur-md transition-[opacity,translate,background-color,border-color] duration-300 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 md:bottom-8 md:left-1/2 md:h-14 md:w-14 md:-translate-x-1/2 md:border-slate-200/70 md:bg-white/68 ${
        shouldShow ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ChevronUp className="h-6 w-6 stroke-[2.3] md:h-7 md:w-7" />
    </button>
  );
}
