import { motion } from "framer-motion";
import { Camera, ChevronDown, ClipboardCheck, Home, MessageCircle, Sparkles } from "lucide-react";

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
    text: "현장 상황과 오염 상태를 확인해 관리 범위와 주기를 안내드립니다.",
  },
  {
    number: "03",
    icon: ClipboardCheck,
    title: "관리 계획 안내",
    text: "방문 견적 후 관리 범위와 주기를 정리한 견적서를 제공해드립니다. 고객님 편의에 따라 대면 또는 비대면 계약이 가능합니다.",
  },
  {
    number: "04",
    icon: Sparkles,
    title: "정기 관리 시작",
    text: "약속한 일정에 맞춰 부부가 직접 방문해 꾸준히 관리합니다.",
  },
  {
    number: "05",
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
          <p className="mb-4 text-xs font-bold tracking-[0.25em] text-primary md:text-sm">
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
                  className="flex min-h-[6.25rem] items-center rounded-2xl border border-blue-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md sm:min-h-[6.5rem] sm:p-5"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                >
                  <div className="flex w-full items-center gap-3 sm:gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-primary ring-1 ring-blue-100 sm:h-12 sm:w-12">
                      <step.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>

                    <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
                      <span className="mt-0.5 text-xs font-extrabold text-primary sm:text-sm">
                        {step.number}
                      </span>

                      <div className="min-w-0">
                        <h3 className="mb-1 text-base font-extrabold text-foreground sm:text-lg">
                          {step.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
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
