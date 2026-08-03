import { Building2, ShieldCheck, Sparkles, Users } from "lucide-react";
import { motion } from "framer-motion";

const wifeCharacterSrc =
  "data:image/webp;base64,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";

const careReasons = [
  {
    icon: Sparkles,
    title: "먼지·오염 축적 방지",
    text: "쌓인 뒤 한꺼번에 치우기보다, 오염이 굳기 전에 꾸준히 관리합니다.",
  },
  {
    icon: Users,
    title: "입주민 만족도 향상",
    text: "매일 오가는 공용공간이 정돈되면 건물의 체감 인상도 달라집니다.",
  },
  {
    icon: Building2,
    title: "건물 첫인상 유지",
    text: "계단과 공동현관은 방문자가 가장 먼저 마주하는 건물의 얼굴입니다.",
  },
  {
    icon: ShieldCheck,
    title: "위험요소 함께 확인",
    text: "청소하며 미끄럼 오염이나 통행에 방해되는 요소도 함께 살핍니다.",
  },
];

export default function AboutDetailHighlights() {
  return (
    <>
      {/* 부부 소개 */}
      <section className="px-5 py-7 md:py-10">
        <motion.div
          className="grid grid-cols-[minmax(0,1fr)_118px] items-center gap-3 md:grid-cols-[minmax(0,1fr)_220px] md:gap-8"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative min-w-0 rounded-2xl border-2 border-blue-100 bg-white px-4 py-5 shadow-[0_10px_30px_rgba(37,99,235,0.06)] md:rounded-3xl md:px-8 md:py-8">
            <span className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 border-r-2 border-t-2 border-blue-100 bg-white md:-right-3 md:h-6 md:w-6" />
            <p className="text-[9px] font-extrabold tracking-[0.18em] text-primary md:text-xs">HELLO</p>
            <h2 className="mt-1.5 break-keep font-['GmarketSans'] text-[15px] font-extrabold leading-snug text-foreground sm:text-[17px] md:mt-2 md:text-3xl">
              안녕하세요, 이천계단지기 부부입니다!
            </h2>
            <p className="mt-2.5 break-keep text-[11px] font-medium leading-[1.65] text-gray-700 sm:text-[12px] md:mt-4 md:text-base md:leading-8">
              상담부터 현장 확인, 작업 후 사진 기록까지 부부가 직접 챙깁니다. 하청 없이 저희 둘이 관리하기에
              매번 같은 사람이 같은 기준으로 건물 상태를 이어서 살필 수 있습니다.
            </p>
          </div>

          <motion.img
            src={wifeCharacterSrc}
            alt="이천계단지기 상담과 운영을 맡은 아내 캐릭터"
            className="mx-auto w-[112px] object-contain md:w-[215px]"
            loading="lazy"
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      {/* 정기관리 철학 */}
      <section className="bg-blue-50/65 px-5 py-10 md:rounded-[2rem] md:px-10 md:py-14">
        <div className="grid items-center gap-4 md:grid-cols-[minmax(0,1fr)_220px] md:gap-8">
          <div className="text-center md:text-left">
            <span className="inline-flex rounded-full bg-primary px-4 py-2 text-[11px] font-extrabold text-white md:text-xs">
              그래서 정기관리입니다
            </span>
            <h2 className="mt-4 break-keep font-['GmarketSans'] text-2xl font-extrabold leading-tight text-foreground md:text-4xl">
              한 번 청소로는 <span className="text-primary">오래 못 갑니다</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl break-keep text-sm font-medium leading-7 text-gray-600 md:mx-0 md:text-base md:leading-8">
              계단과 공동현관은 매일 사람이 오가는 공간입니다. 깨끗함을 오래 유지하려면 오염이 쌓인 뒤가 아니라,
              쌓이기 전부터 주기적으로 관리해야 합니다.
            </p>
          </div>

          <motion.img
            src="/character-husband.png"
            alt="계단을 직접 관리하는 이천계단지기 대표 캐릭터"
            className="mx-auto w-[150px] object-contain mix-blend-multiply md:w-[215px]"
            loading="lazy"
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            animate={{ y: [0, -6, 0] }}
            transition={{ opacity: { duration: 0.6 }, scale: { duration: 0.6 }, y: { duration: 4.8, repeat: Infinity, ease: "easeInOut" } }}
          />
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3 md:mt-10 md:grid-cols-4 md:gap-4">
          {careReasons.map((reason, index) => (
            <motion.article
              key={reason.title}
              className="rounded-2xl border border-blue-100 bg-white p-4 text-center shadow-[0_8px_24px_rgba(15,23,42,0.04)] md:p-6"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
            >
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-primary md:h-14 md:w-14">
                <reason.icon className="h-5 w-5 md:h-6 md:w-6" strokeWidth={2.2} />
              </span>
              <h3 className="mt-3 break-keep text-[13px] font-extrabold leading-snug text-foreground md:text-base">
                {reason.title}
              </h3>
              <p className="mt-2 hidden break-keep text-[12px] font-medium leading-6 text-muted-foreground md:block">
                {reason.text}
              </p>
            </motion.article>
          ))}
        </div>
      </section>
    </>
  );
}
