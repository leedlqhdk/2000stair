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
  hidden: { opacity: 0, x: -28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardListVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.16 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, x: 34, y: 18, scale: 0.97 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
  },
};

const offsetClasses = ["md:-translate-y-5", "md:translate-y-5", "md:-translate-y-3", "md:translate-y-4"];

export default function SeoIntroSection() {
  return (
    <section className="relative overflow-hidden border-y border-blue-100 bg-gradient-to-br from-white via-blue-50/45 to-white py-14 md:py-20">
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

      <div className="container relative max-w-6xl">
        <div className="grid gap-9 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={textVariants}
          >
            <motion.p
              className="mb-4 text-xs font-bold tracking-[0.35em] text-primary md:text-sm"
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
            <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground md:text-base">
              다음 중 하나라도 해당된다면 정기적인 계단관리를 추천드립니다.
            </p>
          </motion.div>

          <motion.div
            className="grid gap-4 sm:grid-cols-2 md:gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={cardListVariants}
          >
            {needCards.map((item, index) => (
              <motion.div
                key={item.title}
                className={`group min-h-[250px] rounded-[1.35rem] border border-blue-200/70 bg-[#0b2b66] p-5 text-white shadow-[0_22px_55px_rgba(15,76,169,0.18)] transition-colors duration-300 hover:bg-primary md:p-6 ${offsetClasses[index]}`}
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <div className="flex h-full flex-col justify-between gap-7">
                  <div>
                    <motion.div
                      className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/12 text-sky-100 ring-1 ring-white/20 transition-colors duration-300 group-hover:bg-white group-hover:text-primary"
                      whileHover={{ rotate: -4 }}
                    >
                      <item.icon className="h-5 w-5" />
                    </motion.div>
                    <h3 className="text-lg font-extrabold leading-snug">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-blue-50/85">{item.text}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-sky-300" />
                    <span className="h-3 w-3 rounded-full border border-white/35" />
                    <span className="h-3 w-3 rounded-full border border-white/20" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
