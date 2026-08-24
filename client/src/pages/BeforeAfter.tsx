import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MoveHorizontal } from "lucide-react";
import Navbar from "@/components/Navbar";
import { beforeAfterItems, type BeforeAfterItem } from "@/data/beforeAfter";

function ComparisonSlider({
  item,
  priority = false,
}: {
  item: BeforeAfterItem;
  priority?: boolean;
}) {
  const [position, setPosition] = useState(50);

  return (
    <article className="overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-sm">
      <div className="flex items-end justify-between gap-4 px-5 py-5 md:px-7 md:py-6">
        <div>
          <p className="mb-1.5 text-xs font-bold text-primary md:text-sm">
            {item.category}
          </p>
          <h2 className="text-xl font-extrabold text-foreground md:text-3xl">
            {item.title}
          </h2>
        </div>
      </div>

      <div className="relative aspect-[4/5] select-none overflow-hidden bg-slate-100 md:aspect-[16/9]">
        <img
          src={item.before}
          alt={`${item.title} 청소 전`}
          className="absolute inset-0 h-full w-full object-cover"
          loading={priority ? "eager" : "lazy"}
          draggable={false}
        />
        <img
          src={item.after}
          alt={`${item.title} 청소 후`}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ clipPath: `inset(0 0 0 ${position}%)` }}
          loading={priority ? "eager" : "lazy"}
          draggable={false}
        />

        <span className="absolute left-4 top-4 z-10 rounded-full bg-black/60 px-3 py-1.5 text-xs font-bold tracking-wide text-white backdrop-blur">
          BEFORE
        </span>
        <span className="absolute right-4 top-4 z-10 rounded-full bg-primary/85 px-3 py-1.5 text-xs font-bold tracking-wide text-white backdrop-blur">
          AFTER
        </span>

        <div
          className="pointer-events-none absolute inset-y-0 z-20 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_12px_rgba(15,23,42,0.35)]"
          style={{ left: `${position}%` }}
        >
          <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-primary text-white shadow-lg">
            <MoveHorizontal className="h-5 w-5" strokeWidth={2.5} />
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={position}
          onInput={(event) => setPosition(Number(event.currentTarget.value))}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-label={`${item.title} 청소 전후 비교`}
          aria-valuetext={`청소 전 ${position}%, 청소 후 ${100 - position}%`}
          className="absolute inset-0 z-30 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
    </article>
  );
}

export default function BeforeAfter() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const moveCarousel = (direction: -1 | 1) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    carousel.scrollBy({
      left: direction * carousel.clientWidth * 0.88,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        <section className="border-b border-blue-100 bg-blue-50/35">
          <div className="container max-w-6xl py-14 md:py-20">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="mb-4 text-xs font-bold tracking-[0.25em] text-primary md:text-sm">
                BEFORE &amp; AFTER
              </p>
              <h1 className="text-4xl font-extrabold leading-tight text-foreground md:text-6xl">
                청소 전후 사진
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                이천 빌라·상가의 계단, 공동현관 유리와 화장실을 직접 관리한 전후 사진을 모았습니다.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-12 md:py-20">
          <div className="container max-w-6xl">
            <div className="mb-5 flex items-center justify-between gap-4 md:mb-7">
              <p className="text-sm font-bold text-muted-foreground">
                {beforeAfterItems.length}개의 실제 작업 사례
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => moveCarousel(-1)}
                  aria-label="이전 청소 전후 사진"
                  title="이전 사진"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-blue-100 bg-white text-primary shadow-sm transition hover:border-primary/30 hover:bg-blue-50"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveCarousel(1)}
                  aria-label="다음 청소 전후 사진"
                  title="다음 사진"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-blue-100 bg-white text-primary shadow-sm transition hover:border-primary/30 hover:bg-blue-50"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <motion.div
            ref={carouselRef}
            className="mx-auto flex max-w-[calc(100vw-2rem)] snap-x snap-mandatory gap-5 overflow-x-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:max-w-[calc(100vw-4rem)] md:gap-6"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            {beforeAfterItems.map((item, index) => (
              <div
                key={item.id}
                className="min-w-full snap-start md:min-w-[min(920px,82vw)]"
              >
                <ComparisonSlider item={item} priority={index === 0} />
              </div>
            ))}
          </motion.div>
        </section>
      </main>
    </div>
  );
}
