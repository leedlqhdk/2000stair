import { MapPin, Building2, Home, Store } from "lucide-react";
import { motion } from "framer-motion";

const areas = [
  "신둔면",
  "마장면",
  "부발읍",
  "증포동",
  "중리동",
  "관고동",
  "대월면",
];

const buildingTypes = [
  {
    icon: Home,
    label: "HOUSE",
    title: "빌라 · 원룸",
    text: "계단, 복도, 공동현관 등 입주민이 매일 오가는 공용공간을 정기관리합니다.",
  },
  {
    icon: Store,
    label: "STORE",
    title: "상가 · 사무실",
    text: "방문객이 마주하는 입구, 유리, 화장실까지 첫인상이 무너지지 않게 관리합니다.",
  },
  {
    icon: Building2,
    label: "BUILDING",
    title: "소형 건물",
    text: "건물 규모와 오염 패턴에 맞춰 필요한 청소 범위부터 현실적으로 안내드립니다.",
  },
];

export default function AreaCoverage() {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-white to-blue-50/40">
      <div className="container max-w-6xl">
        <motion.div
          className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-start"
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <p className="text-sm font-bold tracking-[0.35em] text-primary mb-5">
              SERVICE AREA
            </p>

            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-foreground mb-6">
              이천 곳곳의
              <br />
              건물을 관리합니다
            </h2>

            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mb-8">
              이천계단지기는 신둔면, 마장면, 부발읍, 대월면 등 이천 생활권의
              빌라·원룸·상가 공용공간을 직접 관리합니다.
            </p>

            <div className="flex flex-wrap gap-2">
              {areas.map((area) => (
                <span
                  key={area}
                  className="px-4 py-2 rounded-full bg-white text-sm font-semibold text-foreground border border-blue-100 shadow-sm"
                >
                  <MapPin className="inline-block w-3.5 h-3.5 mr-1 text-primary" />
                  {area}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {buildingTypes.map((item) => (
              <div
                key={item.title}
                className="group rounded-[2rem] border border-blue-100 bg-white p-6 md:p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start gap-5">
                  <div className="w-13 h-13 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    <item.icon className="w-6 h-6" />
                  </div>

                  <div>
                    <p className="text-xs font-bold tracking-[0.25em] text-primary mb-2">
                      {item.label}
                    </p>

                    <h3 className="text-xl font-extrabold text-foreground mb-2">
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
        </motion.div>
      </div>
    </section>
  );
}
