import { MessageCircle, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { trackConversion } from "@/lib/analytics";

const KAKAO_CHANNEL_URL = "https://pf.kakao.com/_IiNfn/chat";
const PHONE_NUMBER = "010-8438-1887";

const expandedButtonClass = "w-[120px] px-3 md:w-[168px] md:px-5";
const collapsedButtonClass = "w-11 px-0 md:w-14 md:px-0";
const expandedTextClass = "max-w-[72px] opacity-100 md:max-w-[80px]";
const collapsedTextClass = "max-w-0 opacity-0";

export default function KakaoChat() {
  const [location] = useLocation();
  const isHome = location === "/";
  const [isScrolling, setIsScrolling] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const scrollTimer = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);

      if (scrollTimer.current) {
        window.clearTimeout(scrollTimer.current);
      }

      scrollTimer.current = window.setTimeout(() => {
        setIsScrolling(false);
      }, 650);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimer.current) {
        window.clearTimeout(scrollTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      {
        threshold: 0.12,
      }
    );

    observer.observe(footer);

    return () => {
      observer.disconnect();
    };
  }, []);

  const buttonWidthClass = isScrolling ? collapsedButtonClass : expandedButtonClass;
  const buttonTextClass = isScrolling ? collapsedTextClass : expandedTextClass;
  const buttonGapClass = isScrolling ? "gap-0" : "gap-1 md:gap-2";

  return (
    <>
      {!isFooterVisible && (
        <div
          className={`fixed bottom-4 right-4 z-50 flex-col items-end gap-1.5 md:bottom-6 md:right-6 md:gap-3 ${
            isHome ? "hidden lg:flex" : "flex"
          }`}
        >
          {!isScrolling && (
            <div className="pointer-events-none mb-1 mr-1 rounded-2xl bg-white/95 px-4 py-3 shadow-lg shadow-blue-900/8 ring-1 ring-blue-100 backdrop-blur">
              <p className="text-center text-xs font-extrabold leading-snug text-slate-700 md:text-sm">
                주소 보내주시면
                <br />
                빠르게 답변드려요 :)
              </p>
            </div>
          )}

          <a
            href={`tel:${PHONE_NUMBER.replace(/-/g, "")}`}
            onClick={() => trackConversion("phone_click", { location: "floating_cta", label: "전화문의" })}
            className={`flex h-11 items-center justify-center overflow-hidden rounded-full bg-primary text-xs font-extrabold text-white shadow-md shadow-blue-900/10 transition-all duration-300 hover:bg-primary/90 md:h-14 md:text-base ${buttonGapClass} ${buttonWidthClass}`}
            aria-label="전화 문의하기"
          >
            <Phone className="h-4 w-4 shrink-0 translate-x-[0.5px] translate-y-[0.5px] stroke-[2.8] md:h-5 md:w-5" />
            <span className={`whitespace-nowrap transition-all duration-300 ${buttonTextClass}`}>전화문의</span>
          </a>

          <a
            href={KAKAO_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackConversion("kakao_click", { location: "floating_cta", label: "카톡상담" })}
            className={`flex h-11 items-center justify-center overflow-hidden rounded-full bg-[#FEE500] text-xs font-extrabold text-[#191919] shadow-md shadow-yellow-900/5 ring-1 ring-black/5 transition-all duration-300 hover:bg-[#F4DC00] md:h-14 md:text-base ${buttonGapClass} ${buttonWidthClass}`}
            aria-label="카카오톡 상담하기"
          >
            <MessageCircle className="h-4 w-4 shrink-0 translate-y-[0.5px] stroke-[2.8] md:h-5 md:w-5" />
            <span className={`whitespace-nowrap transition-all duration-300 ${buttonTextClass}`}>카톡상담</span>
          </a>
        </div>
      )}
    </>
  );
}
