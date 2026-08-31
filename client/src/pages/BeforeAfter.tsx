import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import InfoPageHero from "@/components/InfoPageHero";
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
    <article className="overflow-hidden">
      <div className="relative aspect-[4/3] select-none overflow-hidden rounded-[2rem] border border-white/40 bg-white/20 shadow-[0_24px_80px_rgba(15,23,42,0.22)] backdrop-blur-xl md:aspect-[4/3]">
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

        <span className="absolute left-4 top-4 z-10 rounded-full bg-black/55 px-3 py-1.5 text-xs font-bold tracking-wide text-white backdrop-blur">
          BEFORE
        </span>
        <span className="absolute right-4 top-4 z-10 rounded-full bg-primary/85 px-3 py-1.5 text-xs font-bold tracking-wide text-white backdrop-blur">
          AFTER
        </span>

        <div
          className="pointer-events-none absolute inset-y-0 z-20 w-1 cursor-col-resize bg-white shadow"
          style={{ left: `${position}%` }}
        >
          <span className="absolute top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white text-xs font-bold text-primary shadow-lg">
            ↔
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
        <section className="container max-w-4xl px-5 pb-2 pt-8 md:pb-4 md:pt-12">
          <InfoPageHero
            eyebrow="BEFORE &amp; AFTER"
            title="청소 전후 사진"
            description="이천 빌라·상가의 계단, 공동현관 유리와 화장실을 직접 관리한 전후 사진을 모았습니다."
          />
        </section>

        <section className="py-8 md:py-16">
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
