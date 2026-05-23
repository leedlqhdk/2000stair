import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Camera, MapPin } from "lucide-react";

interface HeroSectionProps {
  isAuthenticated: boolean;
}

const KAKAO_CHANNEL_URL = "https://pf.kakao.com/_IiNfn/chat";

const areaSectionItems = [
  { src: "/images/shorts-1.webp", title: "신둔면", subtitle: "공동현관 관리" },
  { src: "/images/shorts-2.webp", title: "부발읍", subtitle: "상가 공용부 관리" },
  { src: "/images/shorts-3.webp", title: "마장면", subtitle: "계단 · 복도 관리" },
  { src: "/images/shorts-4.webp", title: "시내권", subtitle: "빌라 정기관리" },
  { src: "/images/shorts-5.webp", title: "대월면", subtitle: "건물 공용부 관리" },
  { src: "/images/shorts-6.webp", title: "송정동", subtitle: "현관 · 복도 관리" },
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
            <h1 className="text-[clamp(1.85rem,6vw,4.5rem)] font-extrabold leading-[1.08] tracking-[0.045em] text-foreground mb-3 sm:mb-4 md:mb-5">
              계단청소
              <br />
              <span className="relative inline-block text-slate-400">
                직접 청소
                <motion.span
                  className="absolute inset-0 overflow-hidden whitespace-nowrap text-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: ["0%", "100%", "100%", "0%"] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  직접 청소
                </motion.span>
              </span>
              하고
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
                className="group absolute left-[11%] right-[7%] bottom-[7.2%] flex h-[10.4%] items-center gap-[1.5%] rounded-full bg-white px-[2%] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary hover:shadow-md"
                aria-label="카카오톡으로 계단 사진 보내기"
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
                <span className="min-w-0 flex-1 truncate text-[clamp(8px,1.85vw,14px)] font-extrabold leading-none text-foreground transition-colors duration-300 group-hover:text-white">
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
              <p className="max-w-xs text-sm leading-relaxed text-gray-600 md:text-base">
               이천 북부 지역을 부부가 직접 관리합니다.
              </p>
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
                      <a className="group relative block h-48 w-40 overflow-hidden rounded-xl border border-white/70 bg-white shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_18px_rgba(15,23,42,0.12)] md:h-52 md:w-44">
                        <img
                          src={item.src}
                          alt={`${item.title} 관리 현장`}
                          className="h-full w-full scale-110 object-cover object-bottom brightness-[1.08] saturate-[0.78] transition-transform duration-500 group-hover:scale-[1.15]"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-white/10 mix-blend-screen" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/68 via-black/12 to-white/12" />
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
