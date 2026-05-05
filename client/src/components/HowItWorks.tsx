import { ClipboardList, Zap, MessageCircle, Leaf } from "lucide-react";

const features = [
  {
    icon: ClipboardList,
    title: "무료 방문 견적",
    description:
      "건물 규모와 상태를 직접 확인하여 맞춤 견적을 제공합니다.",
    image: "/manus-storage/stair-clean3_7d8b7d17.jpg",
  },
  {
    icon: Zap,
    title: "빠른 피드백",
    description:
      "청소 완료 후 카카오톡 채널을 통해 결과를 빠르게 보고받을 수 있습니다.",
    image: "/manus-storage/bathroom-clean_94fbf76e.jpg",
  },
  {
    icon: Leaf,
    title: "친환경 세정제",
    description:
      "해외 수입 친환경 세정제로 안전하고 프리미엄급 청소를 진행합니다.",
    image: "/manus-storage/eco-truck_c63bcfce.jpg",
  },
  {
    icon: MessageCircle,
    title: "카카오톡 상담",
    description:
      "언제든지 카카오톡 채널에서 상담받을 수 있습니다.",
    image: "/manus-storage/glass-clean_454b0f7d.jpg",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-white">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            서비스 특징
          </h2>
          <p className="text-muted-foreground text-lg">
            이천계단지기의 차별화된 서비스를 경험하세요
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((item, index) => (
            <div key={index} className="group">
              <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-border hover:shadow-lg hover:border-primary/30 transition-all duration-300">
                {/* Feature Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
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
