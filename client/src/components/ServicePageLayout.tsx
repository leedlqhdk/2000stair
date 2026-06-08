import { motion } from "framer-motion";
import {
  Brush,
  DoorOpen,
  Hand,
  Leaf,
  MessageCircle,
  Phone,
  Sparkles,
  Bug,
  ArrowDown,
} from "lucide-react";
import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
// 기존의 import 문들 아래에 이 줄을 한 줄 추가해 주세요.
import { Link } from "react-router-dom";

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

const scopeIcons = [Brush, Hand, Sparkles, DoorOpen, Bug, Leaf];

function getScopeIcon(index: number) {
  return scopeIcons[index % scopeIcons.length];
}
export default function ServicePageLayout({ data }: { data: ServicePageData }) {
  const isFullscreenVideo = data.heroStyle === "fullscreenVideo" && !!data.heroVideo;

  return (
    <>
      <Navbar />

      <main className="relative min-h-screen overflow-hidden bg-[#07152f]">
        {/* 고정 배경 영상 */}
        {data.heroVideo && (
          <div className="absolute inset-0 z-0 bg-[#07152f]">
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
            <div className="absolute inset-0 bg-[#061226]/30" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-[#07152f]/10 to-[#07152f]/40" />
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

        <div className="relative overflow-hidden">
        {/* 상단 히어로 섹션 */}
        <section
          className={`relative z-10 flex items-center justify-center px-4 text-white ${
            isFullscreenVideo ? "min-h-screen py-28" : "min-h-[620px] py-24"
          }`}
        >
          <div className="container mx-auto max-w-5xl text-center">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="mb-5 text-xs font-extrabold tracking-[0.35em] text-white/65"
            >
              2000 STAIR SERVICE
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08 }}
              className="mx-auto whitespace-pre-line font-['GmarketSans'] text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-2xl sm:text-5xl md:text-7xl"
            >
              {data.heroTitle}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="mx-auto mt-6 max-w-2xl text-base font-semibold leading-relaxed text-white/78 sm:text-lg md:text-xl"
            >
              {data.heroSubtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.32 }}
              className="mt-8 flex flex-wrap justify-center gap-2"
            >
              {["부부 직접 관리", "하청 없이 직접 방문", "작업 전후 사진 제공", "무료 견적"].map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold text-white/90 backdrop-blur-md sm:text-sm"
                >
                  {badge}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.44 }}
              className="mt-10 flex flex-col justify-center gap-3 sm:flex-row"
            >
              <a
                href="https://pf.kakao.com/_IiNfn/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-extrabold text-[#123268] shadow-xl transition hover:-translate-y-0.5 hover:bg-white/90"
              >
                <MessageCircle className="h-4 w-4" />
                카카오톡 상담하기
              </a>

              <a
                href="tel:01084381887"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/35 bg-white/10 px-7 py-4 text-sm font-extrabold text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                <Phone className="h-4 w-4" />
                전화 문의
              </a>
            </motion.div>

            <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/55 md:flex">
              <span className="text-[10px] font-bold tracking-[0.3em]">SCROLL</span>
              <ArrowDown className="h-4 w-4 animate-bounce" />
            </div>
          </div>
        </section>

                {/* 서비스 범위 섹션 */}
        <section className="relative z-10 py-16 md:py-24">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="rounded-[2.5rem] border border-white/25 bg-white/[0.18] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_30px_90px_rgba(15,23,42,0.2)] backdrop-blur-2xl md:p-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-9 text-center"
              >
                <p className="mb-3 text-xs font-extrabold tracking-[0.3em] text-white/65">
                  CLEANING SCOPE
                </p>
                <h2 className="text-2xl font-extrabold text-white drop-shadow sm:text-3xl">
                  서비스 범위
                </h2>
              </motion.div>

              <div className="overflow-hidden rounded-[2rem] border border-white/30 bg-white/[0.18] shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_20px_70px_rgba(15,23,42,0.18)] backdrop-blur-2xl">
                <div className="grid grid-cols-1 divide-y divide-white/25 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                  <div>
                    {data.scopeItems.slice(0, 3).map((item, i) => {
                      const Icon = getScopeIcon(i);

                      return (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.06 }}
                          className="flex items-center gap-4 border-b border-white/25 px-5 py-5 last:border-b-0"
                        >
                          <Icon className="h-5 w-5 shrink-0 text-white/90 drop-shadow" />
                          <span className="text-sm font-extrabold text-white drop-shadow md:text-base">
                            {item}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div>
                    {data.scopeItems.slice(3).map((item, i) => {
                      const Icon = getScopeIcon(i + 3);

                      return (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: (i + 3) * 0.06 }}
                          className="flex items-center gap-4 border-b border-white/25 px-5 py-5 last:border-b-0"
                        >
                          <Icon className="h-5 w-5 shrink-0 text-white/90 drop-shadow" />
                          <span className="text-sm font-extrabold text-white drop-shadow md:text-base">
                            {item}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
</div>
        
        {/* 작업 비포 & 애프터 갤러리 섹션 */}
        {data.gallery && data.gallery.length > 0 ? (
          <section className="relative z-10 py-16 md:py-24">
            <div className="container mx-auto max-w-4xl px-4">
              <div className="rounded-[2.5rem] border border-white/35 bg-white/25 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_30px_90px_rgba(15,23,42,0.24)] backdrop-blur-2xl md:p-10">
                <motion.div
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-9 text-center"
                >
                  <p className="mb-3 text-xs font-extrabold tracking-[0.3em] text-primary">
                    BEFORE & AFTER
                  </p>
                  <h2 className="text-2xl font-extrabold text-[#0f172a] sm:text-3xl">
                    작업 비포 & 애프터
                  </h2>
                </motion.div>

                <div className="space-y-8">
                  {data.gallery.map((pair, idx) => (
                    <div key={idx}>
                      <BeforeAfterSlider before={pair.before} after={pair.after} />
                      {(pair.caption || pair.label) && (
                        <p className="mt-4 text-center text-sm font-semibold text-slate-600">
                          {pair.caption || pair.label}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* [수정 완료]: 지도가 있는 서비스 지역 페이지로 연결되는 버튼 */}
                <div className="mt-10 text-center">
                  <a 
                    href="/area" 
                    className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold px-6 py-3 rounded-full border border-slate-200/80 shadow-sm transition-all duration-200 hover:shadow hover:-translate-y-0.5 text-sm sm:text-base"
                  >
                    <span>우리 동네 서비스 가능 지역 확인하기</span>
                    <span className="text-primary font-extrabold">→</span>
                  </a>
                </div>

              </div>
            </div>
          </section>
        ) : null}

                {/* [추가 완료]: 비포애프터 슬라이더 리스트 하단에 삽입된 후기 링크 버튼 */}
                <div className="mt-10 text-center">
                  <a 
                    href="/reviews" 
                    className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold px-6 py-3 rounded-full border border-slate-200/80 shadow-sm transition-all duration-200 hover:shadow hover:-translate-y-0.5 text-sm sm:text-base"
                  >
                    <span>실제 고객 작업 후기 보러가기</span>
                    <span className="text-primary font-extrabold">→</span>
                  </a>
                </div>

              </div>
            </div>
          </section>
        ) : null}
        
        {/* 요금 안내 섹션 */}
        <section className="relative z-10 py-16 md:py-24">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="rounded-[2rem] border border-white/25 bg-white/[0.82] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.2)] backdrop-blur-xl md:p-10">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-8 text-center text-2xl font-extrabold text-[#0f172a] sm:text-3xl"
              >
                요금 안내
              </motion.h2>

              <div className="mx-auto grid max-w-3xl gap-5 sm:grid-cols-3">
                {data.pricingTiers.map((tier, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`rounded-2xl border p-6 text-center ${
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

                    <p className="mt-4 text-2xl font-extrabold">
                      {tier.price}
                    </p>

                    <p
                      className={`mt-2 text-xs font-medium ${
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

        {/* CTA 섹션 */}
        <section className="relative z-10 px-4 pb-16 md:pb-24">
          <div className="container mx-auto max-w-4xl rounded-[2rem] border border-white/25 bg-primary/90 px-6 py-12 text-center text-white shadow-[0_24px_80px_rgba(15,23,42,0.28)] backdrop-blur-xl md:px-10 md:py-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-3 text-2xl font-extrabold sm:text-3xl"
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
