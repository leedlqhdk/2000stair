import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

interface HeroSectionProps {
  isAuthenticated: boolean;
}

export default function HeroSection({ isAuthenticated }: HeroSectionProps) {
  const handleCTA = () => {
    document.getElementById("quote-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient - cobalt blue tones */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-blue-50/50" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl" />

      <div className="container relative py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              이천 전 지역 계단청소 전문
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-foreground">
              깨끗한 건물,{" "}
              <span className="text-primary">구독 한 번</span>으로
              <br />
              시작하세요
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg">
              이천계단지기가 직접 관리하는 2년 정기 청소 구독 서비스.
              대면·비대면 모두 가능하며, 무료 방문 견적으로 시작하세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="text-base px-8" onClick={handleCTA}>
                무료 견적 신청
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-base px-8"
                onClick={() =>
                  document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                서비스 알아보기
              </Button>
            </div>
            <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                무료 방문 견적
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                하청 없는 직접 관리
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                친환경 세정제
              </span>
            </div>
          </div>

          {/* Right: Hero Image Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-3">
              {/* Main large image - 작업조끼 (브랜드 인식) */}
              <div className="col-span-2 rounded-2xl overflow-hidden shadow-xl border border-blue-100">
                <img
                  src="/manus-storage/work-vest_b3f4fbac.png"
                  alt="이천계단지기 작업 조끼"
                  className="w-full h-56 md:h-64 object-cover object-center"
                />
              </div>
              {/* Bottom left - 계단 청소 완료 */}
              <div className="rounded-xl overflow-hidden shadow-lg border border-blue-100">
                <img
                  src="/manus-storage/stair-clean3_7d8b7d17.jpg"
                  alt="계단 청소 완료"
                  className="w-full h-32 md:h-40 object-cover"
                />
              </div>
              {/* Bottom right - 화장실 청소 */}
              <div className="rounded-xl overflow-hidden shadow-lg border border-blue-100">
                <img
                  src="/manus-storage/bathroom-clean_94fbf76e.jpg"
                  alt="화장실 청소 현장"
                  className="w-full h-32 md:h-40 object-cover"
                />
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 border border-blue-100">
              <div className="text-2xl font-bold text-primary">5년+</div>
              <div className="text-sm text-muted-foreground">경력의 전문 관리</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
