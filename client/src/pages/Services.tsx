import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";

const serviceCards = [
  {
    title: "계단정기청소",
    subtitle: "빌라·원룸·상가 공용계단",
    image: "/images/main-service-stair.webp",
    href: "/services/stair",
  },
  {
    title: "유리청소",
    subtitle: "상가·사무실·매장 유리관리",
    image: "/images/main-service-glass.webp",
    href: "/services/glass",
  },
  {
    title: "화장실청소",
    subtitle: "상가·사무실 공용화장실",
    image: "/images/main-service-restroom.webp",
    href: "/services/restroom",
  },
];

export default function Services() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/35 to-white">
      <Navbar />

      <main className="px-5 py-16 md:px-10 md:py-24">
        <section className="mx-auto max-w-6xl">
          <div className="mb-10 text-center md:mb-14">
            <p className="text-sm font-extrabold tracking-[0.32em] text-primary">
              SERVICES
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
              이천계단지기 서비스
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
              이천 빌라·상가·원룸 공용공간을 부부가 직접 확인하고 관리합니다.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {serviceCards.map((card) => (
              <Link key={card.title} href={card.href}>
                <a className="group relative block h-[430px] overflow-hidden rounded-[1.8rem] border border-blue-100 bg-white shadow-[0_18px_45px_rgba(15,76,169,0.10)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(15,76,169,0.16)] md:h-[520px]">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/28 to-white/5" />
                  <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/20 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-7 md:p-8">
                    <p className="mb-2 text-sm font-bold text-white/75">
                      {card.subtitle}
                    </p>

                    <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white md:text-[2.15rem]">
                      {card.title}
                    </h2>

                    <div className="mt-8 flex items-center justify-between">
                      <span className="text-xs font-bold tracking-[0.22em] text-white/55">
                        VIEW SERVICE
                      </span>

                      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-white group-hover:text-primary">
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
    </div>
  );
}
