import { motion } from "framer-motion";
import { ClipboardList, Truck, Sparkles } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "견적 상담",
    description:
      "이천 계단청소가 필요한 건물 규모와 현재 상태를 확인한 뒤, 현장에 맞는 청소 범위와 요금을 안내드립니다. 사진이나 영상으로도 간편 상담이 가능합니다.",
  },
  {
    icon: Truck,
    step: "02",
    title: "정기청소 시작",
    description:
      "계약 일정에 맞춰 부부가 직접 방문해 계단, 복도, 현관 등 공용공간을 꾸준히 관리합니다. 외주 없이 약속한 품질을 지키는 것을 중요하게 생각합니다.",
  },
  {
    icon: Sparkles,
    step: "03",
    title: "피드백 관리",
    description:
      "카카오톡으로 빠른 피드백이 가능합니. 이천 원룸, 빌라, 상가 건물의 첫인상이 깔끔하게 유지되도록 꼼꼼히 관리합니다.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-secondary/30">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            이천계단청소, 이렇게 진행됩니다
          </h2>
          <p className="text-muted-foreground text-lg">
            간단한 3단계로 이천계단청소 서비스를 시작하세요
          </p>
        </div>

        {/* Steps Grid */}
        <motion.div
  className="grid md:grid-cols-3 gap-8 md:gap-12"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2 } } }}
>
          </motion.div>
          
          {steps.map((item, index) => (
            <motion.div
  key={index}
  className="relative group"
  variants={{
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }}
>
           </motion.div>
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
