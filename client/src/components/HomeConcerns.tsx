import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * 모바일 메인 — "혹시, 이런 고민 있으신가요?" 고민 섹션 (카톡 상담창 형태).
 *
 * 스크롤을 내리면서 각 말풍선이 화면 하단 트리거 라인을 지나 올라올 때
 * 위에서부터 순서대로 하나씩 떠오릅니다. (여백 없이 일반 높이 섹션, 스크롤 연동)
 * 마지막 부부 답장까지 나오면 onComplete로 다음 섹션 등장을 알립니다.
 * 콘텐츠는 항상 DOM에 있으므로 검색엔진은 처음부터 읽을 수 있습니다.
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
const TOTAL = lines.length + 1; // 답장 포함
const TRIGGER = 0.72; // 말풍선 top이 화면 높이의 72% 지점을 지나 올라오면 등장

type Props = {
  /** 마지막 답장까지 나오면 호출됩니다. 다음 섹션 등장 신호로 씁니다. */
  onComplete?: () => void;
};

export default function HomeConcerns({ onComplete }: Props) {
  const reduce = useReducedMotion();
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [shown, setShown] = useState(0);
  const firedRef = useRef(false);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const fire = () => {
    if (firedRef.current) return;
    firedRef.current = true;
    onCompleteRef.current?.();
  };

  useEffect(() => {
    if (reduce) {
      setShown(TOTAL);
      fire();
      return;
    }

    const update = () => {
      const line = window.innerHeight * TRIGGER;
      let n = 0;
      for (const el of itemRefs.current) {
        if (el && el.getBoundingClientRect().top <= line) n += 1;
        else break; // 위에서부터 순서대로만 노출
      }
      setShown((prev) => (n > prev ? n : prev)); // 한 번 뜬 건 유지
      if (n >= TOTAL) fire();
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  const anim = (visible: boolean) =>
    reduce
      ? {}
      : {
          initial: false as const,
          animate: { opacity: visible ? 1 : 0, y: visible ? 0 : 16 },
          transition: { duration: 0.45, ease: EASE },
        };

  return (
    <section className="px-5 py-10">
      <h2 className="mb-6 break-keep font-['GmarketSans'] text-lg font-extrabold leading-snug text-foreground">
        혹시, 이런 고민 있으신가요?
      </h2>

      <div className="flex flex-col gap-2.5">
        {lines.map((line, i) => (
          <motion.div
            key={line.accent}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="flex"
            {...anim(shown > i)}
          >
            <p className={`${BUBBLE} rounded-[5px_15px_15px_15px] bg-[#f2f4f8] text-foreground`}>
              &ldquo;{line.lead}
              {line.breakAfterLead && <br />}
              <span className="font-extrabold text-primary">{line.accent}</span>
              {line.tail}&rdquo;
            </p>
          </motion.div>
        ))}

        {/* 부부 답장 */}
        <motion.div
          ref={(el) => {
            itemRefs.current[lines.length] = el;
          }}
          className="flex items-start justify-end gap-2"
          {...anim(shown >= TOTAL)}
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
