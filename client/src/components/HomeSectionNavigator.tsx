import { useEffect, useState } from "react";
import { useDarkSectionBehind } from "@/hooks/useDarkSectionBehind";

const homeSections = [
  { id: "home-hero", title: "이천 건물 정기 청소관리" },
  { id: "home-concerns", title: "기존 관리가 아쉬웠던 이유" },
  { id: "home-representative", title: "같은 사람이, 꾸준히" },
  { id: "home-process", title: "관리 지역·진행 방식" },
  { id: "home-services", title: "청소 서비스" },
  { id: "home-before-after", title: "청소 전후 사진" },
  { id: "home-reviews", title: "실제 고객 후기" },
  { id: "home-work-log", title: "최신 작업일지" },
  { id: "home-contact", title: "방문견적 문의" },
] as const;

export default function HomeSectionNavigator() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  // 점 메뉴가 놓인 화면 가운데 뒤가 어두운 사진·파란 섹션이면 흰색으로 바꾼다
  const onDark = useDarkSectionBehind(() => window.innerHeight / 2, { initial: true });

  useEffect(() => {
    let frame: number | null = null;

    const updateActiveSection = () => {
      frame = null;
      const anchor = window.innerHeight * 0.42;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      homeSections.forEach((section, index) => {
        const element = document.getElementById(section.id);
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const distance = rect.top <= anchor && rect.bottom >= anchor
          ? 0
          : Math.min(Math.abs(rect.top - anchor), Math.abs(rect.bottom - anchor));

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex((current) => (current === closestIndex ? current : closestIndex));
    };

    const requestUpdate = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <nav
      aria-label="메인 화면 섹션 바로가기"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 lg:block xl:right-7"
      onMouseLeave={() => setPreviewIndex(null)}
    >
      {/* 캡슐 없이 가는 막대만: 지금 섹션은 길게, 마우스를 올리면 늘어나며 섹션 이름이 나온다 */}
      <ol className="flex flex-col items-end gap-1">
        {homeSections.map((section, index) => {
          const active = index === activeIndex;
          const previewing = index === previewIndex;

          return (
            <li key={section.id}>
              <button
                type="button"
                aria-label={`${section.title} 섹션으로 이동`}
                aria-current={active ? "location" : undefined}
                className="group flex h-6 items-center justify-end gap-3 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                onMouseEnter={() => setPreviewIndex(index)}
                onFocus={() => setPreviewIndex(index)}
                onBlur={() => setPreviewIndex(null)}
                onClick={() => document.getElementById(section.id)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" })}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold transition-all duration-300 ${
                    previewing ? "translate-x-0 opacity-100" : "translate-x-1 opacity-0"
                  } ${onDark ? "bg-slate-950/55 text-white backdrop-blur-sm" : "bg-white/90 text-slate-700 shadow-sm ring-1 ring-slate-200/70"}`}
                >
                  {section.title}
                </span>
                <span
                  aria-hidden="true"
                  className={`block h-[2px] rounded-full transition-all duration-300 ${
                    active ? "w-8" : previewing ? "w-6" : "w-3.5"
                  } ${
                    onDark
                      ? active ? "bg-white" : "bg-white/45 group-hover:bg-white/80"
                      : active ? "bg-primary" : "bg-slate-300 group-hover:bg-slate-500"
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
