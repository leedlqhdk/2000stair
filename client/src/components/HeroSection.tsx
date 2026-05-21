import { Link } from "wouter";
import { ClipboardCheck, MapPin, MessageCircle, Users } from "lucide-react";

interface HeroSectionProps {
  isAuthenticated: boolean;
}

const areas = [
  {
    name: "신둔면",
    active: false,
    desc: "",
    href: "",
  },
  {
    name: "마장면",
    active: true,
    desc: "",
    href: "/area/majang",
  },
  {
    name: "대월면",
    active: true,
    desc: "",
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
  "/images/villa-cleaning-1.jpg",
  "/images/villa-entrance-glass.jpg",
  "/images/bathroom-cleaning-1.jpg",
  "/images/stair-floor-after-1.jpg",
  "/images/stair-floor-after-2.jpg",
  "/images/icheon-bathroom-cleaning.jpg",
];

export default function HeroSection({ isAuthenticated }: HeroSectionProps) {
  void isAuthenticated;

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="container max-w-7xl pt-12 md:pt-24 pb-8 md:pb-10">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-8 lg:gap-16 items-center">
          <div>
            <p className="text-xs md:text-sm font-bold tracking-[0.35em] text-primary mb-5">
              SERVICE AREA
            </p>

            <h1 className="text-[2.2rem] sm:text-3xl md:text-4xl lg:text-6xl font-extrabold leading-[1.03] text-foreground mb-6 md:mb-8">
              계단
              <br />
              지기
            </h1>

            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6 md:mb-8">
              이천 빌라·원룸·상가 공용공간을
              <br className="hidden sm:block" />
              부부가 직접 관리합니다.
            </p>

            <div className="grid grid-cols-2 sm:flex gap-3 max-w-[420px]">
              {areas.map((area) =>
                area.active ? (
                  <Link key={area.name} href={area.href}>
                    <a className="group rounded-2xl border border-blue-100 bg-white px-4 py-3 md:px-5 md:py-4 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-primary shrink-0" />
                        <span className="font-extrabold text-sm md:text-base text-foreground truncate">
                          {area.name}
                        </span>
                      </div>

                      <p className="text-[11px] md:text-xs text-muted-foreground leading-snug">
                        {area.desc}
                      </p>
                    </a>
                  </Link>
                ) : (
                  <div
                    key={area.name}
                    className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 md:px-5 md:py-4 opacity-70 min-w-0"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="font-extrabold text-sm md:text-base text-gray-500 truncate">
                        {area.name}
                      </span>
                    </div>

                    <p className="text-[11px] md:text-xs text-gray-400 leading-snug">
                      {area.desc}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="relative mt-6 lg:mt-0">
            <div className="overflow-hidden rounded-[1.75rem] md:rounded-[2rem] border border-blue-100 shadow-xl bg-blue-50">
              <img
                src="/images/hero-main.png"
                alt="이천계단지기 계단청소 관리 현장"
                className="w-full aspect-[16/11] md:aspect-[16/10] object-cover"
              />
            </div>

            <div className="absolute right-4 bottom-4 rounded-[1.25rem] md:rounded-[1.75rem] bg-white px-5 md:px-7 py-4 md:py-6 shadow-xl border border-blue-100">
              <p className="text-xs md:text-sm font-bold text-primary mb-1 md:mb-2">
                부부직영
              </p>
              <p className="text-lg md:text-3xl font-extrabold leading-[1.1] text-foreground">
                하청 없이
                <br />
                직접 관리
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 md:mt-10 mx-auto max-w-5xl rounded-2xl border border-blue-100 bg-blue-50/40 px-5 py-5 md:px-8 md:py-6">
          <div className="grid gap-4 sm:grid-cols-3 sm:divide-x sm:divide-blue-100">
            {trustPoints.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex items-center justify-center gap-3 text-center sm:px-5"
                >
                  <Icon className="h-8 w-8 md:h-9 md:w-9 text-primary shrink-0" />
                  <div className="text-left">
                    <p className="text-xs md:text-sm font-semibold text-gray-600 leading-tight">
                      {item.label}
                    </p>
                    <p className="text-sm md:text-base font-extrabold text-foreground leading-tight">
                      {item.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-blue-50/40 py-10 md:py-16 overflow-hidden">
        <div className="container max-w-7xl">
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
                {[...proofImages, ...proofImages].map((src, index) => (
                  <button
                    key={`${src}-${index}`}
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
                      src={src}
                      alt={`이천계단지기 실제 관리 현장 ${index + 1}`}
                      className="w-full h-full object-cover"
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
