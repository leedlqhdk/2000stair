import { motion } from "framer-motion";
import { Check, Phone, MessageCircle } from "lucide-react";
import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";

export interface ServiceFeature {
  title: string;
  description: string;
  icon?: string;
}

export interface ServicePricingTier {
  badge: string;
  price: string;
  note: string;
  highlight?: boolean;
}

export interface GalleryPair {
  before: string;
  after: string;
  label?: string;
  caption?: string;
}

export interface ServicePageData {
  heroTitle: string;
  heroSubtitle: string;
  heroBgImage?: string;
  heroVideo?: string;
  features: ServiceFeature[];
  scopeItems: string[];
  pricingTiers: ServicePricingTier[];
  gallery?: GalleryPair[];
  serviceFolder: string;
}

function BeforeAfterSlider({ before, after }: GalleryPair) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updatePos = (clientX: number) => {
    if (!ref.current) return;
    const { left, width } = ref.current.getBoundingClientRect();
    setPos(Math.max(2, Math.min(98, ((clientX - left) / width) * 100)));
  };

  const handleTouch = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      updatePos(e.touches[0].clientX);
    }
  };

  return (
    <div className="flex w-full flex-col items-center">
      <div
        ref={ref}
        className="relative aspect-[4/3] w-full cursor-col-resize select-none overflow-hidden rounded-2xl shadow-md"
        onMouseMove={(e) => {
          if (dragging.current) updatePos(e.clientX);
        }}
        onMouseDown={(e) => {
          dragging.current = true;
          updatePos(e.clientX);
        }}
        onMouseUp={() => {
          dragging.current = false;
        }}
        onMouseLeave={() => {
          dragging.current = false;
        }}
        onTouchMove={handleTouch}
        onTouchStart={handleTouch}
      >
        <img
          src={after}
          alt="청소 후"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div
          className="absolute inset-0 right-0 overflow-hidden"
          style={{ width: `${pos}%` }}
        >
          <img
            src={before}
            alt="청소 전"
            className="absolute inset-0 h-full max-w-none object-cover"
            style={{ width: ref.current?.clientWidth }}
          />
        </div>

        <div
          className="absolute inset-y-0 w-1 cursor-col-resize bg-white shadow"
          style={{ left: `${pos}%` }}
        >
          <div className="absolute top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-lg">
            <span className="text-xs font-bold text-gray-400">↔</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServicePageLayout({ data }: { data: ServicePageData }) {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white">
        {/* 상단 히어로 섹션 */}
        <section className="relative flex h-[60vh] min-h-[400px] items-center justify-center overflow-hidden bg-gray-900 text-white">
          {data.heroVideo ? (
            <video
  src={data.heroVideo}
  autoPlay
  loop
  muted
  playsInline
  preload="auto"
  poster={data.heroBgImage}
  className="absolute inset-0 h-full w-full object-cover opacity-40"
/>
          ) : data.heroBgImage ? (
            <img
              src={data.heroBgImage}
              alt={data.heroTitle}
              className="absolute inset-0 h-full w-full object-cover opacity-40"
            />
          ) : null}

          <div className="container relative z-10 mx-auto px-4 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 whitespace-pre-line text-3xl font-extrabold sm:text-5xl"
            >
              {data.heroTitle}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-white/80 sm:text-xl"
            >
              {data.heroSubtitle}
            </motion.p>
          </div>
        </section>

        {/* 서비스 범위 섹션 */}
        <section className="relative bg-white py-12 md:py-20" style={{ zIndex: 10 }}>
          <div className="container mx-auto max-w-3xl px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8 text-center text-xl font-extrabold text-foreground sm:text-2xl"
            >
              서비스 범위
            </motion.h2>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {data.scopeItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3"
                >
                  <Check className="h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="text-sm font-medium text-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 작업 비포 & 애프터 갤러리 섹션 */}
        {data.gallery && data.gallery.length > 0 ? (
          <section className="container relative z-10 mx-auto max-w-2xl bg-white px-4 py-12 md:py-20">
            <h2 className="mb-8 text-center text-xl font-extrabold text-foreground sm:text-2xl">
              작업 비포 & 애프터
            </h2>

            {data.gallery.map((pair, idx) => (
              <div key={idx} className="mb-6">
                <BeforeAfterSlider before={pair.before} after={pair.after} />
                {pair.caption && (
                  <p className="mt-3 text-center text-sm text-muted-foreground">
                    {pair.caption}
                  </p>
                )}
              </div>
            ))}
          </section>
        ) : (
          <div className="bg-white py-6" />
        )}

        {/* 요금 안내 섹션 */}
        <section className="relative bg-gray-50 py-12 md:py-20" style={{ zIndex: 10 }}>
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8 text-center text-xl font-extrabold text-foreground sm:text-2xl"
            >
              요금 안내
            </motion.h2>

            <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-3">
              {data.pricingTiers.map((tier, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`rounded-2xl border p-6 text-center ${
                    tier.highlight
                      ? "border-primary bg-primary/5 shadow-lg"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                      tier.highlight
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {tier.badge}
                  </span>

                  <p className="mt-4 text-2xl font-extrabold text-foreground">
                    {tier.price}
                  </p>

                  <p className="mt-2 text-xs text-muted-foreground">
                    {tier.note}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA 섹션 */}
        <section className="relative bg-primary py-10 md:py-16" style={{ zIndex: 10 }}>
          <div className="container mx-auto px-4 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-3 text-2xl font-extrabold text-white sm:text-3xl"
            >
              지금 바로 무료 견적 받으세요
            </motion.h2>

            <p className="mb-8 text-white/80">
              전화 또는 카카오톡으로 간편하게 문의하세요
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="tel:01084381887"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-primary shadow transition-all hover:scale-105 hover:bg-white/90 sm:w-auto"
              >
                <Phone className="h-4 w-4" />
                010-8438-1887
              </a>

              <a
                href="https://pf.kakao.com/_IiNfn/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/40 bg-white/15 px-8 py-4 text-sm font-bold text-white transition-all hover:scale-105 hover:bg-white/25 sm:w-auto"
              >
                <MessageCircle className="h-4 w-4" />
                카카오톡 문의
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
