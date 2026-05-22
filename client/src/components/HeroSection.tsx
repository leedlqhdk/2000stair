import { Link } from "wouter";
import { ArrowRight, Camera, ClipboardCheck, MapPin, MessageCircle, Phone, Users } from "lucide-react";

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

const trustPoints = [
  { icon: Users, label: "부부직영", value: "하청 NO" },
  { icon: ClipboardCheck, label: "상담 기준", value: "사진 안내" },
  { icon: MessageCircle, label: "문의 방식", value: "카톡 상담" },
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
      <div className="container max-w-5xl pt-8 md:pt-10 pb-7 md:pb-8">
        <div className="grid lg:grid-cols-[0.62fr_0.38fr] gap-4 md:gap-5 lg:gap-3 items-start">
          <div className="lg:pt-4">
            <h1 className="text-[2.35rem] sm:text-4xl md:text-5xl lg:text-[3.35rem] font-extrabold leading-[1.08] text-foreground mb-4 md:mb-5">
              아직도
              <br />
              <span className="text-primary">직접 청소</span>하고
              <br />
              계신가요?
            </h1>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-5 md:mb-6">
              이천 빌라 · 상가 계단청소
              <br className="hidden sm:block" />
              사진 한 장이면 바로 안내드립니다.
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5 mb-5 md:mb-6 max-w-[520px]">
              <a
                href={KAKAO_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#FEE500] px-5 text-base font-extrabold text-[#191919] shadow-lg shadow-yellow-300/20 ring-1 ring-black/5 transition-colors hover:bg-[#F4DC00]"
              >
                <MessageCircle className="h-5 w-5 stroke-[2.8]" />
                카톡으로 사진 보내기
                <ArrowRight className="h-4 w-4 stroke-[2.8]" />
              </a>
              <a
                href={`tel:${PHONE_NUMBER.replace(/-/g, "")}`}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border-2 border-primary/20 bg-white px-5 text-base font-extrabold text-primary shadow-sm transition-colors hover:border-primary/35 hover:bg-blue-50"
              >
                <Phone className="h-5 w-5 stroke-[2.8]" />
                전화 상담
              </a>
            </div>

            <p className="mb-4 text-sm font-semibold text-gray-500">
              관리 희망 지역을 먼저 확인해보세요
            </p>
            <div className="flex flex-wrap gap-2.5 max-w-[520px]">
              {areas.map((area) => (
                <Link key={area.name} href={area.href}>
                  <a className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-white px-3.5 py-2 text-sm font-bold text-foreground shadow-sm whitespace-nowrap transition-colors hover:border-primary/40 hover:text-primary">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    {area.name}
                  </a>
                </Link>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[230px] sm:max-w-[250px] md:max-w-[270px] mt-1 lg:mx-0 lg:mt-0 lg:-ml-1">
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
                className="absolute right-[0%] bottom-[27%] flex w-[37%] items-center justify-center rounded-[0.6rem] bg-[#FEE500] px-[4%] py-[3.5%] text-center text-[clamp(8px,1vw,11px)] font-extrabold leading-[1.12] text-[#191919] transition-transform hover:-translate-y-0.5"
                aria-label="카카오톡으로 계단 사진 보내기"
              >
                계단 사진
                <br />
                보내드려요!
              </a>
              <a
                href={KAKAO_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute right-[-3%] bottom-[18%] flex aspect-square w-[18%] items-center justify-center rounded-full border border-blue-100 bg-white text-primary transition-transform hover:-translate-y-0.5"
                aria-label="카카오톡 사진 보내기"
              >
                <Camera className="h-[52%] w-[52%]" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50/40 pt-7 pb-10 md:pt-9 md:pb-16 overflow-hidden">
        <div className="container max-w-7xl">
          <div className="mx-auto mb-8 md:mb-11 max-w-5xl">
            <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-8">
              {trustPoints.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex min-w-0 flex-col items-center justify-center gap-2 text-center md:flex-row md:gap-3 md:text-left"
                  >
                    <Icon className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[11px] sm:text-xs md:text-sm font-semibold text-gray-600 leading-tight">
                        {item.label}
                      </p>
                      <p className="text-xs sm:text-sm md:text-base font-extrabold text-foreground leading-tight whitespace-nowrap">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

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
