import { Link } from "wouter";
import { motion } from "framer-motion";

const stats = [
  { value: "직영", unit: "", label: "하청 없는 관리" },
  { value: "사진", unit: "", label: "초도청소 후 사진제공" },
  { value: "증빙", unit: "", label: "사업자 거래 상담" },
];

export default function HusbandProfileStats() {
  return (
    <section className="bg-white py-14 md:py-20">
      <div className="container max-w-6xl">
        <motion.div
          className="grid items-stretch overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-[0_20px_55px_rgba(15,76,169,0.06)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="relative h-full min-h-[260px] overflow-hidden md:min-h-[430px] lg:min-h-[520px]"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src="/images/husband-profile.webp?v=20260606"
              alt="이천계단지기 대표 현장관리 프로필"
              className="absolute inset-0 h-full w-full object-cover object-[38%_50%]"
              loading="lazy"
            />
          </motion.div>

          <motion.div
            className="flex flex-col px-6 py-8 text-center md:px-10 md:py-10 lg:px-12 lg:py-14 lg:text-left"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-3xl font-extrabold leading-tight text-foreground md:text-4xl">
              같은 사람이, 꾸준히
              <br />
              대표가 직접 관리합니다
            </h2>

            <p className="mx-auto mt-6 max-w-xl break-keep text-sm font-medium leading-7 text-muted-foreground md:text-base md:leading-8 lg:mx-0">
              처음 방문한 건물의 계단·공동현관·창틀 상태를 기록하고, 다음 방문에도 같은 기준으로 이어서 관리합니다.
              관리 범위와 주기는 현장 확인 후 안내하며, 관리사무소와 법인 고객은 계약·증빙 기준에 맞춰 상담합니다.
            </p>

            <div className="mx-auto mt-8 grid max-w-2xl gap-5 sm:grid-cols-3 lg:mx-0">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center lg:text-left"
                  initial={{ opacity: 0, y: 18, scale: 0.92 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.55,
                    delay: 0.25 + index * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <motion.p
                    className="text-[2rem] font-extrabold leading-none tracking-tight text-primary md:text-[2.2rem]"
                    initial={{ scale: 0.9 }}
                    whileInView={{ scale: [0.9, 1.08, 1] }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.7,
                      delay: 0.35 + index * 0.12,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {stat.value}
                    {stat.unit && (
                      <span className="ml-1 align-baseline text-xs font-bold text-foreground/80">
                        {stat.unit}
                      </span>
                    )}
                  </motion.p>
                  <p className="mt-2 text-sm font-bold text-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-auto flex justify-center pt-10 lg:max-w-2xl lg:justify-end">
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-blue-50 px-5 py-3 text-sm font-extrabold text-primary shadow-[0_10px_24px_rgba(15,76,169,0.08)] transition hover:-translate-y-0.5 hover:border-primary/35 hover:bg-white hover:shadow-[0_14px_30px_rgba(15,76,169,0.12)]"
              >
                부부소개 보기
                <span className="ml-2">→</span>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
