import { motion } from "framer-motion";
import { Camera, Home, MessageCircle, Sparkles } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MessageCircle,
    title: "문의하기",
    text: "카카오톡으로 건물 사진과 주소를 보내주시면 상담을 시작합니다.",
  },
  {
    number: "02",
    icon: Home,
    title: "무료 방문 견적",
    text: "현장 상황과 오염 상태를 확인해 관리 범위를 안내드립니다.",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "정기 관리 시작",
    text: "약속한 일정에 맞춰 부부가 직접 방문해 꾸준히 관리합니다.",
  },
  {
    number: "04",
    icon: Camera,
    title: "작업 사진 공유",
    text: "관리 전후 사진으로 진행 내용을 확인하실 수 있습니다.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-white">
      <div className="container max-w-4xl">
        <motion.div
          className="mx-auto mb-10 max-w-2xl text-center md:mb-12"
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-4 text-xs font-bold tracking-[0.35em] text-primary md:text-sm">
            PROCESS
          </p>

          <h2 className="mb-4 text-3xl font-extrabold leading-[1.14] text-foreground md:text-4xl">
            상담부터 관리까지
            <br />
            간단하게 진행합니다
          </h2>

          <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            복잡한 신청서 없이 카카오톡으로 문의하고, 건물 상태에 맞는 관리 범위를 안내드립니다.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto max-w-xl md:max-w-2xl"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <div className="relative space-y-3 md:space-y-4">
            <div className="absolute bottom-10 left-[1.05rem] top-10 hidden w-px bg-blue-100 sm:block" />

            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className="relative grid grid-cols-[2.5rem_1fr] items-stretch gap-3 sm:grid-cols-[3rem_1fr] md:gap-4"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <div className="flex justify-center pt-5">
                  <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-blue-100 bg-white text-[0.68rem] font-extrabold text-primary shadow-sm">
                    {step.number}
                  </span>
                </div>

                <div className="flex min-h-[7.25rem] items-center rounded-2xl border border-blue-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md sm:min-h-[7.5rem] sm:p-5">
                  <div className="flex w-full items-start gap-3 sm:gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-primary ring-1 ring-blue-100 sm:h-12 sm:w-12">
                      <step.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="mb-1.5 text-base font-extrabold text-foreground sm:text-lg">
                        {step.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                        {step.text}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
