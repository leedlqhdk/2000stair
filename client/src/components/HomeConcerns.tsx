import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * 모바일 메인 — "혹시, 이런 고민 있으신가요?" 고민 섹션 (카톡 상담창 형태).
 *
 * 섹션이 화면에 들어오면 고민 말풍선이 0.45초 간격으로 하나씩 순차로 떠오르고
 * (staggerChildren), 마지막 부부 답장까지 나오면 onComplete로 다음 섹션 등장을
 * 알립니다. 콘텐츠는 항상 DOM에 있으므로 검색엔진은 처음부터 읽을 수 있습니다.
 * prefers-reduced-motion: reduce 이면 모션 없이 최종 상태만 보여줍니다.
 */

type Line = { lead: string; accent: string; tail: string; breakAfterLead?: boolean };

const lines: Line[] = [
  { lead: "매달 관리비는 나가는데", accent: "늘 그대로예요", tail: "", breakAfterLead: true },
  { lead: "다녀갔다고는 하는데", accent: "언제 왔는지 알 수가 없어요", tail: "", breakAfterLead: true },
  { lead: "바닥만 쓸고 ", accent: "창틀·난간은 그대로", tail: "예요" },
  { lead: "사람이 자주 바뀌니 ", accent: "말해도 그때뿐", tail: "이에요" },
];

const EASE = [0.22, 1, 0.36, 1] as const;
const BUBBLE = "max-w-[82%] break-keep px-3.5 py-2.5 text-[13px] font-semibold leading-[1.6]";
const STEP = 0.55; // 말풍선 사이 등장 간격(초)

type Props = {
  /** 마지막 답장까지 나오면 호출됩니다. 다음 섹션 등장 신호로 씁니다. */
  onComplete?: () => void;
};

export default function HomeConcerns({ onComplete }: Props) {
  const reduce = useReducedMotion();
  const firedRef = useRef(false);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const fire = () => {
    if (firedRef.current) return;
    firedRef.current = true;
    onCompleteRef.current?.();
  };

  // 답장이 끝내 화면에 안 들어와도 다음 섹션이 막히지 않도록 하는 안전장치.
  useEffect(() => {
    if (reduce) {
      fire();
      return;
    }
    const t = setTimeout(fire, 14000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  return (
    <section className="px-5 py-9">
      <h2 className="mb-6 break-keep font-['GmarketSans'] text-lg font-extrabold leading-snug text-foreground">
        혹시, 이런 고민 있으신가요?
      </h2>

      <div className="flex flex-col gap-2.5">
        {lines.map((line, i) => (
          <motion.div
            key={line.accent}
            className="flex"
            {...(reduce
              ? {}
              : {
                  initial: { opacity: 0, y: 16 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, amount: 0.5 },
                  transition: { duration: 0.6, ease: EASE, delay: i * STEP },
                })}
          >
            <p className={`${BUBBLE} rounded-[5px_15px_15px_15px] bg-[#f2f4f8] text-foreground`}>
              &ldquo;{line.lead}
              {line.breakAfterLead && <br />}
              <span className="text-primary">{line.accent}</span>
              {line.tail}&rdquo;
            </p>
          </motion.div>
        ))}

        {/* 부부 답장 */}
        <motion.div
          className="flex items-start justify-end gap-2"
          {...(reduce
            ? {}
            : {
                initial: { opacity: 0, y: 16 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, amount: 0.5 },
                transition: { duration: 0.6, ease: EASE, delay: lines.length * STEP },
                onAnimationComplete: fire,
              })}
        >
          <p
            className={`${BUBBLE} rounded-[15px_5px_15px_15px] bg-primary text-white shadow-[0_10px_24px_rgba(15,76,169,0.2)]`}
          >
            문제는 청소보다 ‘관리의 지속성’이었습니다.
          </p>
          <img
            src="/favicon-192.png"
            alt="이천계단지기"
            className="h-9 w-9 shrink-0 rounded-full bg-white p-1 shadow-sm ring-1 ring-blue-100"
          />
        </motion.div>
      </div>
    </section>
  );
}
