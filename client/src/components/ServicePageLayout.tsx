import { motion } from "framer-motion";
import { Check, Phone, MessageCircle, ChevronRight } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";

export interface ServiceFeature {
  title: string;
  description: string;
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
}

export interface ServiceInfoSection {
  title: string;
  body: string;
  image: string;
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
  infoSections?: ServiceInfoSection[];
  serviceFolder: string;
}

function BeforeAfterCard({ item }: { item: GalleryPair }) {
  const title = item.label ?? "청소 전후 사례";

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
            alt={`${title} 청소 전`}
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
            alt={`${title} 청소 후`}
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

function ServiceInfoSections({ sections }: { sections: ServiceInfoSection[] }) {
  return (
    <section className="bg-gradient-to-b from-white to-blue-50/30 py-16 md:py-28">
      <div className="container max-w-6xl">
        <motion.div
          className="mx-auto mb-10 max-w-3xl text-center md:mb-14"
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-5 text-center text-sm font-bold tracking-[0.35em] text-primary">GUIDE</p>
          <h2 className="text-center text-4xl font-extrabold leading-tight text-foreground md:text-5xl">
            유리청소,
            <br />
            이런 점을 확인하세요
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-center text-lg leading-relaxed text-muted-foreground">
            현장 상황에 따라 작업 범위와 비용이 달라질 수 있어 먼저 확인이 필요합니다.
          </p>
        </motion.div>

        <div className="space-y-6 md:space-y-8">
          {sections.map((section, index) => (
            <motion.article
              key={section.title}
              className={`grid overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-sm lg:grid-cols-2 ${
                index % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""
              }`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
            >
              <div className="relative min-h-[260px] overflow-hidden bg-blue-50 md:min-h-[340px]">
                <img
                  src={section.image}
                  alt={section.title}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col justify-center p-6 md:p-10">
                <span className="mb-4 inline-flex w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-extrabold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-2xl font-extrabold leading-tight text-foreground md:text-3xl">
                  {section.title}
                </h3>
                <p className="mt-5 text-sm font-medium leading-7 text-muted-foreground md:text-base">
                  {section.body}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceGallery({ gallery }: { gallery: GalleryPair[] }) {
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(0);
  const selectedGalleryItem = gallery[selectedGalleryIndex] ?? gallery[0];

  return (
    <section className="bg-gradient-to-b from-white to-blue-50/30 py-16 md:py-28">
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
            청소 결과
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-center text-lg leading-relaxed text-muted-foreground">
            실제 작업 현장을 기반으로 촬영한 전후 사진입니다.
          </p>
        </motion.div>

        <div className="mx-auto max-w-5xl space-y-5">
          <div className="flex gap-2 overflow-x-auto pb-2 md:justify-center">
            {gallery.map((item, index) => (
              <button
                key={`${item.label ?? "case"}-${index}`}
                type="button"
                onClick={() => setSelectedGalleryIndex(index)}
                className={`flex-shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                  index === selectedGalleryIndex
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-blue-100 bg-white text-muted-foreground hover:border-primary/30 hover:text-primary"
                }`}
              >
                {item.label ?? `사례 ${index + 1}`}
              </button>
            ))}
          </div>

          {selectedGalleryItem && <BeforeAfterCard key={selectedGalleryIndex} item={selectedGalleryItem} />}
        </div>
      </div>
    </section>
  );
}

export default function ServicePageLayout({ data }: { data: ServicePageData }) {
  const imgBase = `/images/services/${data.serviceFolder}/`;
  const kakaoUrl = "https://pf.kakao.com/_IiNfn/chat";
  const gallery = data.gallery ?? [
    { before: imgBase + "before-1.webp", after: imgBase + "after-1.webp", label: "사례 1" },
    { before: imgBase + "before-2.webp", after: imgBase + "after-2.webp", label: "사례 2" },
  ];
  const isFullscreenVideo = data.heroStyle === "fullscreenVideo" && !!data.heroVideo;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <section
          className={`relative flex flex-col overflow-hidden bg-gray-900 ${
            isFullscreenVideo
              ? "min-h-screen justify-center py-28 md:py-36"
              : "min-h-[460px] justify-end pb-14 pt-24 md:min-h-[580px]"
          }`}
          style={
            !data.heroVideo && data.heroBgImage
              ? { backgroundImage: `url(${data.heroBgImage})`, backgroundSize: "cover", backgroundPosition: "center" }
              : {}
          }
        >
          {data.heroVideo && (
            <div className="absolute inset-0 z-0 overflow-hidden">
              <video
                autoPlay
                muted
                loop
                playsInline
                poster={data.heroBgImage}
                className={`h-full w-full object-cover ${isFullscreenVideo ? "scale-110 md:fixed md:inset-0 md:h-screen md:w-screen" : ""}`}
              >
                <source src={data.heroVideo} type="video/mp4" />
              </video>
            </div>
          )}
          <div className={`absolute inset-0 z-10 ${isFullscreenVideo ? "bg-black/55" : "bg-black/60"}`} />
          {isFullscreenVideo && (
            <div className="absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-black/65 to-transparent" />
          )}
          <div className={`relative z-20 container mx-auto px-4 ${isFullscreenVideo ? "text-center" : ""}`}>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className={`mb-5 text-xs font-extrabold tracking-[0.35em] text-white/80 ${isFullscreenVideo ? "text-center" : ""}`}
            >
              2000 STAIR SERVICE
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className={`whitespace-pre-line font-['GmarketSans'] font-extrabold leading-tight text-white ${
                isFullscreenVideo ? "mx-auto max-w-5xl text-4xl sm:text-5xl md:text-7xl" : "text-3xl sm:text-4xl md:text-5xl"
              }`}
            >
              {data.heroTitle}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`mt-6 flex flex-wrap gap-2 ${isFullscreenVideo ? "justify-center" : ""}`}
            >
              {["이천 청소 전문", "대표 직접 관리", "현장 맞춤 안내", "무료견적"].map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-white/40 bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-sm md:text-sm"
                >
                  {badge}
                </span>
              ))}
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className={`mt-5 text-sm leading-7 text-white/80 md:text-lg ${isFullscreenVideo ? "mx-auto max-w-2xl text-center" : ""}`}
            >
              {data.heroSubtitle}
            </motion.p>
            {isFullscreenVideo && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.48 }}
                className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"
              >
                <a href="tel:01084381887" className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-extrabold text-[#1B2F57] shadow-xl transition hover:-translate-y-0.5">
                  전화 문의
                </a>
                <a href={kakaoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full border border-white/45 bg-white/10 px-6 py-3 text-sm font-extrabold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20">
                  카카오톡 상담하기
                </a>
              </motion.div>
            )}
          </div>
          {isFullscreenVideo && (
            <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-xs font-bold tracking-[0.25em] text-white/55">
              SCROLL
            </div>
          )}
        </section>

        <section className="relative z-20 bg-[#f7f8fa] py-14 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-center text-2xl font-extrabold text-foreground md:text-3xl">
              이천계단지기가 다른 이유
            </h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
              {data.features.map((f) => (
                <div key={f.title} className="rounded-2xl border border-blue-50 bg-white p-4 shadow-sm md:p-5">
                  <p className="mb-1 text-sm font-bold text-foreground md:text-base">{f.title}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground md:text-sm">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="relative z-20 bg-white">
          {data.infoSections?.length ? <ServiceInfoSections sections={data.infoSections} /> : <ServiceGallery gallery={gallery} />}

          <section className="bg-[#f7f8fa] py-14 md:py-20">
            <div className="container mx-auto max-w-3xl px-4">
              <h2 className="mb-8 text-center text-2xl font-extrabold text-foreground md:text-3xl">서비스 범위</h2>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:gap-3">
                {data.scopeItems.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm text-foreground md:text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white py-14 md:py-20">
            <div className="container mx-auto px-4">
              <h2 className="mb-8 text-center text-2xl font-extrabold text-foreground md:text-3xl">요금 안내</h2>
              <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.pricingTiers.map((tier) => (
                  <div
                    key={tier.badge}
                    className={`rounded-2xl p-6 md:p-7 ${tier.highlight ? "bg-[#1B2F57] text-white" : "bg-[#f7f8fa] text-foreground"}`}
                  >
                    <span className={`mb-3 inline-block rounded-full px-3 py-1 text-xs font-bold ${tier.highlight ? "bg-white/20 text-white" : "bg-primary/10 text-primary"}`}>
                      {tier.badge}
                    </span>
                    <p className={`text-2xl font-extrabold md:text-3xl ${tier.highlight ? "text-white" : "text-foreground"}`}>{tier.price}</p>
                    <p className={`mt-1 text-sm ${tier.highlight ? "text-white/70" : "text-muted-foreground"}`}>{tier.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-[#f0f3f8] py-12 md:py-16">
            <div className="container mx-auto px-4 text-center">
              <h3 className="mb-2 text-xl font-extrabold text-foreground md:text-2xl">지금 바로 무료 견적 받아보세요!</h3>
              <p className="mb-7 text-sm text-muted-foreground">담당자가 빠르게 연락드리겠습니다.</p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <a href="tel:01084381887" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1B2F57] px-6 py-3 text-sm font-bold text-white">
                  <Phone className="h-4 w-4" />
                  전화 문의
                </a>
                <a href={kakaoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FAE100] px-6 py-3 text-sm font-bold text-[#3A1D1D]">
                  <MessageCircle className="h-4 w-4" />
                  카카오톡 상담하기
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
