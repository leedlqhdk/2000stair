import { ShoppingCart, Truck, Sparkles } from "lucide-react";

const steps = [
  {
    icon: ShoppingCart,
    step: "01",
    title: "주문",
    description:
      "나에게 맞는 구독 플랜을 선택하고 간편하게 주문하세요. Basic, Standard, Premium 중 원하는 구성을 골라보세요.",
  },
  {
    icon: Truck,
    step: "02",
    title: "배송",
    description:
      "매달 정해진 날짜에 엄선된 청소 용품이 담긴 박스가 문 앞에 도착합니다. 무료 배송!",
  },
  {
    icon: Sparkles,
    step: "03",
    title: "청소",
    description:
      "프리미엄 친환경 제품으로 집안 구석구석을 깨끗하게 청소하세요. 매달 새로운 제품을 만나보세요.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-secondary/30">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            어떻게 작동하나요?
          </h2>
          <p className="text-muted-foreground text-lg">
            간단한 3단계로 깨끗한 집을 유지하세요
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((item, index) => (
            <div key={index} className="relative group">
              {/* Connector line (desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-primary/10" />
              )}

              <div className="bg-white rounded-2xl p-8 shadow-sm border border-border hover:shadow-md hover:border-primary/20 transition-all duration-300 relative">
                {/* Step number */}
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                  {item.step}
                </div>

                {/* Icon */}
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
