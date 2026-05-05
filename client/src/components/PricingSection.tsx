import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Check } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

interface PricingSectionProps {
  isAuthenticated: boolean;
}

export default function PricingSection({ isAuthenticated }: PricingSectionProps) {
  const [isYearly, setIsYearly] = useState(false);
  const { data: plans } = trpc.subscription.plans.useQuery();
  const createCheckout = trpc.subscription.createCheckout.useMutation();

  const handleSubscribe = async (planId: string) => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    try {
      const result = await createCheckout.mutateAsync({
        planId,
        interval: isYearly ? "yearly" : "monthly",
      });

      if (result.url) {
        toast.info("결제 페이지로 이동합니다...");
        window.open(result.url, "_blank");
      }
    } catch (error: any) {
      toast.error(error.message || "오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  const displayPlans = plans || [
    {
      id: "basic",
      name: "Basic",
      description: "청소 입문자를 위한 기본 구성",
      features: ["다목적 세정제 1종", "극세사 타올 2장", "고무장갑 1켤레", "월간 청소 팁 가이드"],
      monthlyPrice: 19900,
      yearlyPrice: 199000,
      popular: false,
    },
    {
      id: "standard",
      name: "Standard",
      description: "깨끗한 집을 위한 인기 구성",
      features: ["다목적 세정제 2종", "극세사 타올 4장", "고무장갑 1켤레", "스펀지 & 수세미 세트", "방향제 1종", "프리미엄 청소 가이드"],
      monthlyPrice: 29900,
      yearlyPrice: 299000,
      popular: true,
    },
    {
      id: "premium",
      name: "Premium",
      description: "완벽한 청소를 위한 올인원 구성",
      features: ["프리미엄 세정제 3종", "극세사 타올 6장", "고무장갑 2켤레", "스펀지 & 수세미 프리미엄 세트", "프리미엄 방향제 2종", "전문가 청소 도구 1종", "1:1 청소 컨설팅", "우선 배송"],
      monthlyPrice: 49900,
      yearlyPrice: 499000,
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
          <p className="text-muted-foreground text-lg mb-8">
            모든 플랜에 무료 배송이 포함되어 있으며, 언제든 해지할 수 있습니다.
          </p>

          {/* Monthly/Yearly Toggle */}
          <div className="flex items-center justify-center gap-3">
            <span
              className={`text-sm font-medium ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}
            >
              월간
            </span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span
              className={`text-sm font-medium ${isYearly ? "text-foreground" : "text-muted-foreground"}`}
            >
              연간
            </span>
            {isYearly && (
              <span className="ml-2 text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                최대 17% 할인
              </span>
            )}
          </div>
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
                  <span className="text-4xl font-bold text-foreground">
                    {formatPrice(
                      isYearly
                        ? Math.round(plan.yearlyPrice / 12)
                        : plan.monthlyPrice
                    )}
                  </span>
                  <span className="text-muted-foreground text-sm ml-1">
                    원/월
                  </span>
                  {isYearly && (
                    <div className="text-xs text-muted-foreground mt-1">
                      연 {formatPrice(plan.yearlyPrice)}원 결제
                    </div>
                  )}
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
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={createCheckout.isPending}
                >
                  {createCheckout.isPending ? "처리 중..." : "구독하기"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
