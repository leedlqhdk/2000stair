import { motion } from "framer-motion";
import { Check, Phone, MessageCircle, ArrowDown } from "lucide-react";
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
  heroStyle?: "default" | "fullscreenVideo";
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
        className="relative aspect-[4/3] w-full cursor-col-resize select-none overflow-hidden rounded-[2rem] border border-white/40 bg-white/20 shadow-[0_24px_80px_rgba(15,23,42,0.22)] backdrop-blur-xl"
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

        <div className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1.5 text-xs font-bold tracking-wide text-white backdrop-blur">
          BEFORE
        </div>

        <div className="absolute right-4 top-4 rounded-full bg-primary/85 px-3 py-1.5 text-xs font-bold tracking-wide text-white backdrop-blur">
          AFTER
        </div>

        <div
          className="absolute inset-y-0 w-1 cursor-col-resize bg-white shadow"
          style={{ left: `${pos}%` }}
        >
          <div className="absolute top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white text-xs font-bold text-primary shadow-lg">
            ↔
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServicePageLayout({ data }: { data: ServicePageData }) {
  const isFullscreenVideo = data.heroStyle === "fullscreenVideo" && !!data.heroVideo;

  return (
    <>
      <Navbar />

      <main className="relative min-h-screen overflow-x-hidden bg-[#07152f]">
        {/* 고정 배경 영상 */}
        {data.heroVideo && (
          <div className="fixed inset-0 z-0 bg-[#07152f]">
            <video
              src={data.heroVideo}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster={data.heroBgImage}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[#061226]/70" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-[#07152f]/45 to-[#07152f]/85" />
          </div>
        )}

        {/* 영상이 없을 때 기본 배경 */}
        {!data.heroVideo && data.heroBgImage && (
          <div className="fixed inset-0 z-0 bg-[#07152f]">
            <img
              src={data.heroBgImage}
              alt={data.heroTitle}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[#061226]/75" />
          </div>
        )}

        {/* 상단 히어로 섹션 (모바일 높이 계산 버그 해결) */}
        <section
          className={`relative z-10 flex items-center justify-center px-4 text-white ${
            isFullscreenVideo 
              ? "min-h-[100dvh] py-20 md:py-28" 
              : "min-h-[540px] md:min-h-[620px] py-16 md:py-24"
          }`}
        >
          <div className="container mx-auto max-w-5xl text-center">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="mb-4 text-xs font-extrabold tracking-[0.35em] text-white/65 md:mb-5"
            >
              2000 STAIR SERVICE
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08 }}
              className="mx-auto whitespace-pre-line font-['GmarketSans'] text-3xl font-extrabold leading-tight tracking-tight text-white drop-shadow-2xl sm:text-5xl md:text-7xl"
            >
              {data.heroTitle}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="mx-auto mt-5 max-w-2xl text-sm font-semibold leading-relaxed text-white/78 sm:text-lg md:text-xl md:mt-6"
            >
              {data.heroSubtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.32 }}
              className="mt-6 flex flex-wrap justify-center gap-1.5 md:gap-2 md:mt-8"
            >
              {["부부 직접 관리", "하청 없이 직접 방문", "작업 전후 사진 제공", "무료 견적"].map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[11px] font-bold text-white/90 backdrop-blur-md sm:text-sm md:px-4 md:py-2"
                >
                  {badge}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.44 }}
              className="mt-8 flex flex-col justify-center gap-3 sm:flex-row md:mt-10"
            >
              <a
                href="https://pf.kakao.com/_IiNfn/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-extrabold text-[#123268] shadow-xl transition hover:-translate-y-0.5 hover:bg-white/90 md:py-4"
              >
                <MessageCircle className="h-4 w-4" />
                카카오톡 상담하기
              </a>

              <a
                href="tel:01084381887"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/35 bg-white/10 px-7 py-3.5 text-sm font-extrabold text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/20 md:py-4"
              >
                <Phone className="h-4 w-4" />
                전화 문의
              </a>
            </motion.div>

            <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/55 md:flex">
              <span className="text-[10px] font-bold tracking-[0.3em]">SCROLL</span>
              <ArrowDown className="h-4 w-4 animate-bounce" />
            </div>
          </div>
        </section>

        {/* 서비스 범위 섹션 */}
        <section className="relative z-10 py-12 md:py-24">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="rounded-[2rem] border border-white/25 bg-white/75 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.2)] backdrop-blur-xl md:p-10">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-6 text-center text-xl font-extrabold text-[#0f172a] sm:text-3xl md:mb-8"
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
                    className="flex items-center gap-3 rounded-2xl border border-white/50 bg-white/70 px-4 py-3.5 shadow-sm backdrop-blur-md"
                  >
                    <Check className="h-4 w-4 flex-shrink-0 text-primary" />
                    <span className="text-sm font-bold text-[#111827]">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 작업 비포 & 애프터 갤러리 섹션 */}
        {data.gallery && data.gallery.length > 0 ? (
          <section className="relative z-10 py-12 md:py-24">
            <div className="container mx-auto max-w-4xl px-4">
              <div className="rounded-[2rem] border border-white/25 bg-white/78 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.22)] backdrop-blur-xl md:p-10">
                <motion.div
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-6 text-center md:mb-9"
                >
                  <p className="mb-2 text-xs font-extrabold tracking-[0.3em] text-primary">
                    BEFORE & AFTER
                  </p>
                  <h2 className="text-xl font-extrabold text-[#0f172a] sm:text-3xl">
                    작업 비포 & 애프터
                  </h2>
                </motion.div>

                <div className="space-y-6 md:space-y-8">
                  {data.gallery.map((pair, idx) => (
                    <div key={idx}>
                      <BeforeAfterSlider before={pair.before} after={pair.after} />
                      {(pair.caption || pair.label) && (
                        <p className="mt-3 text-center text-xs font-semibold text-slate-600 md:text-sm md:mt-4">
                          {pair.caption || pair.label}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {/* 요금 안내 섹션 */}
        <section className="relative z-10 py-12 md:py-24">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="rounded-[2rem] border border-white/25 bg-white/82 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.2)] backdrop-blur-xl md:p-10">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-6 text-center text-xl font-extrabold text-[#0f172a] sm:text-3xl md:mb-8"
              >
                요금 안내
              </motion.h2>

              <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3">
                {data.pricingTiers.map((tier, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`rounded-2xl border p-5 text-center md:p-6 ${
                      tier.highlight
                        ? "border-primary bg-primary text-white shadow-xl"
                        : "border-blue-100 bg-white/80 text-[#0f172a]"
                    }`}
                  >
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                        tier.highlight
                          ? "bg-white/20 text-white"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {tier.badge}
                    </span>

                    <p className="mt-3 text-xl font-extrabold md:text-2xl md:mt-4">
                      {tier.price}
                    </p>

                    <p
                      className={`mt-1.5 text-xs font-medium ${
                        tier.highlight ? "text-white/75" : "text-slate-500"
                      }`}
                    >
                      {tier.note}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA 섹션 (하단 불필요한 마진 슬림화) */}
        <section className="relative z-10 px-4 pb-12 md:pb-24">
          <div className="container mx-auto max-w-4xl rounded-[2rem] border border-white/25 bg-primary/90 px-5 py-10 text-center text-white shadow-[0_24px_80px_rgba(15,23,42,0.28)] backdrop-blur-xl md:px-10 md:py-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-2 text-xl font-extrabold sm:text-3xl md:mb-3"
            >
              지금 바로 무료 견적 받으세요
            </motion.h2>

            <p className="mb-6 text-sm text-white/80 md:mb-8">
              전화 또는 카카오톡으로 간편하게 문의하세요
            </p>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row md:gap-4">
              <a
                href="tel:01084381887"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-primary shadow transition-all hover:scale-105 hover:bg-white/90 sm:w-auto"
              >
                <Phone className="h-4 w-4" />
                010-8438-1887
              </a>

              <a
                href="https://pf.kakao.com/_IiNfn/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/40 bg-white/15 px-8 py-3.5 text-sm font-bold text-white transition-all hover:scale-105 hover:bg-white/25 sm:w-auto"
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
