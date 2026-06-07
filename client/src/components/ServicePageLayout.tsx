import { motion } from "framer-motion";
import { Check, Phone, MessageCircle } from "lucide-react";

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

export interface ServicePageData {
  heroTitle: string;
  heroSubtitle: string;
  heroBgImage?: string;
  features: ServiceFeature[];
  scopeItems: string[];
  pricingTiers: ServicePricingTier[];
  gallery?: GalleryPair[];
  serviceFolder: string; // e.g. "stair-cleaning"
}

export default function ServicePageLayout({ data }: { data: ServicePageData }) {
  const kakaoUrl = "https://" + ["pf.kakao.com", "_IiNfn", "chat"].join("/");
  const imgBase = "/images/services/" + data.serviceFolder + "/";
  const gallery = data.gallery ?? [
    { before: imgBase + "before-1.webp", after: imgBase + "after-1.webp", label: "사례 1" },
    { before: imgBase + "before-2.webp", after: imgBase + "after-2.webp", label: "사례 2" },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section
        className="relative flex min-h-[460px] md:min-h-[540px] flex-col justify-end overflow-hidden bg-gray-800 pb-12 pt-24"
        style={
          data.heroBgImage
            ? { backgroundImage: `url(${data.heroBgImage})`, backgroundSize: "cover", backgroundPosition: "center" }
            : {}
        }
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl font-['GmarketSans'] whitespace-pre-line"
          >
            {data.heroTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-3 text-sm text-white/80 md:text-base"
          >
            {data.heroSubtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-5 flex flex-wrap gap-2"
          >
            {["하청 NO", "직접 담당", "전후 사진 제공", "장기 관리 가능"].map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm"
              >
                {badge}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Us */}
      <section className="bg-[#f7f8fa] py-14 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-2xl font-extrabold text-foreground md:text-3xl">
            이천계단지기가 다른 이유
          </h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {data.features.map((f) => (
              <div key={f.title} className="rounded-2xl bg-white border border-blue-50 p-4 md:p-5 shadow-sm">
                <p className="font-bold text-foreground text-sm md:text-base mb-1">{f.title}</p>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Gallery */}
      <section className="bg-white py-14 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-2xl font-extrabold text-foreground md:text-3xl">
            청소 전·후 사례
          </h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {gallery.flatMap((pair, i) => [
              <div key={"b" + i} className="relative">
                <img
                  src={pair.before}
                  alt={"청소 전 " + (pair.label ?? "")}
                  className="aspect-[4/3] w-full rounded-2xl object-cover bg-gray-100"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden"); }}
                />
                <div className="hidden aspect-[4/3] rounded-2xl bg-gray-100 flex-col items-center justify-center text-gray-400 text-xs gap-1 flex">
                  <span className="text-2xl">📷</span><span>사진 업로드 예정</span>
                </div>
                <span className="absolute left-2 top-2 rounded bg-black/50 px-2 py-0.5 text-[10px] font-bold text-white">전</span>
              </div>,
              <div key={"a" + i} className="relative">
                <img
                  src={pair.after}
                  alt={"청소 후 " + (pair.label ?? "")}
                  className="aspect-[4/3] w-full rounded-2xl object-cover bg-gray-100"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden"); }}
                />
                <div className="hidden aspect-[4/3] rounded-2xl bg-gray-100 flex-col items-center justify-center text-gray-400 text-xs gap-1 flex">
                  <span className="text-2xl">📷</span><span>사진 업로드 예정</span>
                </div>
                <span className="absolute left-2 top-2 rounded bg-primary/80 px-2 py-0.5 text-[10px] font-bold text-white">후</span>
              </div>,
            ])}
          </div>
        </div>
      </section>

      {/* Scope */}
      <section className="bg-[#f7f8fa] py-14 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-2xl font-extrabold text-foreground md:text-3xl">서비스 범위</h2>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:gap-3 max-w-2xl">
            {data.scopeItems.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm md:text-base text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white py-14 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-2xl font-extrabold text-foreground md:text-3xl">요금 안내</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-3xl mx-auto">
            {data.pricingTiers.map((tier) => (
              <div
                key={tier.badge}
                className={`rounded-2xl p-6 md:p-7 ${tier.highlight ? "bg-[#1B2F57] text-white" : "bg-[#f7f8fa] text-foreground"}`}
              >
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold mb-3 ${tier.highlight ? "bg-white/20 text-white" : "bg-primary/10 text-primary"}`}>
                  {tier.badge}
                </span>
                <p className={`text-2xl font-extrabold md:text-3xl ${tier.highlight ? "text-white" : "text-foreground"}`}>
                  {tier.price}
                </p>
                <p className={`mt-1 text-sm ${tier.highlight ? "text-white/70" : "text-muted-foreground"}`}>
                  {tier.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#f0f3f8] py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl font-extrabold text-foreground md:text-2xl mb-2">
            지금 바로 무료 견적 받아보세요!
          </h3>
          <p className="text-sm text-muted-foreground mb-7">담당자가 빠르게 연락드리겠습니다.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:010-4491-4721"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1B2F57] px-6 py-3 text-sm font-bold text-white"
            >
              <Phone className="h-4 w-4" />
              전화 문의
            </a>
            <a
              href={kakaoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FAE100] px-6 py-3 text-sm font-bold text-[#3A1D1D]"
            >
              <MessageCircle className="h-4 w-4" />
              카카오톡 상담하기
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
