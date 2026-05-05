import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { ArrowRight, Sparkles } from "lucide-react";

interface HeroSectionProps {
  isAuthenticated: boolean;
}

export default function HeroSection({ isAuthenticated }: HeroSectionProps) {
  const handleCTA = () => {
    if (isAuthenticated) {
      document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = getLoginUrl();
    }
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/30" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />

      <div className="container relative py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              매달 새로운 청소 용품이 문 앞에
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-foreground">
              깨끗한 집,{" "}
              <span className="text-primary">구독 한 번</span>으로
              <br />
              시작하세요
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg">
              PeanutCrate가 엄선한 프리미엄 친환경 청소 용품을 매달 배송해 드립니다.
              더 이상 무엇을 사야 할지 고민하지 마세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="text-base px-8" onClick={handleCTA}>
                구독 시작하기
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
                자세히 알아보기
              </Button>
            </div>
            <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                무료 배송
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                언제든 해지 가능
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                친환경 제품
              </span>
            </div>
          </div>

          {/* Right: Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663628169660/BuDLHDfm5bfYXthRJ4c8ks/hero-box-VQJxFnnoqhhVEEG6uNWfpD.webp"
                alt="PeanutCrate 청소 구독 박스"
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 border border-border">
              <div className="text-2xl font-bold text-primary">5,000+</div>
              <div className="text-sm text-muted-foreground">만족한 구독자</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
