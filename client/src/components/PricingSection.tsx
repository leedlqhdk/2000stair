import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface PricingSectionProps {
  isAuthenticated: boolean;
}

export default function PricingSection({
  isAuthenticated,
}: PricingSectionProps) {
  const { data: plans } = trpc.quote.plans.useQuery();

  const handleQuoteRequest = () => {
    window.open("https://pf.kakao.com/_IiNfn/chat", "_blank");
  };

  const displayPlans = plans || [
    {
      id: "stair_2_3",
      name: "2~3층 계단 정기관리",
      price: "66,000원~",
      description:
        "소형 빌라·상가 공용계단 관리에 적합합니다. 계단, 복도, 공동현관 상태에 따라 범위를 조정합니다.",
      popular: false,
    },
    {
      id: "stair_4",
      name: "4층 계단 정기관리",
      price: "77,000원~",
      description:
        "이천 지역 빌라에서 가장 많이 문의되는 기본 관리형입니다. 하청 없이 부부가 직접 방문합니다.",
      popular: true,
    },
    {
      id: "stair_5_6",
      name: "5~6층 계단 정기관리",
      price: "88,000원~",
      description:
        "층수가 높거나 오염이 반복되는 건물에 맞춘 관리입니다. 정기 방문으로 깔끔한 상태를 유지합니다.",
      popular: false,
    },
    {
      id: "bathroom",
      name: "화장실 · 상가유리 · 사무실 청소",
      price: "별도 문의",
      description:
        "공용화장실, 공동현관 유리, 사무실 청소는 현장 상태와 면적에 따라 별도 안내드립니다.",
      popular: false,
    },
  ];

  const stairPlans = displayPlans.filter(p => p.id.startsWith("stair"));
  const otherPlans = displayPlans.filter(p => !p.id.startsWith("stair"));

  return (
    <section
      id="pricing"
      className="py-16 md:py-28 bg-gradient-to-b from-white to-blue-50/40"
    >
      <div className="container">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-sm font-bold tracking-[0.3em] text-primary mb-4">
            PRICING
          </p>

          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-5 leading-tight">
            건물 상태에 맞춘
            <br />
            정기관리 플랜
          </h2>

          <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto">
            빌라·상가의 층수와 오염 상태에 맞춰 정기관리 기준으로 안내드립니다.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.18 } },
          }}
        >
          {stairPlans.map(plan => (
            <motion.div
              key={plan.id}
              variants={{
                hidden: { opacity: 0, y: 28 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
              }}
            >
              <Card
                className={`relative overflow-hidden rounded-[2rem] border bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${
                  plan.popular
                    ? "border-primary shadow-lg ring-2 ring-primary/15"
                    : "border-blue-100 shadow-sm"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-5 right-5 rounded-full bg-primary text-white text-xs font-semibold px-3 py-1 shadow-sm">
                    가장 많이 선택
                  </div>
                )}

                <CardContent className="p-6 md:p-9 flex flex-col h-full">
                  <h3 className="text-lg md:text-xl font-extrabold text-foreground mb-4 pr-20">
                    {plan.name}
                  </h3>

                  <div className="mb-6">
                    <span className="text-2xl md:text-3xl font-extrabold text-primary">
                      {plan.price}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">
                      / 월
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 md:mb-8 flex-1">
                    {plan.description}
                  </p>

                  <Button
                    className="w-full rounded-xl"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={handleQuoteRequest}
                  >
                    카톡으로 요금 문의
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {otherPlans.length > 0 && (
          <motion.div
            className="max-w-6xl mx-auto mt-8"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <Card className="rounded-[2rem] border-blue-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-7 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <p className="text-xs font-bold tracking-[0.25em] text-primary mb-2">
                      EXTRA SERVICE
                    </p>
                    <h3 className="text-xl font-extrabold text-foreground">
                      {otherPlans[0].name}
                    </h3>
                  </div>

                  <span className="text-lg font-extrabold text-primary">
                    {otherPlans[0].price}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {otherPlans[0].description}
                </p>

                <Button
                  className="w-full md:w-auto rounded-xl"
                  variant="outline"
                  onClick={handleQuoteRequest}
                >
                  카톡으로 별도 문의
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            정확한 견적은 건물 사진 또는 현장 확인 후 안내드립니다 · 전화{" "}
            <a
              href="tel:010-8438-1887"
              className="text-primary font-semibold hover:underline"
            >
              010-8438-1887
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
