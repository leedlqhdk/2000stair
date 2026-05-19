import { motion } from "framer-motion";
import { Camera, MessageCircle, ShieldCheck } from "lucide-react";

const standards = [
  {
    label: "DIRECT",
    title: "하청 없는 직접 방문",
    text: "담당자가 바뀌지 않아 건물 상태와 반복되는 오염 구간을 꾸준히 기억합니다.",
    icon: ShieldCheck,
  },
  {
    label: "RECORD",
    title: "현장 상태 기록",
    text: "필요한 부분은 사진으로 남겨 관리 흐름을 확인할 수 있게 돕습니다.",
    icon: Camera,
  },
  {
    label: "CARE",
    title: "카톡 빠른 소통",
    text: "요청사항과 피드백은 카카오톡으로 빠르게 확인하고 반영합니다.",
    icon: MessageCircle,
  },
];

export default function OwnerStory() {
  return (
    <section className="py-16 md:py-32 bg-gradient-to-b from-white to-blue-50/40">
      <div className="container max-w-6xl">
        <motion.div
          className="grid lg:grid-cols-[0.95fr_1.05fr] gap-10 lg:gap-16 items-start"
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Left: Brand story */}
          <div>
            <p className="text-sm font-bold tracking-[0.35em] text-primary mb-6">
              ABOUT US
            </p>

            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight text-foreground mb-8">
              같은 사람이
              <br />
              꾸준히 보는 관리
            </h2>

            <div className="space-y-5 text-muted-foreground text-base md:text-lg leading-relaxed max-w-xl">
              <p>
                이천계단지기는 부부가 직접 방문해 빌라, 원룸, 상가의 공용공간을 관리합니다.
              </p>

              <p>
                건물마다 자주 더러워지는 곳은 다릅니다. 계단 바닥, 공동현관 유리,
                난간 손때처럼 반복되는 오염을 기억하고 관리하는 것이 중요합니다.
              </p>

              <p>
                그래서 저희는 한 번의 청소보다, 같은 사람이 꾸준히 보고 관리하는 방식을
                더 중요하게 생각합니다.
              </p>
            </div>
          </div>

          {/* Right: Standards */}
          <div className="rounded-[2rem] bg-white border border-blue-100 shadow-sm p-6 md:p-8">
            <p className="text-sm font-bold tracking-[0.3em] text-primary mb-5">
              PROFESSIONALISM
            </p>

            <div className="space-y-4">
              {standards.map((item) => (
                <div
                  key={item.title}
                  className="group rounded-3xl border border-border bg-secondary/30 p-5 md:p-6 hover:bg-white hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                      <item.icon className="w-5 h-5" />
                    </div>

                    <div>
                      <p className="text-xs font-bold tracking-[0.25em] text-primary mb-2">
                        {item.label}
                      </p>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-7 rounded-3xl bg-primary/5 border border-primary/10 p-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                건물 사진을 카카오톡으로 보내주시면, 현재 상태에 맞는 관리 범위부터 안내드립니다.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
