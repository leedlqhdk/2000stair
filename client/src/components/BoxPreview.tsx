import { Building2, Camera, MessageCircle, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const managementSystem = [
  {
    number: "01",
    label: "SITE CHECK",
    icon: Building2,
    title: "건물 상태 먼저 확인",
    description:
      "계단 수, 공동현관, 유리, 화장실 등 건물마다 다른 오염 구간을 먼저 보고 관리 범위를 정합니다.",
  },
  {
    number: "02",
    label: "DIRECT CARE",
    icon: ShieldCheck,
    title: "하청 없는 직접 관리",
    description:
      "외부 인력에게 맡기지 않고 부부가 직접 방문합니다. 담당자가 바뀌지 않아 관리 기준이 흔들리지 않습니다.",
  },
  {
    number: "03",
    label: "PHOTO RECORD",
    icon: Camera,
    title: "필요한 부분은 사진 기록",
    description:
      "작업 전후나 확인이 필요한 부분은 사진으로 남겨 건물주님이 상태를 쉽게 파악할 수 있게 돕습니다.",
  },
  {
    number: "04",
    label: "FAST FEEDBACK",
    icon: MessageCircle,
    title: "카톡으로 빠른 피드백",
    description:
      "요청사항, 일정 조율, 추가 관리가 필요한 부분은 카카오톡으로 빠르게 소통합니다.",
  },
];

export default function BoxPreview() {
  return (
    <section id="box-preview" className="py-16 md:py-32 bg-white">
      <div className="container max-w-6xl">
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-sm font-bold tracking-[0.35em] text-primary mb-5">
            MANAGEMENT SYSTEM
          </p>

          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-16 items-end">
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-foreground">
              이천계단지기는
              <br />
              이렇게 관리합니다
            </h2>

            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
              단순히 한 번 닦고 끝나는 청소가 아니라, 건물의 반복되는 오염을 기억하고
              꾸준히 관리하는 방식을 지향합니다.
            </p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {managementSystem.map((item, index) => (
            <motion.div
              key={item.number}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="group rounded-[2rem] border border-blue-100 bg-gradient-to-br from-white to-blue-50/30 p-6 md:p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4 mb-8">
                <div>
                  <p className="text-xs font-bold tracking-[0.25em] text-primary mb-2">
                    {item.label}
                  </p>
                  <p className="text-5xl font-extrabold text-primary/15">
                    {item.number}
                  </p>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <item.icon className="w-6 h-6" />
                </div>
              </div>

              <h3 className="text-2xl font-extrabold text-foreground mb-3">
                {item.title}
              </h3>

              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
