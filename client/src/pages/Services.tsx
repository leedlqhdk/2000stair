import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

const serviceCards = [
  {
    title: "계단 정기관리",
    subtitle: "빌라·원룸·상가 공용계단",
    image: "/images/services/stair-cleaning.webp",
    href: "/services/stair",
  },
  {
    title: "공동현관 유리관리",
    subtitle: "출입문·창틀·손자국 관리",
    image: "/images/services/glass-cleaning.webp",
    href: "/services/glass",
  },
  {
    title: "공용공간 관리",
    subtitle: "복도·엘리베이터·입구 주변",
    image: "/images/services/common-area.webp",
    href: "/services/common",
  },
];

export default function Services() {
  return (
    <main className="bg-[#0f172a] px-5 py-16 md:px-10 md:py-24">
      <section className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-extrabold tracking-[0.3em] text-blue-300">
            SERVICES
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-white md:text-5xl">
            이천계단지기 서비스
          </h1>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {serviceCards.map((card) => (
            <Link key={card.title} href={card.href}>
              <a className="group relative block h-[420px] overflow-hidden border border-white/30 bg-slate-900 shadow-xl md:h-[520px]">
                <img
                  src={card.image}
                  alt={card.title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-black/85" />

                {card.badge && (
                  <span className="absolute right-6 top-24 bg-white/85 px-4 py-2 text-sm font-bold text-slate-800">
                    {card.badge}
                  </span>
                )}

                <div className="absolute bottom-8 left-7 right-7">
                  <p className="mb-2 text-sm font-bold text-white/70">
                    {card.subtitle}
                  </p>
                  <h2 className="text-3xl font-extrabold leading-tight text-white md:text-4xl">
                    {card.title}
                  </h2>

                  <div className="mt-8 flex justify-end">
                    <span className="flex h-10 w-10 items-center justify-center border border-white/50 text-white transition group-hover:bg-white group-hover:text-slate-900">
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
