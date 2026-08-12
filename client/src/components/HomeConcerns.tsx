import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * 모바일 메인 — "혹시, 이런 고민 있으신가요?" 고민 섹션 (카톡 상담창 형태).
 *
 * 섹션이 화면에 들어오면 말풍선이 위에서부터 순서대로 자동으로 떠오릅니다.
 * (스크롤을 멈춰도 계속 재생되며, 한 번 재생한 뒤에는 다시 재생하지 않습니다)
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
const START_DELAY = 250; // 섹션이 보이고 첫 말풍선까지
const STEP = 900; // 말풍선 사이 간격
const TYPING_MS = 1200; // 답장 전 "입력 중" 점 세 개가 보이는 시간

type Props = {
  /** 마지막 답장까지 나오면 호출됩니다. 다음 섹션 등장 신호로 씁니다. */
  onComplete?: () => void;
};

export default function HomeConcerns({ onComplete }: Props) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(false);
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

    const node = sectionRef.current;
    if (!node) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    // 섹션이 화면에 들어오면 한 번만 재생 시작. 이후에는 스크롤과 무관하게 진행됩니다.
    const observer = new IntersectionObserver(
      (entries, obs) => {
        if (!entries[0]?.isIntersecting) return;
        obs.disconnect();
        // 건물주 말풍선 순차 등장
        for (let i = 0; i < lines.length; i += 1) {
          timers.push(setTimeout(() => setShown(i + 1), START_DELAY + i * STEP));
        }
        // "입력 중" 표시 → 답장
        const typingAt = START_DELAY + lines.length * STEP;
        timers.push(setTimeout(() => setTyping(true), typingAt));
        timers.push(
          setTimeout(() => {
            setTyping(false);
            setShown(TOTAL);
          }, typingAt + TYPING_MS),
        );
        timers.push(setTimeout(fire, typingAt + TYPING_MS + 400));
      },
      { threshold: 0.25 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
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
    <section ref={sectionRef} className="px-5 py-10">
      <style>{`
        @keyframes home-concerns-blink {
          0%, 60%, 100% { opacity: .25; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-3px); }
        }
        .home-concerns-dot { animation: home-concerns-blink 1.2s infinite; }
        .home-concerns-dot:nth-child(2) { animation-delay: .18s; }
        .home-concerns-dot:nth-child(3) { animation-delay: .36s; }
        @media (prefers-reduced-motion: reduce) {
          .home-concerns-dot { animation: none; }
        }
      `}</style>

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

        {/* 입력 중 표시 (장식) — 답장 직전에만 잠깐 나타납니다 */}
        {typing && !reduce && (
          <motion.div
            aria-hidden="true"
            className="flex items-start justify-end gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <span className="flex gap-1 rounded-[15px_5px_15px_15px] bg-[#f2f4f8] px-3.5 py-[15px]">
              <i className="home-concerns-dot h-1.5 w-1.5 rounded-full bg-[#9fb0c8]" />
              <i className="home-concerns-dot h-1.5 w-1.5 rounded-full bg-[#9fb0c8]" />
              <i className="home-concerns-dot h-1.5 w-1.5 rounded-full bg-[#9fb0c8]" />
            </span>
            <img
              src="/favicon-192.png"
              alt=""
              className="h-9 w-9 shrink-0 rounded-full bg-white p-1 shadow-sm ring-1 ring-blue-100"
            />
          </motion.div>
        )}

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
