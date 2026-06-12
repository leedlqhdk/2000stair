import { motion } from "framer-motion";
import { Camera, MessageCircle, ShieldCheck } from "lucide-react";

const standards = [
  {
    label: "DIRECT",
    title: "직접 방문",
    text: "하청 없이 부부가 직접 방문해 건물 상태를 꾸준히 확인합니다.",
    icon: ShieldCheck,
  },
  {
    label: "RECORD",
    title: "현장 기록",
    text: "필요한 부분은 사진으로 남겨 관리 흐름을 확인할 수 있게 돕습니다.",
    icon: Camera,
  },
  {
    label: "CARE",
    title: "빠른 소통",
    text: "요청사항과 피드백은 카카오톡으로 빠르게 확인합니다.",
    icon: MessageCircle,
  },
];

export default function OwnerStory() {
  return (
    <section className="py-16 md:py-32 bg-gradient-to-b from-white to-blue-50/40">
      <div className="container max-w-6xl">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-10 md:mb-14"
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs md:text-sm font-bold tracking-[0.25em] text-primary mb-4">
            ABOUT US
          </p>

          <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.12] text-foreground mb-4">
            같은 사람이 꾸준히 보는 관리
          </h2>

          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            이천계단지기는 부부가 직접 방문해 빌라, 원룸, 상가의 공용공간을 관리합니다.
          </p>
        </motion.div>

        <motion.div
          className="grid lg:grid-cols-[0.9fr_1.1fr] gap-5 md:gap-8 items-stretch"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <div className="rounded-[1.75rem] md:rounded-[2rem] bg-white border border-blue-100 shadow-sm p-6 md:p-8">
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
              건물마다 자주 더러워지는 곳은 다릅니다. 계단 바닥, 공동현관 유리,
              난간 손때처럼 반복되는 오염을 기억하고 관리하는 것이 중요합니다.
            </p>

            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              그래서 저희는 한 번의 청소보다, 같은 사람이 꾸준히 보고 관리하는 방식을
              더 중요하게 생각합니다.
            </p>
          </div>

          <div className="rounded-[1.75rem] md:rounded-[2rem] bg-white border border-blue-100 shadow-sm p-5 md:p-7">
            <p className="text-xs md:text-sm font-bold tracking-[0.3em] text-primary mb-5">
              PROFESSIONALISM
            </p>

            <div className="grid gap-3">
              {standards.map((item) => (
                <div
                  key={item.title}
                  className="group rounded-2xl border border-blue-100 bg-blue-50/30 p-4 md:p-5 hover:bg-white hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                      <item.icon className="w-5 h-5" />
                    </div>

                    <div>
                      <p className="text-[11px] md:text-xs font-bold tracking-[0.22em] text-primary mb-1.5">
                        {item.label}
                      </p>

                      <h3 className="text-lg md:text-xl font-extrabold text-foreground mb-1.5">
                        {item.title}
                      </h3>

                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl bg-primary/5 border border-primary/10 p-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                건물 사진을 카카오톡으로 보내주시면 현재 상태에 맞는 관리 범위부터 안내드립니다.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
