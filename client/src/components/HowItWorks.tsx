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
    <section id="how-it-works" className="py-24 md:py-32 bg-white">
      <div className="container max-w-6xl">
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-sm font-bold tracking-[0.35em] text-primary mb-5">
            PROCESS
          </p>

          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-16 items-end">
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-foreground">
              상담부터 관리까지
              <br />
              간단하게 진행합니다
            </h2>

            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
              복잡한 신청서 없이 카카오톡으로 문의하고, 건물 상태에 맞는 관리 범위를 안내드립니다.
            </p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="rounded-[2rem] border border-blue-100 bg-gradient-to-br from-white to-blue-50/30 p-7 md:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-8">
                <p className="text-5xl font-extrabold text-primary/15">
                  {step.number}
                </p>

                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <step.icon className="w-6 h-6" />
                </div>
              </div>

              <h3 className="text-2xl font-extrabold text-foreground mb-3">
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
