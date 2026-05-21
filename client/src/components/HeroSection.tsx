import { Link } from "wouter";
import { ClipboardCheck, MapPin, MessageCircle, Users } from "lucide-react";

interface HeroSectionProps {
  isAuthenticated: boolean;
}

const areas = [
  {
    name: "시내권",
    href: "/area/downtown",
  },
  {
    name: "신둔면",
    href: "/area/sindun",
  },
  {
    name: "마장면",
    href: "/area/majang",
  },
  {
    name: "대월면",
    href: "/area/daewol",
  },
];

const trustPoints = [
  {
    icon: Users,
    label: "부부직영",
    value: "하청 NO",
  },
  {
    icon: ClipboardCheck,
    label: "관리 기준",
    value: "정기관리",
  },
  {
    icon: MessageCircle,
    label: "상담 방식",
    value: "카톡 상담",
  },
];

const proofImages = [
  { src: "/images/villa-cleaning-1.jpg" },

  { 
    src: "/images/villa-entrance-glass.jpg",
    imageClassName: "-rotate-90 scale-[1.35]"
  },

  { 
    src: "/images/bathroom-cleaning-1.jpg",
    imageClassName: "-rotate-90 scale-[1.35]"
  },

  { src: "/images/stair-floor-after-1.jpg" },

  {
    src: "/images/stair-floor-after-2.jpg",
    imageClassName: "-rotate-90 scale-[1.35]"
  },

  {
    src: "/images/icheon-bathroom-cleaning.jpg",
    imageClassName: "-rotate-90 scale-[1.35]"
  },
];

export default function HeroSection({ isAuthenticated }: HeroSectionProps) {
  void isAuthenticated;

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="container max-w-7xl pt-8 md:pt-12 pb-7 md:pb-9">
        <div className="grid lg:grid-cols-[0.9fr_0.72fr] gap-7 lg:gap-12 items-start">
          <div className="lg:pt-5">
            <p className="text-xs md:text-sm font-bold tracking-[0.35em] text-primary mb-4">
              SERVICE AREA
            </p>

            <h1 className="text-[2.2rem] sm:text-3xl md:text-4xl lg:text-6xl font-extrabold leading-[1.12] text-foreground mb-5 md:mb-6">
              이천 빌라·상가
              <br />
              공용공간,
              <br />
              부부가 직접 관리합니다
            </h1>

            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-5 md:mb-6">
              계단·복도·공동현관 유리·화장실까지
              <br className="hidden sm:block" />
              하청 없이 정기적으로 관리합니다.
            </p>

            <div className="flex flex-wrap gap-2.5 max-w-[520px]">
              {areas.map((area) => {
                const className =
                  "inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-white px-3.5 py-2 text-sm font-bold text-foreground shadow-sm whitespace-nowrap transition-colors hover:border-primary/40 hover:text-primary";

                return (
                  <Link key={area.name} href={area.href}>
                    <a className={className}>
                      <MapPin className="h-4 w-4 text-primary shrink-0" />
                      {area.name}
                    </a>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[430px] mt-3 lg:mt-0">
            <div className="overflow-hidden rounded-[1.5rem] md:rounded-[1.75rem] border border-blue-100 shadow-xl bg-blue-50">
              <img
                src="/images/hero-main.png"
                alt="이천계단지기 계단청소 관리 현장"
                className="w-full aspect-[3/4] md:aspect-[4/5] object-cover"
              />
            </div>

            <div className="absolute right-3 bottom-3 rounded-[1.1rem] md:rounded-[1.35rem] bg-white px-4 md:px-6 py-3.5 md:py-5 shadow-xl border border-blue-100">
              <p className="text-xs md:text-sm font-bold text-primary mb-1 md:mb-2">
                부부직영
              </p>
              <p className="text-lg md:text-2xl font-extrabold leading-[1.1] text-foreground">
                하청 없이
                <br />
                직접 관리
              </p>
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
              <h2 className="text-xl md:text-3xl font-extrabold text-foreground mb-2">
                실제 관리 현장
              </h2>
              <p className="text-sm md:text-base text-gray-600">
                영상으로 확인해보세요
              </p>
            </div>

            <div className="relative overflow-hidden">
              <div
                className="flex w-max gap-3 md:gap-4"
                style={{ animation: "slideLeft 24s linear infinite" }}
              >
                {[...proofImages, ...proofImages].map((image, index) => (
                  <button
                    key={`${image.src}-${index}`}
                    type="button"
                    onClick={() =>
                      window.open(
                        "https://youtube.com/@2000stair?si=UxYmvQPywQSOj3DU",
                        "_blank"
                      )
                    }
                    className="relative shrink-0 w-36 md:w-52 aspect-[4/5] overflow-hidden rounded-2xl bg-white shadow-sm border border-blue-100"
                  >
                    <img
  src={image.src}
  alt={`이천계단지기 실제 관리 현장 ${index + 1}`}
  className={`h-full w-full object-cover ${image.imageClassName ?? ""}`}
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
