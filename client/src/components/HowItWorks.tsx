import { motion } from "framer-motion";
import { ClipboardList, Truck, Sparkles } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "건물 상태 확인",
    description:
      "계단 수, 공용현관, 유리, 화장실 상태를 먼저 확인합니다. 사진 상담도 가능하지만, 정기청소는 현장 상태를 보고 정확히 안내드립니다.",
  },
  {
    icon: Truck,
    step: "02",
    title: "부부직영 정기관리",
    description:
      "하청 없이 부부가 직접 방문합니다. 담당자가 자주 바뀌지 않아 건물 특성과 오염 패턴을 기억하고 꾸준히 관리할 수 있습니다.",
  },
  {
    icon: Sparkles,
    step: "03",
    title: "사진 보고 · 피드백",
    description:
      "작업 후 필요한 부분은 사진과 메시지로 공유합니다. 건물주님이 직접 매번 확인하지 않아도 상태를 파악할 수 있게 돕습니다.",
  },
];
export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-secondary/30">
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            정기청소는 이렇게 관리됩니다
          </h2>
          <p className="text-muted-foreground text-lg">
            상담부터 정기관리, 피드백까지 외주 없이 직접 챙깁니다
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 md:gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.3 } },
          }}
        >
          {steps.map((item, index) => (
            <motion.div
              key={index}
              className="relative group"
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 1 } },
              }}
            >
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
