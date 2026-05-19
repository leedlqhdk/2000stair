import { motion } from "framer-motion";
import { MessageCircle, MapPinned, Sparkles } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MessageCircle,
    title: "카톡 문의",
    text: "건물 사진이나 주소를 보내주시면 상담을 시작합니다.",
  },
  {
    number: "02",
    icon: MapPinned,
    title: "현장 확인",
    text: "층수, 오염 상태, 관리 범위를 확인해 안내드립니다.",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "정기관리",
    text: "하청 없이 부부가 직접 방문해 꾸준히 관리합니다.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-32 bg-white">
      <div className="container max-w-6xl">
        <motion.div
          className="mb-10 md:mb-14 max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs md:text-sm font-bold tracking-[0.35em] text-primary mb-4">
            PROCESS
          </p>

          <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.12] text-foreground mb-4">
            상담부터 관리까지
            <br />
            간단하게 진행합니다
          </h2>

          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            복잡한 신청서 없이 카카오톡으로 문의하고,
            건물 상태에 맞는 관리 범위를 안내드립니다.
          </p>
        </motion.div>

        <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-5 overflow-x-auto pb-3 snap-x snap-mandatory">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="min-w-[82%] sm:min-w-[48%] md:min-w-0 snap-start rounded-[1.5rem] md:rounded-[2rem] border border-blue-100 bg-gradient-to-br from-white to-blue-50/30 p-5 md:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-8">
                <p className="text-4xl md:text-5xl font-extrabold text-primary/15">
                  {step.number}
                </p>

                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <step.icon className="w-6 h-6" />
                </div>
              </div>

              <h3 className="text-xl md:text-2xl font-extrabold text-foreground mb-2 md:mb-3">
                {step.title}
              </h3>

              <p className="text-muted-foreground leading-relaxed">
                {step.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
