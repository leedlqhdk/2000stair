import { ArrowRight, Building2, Droplets, Sparkles } from "lucide-react";

const services = [
  {
    title: "계단청소",
    description: "빌라·원룸·상가 계단과 공동현관 주변을 정기적으로 관리합니다.",
    tag: "빌라 · 원룸 · 상가",
    href: "/services/stair",
    icon: Building2,
  },
  {
    title: "화장실청소",
    description: "상가와 사무실 공용화장실의 냄새, 물때, 세면대 주변을 관리합니다.",
    tag: "상가 · 사무실",
    href: "/services/bathroom",
    icon: Droplets,
  },
  {
    title: "유리청소",
    description: "공동현관 유리, 출입문 유리, 상가 전면 유리의 손자국을 줄입니다.",
    tag: "공동현관 · 출입문",
    href: "/services/glass",
    icon: Sparkles,
  },
];

const serviceCard =
  "group rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_22px_55px_rgba(15,23,42,0.1)] md:p-6";

export default function Services() {
  return (
    <section className="bg-background px-4 py-14 md:py-20">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8 text-center md:mb-10">
          <p className="mb-3 text-xs font-extrabold tracking-[0.35em] text-primary">
            SERVICES
          </p>

          <h2 className="font-['GmarketSans'] text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
            어떤 공간을 관리하나요?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-relaxed text-slate-500 md:text-base">
            이천계단지기는 건물 상태와 이용 환경에 맞춰 필요한 청소 범위를
            직접 확인하고 관리합니다.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <a key={service.title} href={service.href} className={serviceCard}>
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-500">
                    {service.tag}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-slate-900">
                  {service.title}
                </h3>

                <p className="mt-3 min-h-[52px] text-sm leading-relaxed text-slate-600">
                  {service.description}
                </p>

                <div className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-primary">
                  서비스 보기
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
