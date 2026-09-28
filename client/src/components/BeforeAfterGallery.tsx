import { useHomeMotion } from "@/components/HomeMotion";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronsLeftRight } from "lucide-react";
import {
  featuredBeforeAfterItems,
  type BeforeAfterItem,
} from "@/data/beforeAfter";

export function BeforeAfterCard({ item }: { item: BeforeAfterItem }) {
  const { home, reveal } = useHomeMotion();
  return (
    <motion.article
      className="group overflow-hidden rounded-[1.75rem] border border-blue-100 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.10)]"
      {...(home ? reveal(0, 12) : {
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0.35 },
      })}
    >
      <div className="relative grid aspect-[3/2] grid-cols-2 overflow-hidden bg-blue-50 sm:aspect-[16/9]">
        <div className="relative overflow-hidden border-r-2 border-white">
          <img
            src={item.before}
            alt={`${item.title} 청소 전`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-bold tracking-wide text-white backdrop-blur sm:text-xs">
            BEFORE
          </span>
        </div>

        <div className="relative overflow-hidden">
          <img
            src={item.after}
            alt={`${item.title} 청소 후`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <span className="absolute right-3 top-3 rounded-full bg-primary px-3 py-1.5 text-[11px] font-bold tracking-wide text-white backdrop-blur sm:text-xs">
            AFTER
          </span>
        </div>

        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-blue-100 bg-white text-primary shadow-[0_6px_16px_rgba(15,23,42,0.2)] sm:h-12 sm:w-12">
          <ChevronsLeftRight className="h-5 w-5" strokeWidth={2.6} />
        </div>
      </div>
    </motion.article>
  );
}

export default function BeforeAfterGallery() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const total = featuredBeforeAfterItems.length;
  const selectedItem = featuredBeforeAfterItems[selectedIndex];

  const go = (dir: number) => {
    setSelectedIndex((prev) => (prev + dir + total) % total);
  };

  return (
    <section id="gallery" className="bg-gradient-to-b from-white to-blue-50/30 py-12 md:py-28">
      <div className="container max-w-6xl">
        <motion.div
          className="mx-auto mb-7 max-w-3xl text-center md:mb-12"
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-3 text-center text-sm font-bold tracking-[0.25em] text-primary md:mb-5">PROOF</p>
          <h2 className="text-center text-2xl font-extrabold leading-tight text-foreground md:text-5xl">
            눈으로 확인하는
            <br />
            관리 결과
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-muted-foreground md:mt-5 md:text-lg">
            실제 작업 현장을 기반으로 촬영한 사진입니다.
          </p>
        </motion.div>

        <div className="mx-auto max-w-4xl">
          <BeforeAfterCard key={selectedItem.id} item={selectedItem} />

          {/* 썸네일 + 카운터 + 이전/다음 */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="-mx-1 flex min-w-0 gap-2 overflow-x-auto px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {featuredBeforeAfterItems.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  aria-label={`${item.title} 전후 보기`}
                  aria-current={index === selectedIndex}
                  className={`relative h-14 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all sm:h-16 sm:w-20 ${
                    index === selectedIndex
                      ? "border-primary shadow-sm"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={item.after}
                    alt={item.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>

            <div className="flex flex-shrink-0 items-center gap-3">
              <span className="text-sm font-bold tabular-nums text-muted-foreground">
                {selectedIndex + 1}
                <span className="mx-0.5 text-blue-200">/</span>
                {total}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="이전 전후 사진"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-100 bg-white text-primary shadow-sm transition-all hover:border-primary/40 hover:bg-blue-50 active:scale-95"
                >
                  <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="다음 전후 사진"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-100 bg-white text-primary shadow-sm transition-all hover:border-primary/40 hover:bg-blue-50 active:scale-95"
                >
                  <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>

          {/* 현재 항목 제목 */}
          <p className="mt-3 text-center text-sm font-semibold text-muted-foreground">
            {selectedItem.title}
          </p>
        </div>
      </div>
    </section>
  );
}
