import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const galleryItems = [
  {
    id: 1,
    title: "계단 바닥 청소",
    description: "쓰레기와 오염물 제거 후 깨끗한 바닥으로",
    before: "/manus-storage/stair-floor-before_563fabe7.webp",
    after: "/manus-storage/stair-floor-after_0e13b4f5.webp",
  },
  {
    id: 2,
    title: "계단 바닥 얼룩 제거",
    description: "오래된 얼룩과 먼지를 완벽하게 제거",
    before: "/manus-storage/stair-floor2-before_58c9ba6f.webp",
    after: "/manus-storage/stair-floor2-after_264662fb.webp",
  },
  {
    id: 3,
    title: "창틀 청소",
    description: "먼지가 쌓인 창틀을 깔끔하게 닦아냄",
    before: "/manus-storage/window-frame-before_f2743b1d.webp",
    after: "/manus-storage/window-frame-after_9c733b21.webp",
  },
  {
    id: 4,
    title: "창문 레일 청소",
    description: "레일 틈새 오염물까지 꼼꼼하게 제거",
    before: "/manus-storage/window-rail-before_92ea563a.webp",
    after: "/manus-storage/window-rail-after_60e8ed20.webp",
  },
  {
    id: 5,
    title: "난간 청소",
    description: "먼지와 때가 낀 난간을 광택 나게 청소",
    before: "/manus-storage/railing-before_9d98104f.webp",
    after: "/manus-storage/railing-after_004e4850.webp",
  },
  {
    id: 6,
    title: "유리 청소",
    description: "지문과 먼지 제거로 투명하게 복원",
    before: "/manus-storage/glass-before_7c3569b7.webp",
    after: "/manus-storage/glass-after_3ef4a793.webp",
  },
];

export default function BeforeAfterGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((i) => (i === 0 ? galleryItems.length - 1 : i - 1));
  };

  const next = () => {
    setCurrentIndex((i) => (i === galleryItems.length - 1 ? 0 : i + 1));
  };

  const item = galleryItems[currentIndex];

  return (
    <section id="gallery" className="py-24 bg-gradient-to-b from-white to-blue-50/50">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            실제 작업 사례
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            청소 전/후 비교
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            이천계단지기의 실제 청소 현장입니다. 전문 장비와 친환경 세정제로 확실한 차이를 만듭니다.
          </p>
        </div>

        {/* Gallery Viewer */}
        <div className="max-w-5xl mx-auto">
          {/* Title & Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prev}
                className="rounded-full"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={next}
                className="rounded-full"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Before/After Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative group">
              <div className="absolute top-3 left-3 z-10 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                BEFORE
              </div>
              <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg border border-border">
                <img
                  src={item.before}
                  alt={`${item.title} - 청소 전`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="relative group">
              <div className="absolute top-3 left-3 z-10 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                AFTER
              </div>
              <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg border border-border">
                <img
                  src={item.after}
                  alt={`${item.title} - 청소 후`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {galleryItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentIndex
                    ? "bg-primary w-6"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>

          {/* Counter */}
          <p className="text-center text-sm text-muted-foreground mt-3">
            {currentIndex + 1} / {galleryItems.length}
          </p>
        </div>
      </div>
    </section>
  );
}
