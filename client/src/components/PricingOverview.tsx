import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";

const priceCards = [
  {
    title: "계단청소 정기관리",
    items: [
      { badge: "추천 · 월 4회", price: "60,000원~", highlight: true },
      { badge: "관리 범위", price: "2~8층" },
    ],
    note: "주 1회 정기관리 · 층별 정찰제 (2층 6만원부터 층당 1만원 추가)",
    href: "/services/stair",
  },
  {
    title: "화장실청소 정기관리",
    items: [
      { badge: "월 2회", price: "20,000원~" },
      { badge: "월 4회", price: "40,000원~", highlight: true },
    ],
    note: "소형 상가·공용화장실 기준",
    href: "/services/bathroom",
  },
  {
    title: "유리청소",
    items: [
      { badge: "공동현관", price: "30,000원~" },
      { badge: "상가 전면", price: "50,000원~", highlight: true },
    ],
    note: "출입문·고정창 기준, 일회성 가능",
    href: "/services/glass",
  },
  {
    title: "사무실청소",
    items: [
      { badge: "1회 청소", price: "방문 견적" },
      { badge: "정기 관리", price: "맞춤 견적", highlight: true },
    ],
    note: "면적·공간 구성 확인 후 안내, 주 1~2회 정기 방문",
    href: "/services/office",
  },
];

export default function PricingOverview() {
  return (
    <section id="pricing" className="bg-blue-50/40 py-16 md:py-24">
      <div className="container max-w-6xl">
        <motion.div
          className="mx-auto mb-10 max-w-2xl text-center md:mb-12"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <p className="mb-4 text-xs font-bold tracking-[0.35em] text-primary md:text-sm">
            PRICING
          </p>
          <h2 className="mb-4 text-3xl font-extrabold leading-[1.14] text-foreground md:text-4xl">
            정기관리 요금 안내
          </h2>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            계단청소는 월 4회(주 1회) 기준 층별 정찰제로 안내합니다. 다른 서비스는
            현장 조건을 확인한 뒤 견적을 안내해드립니다.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {priceCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Link href={card.href}>
                <a className="group block h-full rounded-[1.5rem] border border-blue-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md">
                  <h3 className="mb-4 text-lg font-extrabold text-foreground">
                    {card.title}
                  </h3>

                  <div className="space-y-2.5">
                    {card.items.map((item) => (
                      <div
                        key={item.badge}
                        className={`flex items-center justify-between rounded-xl px-4 py-3 ${
                          item.highlight ? "bg-primary text-white" : "bg-blue-50 text-foreground"
                        }`}
                      >
                        <span className="text-sm font-bold">{item.badge}</span>
                        <span className="text-base font-extrabold">{item.price}</span>
                      </div>
                    ))}
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {card.note}
                  </p>

                  <div className="mt-5 flex items-center gap-1.5 text-sm font-bold text-primary">
                    자세히 보기
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </a>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-8 flex flex-col items-center gap-4 rounded-[1.5rem] border border-blue-100 bg-white p-6 text-center shadow-sm md:mt-10 md:p-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.24 }}
        >
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            계단청소 정찰가는 월 4회(주 1회) 기준이며 2층부터 8층까지 적용합니다. 사진과 층수·세대수를 보내주시면 관리 가능 여부를 안내드립니다.
          </p>
          <a
            href="https://pf.kakao.com/_IiNfn/chat"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-primary/25 transition hover:-translate-y-0.5"
          >
            <MessageCircle className="h-4 w-4" />
            카톡으로 관리 가능 여부 확인
          </a>
        </motion.div>
      </div>
    </section>
  );
}
