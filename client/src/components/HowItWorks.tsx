import { motion } from "framer-motion";
import { Camera, ClipboardCheck, FileText, MapPin, RotateCw } from "lucide-react";

const steps = [
  { icon: MapPin, title: "방문 확인" },
  { icon: Camera, title: "상태 기록" },
  { icon: ClipboardCheck, title: "초도관리" },
  { icon: RotateCw, title: "정기관리" },
  { icon: FileText, title: "작업 기록" },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-20 md:py-28">
      <div className="container max-w-6xl">
        <motion.div className="mx-auto mb-12 max-w-2xl text-center" initial={{ opacity: 0, y: 34 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <p className="mb-2 text-xs font-bold tracking-[0.25em] text-primary md:mb-4 md:text-sm">PROCESS</p>
          <h2 className="text-3xl font-extrabold leading-[1.14] text-foreground md:text-5xl">
            이천 건물 정기관리,
            <br />
            이렇게 진행합니다
          </h2>
          <p className="mx-auto mt-5 max-w-2xl break-keep text-lg font-semibold leading-relaxed text-muted-foreground">
            방문 확인부터 작업 기록까지, 계단·공동현관·창틀 상태를 이어서 관리합니다.
          </p>
        </motion.div>

        <motion.div
          className="rounded-[2rem] border border-blue-100 bg-blue-50/45 p-5 shadow-[0_12px_36px_rgba(15,76,169,0.08)] md:p-8"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <div className="grid grid-cols-5 items-stretch gap-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                className="relative flex min-h-[150px] flex-col items-center justify-center rounded-2xl border border-blue-100 bg-white px-4 py-6 text-center shadow-sm"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
              >
                <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-primary">
                  <step.icon className="h-6 w-6" />
                </span>
                <span className="text-sm font-extrabold text-primary">0{index + 1}</span>
                <h3 className="mt-1 break-keep text-xl font-extrabold text-foreground">{step.title}</h3>
                {index < steps.length - 1 && (
                  <span className="absolute -right-3 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-xs font-extrabold text-white shadow">
                    →
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
