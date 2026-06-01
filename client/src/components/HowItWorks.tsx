import { motion } from "framer-motion";
import { Camera, ChevronDown, Home, MessageCircle, Sparkles } from "lucide-react";

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
    <section id="how-it-works" className="bg-white py-16 md:py-24">
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
            이렇게 진행됩니다
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
          <div className="space-y-2.5 md:space-y-3">
            {steps.map((step, index) => (
              <div key={step.number}>
                <motion.div
                  className="flex min-h-[6.25rem] items-center rounded-[1.75rem] border border-slate-800/70 bg-[radial-gradient(circle_at_top,_rgba(41,93,167,0.2),_transparent_42%),linear-gradient(180deg,_rgba(12,19,31,0.98),_rgba(9,14,24,0.96))] p-4 shadow-[0_22px_60px_rgba(8,12,20,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-700/80 hover:shadow-[0_26px_70px_rgba(8,12,20,0.24)] sm:min-h-[6.5rem] sm:p-5"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                >
                  <div className="flex w-full items-center gap-3 sm:gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/[0.05] text-white ring-1 ring-white/10 sm:h-12 sm:w-12">
                      <step.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>

                    <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
                      <span className="mt-0.5 text-xs font-extrabold tracking-[0.18em] text-sky-200/90 sm:text-sm">
                        {step.number}
                      </span>

                      <div className="min-w-0">
                        <h3 className="mb-1 text-base font-extrabold text-white sm:text-lg">
                          {step.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-white/68 sm:text-base">
                          {step.text}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {index < steps.length - 1 && (
                  <div className="flex justify-center py-1 text-primary/45">
                    <ChevronDown className="h-4 w-4 stroke-[2.5]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
