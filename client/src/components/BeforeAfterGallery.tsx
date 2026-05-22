import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeftRight } from "lucide-react";

const galleryItems = [
  {
    id: 1,
    title: "빌라 계단 바닥 오염",
    before: "/images/stair-before.jpg",
    after: "/images/stair-after.jpg",
  },
  {
    id: 2,
    title: "소화전 먼지 제거",
    before: "/images/fire-extinguisher-before.jpg",
    after: "/images/fire-extinguisher-after.jpg",
  },
  {
    id: 3,
    title: "난간 아래 먼지 제거",
    before: "/images/stair-railing-before2.jpg",
    after: "/images/stair-railing-after2.jpg",
  },
  {
    id: 4,
    title: "창틀 오염 제거",
    before: "/images/window-frame-before.jpg",
    after: "/images/window-frame-after.jpg",
  },
];

function BeforeAfterSlider({ item }: { item: (typeof galleryItems)[0] }) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percent);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    updatePosition(e.clientX);
  }, [updatePosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    updatePosition(e.clientX);
  }, [updatePosition]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    isDragging.current = true;
    updatePosition(e.touches[0].clientX);
  }, [updatePosition]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    updatePosition(e.touches[0].clientX);
  }, [updatePosition]);

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[16/10] md:aspect-[16/9] rounded-[2rem] overflow-hidden cursor-col-resize select-none shadow-2xl border border-blue-100 bg-white"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <img
        src={item.after}
        alt={`${item.title} - 청소 후`}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPos}%` }}>
        <img
          src={item.before}
          alt={`${item.title} - 청소 전`}
          className="absolute inset-0 h-full object-cover"
          style={{
            width: containerRef.current ? `${containerRef.current.offsetWidth}px` : "100%",
            maxWidth: "none",
          }}
          draggable={false}
        />
      </div>

      <div
        className="absolute top-0 bottom-0 w-px bg-white/90 shadow-2xl z-10"
        style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full shadow-xl flex items-center justify-center border border-white/40 backdrop-blur">
          <ArrowLeftRight className="w-4 h-4 text-primary" />
        </div>
      </div>

      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur text-white text-xs font-semibold tracking-wide z-20">
        BEFORE
      </div>
      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur text-white text-xs font-semibold tracking-wide z-20">
        AFTER
      </div>

      <div className="absolute left-5 bottom-5 right-5 flex items-center justify-between gap-3">
        <div className="rounded-full bg-white/90 backdrop-blur px-4 py-2 text-sm font-semibold text-foreground shadow-sm">
          {item.title}
        </div>
        <div className="hidden sm:block rounded-full bg-black/55 backdrop-blur px-4 py-2 text-xs font-medium text-white">
          좌우로 드래그
        </div>
      </div>
    </div>
  );
}

export default function BeforeAfterGallery() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <section id="gallery" className="py-16 md:py-28 bg-gradient-to-b from-white to-blue-50/30">
      <div className="container max-w-6xl">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-sm font-bold tracking-[0.35em] text-primary mb-5">PROOF</p>
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-16 items-end">
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-foreground">
              눈으로 확인하는
              <br />
              관리 결과
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
              실제 작업 현장을 기반으로 촬영한 사진입니다.
              좌우로 드래그해 관리 전후의 차이를 확인해보세요.
            </p>
          </div>
        </motion.div>

        <div className="space-y-5">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {galleryItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setSelectedIndex(idx)}
                className={`flex-shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                  idx === selectedIndex
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-white text-muted-foreground border-blue-100 hover:text-primary hover:border-primary/30"
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>

          <motion.div
            key={galleryItems[selectedIndex].id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <BeforeAfterSlider item={galleryItems[selectedIndex]} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
