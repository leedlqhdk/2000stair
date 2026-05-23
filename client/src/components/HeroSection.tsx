import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Building2, Camera, MapPin, MessageCircle, ShieldCheck } from "lucide-react";

interface HeroSectionProps {
  isAuthenticated: boolean;
}

const KAKAO_CHANNEL_URL = "https://pf.kakao.com/_IiNfn/chat";

const areaSectionItems = [
  { src: "/images/shorts-1.webp", title: "신둔면 빌라", subtitle: "계단 · 복도 정기관리" },
  { src: "/images/shorts-2.webp", title: "부발읍 상가", subtitle: "공용공간 정기관리" },
  { src: "/images/shorts-3.webp", title: "마장면 빌라", subtitle: "바닥 · 계단 관리" },
  { src: "/images/shorts-4.webp", title: "이천 시내 빌라", subtitle: "계단 · 공동현관 관리" },
  { src: "/images/shorts-5.webp", title: "대월면 건물", subtitle: "공용부 정기관리" },
  { src: "/images/shorts-6.webp", title: "송정동 빌라", subtitle: "현관 · 복도 관리" },
];

const featureItems = [
  { icon: Building2, title: "현장 확인" },
  { icon: ShieldCheck, title: "직접 관리" },
  { icon: Camera, title: "사진 기록" },
  { icon: MessageCircle, title: "빠른 소통" },
];

export default function HeroSection({ isAuthenticated }: HeroSectionProps) {
  void isAuthenticated;

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="container max-w-6xl pt-6 sm:pt-7 md:pt-9 pb-6 md:pb-8">
        <div className="grid grid-cols-[0.56fr_0.44fr] items-start gap-1 sm:gap-2 md:gap-3 lg:gap-0">
          <motion.div
            className="min-w-0 pt-5 sm:pt-6 md:pt-7 lg:pt-8"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-[clamp(1.85rem,6vw,4.5rem)] font-extrabold leading-[1.08] tracking-[0.018em] text-foreground mb-3 sm:mb-4 md:mb-5">
              계단청소
              <br />
              <span className="text-primary">직접 청소</span>하고
              <br />
              계신가요?
            </h1>
            <motion.p
              className="text-[clamp(0.78rem,2vw,1.25rem)] text-gray-700 font-semibold leading-relaxed"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              이천 빌라 · 상가 계단청소
              <br />
              사진 한 장이면 빠르게 안내드립니다.
            </motion.p>
          </motion.div>

          <motion.div
            className="relative ml-[-2%] w-[108%] max-w-[clamp(230px,44vw,470px)] pt-0 -mr-[1%] md:ml-[-5%] md:-mr-[2%] lg:ml-[-10%]"
            initial={{ opacity: 0, y: 34, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="relative mx-auto w-full"
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <img
                src="/images/main-phone.webp"
                alt="카카오톡으로 계단 사진을 보내는 상담 화면"
                className="w-full object-contain"
              />
              <motion.a
                href={KAKAO_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group absolute left-[11%] right-[7%] bottom-[7.2%] flex h-[10.4%] items-center gap-[1.5%] rounded-full bg-white px-[2%] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary hover:shadow-md"
                aria-label="카카오톡으로 계단 사진 보내기"
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="flex aspect-square h-[68%] shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors duration-300 group-hover:bg-white/95 group-hover:text-primary">
                  <Camera className="h-[54%] w-[54%]" />
                </span>
                <span className="min-w-0 flex-1 truncate text-[clamp(8px,1.85vw,14px)] font-extrabold leading-none text-foreground transition-colors duration-300 group-hover:text-white">
                  4층 빌라 계단사진 보내드려요
                </span>
                <span className="flex aspect-square h-[78%] shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors duration-300 group-hover:bg-white group-hover:text-primary">
                  <ArrowRight className="h-[55%] w-[55%] -rotate-45 stroke-[3]" />
                </span>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="bg-blue-50/45 py-10 md:py-14 overflow-hidden">
        <div className="container max-w-7xl">
          <div className="grid items-center gap-6 lg:grid-cols-[0.27fr_0.73fr] lg:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-extrabold tracking-[0.18em] text-primary md:text-sm">
                <MapPin className="h-4 w-4 fill-primary/10" />
                MAP
              </p>
              <h2 className="mb-3 text-2xl font-extrabold leading-tight text-foreground md:text-3xl">
                실제 관리 지역
              </h2>
              <p className="max-w-xs text-sm leading-relaxed text-gray-600 md:text-base">
                이천 전 지역 꼼꼼하게 관리합니다. 실제 관리 현장을 확인해보세요.
              </p>

              <div className="mt-5 grid max-w-xs grid-cols-2 gap-2.5 rounded-2xl border border-blue-100 bg-white/75 p-3 shadow-sm backdrop-blur">
                {featureItems.map((item) => (
                  <div key={item.title} className="flex items-center gap-2 rounded-xl bg-blue-50/60 px-2.5 py-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-primary shadow-sm">
                      <item.icon className="h-4 w-4" />
                    </span>
                    <span className="text-xs font-extrabold text-foreground">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="relative overflow-hidden pb-2">
              <div className="flex w-max gap-3 md:gap-4" style={{ animation: "slideLeft 26s linear infinite" }}>
                {[...areaSectionItems, ...areaSectionItems].map((item, index) => (
                  <motion.div
                    key={`${item.src}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: (index % areaSectionItems.length) * 0.04 }}
                  >
                    <Link href="/areas">
                      <a className="group relative block h-40 w-36 overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:h-44 md:w-40">
                        <img
                          src={item.src}
                          alt={`${item.title} 관리 현장`}
                          className="h-full w-full object-cover object-bottom transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-2.5 text-white">
                          <div className="mb-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/95 text-primary shadow-sm">
                            <MapPin className="h-3.5 w-3.5" />
                          </div>
                          <h3 className="text-xs font-extrabold leading-tight md:text-sm">
                            {item.title}
                          </h3>
                          <p className="mt-0.5 text-[0.62rem] font-semibold text-white/80 md:text-[0.68rem]">
                            {item.subtitle}
                          </p>
                        </div>
                      </a>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
