import { Link } from "wouter";
import { ArrowRight, Camera, MapPin, MessageCircle, Phone } from "lucide-react";

interface HeroSectionProps {
  isAuthenticated: boolean;
}

const KAKAO_CHANNEL_URL = "https://pf.kakao.com/_IiNfn/chat";
const PHONE_NUMBER = "010-8438-1887";

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
      <div className="container max-w-5xl pt-4 sm:pt-6 md:pt-9 pb-7 md:pb-10">
        <div className="grid grid-cols-[0.57fr_0.43fr] items-start gap-2 sm:gap-3 md:gap-4 lg:gap-2">
          <div className="min-w-0 pt-1 lg:pt-2">
            <a href="/" className="mb-3 inline-flex items-center" aria-label="이천계단지기 홈으로 이동">
              <img
                src="/images/icheon-logo-main.png"
                alt="이천계단지기"
                className="h-[clamp(16px,3.8vw,28px)] w-auto object-contain"
              />
            </a>

            <h1 className="text-[clamp(1.85rem,7.5vw,3.2rem)] font-extrabold leading-[1.08] text-foreground mb-3 sm:mb-4 md:mb-5">
              아직도
              <br />
              <span className="text-primary">직접 청소</span>하고
              <br />
              계신가요?
            </h1>
            <p className="text-[clamp(0.78rem,3vw,1.1rem)] text-gray-700 font-semibold leading-relaxed mb-4 sm:mb-5 md:mb-6">
              이천 빌라 · 상가 계단청소
              <br />
              사진 한 장이면 빠르게 안내드립니다.
            </p>

            <div className="flex flex-col min-[420px]:flex-row gap-2 sm:gap-2.5 max-w-[520px]">
              <a
                href={KAKAO_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-[clamp(42px,10vw,52px)] items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-[#FEE500] px-3 sm:px-5 text-[clamp(0.78rem,3vw,1rem)] font-extrabold text-[#191919] shadow-sm ring-1 ring-black/5 transition-colors hover:bg-[#F4DC00]"
              >
                <MessageCircle className="h-[1.1em] w-[1.1em] stroke-[2.8]" />
                카톡으로 사진 보내기
                <ArrowRight className="h-[1em] w-[1em] stroke-[2.8]" />
              </a>
              <a
                href={`tel:${PHONE_NUMBER.replace(/-/g, "")}`}
                className="inline-flex h-[clamp(42px,10vw,52px)] items-center justify-center gap-1.5 sm:gap-2 rounded-full border-2 border-primary/20 bg-white px-4 sm:px-7 text-[clamp(0.78rem,3vw,1rem)] font-extrabold text-primary shadow-sm transition-colors hover:border-primary/35 hover:bg-blue-50"
              >
                <Phone className="h-[1.1em] w-[1.1em] stroke-[2.8]" />
                전화 상담
              </a>
            </div>
          </div>

          <div className="relative ml-auto w-full max-w-[clamp(180px,43vw,420px)] pt-1 md:pt-0 lg:-ml-4">
            <div className="relative mx-auto w-full">
              <img
                src="/images/main-phone.webp"
                alt="카카오톡으로 계단 사진을 보내는 상담 화면"
                className="w-full object-contain"
              />
              <a
                href={KAKAO_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute left-[13%] right-[4%] bottom-[5.8%] flex h-[6.3%] items-center gap-[2.5%] rounded-full bg-white/96 px-[2.1%] shadow-sm transition-transform hover:-translate-y-0.5"
                aria-label="카카오톡으로 계단 사진 보내기"
              >
                <span className="flex aspect-square h-[74%] shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                  <Camera className="h-[55%] w-[55%]" />
                </span>
                <span className="min-w-0 flex-1 truncate text-[clamp(6px,1.55vw,12px)] font-extrabold leading-none text-foreground">
                  4층 빌라 계단사진 보내드려요
                </span>
                <span className="flex aspect-square h-[84%] shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <ArrowRight className="h-[55%] w-[55%] -rotate-45 stroke-[3]" />
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 border-t border-blue-100 pt-4 sm:pt-5 md:mt-10 md:pt-6">
          <p className="mb-3 text-[clamp(0.75rem,2.5vw,0.9rem)] font-semibold text-gray-500">
            관리 희망 지역을 먼저 확인해보세요
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            {areas.map((area) => (
              <Link key={area.name} href={area.href}>
                <a className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-white px-3 sm:px-4 py-2 text-[clamp(0.75rem,2.5vw,0.9rem)] font-bold text-foreground shadow-sm whitespace-nowrap transition-colors hover:border-primary/40 hover:text-primary">
                  <MapPin className="h-[1em] w-[1em] text-primary shrink-0" />
                  {area.name}
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-blue-50/40 pt-7 pb-10 md:pt-9 md:pb-16 overflow-hidden">
        <div className="container max-w-7xl">
          <div className="grid lg:grid-cols-[0.22fr_0.78fr] gap-6 md:gap-8 items-center">
            <div>
              <p className="text-xs md:text-sm font-bold tracking-[0.35em] text-primary mb-3 md:mb-4">
                Shorts
              </p>
              <h2 className="text-xl md:text-3xl font-extrabold text-foreground mb-2">실제 관리 현장</h2>
              <p className="text-sm md:text-base text-gray-600">영상으로 확인해보세요</p>
            </div>
            <div className="relative overflow-hidden">
              <div className="flex w-max gap-3 md:gap-4" style={{ animation: "slideLeft 24s linear infinite" }}>
                {[...proofImages, ...proofImages].map((image, index) => (
                  <button
                    key={`${image.src}-${index}`}
                    type="button"
                    onClick={() => window.open("https://youtube.com/@2000stair?si=UxYmvQPywQSOj3DU", "_blank")}
                    className="relative shrink-0 w-36 md:w-52 aspect-square overflow-hidden rounded-2xl bg-white shadow-sm border border-blue-100"
                  >
                    <img
                      src={image.src}
                      alt={`이천계단지기 실제 관리 현장 ${index + 1}`}
                      className="h-full w-full object-cover object-bottom"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
