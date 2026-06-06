import { Camera, Home, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    value: "30+",
    label: "관리 빌라",
    text: "이천 지역 빌라·상가 공용공간을 직접 확인합니다.",
  },
  {
    value: "100%",
    label: "직접 방문",
    text: "상담 후 필요한 현장은 남편이 직접 보고 안내합니다.",
  },
  {
    value: "사진기록",
    label: "작업 공유",
    text: "관리 전후 상태를 사진으로 남겨 확인하기 쉽게 정리합니다.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 26, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HusbandProfileStats() {
  return (
    <section className="relative overflow-hidden bg-white py-14 md:py-20">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-blue-100/70" />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-10 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-50 blur-3xl md:h-80 md:w-80"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
      />

      <div className="container relative max-w-6xl">
        <motion.div
          className="grid items-center gap-9 rounded-[2rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50/35 to-white p-6 shadow-[0_24px_70px_rgba(15,76,169,0.08)] md:grid-cols-[0.9fr_1.1fr] md:p-10"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative flex min-h-[310px] items-end justify-center overflow-hidden rounded-[1.5rem] bg-gradient-to-b from-blue-50 to-white md:min-h-[420px]">
            <div className="absolute inset-8 rounded-full border border-blue-100/80" />
            <div className="absolute inset-14 rounded-full border border-blue-100/60" />
            <motion.div
              className="absolute left-6 top-6 rounded-2xl border border-blue-100 bg-white/90 px-4 py-3 text-sm font-extrabold text-primary shadow-sm"
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.25 }}
            >
              현장관리 담당
            </motion.div>
            <motion.img
              src="/character-husband.png"
              alt="이천계단지기 남편 현장관리 캐릭터"
              className="relative z-10 w-60 object-contain md:w-72"
              loading="lazy"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <div>
            <motion.p
              className="mb-4 text-xs font-bold tracking-[0.35em] text-primary md:text-sm"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              FIELD PROFILE
            </motion.p>
            <motion.h2
              className="text-2xl font-extrabold leading-[1.18] text-foreground md:text-4xl"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08 }}
            >
              남편이 직접 보고,
              <br className="hidden sm:block" />
              건물 상태에 맞춰 관리합니다
            </motion.h2>
            <motion.p
              className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground md:text-base"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.14 }}
            >
              계단 바닥, 난간, 공동현관처럼 오염이 반복되는 공간을 직접 확인하고 관리합니다. 같은 사람이 꾸준히 보면 건물마다 쌓이는 오염 패턴까지 기억할 수 있습니다.
            </motion.p>

            <motion.div
              className="mt-8 grid gap-3 sm:grid-cols-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              transition={{ staggerChildren: 0.1 }}
            >
              {stats.map((item, index) => (
                <motion.div
                  key={item.label}
                  className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_16px_35px_rgba(15,76,169,0.12)]"
                  variants={cardVariants}
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-primary ring-1 ring-blue-100">
                    {index === 0 ? <Home className="h-5 w-5" /> : index === 1 ? <ShieldCheck className="h-5 w-5" /> : <Camera className="h-5 w-5" />}
                  </div>
                  <p className="text-2xl font-extrabold text-primary md:text-3xl">{item.value}</p>
                  <h3 className="mt-1 text-sm font-extrabold text-foreground">{item.label}</h3>
                  <p className="mt-2 text-xs leading-6 text-muted-foreground">{item.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
