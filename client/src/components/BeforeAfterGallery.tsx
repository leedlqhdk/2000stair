import { useState, useRef, useCallback } from "react";

const galleryItems = [
  {
    id: 1,
    title: "계단 공용공간",
    before: "/manus-storage/stair-floor-before_563fabe7.webp",
    after: "/manus-storage/stair-floor-after_0e13b4f5.webp",
  },
  {
    id: 2,
    title: "바닥 얼룩 제거",
    before: "/manus-storage/stair-floor2-before_58c9ba6f.webp",
    after: "/manus-storage/stair-floor2-after_264662fb.webp",
  },
  {
    id: 3,
    title: "꽃가루 청소",
    before: "/manus-storage/window-frame-before_f2743b1d.webp",
    after: "/manus-storage/window-frame-after_9c733b21.webp",
  },
  {
    id: 4,
    title: "창문 레일 청소",
    before: "/manus-storage/window-rail-before_92ea563a.webp",
    after: "/manus-storage/window-rail-after_60e8ed20.webp",
  },
  {
    id: 5,
    title: "난간 청소",
    before: "/manus-storage/railing-before_9d98104f.webp",
    after: "/manus-storage/railing-after_004e4850.webp",
  },
  {
    id: 6,
    title: "엘리베이터 얼룩",
    before: "/manus-storage/glass-before_7c3569b7.webp",
    after: "/manus-storage/glass-after_3ef4a793.webp",
  },
];

function BeforeAfterSlider({ item }: { item: typeof galleryItems[0] }) {
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
      className="relative w-full aspect-[4/3] rounded-xl overflow-hidden cursor-col-resize select-none shadow-md border border-border"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* After image (full background) */}
      <img
        src={item.after}
        alt={`${item.title} - 청소 후`}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />
      {/* Before image (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPos}%` }}
      >
        <img
          src={item.before}
          alt={`${item.title} - 청소 전`}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%', maxWidth: 'none' }}
          draggable={false}
        />
      </div>
      {/* Slider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10"
        style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
      >
        {/* Slider handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-primary">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-primary">
            <path d="M4 8L1 8M1 8L3 6M1 8L3 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8L15 8M15 8L13 6M15 8L13 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      {/* Labels */}
      <div className="absolute top-3 left-3 px-2 py-0.5 bg-red-500/90 text-white text-xs font-bold rounded-full z-20">
        BEFORE
      </div>
      <div className="absolute top-3 right-3 px-2 py-0.5 bg-green-500/90 text-white text-xs font-bold rounded-full z-20">
        AFTER
      </div>
    </div>
  );
}

export default function BeforeAfterGallery() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <section id="gallery" className="py-20 bg-gradient-to-b from-white to-blue-50/30">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            실제 작업 사례
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            청소 전/후 비교
          </h2>
          <p className="text-muted-foreground text-sm">
            좌우로 드래그하여 청소 전/후를 비교해보세요
          </p>
        </div>

        {/* Main content - compact layout */}
        <div className="max-w-4xl mx-auto">
          {/* Thumbnail selector */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 justify-center">
            {galleryItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setSelectedIndex(idx)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  idx === selectedIndex
                    ? "bg-primary text-white shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>

          {/* Slider */}
          <BeforeAfterSlider item={galleryItems[selectedIndex]} />
        </div>
      </div>
    </section>
  );
}
