import { MapPin, Users, ClipboardCheck, MessageCircle, ArrowRight } from "lucide-react";

interface HeroSectionProps {
  isAuthenticated: boolean;
}

const areas = ["신둔면", "마장면", "부발읍", "증포동", "중리동", "관고동", "대월면"];

const proofImages = [
  "/manus-storage/stair-floor-after_0e13b4f5.webp",
  "/manus-storage/railing-after_004e4850.webp",
  "/manus-storage/stair-floor2-after_264662fb.webp",
  "/manus-storage/window-frame-after_9c733b21.webp",
  "/manus-storage/glass-after_3ef4a793.webp",
];

export default function HeroSection({ isAuthenticated }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="container max-w-7xl pt-20 md:pt-28">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-10 lg:gap-16 items-center">
          <div>
            <p className="text-sm font-bold tracking-[0.35em] text-primary mb-6">
              SERVICE AREA
            </p>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.08] text-foreground mb-8">
              이천 곳곳의
              <br />
              건물을 관리합니다
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
              이천 빌라·원룸·상가 공용공간을
              <br className="hidden sm:block" />
              부부가 직접 관리합니다.
            </p>

            <div className="flex flex-wrap gap-3">
              {areas.map((area) => (
                <span
                  key={area}
                  className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-5 py-3 text-sm font-bold text-foreground shadow-sm"
                >
                  <MapPin className="w-4 h-4 text-primary" />
                  {area}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] border border-blue-100 shadow-xl">
              <img
                src="/manus-storage/stair-clean3_7d8b7d17.jpg"
                alt="이천계단지기 계단청소 관리 현장"
                className="w-full aspect-[16/10] object-cover"
              />
            </div>

            <div className="absolute right-5 bottom-5 rounded-[1.5rem] bg-white px-7 py-6 shadow-xl border border-blue-100">
              <p className="text-sm font-bold text-primary mb-2">부부직영</p>
              <p className="text-2xl md:text-3xl font-extrabold leading-tight text-foreground">
                하청 없이
                <br />
                직접 관리
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-14 bg-blue-50/60 border-y border-blue-100">
        <div className="container max-w-7xl grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-blue-100">
          <div className="flex items-center gap-5 py-8 md:py-10">
            <Users className="w-11 h-11 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">부부직영</p>
              <p className="text-xl font-extrabold text-foreground">하청 NO</p>
            </div>
          </div>

          <div className="flex items-center gap-5 py-8 md:py-10 md:pl-12">
            <ClipboardCheck className="w-11 h-11 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">관리 기준</p>
              <p className="text-xl font-extrabold text-foreground">정기관리</p>
            </div>
          </div>

          <div className="flex items-center gap-5 py-8 md:py-10 md:pl-12">
            <MessageCircle className="w-11 h-11 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">상담 방식</p>
              <p className="text-xl font-extrabold text-foreground">카톡 상담</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50/40 py-14 md:py-16">
        <div className="container max-w-7xl">
          <div className="grid lg:grid-cols-[0.22fr_0.78fr] gap-8 items-center">
            <div>
              <p className="text-sm font-bold tracking-[0.35em] text-primary mb-4">
                SHORTS
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
                실제 관리 현장
              </h2>
              <p className="text-muted-foreground">
                짧은 영상으로 확인해보세요
              </p>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2">
              {proofImages.map((src, index) => (
                <div
                  key={src}
                  className="relative shrink-0 w-44 md:w-52 aspect-[4/5] overflow-hidden rounded-2xl bg-white shadow-sm border border-blue-100"
                >
                  <img
                    src={src}
                    alt={`이천계단지기 실제 관리 현장 ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  window.open("https://youtube.com/@2000stair?si=UxYmvQPywQSOj3DU", "_blank")
                }
                className="shrink-0 self-center w-14 h-14 rounded-full bg-white shadow-md border border-blue-100 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                aria-label="유튜브 채널 보기"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
