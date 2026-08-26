import { useState } from "react";
import { motion } from "framer-motion";
import { MoveHorizontal } from "lucide-react";
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
      <div className="flex items-end justify-between gap-4 px-4 py-4 md:px-7 md:py-6">
        <div>
          <p className="mb-1.5 text-xs font-bold text-primary md:text-sm">
            {item.category}
          </p>
          <h2 className="text-[17px] font-extrabold text-foreground md:text-3xl">
            {item.title}
          </h2>
        </div>
      </div>

      <div className="relative aspect-[3/2] select-none overflow-hidden bg-slate-100 md:aspect-[16/9]">
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

        <span className="absolute left-3 top-3 z-10 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold tracking-wide text-white backdrop-blur md:left-4 md:top-4 md:px-3 md:py-1.5 md:text-xs">
          BEFORE
        </span>
        <span className="absolute right-3 top-3 z-10 rounded-full bg-primary/85 px-2.5 py-1 text-[10px] font-bold tracking-wide text-white backdrop-blur md:right-4 md:top-4 md:px-3 md:py-1.5 md:text-xs">
          AFTER
        </span>

        <div
          className="pointer-events-none absolute inset-y-0 z-20 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_12px_rgba(15,23,42,0.35)]"
          style={{ left: `${position}%` }}
        >
          <span className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-primary text-white shadow-lg md:h-11 md:w-11">
            <MoveHorizontal className="h-4 w-4 md:h-5 md:w-5" strokeWidth={2.5} />
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
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        <section className="border-b border-blue-100 bg-blue-50/35">
          <div className="container max-w-6xl py-9 md:py-20">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="mb-3 text-xs font-bold tracking-[0.25em] text-primary md:mb-4 md:text-sm">
                BEFORE &amp; AFTER
              </p>
              <h1 className="text-[28px] font-extrabold leading-tight text-foreground md:text-6xl">
                청소 전후 사진
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:mt-5 md:text-lg md:leading-8">
                이천 빌라·상가의 계단, 공동현관 유리와 화장실을 직접 관리한 전후 사진을 모았습니다.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-8 md:py-20">
          <motion.div
            className="mx-auto flex max-w-[calc(100vw-2rem)] flex-col gap-5 pb-5 md:max-w-[min(920px,82vw)] md:gap-6"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            {beforeAfterItems.map((item, index) => (
              <div
                key={item.id}
                className="w-full"
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
