import { MapPin, Building2, Home, Store } from "lucide-react";

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
    title: "빌라 · 원룸",
    text: "계단, 복도, 공동현관 등 공용공간 정기관리",
  },
  {
    icon: Store,
    title: "상가 · 사무실",
    text: "방문객이 오가는 입구, 유리, 화장실 관리",
  },
  {
    icon: Building2,
    title: "소형 건물",
    text: "건물 상태에 맞춘 맞춤형 청소 범위 안내",
  },
];

export default function AreaCoverage() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container max-w-6xl">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            <MapPin className="w-4 h-4" />
            작업 가능 지역
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            이천 전 지역 계단청소 관리
          </h2>

          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            이천계단지기는 이천시를 중심으로 빌라, 원룸, 상가 공용공간을 직접 관리합니다.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {areas.map((area) => (
            <span
              key={area}
              className="px-4 py-2 rounded-full bg-secondary text-sm font-medium text-foreground border border-border"
            >
              {area}
            </span>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {buildingTypes.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border bg-secondary/30 p-6 hover:shadow-md transition-all"
            >
              <item.icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
