import type { SVGProps } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ArrowUpDown, Camera, DoorOpen, Hand } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface PricingSectionProps {
  isAuthenticated: boolean;
}

function StairIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 19h16" />
      <path d="M5 16h4v-4h4V8h4V4h3" />
      <path d="M9 16v3" />
      <path d="M13 12v7" />
      <path d="M17 8v11" />
      <path d="M5 7.5l1.1-2.2L8.3 4.2 6.1 3.1 5 1.8 3.9 3.1 1.7 4.2l2.2 1.1L5 7.5Z" />
    </svg>
  );
}

function SpiderWebIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3v18" />
      <path d="M3 12h18" />
      <path d="M5.6 5.6l12.8 12.8" />
      <path d="M18.4 5.6 5.6 18.4" />
      <path d="M12 6.5c3.1 0 5.5 2.4 5.5 5.5S15.1 17.5 12 17.5 6.5 15.1 6.5 12 8.9 6.5 12 6.5Z" />
      <path d="M12 9.2c1.6 0 2.8 1.2 2.8 2.8s-1.2 2.8-2.8 2.8S9.2 13.6 9.2 12 10.4 9.2 12 9.2Z" />
      <path d="M20.5 4.5c-.4 1.4-1.2 2.1-2.5 2.5 1.3.4 2.1 1.2 2.5 2.5.4-1.3 1.2-2.1 2.5-2.5-1.3-.4-2.1-1.1-2.5-2.5Z" />
    </svg>
  );
}

const includedServices = [
  { label: "계단 바닥", icon: StairIcon },
  { label: "난간·손잡이", icon: Hand },
  { label: "공동현관 유리", icon: DoorOpen },
  { label: "거미줄 제거", icon: SpiderWebIcon },
  { label: "엘리베이터", icon: ArrowUpDown },
  { label: "전후 사진 기록", icon: Camera },
];

const planFeatures: Record<string, string[]> = {
  stair_2_3: [
    "추천 주기: 월 4회 · 주 1회",
    "2층 60,000원 · 3층 70,000원",
    "층별 정찰제로 미리 비용 확인",
  ],
  stair_4: [
    "추천 주기: 월 4회 · 주 1회",
    "4층 80,000원",
    "층별 정찰제로 미리 비용 확인",
  ],
  stair_5_6: [
    "추천 주기: 월 4회 · 주 1회",
    "5층 90,000원 · 6층 100,000원",
    "층별 정찰제로 미리 비용 확인",
  ],
  stair_7_8: [
    "추천 주기: 월 4회 · 주 1회",
    "7층 110,000원 · 8층 120,000원",
    "최대 8층까지 작업",
  ],
};

export default function PricingSection({ isAuthenticated: _isAuthenticated }: PricingSectionProps) {
  const { data: plans } = trpc.quote.plans.useQuery();

  const handleQuoteRequest = () => {
    window.open("https://pf.kakao.com/_IiNfn/chat", "_blank");
  };

  const displayPlans = plans || [
    {
      id: "stair_2_3",
      name: "2~3층 계단 정기관리",
      price: "60,000원~",
      description: "월 4회(주 1회) 기준으로 2층 60,000원, 3층 70,000원입니다.",
      popular: false,
    },
    {
      id: "stair_4",
      name: "4층 계단 정기관리",
      price: "80,000원",
      description: "월 4회(주 1회) 기준 4층 정찰가는 80,000원입니다.",
      popular: false,
    },
    {
      id: "stair_5_6",
      name: "5~6층 계단 정기관리",
      price: "90,000원~",
      description: "월 4회(주 1회) 기준으로 5층 90,000원, 6층 100,000원입니다.",
      popular: false,
    },
    {
      id: "stair_7_8",
      name: "7~8층 계단 정기관리",
      price: "110,000원~",
      description: "월 4회(주 1회) 기준으로 7층 110,000원, 8층 120,000원입니다.",
      popular: false,
    },
    {
      id: "bathroom",
      name: "화장실 · 상가 유리창 · 사무실 청소",
      price: "별도 문의",
      description:
        "공용화장실, 사무실 청소는 현장 상태와 면적에 따라 별도 안내드립니다.",
      popular: false,
    },
  ];

  const stairPlans = displayPlans.filter((p) => p.id.startsWith("stair"));
  const otherPlans = displayPlans.filter((p) => !p.id.startsWith("stair"));

  return (
    <section id="pricing" className="bg-gradient-to-b from-white to-blue-50/45 py-16 md:py-28">
      <div className="container">
        <motion.div
          className="mx-auto mb-8 max-w-3xl text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-4 inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-bold text-white">
            <span className="mr-2">✓</span>
            추천 관리 주기 · 월 4회(주 1회)
          </div>

          <h2 className="text-4xl font-extrabold leading-tight text-foreground md:text-5xl">
            계단청소는 <span className="text-primary">층별 정찰제</span>로 안내합니다
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            2층 60,000원부터 시작해 한 층 올라갈 때마다 10,000원씩 올라가며,
            최대 8층까지 작업합니다.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto mb-8 grid max-w-md grid-cols-6 gap-2 md:max-w-6xl md:grid-cols-3 md:gap-5 xl:grid-cols-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {includedServices.map((service) => (
            <div
              key={service.label}
              className="flex min-h-12 items-center justify-center rounded-2xl px-1 py-2 md:min-h-[96px] md:flex-col md:gap-3 md:px-2 md:text-center"
              aria-label={service.label}
              title={service.label}
            >
              <service.icon className="h-7 w-7 shrink-0 text-primary md:h-9 md:w-9" strokeWidth={1.8} />
              <p className="hidden text-sm font-extrabold text-foreground md:block">{service.label}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
        >
          {stairPlans.map((plan) => (
            <motion.div
              key={plan.id}
              variants={{
                hidden: { opacity: 0, y: 28 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
              }}
            >
              <Card className="relative h-full overflow-visible rounded-[1.6rem] border border-blue-100 bg-white shadow-[0_16px_42px_rgba(15,76,169,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">
                <CardContent className="flex h-full flex-col p-7 md:p-8">
                  <h3 className="mb-4 text-xl font-extrabold text-foreground">
                    {plan.name}
                  </h3>

                  <div className="mb-6 border-b border-blue-100 pb-6">
                    <span className="text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
                      {plan.price}
                    </span>
                    <span className="ml-1 text-xs font-semibold text-muted-foreground">
                      / 월
                    </span>
                  </div>

                  <ul className="mb-8 flex-1 space-y-3">
                    {(planFeatures[plan.id] || [plan.description]).map((feature) => (
                      <li key={feature} className="flex gap-2 text-sm leading-6 text-foreground/80">
                        <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-primary text-[10px] font-bold text-primary">
                          ✓
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full rounded-xl"
                    variant="outline"
                    onClick={handleQuoteRequest}
                  >
                    카톡으로 관리 문의
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {otherPlans.length > 0 && (
          <motion.div
            className="mx-auto mt-6 max-w-6xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <Card className="overflow-hidden rounded-[1.6rem] border-blue-100 bg-white shadow-[0_16px_42px_rgba(15,76,169,0.08)] transition-all duration-300 hover:shadow-xl">
              <CardContent className="grid gap-6 p-7 md:grid-cols-[1fr_auto] md:items-center md:p-8">
                <div>
                  <p className="mb-3 text-xs font-bold tracking-[0.28em] text-primary">
                    EXTRA SERVICE
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-extrabold text-foreground md:text-2xl">
                      {otherPlans[0].name}
                    </h3>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-primary">
                      별도 문의
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {otherPlans[0].description}
                  </p>
                </div>

                <Button
                  className="w-full rounded-xl md:w-auto md:min-w-[190px]"
                  variant="outline"
                  onClick={handleQuoteRequest}
                >
                  카톡으로 별도 문의
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </section>
  );
}
