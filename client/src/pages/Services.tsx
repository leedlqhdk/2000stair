import { HOME_EASE, useHomeMotion } from "@/components/HomeMotion";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import ServiceShowcase, { type ServiceCardItem } from "@/components/ServiceShowcase";

// scope: PC 카드 아래에 적는 주요 관리 범위 (각 서비스 상세 페이지의 관리 범위에서 고른 것)
// heroImage: 각 서비스 상세 페이지의 첫 화면 배경 사진 (카드를 누르면 이 자리로 커진다)
const serviceCards: ServiceCardItem[] = [
  {
    title: "계단청소",
    en: "STAIR",
    subtitle: "빌라·상가 공용계단 정기관리",
    scope: ["계단 바닥 약품 청소", "난간·손잡이", "공동현관 유리", "거미줄·천장 먼지"],
    image: "/images/main-service-stair.webp",
    href: "/services/stair",
    heroImage: "/images/services/stair-cleaning/icheon-stair-cleaning-service-main.webp",
  },
  {
    title: "사무실청소",
    en: "OFFICE",
    subtitle: "사무공간 바닥·먼지 정기관리",
    scope: ["사무실 바닥", "책상·집기 먼지", "탕비실", "휴지통 비움"],
    image: "/images/main-service-office.webp",
    href: "/services/office",
    heroImage: "/images/main-service-office.webp",
  },
  {
    title: "화장실청소",
    en: "RESTROOM",
    subtitle: "상가·사무실 공용화장실 관리",
    scope: ["변기 세척·소독", "세면대·거울 물때", "바닥·배수구", "악취 관리"],
    image: "/images/main-service-restroom.webp",
    href: "/services/bathroom",
    heroImage: "/images/services/restroom-cleaning/bathroom-02-after.webp",
  },
  {
    title: "유리청소",
    en: "GLASS",
    subtitle: "공동현관·상가 유리 손자국 관리",
    scope: ["상가 출입문·전면 유리", "공동현관 유리문", "칸막이 유리", "창틀·레일"],
    image: "/images/main-service-glass.webp",
    href: "/services/glass",
    heroImage: "/images/services/glass-cleaning/glass-page01.webp",
  },
];

const srDescription = "이천 계단청소, 사무실청소, 화장실청소, 유리청소 정기관리 서비스를 안내합니다.";

export default function Services() {
  const { home, reveal } = useHomeMotion();
  const reduceMotion = useReducedMotion();

  return (
    <div className="bg-gradient-to-b from-white via-blue-50/35 to-white">
      <main>
        {/* 데스크톱: 네 가지 서비스 사진과 관리 범위를 한 화면에 보여준다 (홈에서는 상단 메뉴 높이만큼 뺀다) */}
        <motion.section
          className="hidden md:block"
          {...(home
            ? reveal(0, 0)
            : {
                initial: reduceMotion ? false : { opacity: 0 },
                animate: { opacity: 1 },
                transition: { duration: reduceMotion ? 0 : 0.6, ease: HOME_EASE },
              })}
        >
          <ServiceShowcase items={serviceCards} className={home ? "min-h-[calc(100svh-3.5rem)]" : "min-h-svh"} />
        </motion.section>

        {/* 모바일: 기존 카드 그리드 유지 */}
        <section className="mx-auto max-w-6xl px-4 py-10 md:hidden">
          <div className="mb-7 text-center">
            <p className="text-xs font-extrabold tracking-[0.32em] text-primary">SERVICES</p>
            <h2 className="font-['GmarketSans'] mt-2 text-2xl font-extrabold leading-[1.18] text-foreground">
              청소 서비스
            </h2>
            <p className="mt-2 text-sm font-semibold text-muted-foreground">건물 상태에 맞춰 정기관리합니다.</p>
            <p className="sr-only">{srDescription}</p>
          </div>

          <div className="grid gap-3">
            {serviceCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={reduceMotion ? false : { opacity: 0, y: 36, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={
                  reduceMotion ? { duration: 0 } : { duration: 0.55, delay: index * 0.14, ease: HOME_EASE }
                }
              >
                <Link
                  href={card.href}
                  aria-label={`이천 ${card.title} 정기관리 상세 안내`}
                  className="group relative block h-[240px] overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_8px_24px_rgba(15,76,169,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,76,169,0.14)] sm:h-[280px]"
                >
                  <img
                    src={card.image}
                    alt={`이천 ${card.title} 정기관리 서비스`}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/28 to-white/5" />
                  <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/20 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="min-h-8 text-xs font-bold leading-4 text-white/70">{card.subtitle}</p>

                    <div className="mt-2 flex items-center justify-between gap-3">
                      <h3 className="whitespace-nowrap text-xl font-extrabold leading-tight tracking-normal text-white">
                        {card.title}
                      </h3>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-white group-hover:text-primary">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
