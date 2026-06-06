import { Building2, ClipboardCheck, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const highlights = [
  {
    icon: Building2,
    title: "빌라·상가 공용공간",
    text: "계단, 복도, 공동현관처럼 여러 사람이 함께 쓰는 공간은 먼지와 발자국 오염이 반복되기 쉬워 정기적인 관리가 필요합니다.",
  },
  {
    icon: MapPin,
    title: "이천 지역 맞춤 관리",
    text: "마장면, 신둔면, 부발읍, 대월면과 시내권 건물 구조에 맞춰 계단청소와 유리·화장실 청소 범위를 안내합니다.",
  },
  {
    icon: ClipboardCheck,
    title: "사진 기준 상담",
    text: "건물 사진 한 장과 주소를 보내주시면 오염 상태, 층수, 관리 주기를 보고 현실적인 정기관리 기준을 잡아드립니다.",
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

export default function SeoIntroSection() {
  return (
    <section className="relative overflow-hidden border-y border-blue-100 bg-blue-50/35 py-14 md:py-20">
      <motion.div
        className="pointer-events-none absolute left-1/2 top-10 h-48 w-48 -translate-x-1/2 rounded-full bg-white/70 blur-3xl md:h-72 md:w-72"
        initial={{ opacity: 0, scale: 0.7 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />

      <div className="container relative max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
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
            <p className="mt-5 text-base leading-8 text-muted-foreground md:text-lg">
              이천계단지기는 이천시 빌라·상가 공용공간을 부부가 직접 관리하는 계단청소 전문 서비스입니다.
              한 번 반짝이는 청소보다, 계단과 공동현관이 꾸준히 깨끗하게 유지되는 상태를 목표로 관리합니다.
            </p>
          </motion.div>

          <motion.div
            className="grid gap-3 md:gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={cardListVariants}
          >
            {highlights.map((item) => (
              <motion.div
                key={item.title}
                className="group grid gap-3 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition-colors duration-300 sm:grid-cols-[48px_minmax(0,1fr)] sm:items-start md:p-6"
                variants={cardVariants}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <motion.div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-primary ring-1 ring-blue-100 transition-colors duration-300 group-hover:bg-primary group-hover:text-white"
                  whileHover={{ rotate: -4 }}
                >
                  <item.icon className="h-5 w-5" />
                </motion.div>
                <div>
                  <h3 className="text-base font-extrabold text-foreground md:text-lg">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground md:text-base">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
