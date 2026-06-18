import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Camera, Check, MapPin } from "lucide-react";

interface HeroSectionProps {
  isAuthenticated: boolean;
}

const KAKAO_CHANNEL_URL = "https://pf.kakao.com/_IiNfn/chat";

const areaSectionItems = [
  { src: "/images/icheon-sindun-stair-cleaning.webp", title: "신둔면", subtitle: "공동현관 관리", slug: "sindun" },
  { src: "/images/icheon-bubal-store-cleaning.webp", title: "부발읍", subtitle: "상가 공용부 관리", slug: "bubal" },
  { src: "/images/icheon-downtown-stair-cleaning.webp", title: "창전동", subtitle: "계단 · 복도 관리", slug: "downtown" },
  { src: "/images/icheon-majang-villa-cleaning.webp", title: "마장면", subtitle: "빌라 정기관리", slug: "majang" },
  { src: "/images/icheon-gwango-building-cleaning.webp", title: "관고동", subtitle: "건물 공용부 관리", slug: "downtown" },
  { src: "/images/icheon-songjeong-villa-cleaning.webp", title: "송정동", subtitle: "현관 · 복도 관리", slug: "downtown" },
];

export default function HeroSection({ isAuthenticated }: HeroSectionProps) {
  void isAuthenticated;

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="container max-w-6xl pb-8 pt-6 sm:pt-7 md:pb-10 md:pt-9">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-8 lg:gap-10">
          <motion.div
            className="min-w-0 pt-3 text-left sm:pt-4 md:pt-0"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-3 hidden md:inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-primary sm:mb-4 sm:text-sm">
              <MapPin className="h-3.5 w-3.5" />
              이천 빌라·상가 전문
            </p>
            <div className="flex items-center gap-3 md:block">
            <h1 className="flex-1 min-w-0 mb-3 font-['GmarketSans'] text-[clamp(2.15rem,5.2vw,4.45rem)] font-extrabold leading-[1.08] tracking-[0.02em] text-foreground sm:mb-4 md:mb-5 md:text-[clamp(2.5rem,4.8vw,4.2rem)]">
              계단청소
              <br />
              <motion.span
                className="inline-block text-primary"
                initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.9, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                직접 관리
              </motion.span>
              <br />
              하고 계신가요?
            </h1>
            <div className="md:hidden w-[45%] shrink-0">
              <img src="/images/main-phone.webp" alt="카카오톡으로 계단 사진을 보내는 상담 화면" className="w-full object-contain" />
            </div>
            </div>
            <motion.p
              className="text-[clamp(0.95rem,2vw,1.22rem)] font-semibold leading-relaxed text-gray-700"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              이천 빌라 · 상가 계단청소
              <br />
              사진 한 장이면 빠르게 안내드립니다.
            </motion.p>
            <div className="mt-5 flex max-w-md flex-col gap-3 sm:mt-6 sm:flex-row sm:flex-wrap">
              <a
                href="https://pf.kakao.com/_IiNfn/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-primary/25 transition hover:-translate-y-0.5 sm:w-auto"
              >
                카톡으로 주소 보내기
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-4 flex max-w-xl flex-wrap gap-x-6 gap-y-2">
              {["하청 없이 부부가 직접", "무료 방문 견적", "작업 전후 사진 보고"].map(badge => (
                <span key={badge} className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground sm:text-sm">
                  <Check className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
                  {badge}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="hidden md:block relative mx-auto w-full max-w-[360px] md:max-w-[430px] lg:max-w-[470px]"
            initial={{ opacity: 0, y: 34, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative mx-auto w-full">
              <img
                src="/images/main-phone.webp"
                alt="카카오톡으로 계단 사진을 보내는 상담 화면"
                className="w-full object-contain"
              />
              <motion.a
                href={KAKAO_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group absolute bottom-[3.8%] left-[11%] right-[7%] flex h-[10.4%] items-center gap-[1.5%] rounded-full bg-white px-[2%] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary hover:shadow-md"
                aria-label="카카오톡으로 계단 주소 보내기"
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: [0, -5, 0], scale: 1 }}
                transition={{
                  opacity: { duration: 0.55, delay: 0.55, ease: [0.22, 1, 0.36, 1] },
                  scale: { duration: 0.55, delay: 0.55, ease: [0.22, 1, 0.36, 1] },
                  y: { duration: 3.8, repeat: Infinity, ease: "easeInOut" },
                }}
              >
                <span className="flex aspect-square h-[68%] shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors duration-300 group-hover:bg-white/95 group-hover:text-primary">
                  <Camera className="h-[54%] w-[54%]" />
                </span>
                <span className="min-w-0 flex-1 truncate text-[clamp(8px,1.45vw,14px)] font-extrabold leading-none text-foreground transition-colors duration-300 group-hover:text-white">
                  4층 빌라 계단사진 보내드려요
                </span>
                <span className="flex aspect-square h-[78%] shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors duration-300 group-hover:bg-white group-hover:text-primary">
                  <ArrowRight className="h-[55%] w-[55%] -rotate-45 stroke-[3]" />
                </span>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="overflow-hidden border-y border-blue-100/60 bg-[#f4f8ff] py-9 md:py-12">
        <div className="container max-w-7xl">
          <div className="grid items-center gap-5 lg:grid-cols-[0.25fr_0.75fr] lg:gap-7">
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-extrabold tracking-[0.16em] text-primary md:text-sm">
                <MapPin className="h-4 w-4 text-primary stroke-[3]" />
                MAP
              </p>

              <h2 className="mb-3 text-2xl font-extrabold leading-tight text-foreground md:text-3xl">
                실제 관리 지역
              </h2>

              <p className="max-w-xs text-sm leading-relaxed text-gray-600 line-clamp-2 md:text-base md:line-clamp-none">
                이천 북부 지역을 부부가 직접 관리합니다.
              </p>
            </motion.div>

            <div className="relative overflow-hidden pb-3 pt-1 md:pb-2 md:pt-0">
              <div className="flex w-max gap-3 md:gap-4" style={{ animation: "slideLeft 26s linear infinite" }}>
                {[...areaSectionItems, ...areaSectionItems].map((item, index) => (
                  <motion.div
                    key={`${item.src}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: (index % areaSectionItems.length) * 0.04 }}
                  >
                    <Link href={`/area/${item.slug}`}>
                      <a className="group relative block h-48 w-40 overflow-hidden rounded-xl border border-white/70 bg-white shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_18px_rgba(15,23,42,0.12)] md:h-52 md:w-44">
                        <img
                          src={item.src}
                          alt={`${item.title} 관리 현장`}
                          className="h-full w-full scale-[1.22] object-cover object-[center_96%] brightness-[1.05] contrast-[0.96] saturate-[0.88] transition-transform duration-500 group-hover:scale-[1.27]"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-[#f5f9ff]/10" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/64 via-black/10 to-white/6" />
                        <div className="absolute bottom-0 left-0 right-0 p-2.5 text-white">
                          <MapPin className="mb-1 h-4 w-4 text-white drop-shadow" />
                          <h3 className="text-sm font-extrabold leading-tight md:text-base">
                            {item.title}
                          </h3>
                          <p className="mt-0.5 text-[0.62rem] font-semibold text-white/78 md:text-xs">
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
