import { useEffect, useState } from "react";

const homeSections = [
  { id: "home-hero", title: "이천 건물 정기 청소관리", description: "하청 없이 부부가 직접 꾸준히 관리합니다." },
  { id: "home-concerns", title: "기존 관리가 아쉬웠던 이유", description: "건물주가 자주 말하는 관리 고민을 확인합니다." },
  { id: "home-representative", title: "같은 사람이, 꾸준히", description: "처음 본 건물 상태를 기억하고 이어서 관리합니다." },
  { id: "home-process", title: "관리 진행 방식", description: "방문 확인부터 작업 기록까지 한눈에 봅니다." },
  { id: "home-services", title: "청소 서비스", description: "계단·사무실·화장실·유리 정기관리 안내입니다." },
  { id: "home-before-after", title: "청소 전후 사진", description: "실제 현장의 작업 전후 모습을 확인합니다." },
  { id: "home-areas", title: "관리지역", description: "이천에서 실제 방문 관리하는 지역을 안내합니다." },
  { id: "home-reviews", title: "실제 고객 후기", description: "고객이 남긴 후기를 출처와 함께 확인합니다." },
  { id: "home-contact", title: "방문견적 문의", description: "건물 주소를 보내주시면 방문 가능 여부를 안내합니다." },
] as const;

export default function HomeSectionNavigator() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

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

  const preview = previewIndex === null ? null : homeSections[previewIndex];

  return (
    <nav
      aria-label="메인 화면 섹션 바로가기"
      className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 lg:block xl:right-6"
      onMouseLeave={() => setPreviewIndex(null)}
    >
      <div className="relative flex flex-col items-center gap-3 rounded-full bg-white/85 px-2.5 py-3.5 shadow-[0_8px_28px_rgba(15,76,169,0.12)] ring-1 ring-blue-100 backdrop-blur-md">
        {homeSections.map((section, index) => {
          const active = index === activeIndex;

          return (
            <button
              key={section.id}
              type="button"
              aria-label={`${section.title} 섹션으로 이동`}
              aria-current={active ? "location" : undefined}
              className="group flex h-4 w-4 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              onMouseEnter={() => setPreviewIndex(index)}
              onFocus={() => setPreviewIndex(index)}
              onBlur={() => setPreviewIndex(null)}
              onClick={() => document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  active
                    ? "h-3 w-3 bg-primary shadow-[0_0_0_4px_rgba(15,76,169,0.12)]"
                    : "h-2.5 w-2.5 border-2 border-blue-200 bg-white group-hover:border-primary group-hover:bg-blue-50"
                }`}
              />
            </button>
          );
        })}

        {preview && (
          <div className="pointer-events-none absolute right-[3.25rem] top-1/2 w-72 -translate-y-1/2 rounded-lg border border-white/10 bg-[#1d1d1f] px-5 py-4 text-left shadow-2xl">
            <p className="break-keep text-sm font-extrabold leading-6 text-white">{preview.title}</p>
            <p className="mt-1.5 break-keep text-xs font-medium leading-5 text-white/60">{preview.description}</p>
          </div>
        )}
      </div>
    </nav>
  );
}
