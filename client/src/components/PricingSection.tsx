import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface PricingSectionProps {
  isAuthenticated: boolean;
}

export default function PricingSection({ isAuthenticated }: PricingSectionProps) {
  const { data: plans } = trpc.quote.plans.useQuery();

  const handleQuoteRequest = (planId: string) => {
    const quoteSection = document.getElementById("quote-form");
    if (quoteSection) {
      quoteSection.scrollIntoView({ behavior: "smooth" });
      // Set plan selection via custom event
      window.dispatchEvent(new CustomEvent("selectPlan", { detail: { planId } }));
    }
  };

  const displayPlans = plans || [
    {
      id: "basic",
      name: "Basic",
      description: "소규모 건물을 위한 기본 청소 구독",
      features: ["월 2회 정기 계단 청소", "공동현관 바닥 청소", "우편함 주변 정리", "청소 완료 사진 보고", "2년 약정 할인 적용"],
      popular: false,
    },
    {
      id: "standard",
      name: "Standard",
      description: "가장 인기 있는 정기 청소 구독",
      features: ["주 1회 정기 계단 청소", "복도 + 계단 + 현관 전체 관리", "엘리베이터 내부 청소", "화장실 청소 포함", "분기별 특수 청소 1회", "청소 완료 사진 보고", "2년 약정 할인 적용"],
      popular: true,
    },
    {
      id: "premium",
      name: "Premium",
      description: "완벽한 건물 관리를 위한 프리미엄 구독",
      features: ["주 2회 정기 청소 (계단+복도+현관)", "엘리베이터 + 화장실 + 주차장", "외부 유리창 청소 포함", "월 1회 특수 청소 (왁스코팅 등)", "비둘기/해충 방제 관리", "전담 매니저 배정", "24시간 긴급 청소 대응", "2년 약정 최대 할인 적용"],
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 md:py-28 bg-secondary/30">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            나에게 맞는 플랜 선택
          </h2>
          <p className="text-muted-foreground text-lg mb-4">
            2년 정기 구독으로 합리적인 가격에 깨끗한 건물을 유지하세요.
          </p>
          <p className="text-sm text-muted-foreground">
            대면 / 비대면 서비스 모두 가능 | 무료 방문 견적 후 정확한 금액을 안내해 드립니다.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {displayPlans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                plan.popular
                  ? "border-primary shadow-md scale-[1.02] md:scale-105"
                  : "border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg">
                  인기
                </div>
              )}
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="pt-4">
                  <span className="text-lg font-semibold text-primary">
                    무료 방문 견적
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    건물 규모에 따라 맞춤 견적을 제공합니다
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2.5">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full mt-4"
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => handleQuoteRequest(plan.id)}
                >
                  무료 견적 신청
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
