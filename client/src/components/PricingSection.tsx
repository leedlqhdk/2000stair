import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
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
      window.dispatchEvent(new CustomEvent("selectPlan", { detail: { planId } }));
    }
  };

  const displayPlans = plans || [
    {
      id: "stair_2_3",
      name: "2-3층 계단",
      price: "66,000원~",
      description: "이천지역 밀착 관리 · 친환경 수입세제로 매달 같은 손이 관리합니다",
      popular: false,
    },
    {
      id: "stair_4",
      name: "4층 계단",
      price: "77,000원~",
      description: "부부 직영, 외주 없이, 처음 온 날과 같은 품질로 유지합니다",
      popular: true,
    },
    {
      id: "stair_5_6",
      name: "5-6층 계단",
      price: "88,000원~",
      description: "건물당 걸레 1장 원칙, 위층 아래층 동일한 기준으로 호텔급 관리",
      popular: false,
    },
    {
      id: "other_services",
      name: "화장실/사무실/유리 청소",
      price: "별도 문의",
      description: "화장실 위생 관리, 사무실 정기청소(세금계산서 가능), 상가 유리창 청소까지 모든 공간을 전문적으로 관리합니다.",
      popular: false,
    },
  ];

  const stairPlans = displayPlans.filter((p) => p.id.startsWith("stair"));
  const otherPlans = displayPlans.filter((p) => !p.id.startsWith("stair"));

  return (
    <section id="pricing" className="py-20 md:py-28 bg-secondary/30">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            서비스 요금 안내
          </h2>
          <p className="text-muted-foreground text-lg mb-2">
            처음처럼, 언제나 같은 품질
          </p>
          <p className="text-sm text-muted-foreground">
            무료 방문 견적 후 정확한 금액을 안내해 드립니다 · 대면 / 비대면 모두 가능
          </p>
        </div>

        {/* Stair Plans - Main Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
          {stairPlans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                plan.popular
                  ? "border-primary shadow-md ring-2 ring-primary/20"
                  : "border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
              )}
              <CardContent className="pt-8 pb-6 px-6 flex flex-col h-full">
                <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-2xl font-extrabold text-primary">{plan.price}</span>
                  <span className="text-xs text-muted-foreground ml-1">/월</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                  {plan.description}
                </p>
                <Button
                  className="w-full"
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

        {/* Other Services - Full Width Card */}
        <div className="max-w-5xl mx-auto mb-8">
          {otherPlans.map((plan) => (
            <Card
              key={plan.id}
              className="border-border hover:border-primary/30 transition-all duration-300 hover:shadow-md"
            >
              <CardContent className="py-8 px-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                    <p className="text-base text-muted-foreground leading-relaxed mb-4">
                      {plan.description}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-primary">{plan.price}</span>
                    </div>
                  </div>
                  <Button
                    className="md:w-auto"
                    onClick={() => handleQuoteRequest(plan.id)}
                  >
                    문의하기
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            문의 및 예약 환영 · 전화{" "}
            <a href="tel:010-8180-6895" className="text-primary font-medium hover:underline">
              010-8180-6895
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
