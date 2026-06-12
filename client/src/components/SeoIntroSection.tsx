import { Building2, ClipboardCheck, Home, Store } from "lucide-react";
import { motion } from "framer-motion";

const needCards = [
  {
    icon: Home,
    title: "빌라·원룸 민원이 잦은 건물",
    text: "계단은 입주민 모두가 매일 사용하는 공간입니다. 먼지, 머리카락, 흙자국이 쌓이면 건물 전체 관리 상태가 나빠 보일 수 있습니다.",
  },
  {
    icon: Building2,
    title: "공동현관 출입이 많은 다세대주택",
    text: "택배 기사, 배달 기사, 방문객의 출입이 많은 건물은 오염 속도가 빠릅니다. 공동현관과 계단 모서리는 관리 여부가 바로 눈에 띕니다.",
  },
  {
    icon: Store,
    title: "상가·사무실 건물",
    text: "고객이 처음 마주하는 공간이 계단과 출입구입니다. 깨끗한 공용공간은 건물 이미지와 입점 업체의 신뢰도에도 영향을 줍니다.",
  },
  {
    icon: ClipboardCheck,
    title: "관리업체가 없거나 직접 관리하기 어려운 건물",
    text: "건물주가 직접 청소하기 어렵거나 기존 관리 품질이 아쉬운 경우, 정기적인 계단청소만으로도 건물 상태를 크게 개선할 수 있습니다.",
  },
];

const textVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardListVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 22, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.56, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function SeoIntroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/45 to-white py-14 md:py-20">
      <motion.div
        className="pointer-events-none absolute -left-16 top-12 h-56 w-56 rounded-full bg-blue-100/70 blur-3xl md:h-72 md:w-72"
        initial={{ opacity: 0, scale: 0.7 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />
      <motion.div
        className="pointer-events-none absolute right-0 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-sky-100/70 blur-3xl md:h-80 md:w-80"
        initial={{ opacity: 0, scale: 0.7 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, delay: 0.1, ease: "easeOut" }}
      />

      <div className="container relative max-w-7xl">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={textVariants}
        >
          <motion.p
            className="mb-4 text-xs font-bold tracking-[0.25em] text-primary md:text-sm"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            ICHEON STAIR CLEANING
          </motion.p>
          <h2 className="text-2xl font-extrabold leading-[1.18] text-foreground md:text-4xl">
            이천 계단청소,
            <br className="hidden sm:block" />
            어떤 건물에 필요할까요?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
            다음 중 하나라도 해당된다면 정기적인 계단관리를 추천드립니다.
          </p>
        </motion.div>

        <motion.div
          className="mt-10 grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={cardListVariants}
        >
          {needCards.map((item) => (
            <motion.div
              key={item.title}
              className="group flex min-h-[300px] w-full flex-col rounded-[1.35rem] border border-blue-100 bg-white/90 p-5 text-foreground shadow-[0_18px_48px_rgba(15,76,169,0.08)] transition duration-300 hover:-translate-y-1 hover:border-primary/25 hover:bg-blue-50/80 md:p-6"
              variants={cardVariants}
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-primary ring-1 ring-blue-100 transition-colors duration-300 group-hover:bg-white">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-extrabold leading-snug md:text-xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
