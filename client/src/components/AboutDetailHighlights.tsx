import { Building2, ShieldCheck, Sparkles, Users } from "lucide-react";
import { motion } from "framer-motion";

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
      {/* 소개 상세페이지 2번 이미지 내용을 코드로 구현 */}
      <section className="px-5 py-7 md:py-10">
        <motion.div
          className="grid items-center gap-5 md:grid-cols-[220px_minmax(0,1fr)] md:gap-8"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.img
            src="/booboo.webp"
            alt="이천계단지기 부부 캐릭터"
            className="mx-auto w-[170px] object-contain md:w-[210px]"
            loading="lazy"
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative rounded-3xl border-2 border-blue-100 bg-white px-5 py-6 shadow-[0_10px_30px_rgba(37,99,235,0.06)] md:px-8 md:py-8">
            <span className="absolute -left-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 rotate-45 border-b-2 border-l-2 border-blue-100 bg-white md:block" />
            <p className="text-[11px] font-extrabold tracking-[0.2em] text-primary md:text-xs">HELLO</p>
            <h2 className="mt-2 break-keep font-['GmarketSans'] text-xl font-extrabold leading-snug text-foreground md:text-3xl">
              안녕하세요,
              <br className="md:hidden" /> 이천계단지기 부부입니다!
            </h2>
            <p className="mt-4 break-keep text-sm font-medium leading-7 text-gray-700 md:text-base md:leading-8">
              상담부터 현장 확인, 작업 후 사진 기록까지 부부가 직접 챙깁니다. 하청 없이 저희 둘이 관리하기에
              매번 같은 사람이 같은 기준으로 건물 상태를 이어서 살필 수 있습니다.
            </p>
          </div>
        </motion.div>
      </section>

      {/* 소개 상세페이지 3번 이미지 내용을 코드로 구현 */}
      <section className="bg-blue-50/65 px-5 py-10 md:rounded-[2rem] md:px-10 md:py-14">
        <div className="text-center">
          <span className="inline-flex rounded-full bg-primary px-4 py-2 text-[11px] font-extrabold text-white md:text-xs">
            그래서 정기관리입니다
          </span>
          <h2 className="mt-4 break-keep font-['GmarketSans'] text-2xl font-extrabold leading-tight text-foreground md:text-4xl">
            한 번 청소로는 <span className="text-primary">오래 못 갑니다</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl break-keep text-sm font-medium leading-7 text-gray-600 md:text-base md:leading-8">
            계단과 공동현관은 매일 사람이 오가는 공간입니다. 깨끗함을 오래 유지하려면 오염이 쌓인 뒤가 아니라,
            쌓이기 전부터 주기적으로 관리해야 합니다.
          </p>
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
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-primary md:h-13 md:w-13">
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
