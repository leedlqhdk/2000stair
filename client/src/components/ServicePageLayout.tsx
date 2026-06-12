import { motion } from "framer-motion";
import {
  ArrowDown,
  Brush,
  Bug,
  CalendarClock,
  Camera,
  ChevronDown,
  DoorOpen,
  Hand,
  Leaf,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import BlogReviews from "@/components/BlogReviews";

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

export interface FaqItem {
  q: string;
  a: string;
}

export interface InfoSection {
  title: string;
  body: string;
  image?: string;
}

export interface PhotoGridItem {
  src: string;
  alt: string;
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
  seoTitle?: string;
  infoContent?: { title: string; body: string };
  infoSections?: InfoSection[];
  faq?: FaqItem[];
  showReviews?: boolean;
  photoGrid?: PhotoGridItem[];
}

const featureIcons = [Users, ShieldCheck, Camera, CalendarClock];
const scopeIcons = [Brush, Hand, Sparkles, DoorOpen, Bug, Leaf];
const glassCard ="rounded-[1.6rem] border border-white/18 bg-white/[0.14] shadow-[0_20px_60px_rgba(15,23,42,0.14)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.2]";

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

function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-white/15 bg-white/[0.1] shadow-[0_16px_46px_rgba(15,23,42,0.12)] backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.15]"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-bold text-white md:px-6 md:py-5"
          >
            <span className="text-sm md:text-base">{item.q}</span>
            <ChevronDown
              className={`h-4 w-4 flex-shrink-0 text-white/70 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
            />
          </button>
          {open === i && (
            <div className="border-t border-white/10 px-5 pb-5 pt-3 md:px-6">
              <p className="text-sm leading-relaxed text-white/70">{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function ServicePageLayout({ data }: { data: ServicePageData }) {
  const isFullscreenVideo = data.heroStyle === "fullscreenVideo";

  useEffect(() => {
    if (data.seoTitle) {
      document.title = data.seoTitle;
    }
  }, [data.seoTitle]);

  return (
    <>
      <Navbar />

      <main className="relative min-h-screen overflow-x-hidden bg-[#07152f]">
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

        <section
          className={`relative z-10 flex items-center justify-center px-4 text-white ${
            isFullscreenVideo
              ? "min-h-[100dvh] py-20 md:py-28"
              : "min-h-[540px] py-16 md:min-h-[620px] md:py-24"
          }`}
        >
          <div className="container mx-auto max-w-5xl text-center">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="mb-4 text-xs font-extrabold tracking-[0.25em] text-white/65 md:mb-5"
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
              className="mx-auto mt-5 max-w-2xl text-sm font-semibold leading-relaxed text-white/78 sm:text-lg md:mt-6 md:text-xl"
            >
              {data.heroSubtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.32 }}
              className="mt-6 flex flex-wrap justify-center gap-1.5 md:mt-8 md:gap-2"
            >
              {[
                "부부 직접 관리",
                "하청 없이 직접 방문",
                "작업 전후 사진 제공",
                "무료 견적",
              ].map((badge) => (
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
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#fee500] px-8 py-3.5 text-sm font-extrabold text-[#3a1d00] shadow-lg transition-all hover:scale-105 hover:brightness-110"
              >
                <MessageCircle className="h-4 w-4" />
                카카오톡 문의
              </a>
              <a
                href="tel:01084381887"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/35 bg-white/12 px-8 py-3.5 text-sm font-extrabold text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-white/20"
              >
                <Phone className="h-4 w-4" />
                010-8438-1887
              </a>
            </motion.div>

            {isFullscreenVideo && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
              >
                <ArrowDown className="h-6 w-6 animate-bounce text-white/50" />
              </motion.div>
            )}
          </div>
        </section>

        {/* 특징 섹션 */}
        <section className="relative z-10 py-12 md:py-24">
          <div className="container mx-auto max-w-5xl px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-7 text-center text-2xl font-extrabold text-white sm:text-3xl md:mb-10"
            >
              왜 '이천계단지기'인가요?
            </motion.h2>

            <div className="grid gap-4 sm:grid-cols-2">
              {data.features.map((feat, i) => {
                const Icon = featureIcons[i % featureIcons.length];

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="group rounded-[1.6rem] border border-white/18 bg-white/[0.14] p-5 shadow-[0_20px_60px_rgba(15,23,42,0.14)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.2] md:p-6"
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <Icon className="h-6 w-6 shrink-0 text-white/90" />
                      <p className="font-extrabold text-white">{feat.title}</p>
                    </div>
                    <p className="text-sm leading-relaxed text-white/70">
                      {feat.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 관리 범위 섹션 */}
        <section className="relative z-10 py-12 md:py-24">
          <div className="container mx-auto max-w-5xl px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-7 text-center text-2xl font-extrabold text-white sm:text-3xl md:mb-10"
            >
              관리 범위
            </motion.h2>

            <div className="grid gap-3 sm:grid-cols-2">
              {data.scopeItems.map((item, i) => {
                const Icon = scopeIcons[i % scopeIcons.length];

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-4 rounded-2xl border border-white/14 bg-white/[0.1] px-4 py-4 backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.16] md:px-5"
                  >
                    <Icon className="h-5 w-5 shrink-0 text-white/85" />
                    <span className="text-sm font-extrabold text-white/90 md:text-base">
                      {item}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 작업 비포 & 애프터 갤러리 섹션 */}
        {data.gallery && data.gallery.length > 0 ? (
          <section className="relative z-10 py-12 md:py-24">
            <div className="container mx-auto max-w-4xl px-4">
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-6 text-center md:mb-9"
              >
                <p className="mb-2 text-xs font-extrabold tracking-[0.3em] text-primary">
                  BEFORE & AFTER
                </p>
                <h2 className="text-xl font-extrabold text-white sm:text-3xl">
                  작업 비포 & 애프터
                </h2>
              </motion.div>

              <div className="space-y-6 md:space-y-8">
                {data.gallery.map((pair, idx) => (
                  <div key={idx}>
                    <BeforeAfterSlider before={pair.before} after={pair.after} />
                    {(pair.caption || pair.label) && (
                      <p className="mt-3 text-center text-xs font-semibold text-white/70 md:mt-4 md:text-sm">
                        {pair.caption || pair.label}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* 요금 안내 섹션 */}
        <section className="relative z-10 py-12 md:py-24">
          <div className="container mx-auto max-w-5xl px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-7 text-center text-2xl font-extrabold text-white sm:text-3xl md:mb-10"
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
                  className={`rounded-[1.6rem] border p-5 text-center shadow-[0_20px_60px_rgba(15,23,42,0.14)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 md:p-6 ${
                    tier.highlight
                      ? "border-primary/50 bg-primary/85 text-white shadow-[0_24px_70px_rgba(49,85,164,0.28)]"
                      : "border-white/16 bg-white/[0.12] text-white hover:bg-white/[0.17]"
                  }`}
                >
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                      tier.highlight
                        ? "bg-white/20 text-white"
                        : "bg-white/12 text-white/80"
                    }`}
                  >
                    {tier.badge}
                  </span>

                  <p className="mt-3 text-xl font-extrabold md:mt-4 md:text-2xl">
                    {tier.price}
                  </p>

                  <p
                    className={`mt-1.5 text-xs font-medium ${
                      tier.highlight ? "text-white/78" : "text-white/58"
                    }`}
                  >
                    {tier.note}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 사진 그리드 섹션 (선택) */}
        {data.photoGrid && data.photoGrid.length > 0 && (
          <section className="relative z-10 py-12 md:py-24">
            <div className="container mx-auto max-w-5xl px-4">
              <div className={`${glassCard} p-5 md:p-10`}>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-6 text-center text-xl font-extrabold text-white sm:text-3xl md:mb-8"
                >
                  작업 현장
                </motion.h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  {data.photoGrid.map((photo, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="overflow-hidden rounded-2xl border border-white/10"
                    >
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        className="aspect-[4/3] w-full object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 정보성 콘텐츠 섹션 (단일 - 선택) */}
        {data.infoContent && (
          <section className="relative z-10 py-12 md:py-24">
            <div className="container mx-auto max-w-4xl px-4">
              <div className={`${glassCard} p-6 md:p-12`}>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-4 text-xl font-extrabold text-white sm:text-2xl md:mb-6"
                >
                  {data.infoContent.title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="whitespace-pre-line text-sm leading-[1.9] text-white/75 md:text-base"
                >
                  {data.infoContent.body}
                </motion.p>
              </div>
            </div>
          </section>
        )}

        {/* 정보성 콘텐츠 섹션 (다중 - 선택) */}
        {data.infoSections && data.infoSections.length > 0 && (
          <section className="relative z-10 py-12 md:py-24">
            <div className="container mx-auto max-w-4xl space-y-6 px-4 md:space-y-8">
              {data.infoSections.map((sec, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`${glassCard} p-6 md:p-10`}
                >
                  {sec.image && (
                    <img
                      src={sec.image}
                      alt={sec.title}
                      className="mb-5 h-48 w-full rounded-2xl object-cover md:h-64"
                    />
                  )}
                  <h2 className="mb-3 text-lg font-extrabold text-white md:text-xl">
                    {sec.title}
                  </h2>
                  <p className="text-sm leading-[1.9] text-white/75 md:text-base">
                    {sec.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* FAQ 섹션 (선택) */}
        {data.faq && data.faq.length > 0 && (
          <section className="relative z-10 py-12 md:py-24">
            <div className="container mx-auto max-w-4xl px-4">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-7 text-center text-2xl font-extrabold text-white sm:text-3xl md:mb-10"
              >
                자주 묻는 질문
              </motion.h2>
              <FaqAccordion items={data.faq} />
            </div>
          </section>
        )}

        {/* 고객 후기 + 실제 작업 기록 섹션 (선택) */}
        {data.showReviews && (
          <section className="relative z-10 py-12 md:py-24">
            <div className="container mx-auto max-w-6xl px-4">
              <BlogReviews variant="dark" />
            </div>
          </section>
        )}

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
