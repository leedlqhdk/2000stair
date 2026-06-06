import { Building2, ClipboardCheck, HeartHandshake, MapPin, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const messageCards = [
  {
    title: "부부가 직접 관리합니다",
    text: "이천시 빌라·상가 공용공간을 하청 없이 직접 확인하고 관리합니다.",
  },
  {
    title: "한 번보다 꾸준히",
    text: "반짝이는 하루 청소보다, 계단과 공동현관이 계속 깨끗하게 유지되는 상태를 목표로 합니다.",
  },
];

const highlights = [
  {
    icon: Building2,
    title: "공용공간 관리",
    text: "계단, 복도, 공동현관처럼 여러 사람이 함께 쓰는 공간을 정기적으로 관리합니다.",
  },
  {
    icon: MapPin,
    title: "이천 지역 맞춤",
    text: "마장면, 신둔면, 부발읍, 대월면과 시내권 건물 구조에 맞춰 안내합니다.",
  },
  {
    icon: ClipboardCheck,
    title: "사진 기준 상담",
    text: "건물 사진과 주소를 보내주시면 오염 상태와 관리 주기를 현실적으로 잡아드립니다.",
  },
  {
    icon: HeartHandshake,
    title: "연락 빠른 관리",
    text: "상담부터 작업 기록까지 같은 흐름으로 빠르게 정리해드립니다.",
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
        <div className="grid gap-9 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center">
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

            <motion.div
              className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={cardListVariants}
            >
              {messageCards.map((item) => (
                <motion.div
                  key={item.title}
                  className="rounded-2xl border border-blue-100 bg-white/90 p-5 shadow-[0_18px_45px_rgba(15,76,169,0.08)]"
                  variants={cardVariants}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-primary ring-1 ring-blue-100">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-extrabold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="grid gap-4 sm:grid-cols-2 md:gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={cardListVariants}
          >
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                className={`group min-h-[220px] rounded-[1.35rem] border border-blue-200/70 bg-[#0b2b66] p-5 text-white shadow-[0_22px_55px_rgba(15,76,169,0.18)] transition-colors duration-300 hover:bg-primary md:p-6 ${offsetClasses[index]}`}
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
                    <h3 className="text-lg font-extrabold">{item.title}</h3>
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
