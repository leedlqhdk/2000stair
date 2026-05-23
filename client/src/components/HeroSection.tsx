import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Camera, MapPin } from "lucide-react";

interface HeroSectionProps {
  isAuthenticated: boolean;
}

const KAKAO_CHANNEL_URL = "https://pf.kakao.com/_IiNfn/chat";

const areas = [
  { name: "시내권", href: "/area/downtown" },
  { name: "신둔면", href: "/area/sindun" },
  { name: "마장면", href: "/area/majang" },
  { name: "대월면", href: "/area/daewol" },
];

const proofImages = [
  { src: "/images/shorts-1.webp" },
  { src: "/images/shorts-2.webp" },
  { src: "/images/shorts-3.webp" },
  { src: "/images/shorts-4.webp" },
  { src: "/images/shorts-5.webp" },
  { src: "/images/shorts-6.webp" },
];

export default function HeroSection({ isAuthenticated }: HeroSectionProps) {
  void isAuthenticated;

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="container max-w-6xl pt-6 sm:pt-7 md:pt-9 pb-4 md:pb-5">
        <div className="grid grid-cols-[0.56fr_0.44fr] items-start gap-1 sm:gap-2 md:gap-3 lg:gap-0">
          <motion.div
            className="min-w-0 pt-5 sm:pt-6 md:pt-7 lg:pt-8"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-[clamp(1.85rem,6vw,4.5rem)] font-extrabold leading-[1.08] tracking-[0.018em] text-foreground mb-3 sm:mb-4 md:mb-5">
              계단청소 아직
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

        <motion.div
          className="mt-6 sm:mt-8 border-t border-blue-100 pt-4 text-right sm:pt-5 md:mt-10 md:pt-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-3 text-[clamp(0.75rem,2.5vw,0.9rem)] font-semibold text-gray-500">
            관리 희망 지역을 먼저 확인해보세요
          </p>
          <div className="flex flex-wrap justify-end gap-2 sm:gap-2.5">
            {areas.map((area) => (
              <Link key={area.name} href={area.href}>
                <a className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-white px-3 sm:px-4 py-2 text-[clamp(0.75rem,2.5vw,0.9rem)] font-bold text-foreground shadow-sm whitespace-nowrap transition-colors hover:border-primary/40 hover:text-primary">
                  <MapPin className="h-[1em] w-[1em] text-primary shrink-0" />
                  {area.name}
                </a>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="bg-blue-50/40 pt-20 pb-24 md:pt-24 md:pb-28 overflow-hidden">
        <div className="container max-w-7xl">
          <div className="grid lg:grid-cols-[0.22fr_0.78fr] gap-10 md:gap-10 items-center">
            <div>
              <p className="text-xs md:text-sm font-bold tracking-[0.35em] text-primary mb-5 md:mb-4">
                map
              </p>
              <h2 className="text-xl md:text-3xl font-extrabold text-foreground mb-3">실제 관리 지역</h2>
              <p className="text-sm md:text-base text-gray-600">사진을 눌러보세요</p>
            </div>
            <div className="relative overflow-hidden">
              <div className="flex w-max gap-3 md:gap-4" style={{ animation: "slideLeft 24s linear infinite" }}>
                {[...proofImages, ...proofImages].map((image, index) => (
                  <Link key={`${image.src}-${index}`} href="/areas">
                    <a className="relative block shrink-0 w-36 md:w-52 aspect-square overflow-hidden rounded-2xl bg-white shadow-sm border border-blue-100 transition-transform hover:-translate-y-1">
                      <img
                        src={image.src}
                        alt={`이천계단지기 실제 관리 현장 ${index + 1}`}
                        className="h-full w-full object-cover object-bottom"
                        loading="lazy"
                      />
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
