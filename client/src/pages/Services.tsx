import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

const serviceCards = [
  {
    title: "계단청소",
    subtitle: "빌라·상가 공용계단 정기관리",
    image: "/images/main-service-stair.webp",
    href: "/services/stair",
  },
  {
    title: "사무실청소",
    subtitle: "사무공간 바닥·먼지 정기관리",
    image: "/images/main-service-office.webp",
    href: "/services/office",
  },
  {
    title: "화장실청소",
    subtitle: "상가·사무실 공용화장실 관리",
    image: "/images/main-service-restroom.webp",
    href: "/services/bathroom",
  },
  {
    title: "유리청소",
    subtitle: "공동현관·상가 유리 손자국 관리",
    image: "/images/main-service-glass.webp",
    href: "/services/glass",
  },
];

export default function Services() {
  return (
    <div className="bg-gradient-to-b from-white via-blue-50/35 to-white">
      <main className="px-4 py-10 md:px-10 md:py-24">
        <section className="mx-auto max-w-6xl">
          <div className="mb-7 text-center md:mb-10">
            <p className="text-xs font-extrabold tracking-[0.32em] text-primary md:text-sm">
              SERVICES
            </p>
            <h2 className="mt-2 text-2xl font-extrabold leading-[1.18] text-foreground md:mt-3 md:text-4xl">
              청소 서비스
            </h2>
            <p className="mt-2 text-sm font-semibold text-muted-foreground md:mt-3 md:text-base">
              건물 상태에 맞춰 정기관리합니다.
            </p>
            <p className="sr-only">
              이천 계단청소, 사무실청소, 화장실청소, 유리청소 정기관리 서비스를 안내합니다.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 md:gap-5 lg:grid-cols-4">
            {serviceCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                aria-label={`이천 ${card.title} 정기관리 상세 안내`}
                className="group relative block h-[240px] overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_8px_24px_rgba(15,76,169,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,76,169,0.14)] sm:h-[280px] md:h-[520px] md:rounded-[1.8rem] md:shadow-[0_18px_45px_rgba(15,76,169,0.10)]"
              >
                <img
                  src={card.image}
                  alt={`이천 ${card.title} 정기관리 서비스`}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/28 to-white/5" />
                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/20 to-transparent md:h-28" />

                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <p className="min-h-8 text-[10px] font-bold leading-4 text-white/70 md:text-[11px]">
                    {card.subtitle}
                  </p>

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <h2 className="whitespace-nowrap text-xl font-extrabold leading-tight tracking-normal text-white md:text-[clamp(1.45rem,2.1vw,2rem)]">
                      {card.title}
                    </h2>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-white group-hover:text-primary md:h-11 md:w-11">
                      <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
