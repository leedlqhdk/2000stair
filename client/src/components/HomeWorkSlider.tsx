import { useEffect, useState } from "react";
import Reveal from "@/components/Reveal";

/**
 * 모바일 메인 — "관리비 불만" 공감 뒤에 놓이는 해결 선언 + 실제 작업 사진 마퀴.
 * 사진을 바꾸려면 아래 workPhotos 배열만 수정하면 됩니다.
 *
 * revealed=false 이면 접힌 상태로 대기하다가, 위 고민 섹션의 대화가 끝나면 펼쳐집니다.
 * 콘텐츠 자체는 항상 DOM에 있으므로 검색엔진은 처음부터 읽을 수 있습니다.
 */

const workPhotos = [
  { src: "/images/icheon-majang-villa-cleaning.webp", caption: "마장면 빌라 계단" },
  { src: "/images/services/stair-cleaning/stair-info-02.webp", caption: "난간·손잡이" },
  { src: "/images/icheon-sindun-stair-cleaning.webp", caption: "신둔면 공동현관" },
  { src: "/images/services/glass-cleaning/glass-page03.webp", caption: "공동현관 유리" },
  { src: "/images/icheon-downtown-stair-cleaning.webp", caption: "시내권 공동현관" },
  { src: "/images/services/stair-cleaning/stair-info-01.webp", caption: "계단 바닥" },
  { src: "/images/icheon-bubal-store-cleaning.webp", caption: "부발읍 상가 유리" },
  { src: "/images/icheon-songjeong-villa-cleaning.webp", caption: "송정동 빌라 공용공간" },
  { src: "/images/services/stair-cleaning/stair-info-03.webp", caption: "복도·공용공간" },
  { src: "/images/icheon-gwango-building-cleaning.webp", caption: "관고동 건물 화장실" },
  { src: "/images/before-after/glass-clean-after01.webp", caption: "상가 통유리" },
  { src: "/images/services/glass-cleaning/glass-page01.webp", caption: "대형 유리 작업" },
  { src: "/images/areas/downtown/downtown-2.webp", caption: "손잡이 마무리" },
  { src: "/images/husband-profile.webp", caption: "장비는 직접 챙깁니다" },
];

type Props = {
  /** 위 고민 섹션의 대화가 끝나면 true */
  revealed?: boolean;
};

export default function HomeWorkSlider({ revealed = false }: Props) {
  const track = [...workPhotos, ...workPhotos];
  const [fallback, setFallback] = useState(false);

  // 어떤 이유로든 신호가 오지 않아도 섹션이 영영 숨겨지지 않도록 하는 안전장치.
  useEffect(() => {
    const timer = setTimeout(() => setFallback(true), 12000);
    return () => clearTimeout(timer);
  }, []);

  const show = revealed || fallback;

  return (
    <div
      className={`grid transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        show ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="overflow-hidden" key={show ? "revealed" : "hidden"}>
    <section className="overflow-hidden bg-blue-50/60 py-10">
      <style>{`
        @keyframes home-work-marquee {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }
        .home-work-track {
          animation: home-work-marquee 15s linear infinite;
          width: max-content;
        }
        @media (prefers-reduced-motion: reduce) {
          .home-work-track { animation: none; }
        }
      `}</style>

      <Reveal className="px-5">
        <h2 className="break-keep font-['GmarketSans'] text-lg font-extrabold leading-snug text-foreground">
          저희는 사람을 바꾸지 않습니다
        </h2>
        <p className="mt-3 break-keep text-[13px] font-medium leading-relaxed text-gray-600">
          하청도, 일용직도 쓰지 않습니다. 처음 건물 상태를 확인한{" "}
          <strong className="font-extrabold text-foreground">같은 부부가 계속 방문해</strong> 이천의 계단과
          공동현관을 이어서 관리합니다.
        </p>
      </Reveal>

      <div className="mt-7 flex gap-3 overflow-hidden" aria-label="이천계단지기 실제 작업 사진">
        <div className="home-work-track flex shrink-0 gap-3">
          {track.map((photo, i) => (
            <figure
              key={`${photo.src}-${i}`}
              className="relative w-[168px] shrink-0 overflow-hidden rounded-2xl bg-white shadow-[0_6px_20px_rgba(15,23,42,0.08)]"
            >
              <img
                src={photo.src}
                alt={`이천계단지기 대표가 직접 작업한 현장 – ${photo.caption}`}
                className="aspect-[3/4] w-full object-cover object-center"
                loading="lazy"
                aria-hidden={i >= workPhotos.length}
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2.5 pt-6 text-[11.5px] font-bold text-white">
                {photo.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
      </div>
    </div>
  );
}
