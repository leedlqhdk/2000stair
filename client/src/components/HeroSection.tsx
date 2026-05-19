import { MapPin } from "lucide-react";

interface HeroSectionProps {
  isAuthenticated: boolean;
}

const areas = ["신둔면", "마장면", "대월면"];

const proofImages = [
  "/manus-storage/stair-floor-after_0e13b4f5.webp",
  "/manus-storage/railing-after_004e4850.webp",
  "/manus-storage/stair-floor2-after_264662fb.webp",
  "/manus-storage/window-frame-after_9c733b21.webp",
  "/manus-storage/glass-after_3ef4a793.webp",
  "/manus-storage/window-rail-after_60e8ed20.webp",
];

export default function HeroSection({ isAuthenticated }: HeroSectionProps) {
  void isAuthenticated;

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="container max-w-7xl pt-14 md:pt-28">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-8 lg:gap-16 items-center">
          <div>
            <p className="text-xs md:text-sm font-bold tracking-[0.35em] text-primary mb-5">
              SERVICE AREA
            </p>

            <h1 className="text-[2.2rem] sm:text-3xl md:text-4xl lg:text-6xl font-extrabold leading-[1.03] text-foreground mb-6 md:mb-8">
              이천 곳곳의
              <br />
              건물을 관리합니다
            </h1>

            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6 md:mb-8">
              이천 빌라·원룸·상가 공용공간을
              <br className="hidden sm:block" />
              부부가 직접 관리합니다.
            </p>

            <div className="flex flex-wrap gap-2.5 md:gap-3">
              {areas.map((area) => (
                <span
                  key={area}
                  className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 md:px-5 py-2.5 md:py-3 text-sm font-bold text-foreground shadow-sm"
                >
                  <MapPin className="w-4 h-4 text-primary" />
                  {area}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mt-6 lg:mt-0">
            <div className="overflow-hidden rounded-[1.75rem] md:rounded-[2rem] border border-blue-100 shadow-xl">
              <img
                src="/manus-storage/work-vest_b3f4fbac.png"
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
      </div>
 
      <div className="bg-blue-50/40 py-10 md:py-16 overflow-hidden">
        <div className="container max-w-7xl">
          <div className="grid lg:grid-cols-[0.22fr_0.78fr] gap-6 md:gap-8 items-center">
            <div>
              <p className="text-xs md:text-sm font-bold tracking-[0.35em] text-primary mb-3 md:mb-4">
                Shorts
              </p>
              <h2 className="text-xl md:text-3xl font-extrabold text-foreground mb-2">
                실제 작업 현장을
              </h2>
              <p className="text-sm md:text-base text-gray-600">
               쇼츠로 확인해보세요
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
