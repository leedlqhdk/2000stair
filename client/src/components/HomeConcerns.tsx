import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";

/**
 * 모바일 메인 — "혹시, 이런 고민 있으신가요?" 고민 섹션 (카톡 상담창 형태).
 *
 * 사용자가 스크롤하는 진행도에 맞춰 고민 말풍선이 하나씩 나타납니다.
 * (섹션을 화면보다 길게 두고 안쪽을 sticky로 고정 → 스크롤량 = 노출 개수)
 * 마지막 부부 답장까지 나오면 onComplete로 다음 섹션 등장을 알립니다.
 * 콘텐츠는 항상 DOM에 있으므로 검색엔진은 처음부터 읽을 수 있습니다.
 * prefers-reduced-motion: reduce 이면 스크롤 연동 없이 최종 상태만 보여줍니다.
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

// 답장까지 총 5개. 각 말풍선이 약 한 화면 스크롤마다 하나씩 나타나도록,
// 섹션을 길게 두고 진행도(0~1)를 넓게 벌려 매핑한다.
const TOTAL = lines.length + 1;
const SECTION_VH = 480; // 섹션 전체 높이(뷰포트 대비 %) — 클수록 한 개당 스크롤이 길어짐
const THRESHOLDS = [0.08, 0.27, 0.46, 0.65, 0.84];

type Props = {
  /** 마지막 답장까지 나오면 호출됩니다. 다음 섹션 등장 신호로 씁니다. */
  onComplete?: () => void;
};

export default function HomeConcerns({ onComplete }: Props) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(0);
  const firedRef = useRef(false);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const fire = () => {
    if (firedRef.current) return;
    firedRef.current = true;
    onCompleteRef.current?.();
  };

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduce) return;
    let n = 0;
    for (const th of THRESHOLDS) if (v >= th) n += 1;
    setShown((prev) => (n > prev ? n : prev)); // 한 번 뜬 말풍선은 유지
    if (n >= TOTAL) fire();
  });

  // 감소모션: 스크롤 연동 없이 즉시 전체 노출 + 다음 섹션 신호.
  useEffect(() => {
    if (reduce) {
      setShown(TOTAL);
      fire();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  const bubble = (visible: boolean) =>
    reduce
      ? {}
      : {
          animate: { opacity: visible ? 1 : 0, y: visible ? 0 : 18 },
          transition: { duration: 0.5, ease: EASE },
        };

  return (
    <section ref={sectionRef} className="relative" style={{ height: reduce ? "auto" : `${SECTION_VH}vh` }}>
      <div
        className={
          reduce
            ? "px-5 py-9"
            : "sticky top-0 flex min-h-[100svh] flex-col justify-center px-5 py-9"
        }
      >
        <h2 className="mb-6 break-keep font-['GmarketSans'] text-lg font-extrabold leading-snug text-foreground">
          혹시, 이런 고민 있으신가요?
        </h2>

        <div className="flex flex-col gap-2.5">
          {lines.map((line, i) => (
            <motion.div key={line.accent} className="flex" initial={false} {...bubble(shown > i)}>
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
            initial={false}
            {...bubble(shown >= TOTAL)}
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
      </div>
    </section>
  );
}
