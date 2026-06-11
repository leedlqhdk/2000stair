import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const galleryItems = [
  {
    id: 1,
    title: "빌라 계단 바닥 녹",
    before: "/images/before-after/majang-villa-stair-rust-removal-before.webp",
    after: "/images/before-after/majang-villa-stair-rust-removal-after.webp",
  },
  {
    id: 2,
    title: "공동현관 유리청소",
    before: "/images/before-after/glass-clean-before01.webp",
    after: "/images/before-after/glass-clean-after01.webp",
  },
  {
    id: 3,
    title: "소화전 오염",
    before: "/images/before-after/fire-extinguisher-before.webp",
    after: "/images/before-after/fire-extinguisher-after.webp",
  },
  {
    id: 4,
    title: "창틀 오염",
    before: "/images/before-after/railing-before.webp",
    after: "/images/before-after/railing-after.webp",
  },
  {
    id: 5,
    title: "계단 난간 아래",
    before: "/images/before-after/stair-railing-before.webp",
    after: "/images/before-after/stair-railing-after.webp",
  },
  {
    id: 6,
    title: "샤워 수전",
    before: "/images/before-after/bathroom-shower-cleaning-before.webp",
    after: "/images/before-after/bathroom-shower-cleaning-after.webp",
  },
];

function BeforeAfterCard({ item }: { item: (typeof galleryItems)[0] }) {
  return (
    <motion.article
      className="group overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-sm"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="relative grid overflow-hidden bg-blue-50 md:aspect-[16/9] md:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto">
          <img
            src={item.before}
            alt={`${item.title} 청소 전`}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <span className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1.5 text-xs font-bold tracking-wide text-white backdrop-blur">
            BEFORE
          </span>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto">
          <img
            src={item.after}
            alt={`${item.title} 청소 후`}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <span className="absolute right-4 top-4 rounded-full bg-primary/85 px-3 py-1.5 text-xs font-bold tracking-wide text-white backdrop-blur">
            AFTER
          </span>
        </div>

        <div className="absolute left-1/2 top-1/2 z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-blue-100 bg-white text-primary shadow-md md:h-12 md:w-12">
          <ChevronRight className="h-5 w-5 rotate-90 md:rotate-0" strokeWidth={3} />
        </div>
      </div>
    </motion.article>
  );
}

export default function BeforeAfterGallery() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedItem = galleryItems[selectedIndex];

  return (
    <section id="gallery" className="bg-gradient-to-b from-white to-blue-50/30 py-16 md:py-28">
      <div className="container max-w-6xl">
        <motion.div
          className="mx-auto mb-10 max-w-3xl text-center md:mb-12"
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-5 text-center text-sm font-bold tracking-[0.35em] text-primary">PROOF</p>
          <h2 className="text-center text-4xl font-extrabold leading-tight text-foreground md:text-5xl">
            눈으로 확인하는
            <br />
            관리 결과
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-center text-lg leading-relaxed text-muted-foreground">
            실제 작업 현장을 기반으로 촬영한 사진입니다.
            
          </p>
        </motion.div>

        <div className="mx-auto max-w-5xl space-y-5">
          <div className="flex gap-2 overflow-x-auto pb-2 md:justify-center">
            {galleryItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`flex-shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                  index === selectedIndex
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-blue-100 bg-white text-muted-foreground hover:border-primary/30 hover:text-primary"
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>

          <BeforeAfterCard key={selectedItem.id} item={selectedItem} />
        </div>
      </div>
    </section>
  );
}
