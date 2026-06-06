import { motion } from "framer-motion";

const stats = [
  {
    value: "5",
    unit: "years",
    label: "대표 직접 방문",
  },
  {
    value: "99.9%",
    unit: "",
    label: "고객 만족도",
  },
  {
    value: "21600+",
    unit: "",
    label: "누적 관리 빌라",
  },
];

export default function HusbandProfileStats() {
  return (
    <section className="bg-white py-14 md:py-20">
      <div className="container max-w-6xl">
        <motion.div
          className="grid items-end gap-6 overflow-hidden rounded-[2rem] border border-blue-100 bg-white px-6 pt-6 shadow-[0_20px_55px_rgba(15,76,169,0.06)] md:grid-cols-[0.9fr_1.1fr] md:gap-8 md:px-12 md:pt-5"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="flex justify-center md:justify-start"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src="/images/husband-profile-main.webp?v=20260606"
              alt="이천계단지기 대표 현장관리 프로필"
              className="-mb-1 w-[315px] max-w-full object-contain md:-mb-2 md:w-[430px]"
              loading="lazy"
            />
          </motion.div>

          <motion.div
            className="pb-8 text-center md:pb-10 md:text-left"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-3xl font-extrabold leading-tight text-foreground md:text-4xl">
              이천계단지기 대표가
              <br />
              직접 관리합니다
            </h2>

            <p className="mt-5 text-sm leading-7 text-muted-foreground md:text-base">
              계단청소는 단순히 바닥을 닦는 일이 아닙니다.
            </p>

            <p className="mt-5 max-w-2xl text-sm font-semibold leading-7 text-foreground/90 md:text-[15px]">
              건물마다 오염 원인과 관리 방법이 다르기 때문에 직접 현장을 확인하고 관리하는 것이 중요합니다.
              <br className="hidden md:block" />
              이천계단지기는 외주나 하청 없이 대표가 직접 방문하여 건물 상태를 확인하고, 관리 주기와 작업 범위를 안내해드립니다.
            </p>

            <div className="mt-7 grid gap-5 sm:grid-cols-3 md:max-w-2xl">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center md:text-left">
                  <p className="text-[2.2rem] font-extrabold leading-none tracking-tight text-primary md:text-[2.45rem]">
                    {stat.value}
                    {stat.unit && (
                      <span className="ml-1 align-baseline text-xs font-bold text-foreground/80">
                        {stat.unit}
                      </span>
                    )}
                  </p>
                  <p className="mt-2 text-sm font-bold text-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center md:max-w-2xl md:justify-end">
              <a
                href="/about"
                className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-blue-50 px-5 py-3 text-sm font-extrabold text-primary shadow-[0_10px_24px_rgba(15,76,169,0.08)] transition hover:-translate-y-0.5 hover:border-primary/35 hover:bg-white hover:shadow-[0_14px_30px_rgba(15,76,169,0.12)]"
              >
                대표 소개 보기
                <span className="ml-2">→</span>
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
