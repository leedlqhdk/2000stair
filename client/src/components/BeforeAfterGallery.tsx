import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const galleryItems = [
  {
    id: 1,
    title: "빌라 계단 바닥 오염",
    before: "/images/before-after/stair-before.webp",
    after: "/images/before-after/stair-after.webp",
  },
  {
    id: 2,
    title: "소화전 먼지 제거",
    before: "/images/before-after/fire-extinguisher-before.webp",
    after: "/images/before-after/fire-extinguisher-after.webp",
  },
  {
    id: 3,
    title: "난간 아래 먼지 제거",
    before: "/images/before-after/railing-before.webp",
    after: "/images/before-after/railing-after.webp",
  },
  {
    id: 4,
    title: "계단 난간 오염 제거",
    before: "/images/before-after/stair-railing-before.webp",
    after: "/images/before-after/stair-railing-after.webp",
  },
];

function BeforeAfterCard({ item, index }: { item: (typeof galleryItems)[0]; index: number }) {
  return (
    <motion.article
      className="group overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.06 }}
    >
      <div className="relative grid aspect-[16/10] grid-cols-2 overflow-hidden bg-blue-50">
        <div className="relative overflow-hidden">
          <img
            src={item.before}
            alt={`${item.title} 청소 전`}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-bold tracking-wide text-white backdrop-blur">
            BEFORE
          </span>
        </div>

        <div className="relative overflow-hidden">
          <img
            src={item.after}
            alt={`${item.title} 청소 후`}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <span className="absolute right-3 top-3 rounded-full bg-primary/85 px-2.5 py-1 text-[11px] font-bold tracking-wide text-white backdrop-blur">
            AFTER
          </span>
        </div>

        <div className="absolute left-1/2 top-1/2 z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-blue-100 bg-white text-primary shadow-md">
          <ChevronRight className="h-4 w-4" strokeWidth={3} />
        </div>
      </div>

      <div className="px-5 py-4">
        <h3 className="text-base font-extrabold leading-snug text-foreground">
          {item.title}
        </h3>
      </div>
    </motion.article>
  );
}

export default function BeforeAfterGallery() {
  return (
    <section id="gallery" className="bg-gradient-to-b from-white to-blue-50/30 py-16 md:py-28">
      <div className="container max-w-6xl">
        <motion.div
          className="mx-auto mb-10 max-w-3xl text-center md:mb-14"
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
            관리 전후의 차이를 한눈에 확인해보세요.
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2">
          {galleryItems.map((item, index) => (
            <BeforeAfterCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
