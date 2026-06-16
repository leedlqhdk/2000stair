import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const priceCards = [
  {
    title: "계단청소 정기관리",
    items: [
      { badge: "월 2회", price: "40,000원~", mobile: true },
      { badge: "월 4회", price: "70,000원~", highlight: true },
    ],
    note: "빌라 2~3층 공용계단 기준",
    href: "/services/stair",
  },
  {
    title: "화장실청소 정기관리",
    items: [
      { badge: "월 2회", price: "20,000원~", mobile: true },
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
          <p className="mb-4 text-xs font-bold tracking-[0.25em] text-primary md:text-sm">
            PRICING
          </p>
          <h2 className="mb-4 text-3xl font-extrabold leading-[1.14] text-foreground md:text-4xl">
            정기관리 요금 안내
          </h2>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            건물 층수·세대수·오염도에 따라 견적이 달라집니다. 사진과 주소를 보내주시면
            아래 기준으로 무료 견적을 안내해드립니다.
          </p>
        </motion.div>

        <div className="space-y-3 md:hidden">
          {priceCards.map((card, index) => {
            const mobilePrice = card.items.find((item) => item.mobile) ?? card.items.find((item) => item.highlight) ?? card.items[0];

            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
              >
                <Link href={card.href}>
                  <a className="flex items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-white px-4 py-4 shadow-sm transition hover:border-primary/30">
                    <div className="min-w-0">
                      <h3 className="text-base font-extrabold text-foreground">
                        {card.title}
                      </h3>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {card.note}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2.5">
                      <span className="text-right">
                        <span className="block text-[11px] font-bold text-primary">
                          {mobilePrice.badge}
                        </span>
                        <span className="block text-base font-extrabold text-foreground">
                          {mobilePrice.price}
                        </span>
                      </span>
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                  </a>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="hidden gap-4 md:grid md:grid-cols-3">
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
          className="mt-8 space-y-1.5 text-center md:mt-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.24 }}
        >
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            위 가격은 대표적인 시작 가격이며, 정확한 견적은 건물 층수·세대수·오염 상태 확인 후 안내드립니다.
          </p>
          <p className="text-[11px] text-muted-foreground/70">
            * 표시된 금액은 부가세(VAT) 별도입니다.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
