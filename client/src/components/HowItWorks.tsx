import { ClipboardList, Truck, Sparkles } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "견적 신청",
    description:
      "무료 방문 견적을 신청하세요. 건물 규모와 상태를 확인 후 맞춤 견적을 제공합니다. 대면 또는 비대면(사진/영상) 상담이 가능합니다.",
    image: "/manus-storage/stair-clean3_7d8b7d17.jpg",
  },
  {
    icon: Truck,
    step: "02",
    title: "서비스 시작",
    description:
      "대면&비대면 정기청소 계약 후 1인대표가 직접 밀착 관리합니다. 약속된 일정에 맞춰 정기적으로 방문하여 청소를 진행합니다.",
    image: "/manus-storage/bathroom-clean_94fbf76e.jpg",
  },
  {
    icon: Sparkles,
    step: "03",
    title: "깨끗한 관리",
    description:
      "계단, 복도, 현관을 친환경 해외수입 세정제로 프리미엄급 청소합니다. 초벌 청소 완료 후 사진 보고로 결과를 확인하세요.",
    image: "/manus-storage/eco-truck_c63bcfce.jpg",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-secondary/30">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            이렇게 진행됩니다
          </h2>
          <p className="text-muted-foreground text-lg">
            간단한 3단계로 깨끗한 건물 관리를 시작하세요
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((item, index) => (
            <div key={index} className="relative group">
              {/* Connector line (desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-24 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-primary/10" />
              )}

              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-md hover:border-primary/20 transition-all duration-300 relative flex flex-col h-full">
                {/* Step Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Step number */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                    {item.step}
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
