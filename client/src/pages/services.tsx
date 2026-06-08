import { motion } from "framer-motion";
import { ArrowRight, Building2, Droplets, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";

const services = [
  {
    title: "계단청소",
    description:
      "빌라, 원룸, 상가 계단을 정기적으로 관리합니다. 계단 바닥, 난간, 공동현관 주변까지 건물 첫인상을 함께 정리합니다.",
    tag: "빌라 · 원룸 · 상가",
    href: "/services/stair",
    icon: Building2,
  },
  {
    title: "화장실청소",
    description:
      "상가와 사무실 공용화장실을 이용자 입장에서 관리합니다. 냄새, 물때, 세면대 주변 오염까지 꼼꼼하게 확인합니다.",
    tag: "상가 · 사무실 · 공용공간",
    href: "/services/bathroom",
    icon: Droplets,
  },
  {
    title: "유리청소",
    description:
      "공동현관 유리, 출입문 유리, 상가 전면 유리를 관리합니다. 손자국과 먼지 자국을 줄여 건물 입구를 밝게 보이게 합니다.",
    tag: "공동현관 · 출입문 · 상가유리",
    href: "/services/glass",
    icon: Sparkles,
  },
];

const glassCard =
  "rounded-[1.6rem] border border-white/18 bg-white/[0.14] shadow-[0_20px_60px_rgba(15,23,42,0.14)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.2]";

export default function Services() {
  return (
    <>
      <Navbar />

      <main className="relative min-h-screen overflow-hidden bg-[#07152f] text-white">
        <div className="fixed inset-0 z-0 bg-[#07152f]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.28),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.18),transparent_32%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#07152f]/70 via-[#07152f]/88 to-[#07152f]" />
        </div>

        <section className="relative z-10 px-4 pb-16 pt-32 md:pb-24 md:pt-40">
          <div className="container mx-auto max-w-6xl">
            <div className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
              <p className="mb-4 text-xs font-extrabold tracking-[0.35em] text-white/55">
                2000 STAIR SERVICES
              </p>

              <h1 className="font-['GmarketSans'] text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
                제공하는 청소 서비스
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-sm font-semibold leading-relaxed text-white/72 sm:text-lg">
                이천계단지기는 건물 상태와 이용 환경에 맞춰 계단, 화장실,
                유리까지 필요한 부분을 직접 확인하고 관리합니다.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3 md:gap-5">
              {services.map((service) => {
                const Icon = service.icon;

                return (
                  <a
                    key={service.title}
                    href={service.href}
                    className={`${glassCard} group flex min-h-[280px] flex-col p-6 md:p-7`}
                  >
                    <div className="mb-6 flex items-center justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/12">
                        <Icon className="h-6 w-6 text-white/90" />
                      </div>

                      <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold text-white/65">
                        {service.tag}
                      </span>
                    </div>

                    <h2 className="text-2xl font-extrabold text-white">
                      {service.title}
                    </h2>

                    <p className="mt-4 flex-1 text-sm leading-[1.8] text-white/72">
                      {service.description}
                    </p>

                    <div className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-white">
                      자세히 보기
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
