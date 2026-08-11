import { useEffect, useRef, useState } from "react";

/**
 * 모바일 메인 — "혹시, 이런 고민 있으신가요?" 고민 섹션 (카톡 상담창 형태).
 *
 * 타이포 스케일은 모바일 메인의 기존 위계를 따릅니다.
 *   h2 = text-lg / GmarketSans extrabold, 본문·말풍선 = text-[13px]
 * 이 섹션은 MobileHome(md:hidden) 안에서만 렌더되므로 sm:/md: 변형을 두지 않습니다.
 *
 * - 뷰포트에 25% 들어오면 1회만 재생하고 옵저버는 해제합니다.
 * - prefers-reduced-motion: reduce 이면 모션 없이 최종 상태만 보여주고
 *   장식용 타이핑 인디케이터는 렌더하지 않습니다.
 */

type Line = { lead: string; accent: string; tail: string; breakAfterLead?: boolean };

const lines: Line[] = [
  { lead: "매달 관리비는 나가는데", accent: "늘 그대로예요", tail: "", breakAfterLead: true },
  { lead: "다녀갔다고는 하는데", accent: "언제 왔는지 알 수가 없어요", tail: "", breakAfterLead: true },
  { lead: "바닥만 쓸고 ", accent: "창틀·난간은 그대로", tail: "예요" },
  { lead: "사람이 자주 바뀌니 ", accent: "말해도 그때뿐", tail: "이에요" },
];

// 섹션 진입(0ms) 기준 타임라인 → step 값
const TIMELINE = [300, 1450, 2600, 3750, 5000, 6700];

const ENTER = "transition-[opacity,transform] duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)]";
const BUBBLE = "max-w-[82%] break-keep px-3.5 py-2.5 text-[13px] font-semibold leading-[1.6]";

type Props = {
  /** 마지막 답장까지 모두 나온 뒤 호출됩니다. 다음 섹션 등장 신호로 씁니다. */
  onComplete?: () => void;
};

export default function HomeConcerns({ onComplete }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  // 최신 콜백을 참조만 하고 옵저버는 1회만 붙입니다.
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduceMotion(true);
      setStep(TIMELINE.length);
      onCompleteRef.current?.();
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    const observer = new IntersectionObserver(
      (entries, obs) => {
        if (!entries[0]?.isIntersecting) return;
        obs.disconnect();
        TIMELINE.forEach((ms, i) => timers.push(setTimeout(() => setStep(i + 1), ms)));
        // 마지막 말풍선이 자리를 잡은 뒤 다음 섹션에 신호를 보냅니다.
        timers.push(setTimeout(() => onCompleteRef.current?.(), TIMELINE[TIMELINE.length - 1] + 700));
      },
      { threshold: 0.25 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  const on = (n: number) => (step >= n ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[14px]");
  const showTyping = !reduceMotion && step >= 5 && step < 6;

  return (
    <section ref={sectionRef} className="px-5 py-9">
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
          <div key={line.accent} className={`flex ${ENTER} ${on(i + 1)}`}>
            <p className={`${BUBBLE} rounded-[5px_15px_15px_15px] bg-[#f2f4f8] text-foreground`}>
              &ldquo;{line.lead}
              {line.breakAfterLead && <br />}
              <span className="text-primary">{line.accent}</span>
              {line.tail}&rdquo;
            </p>
          </div>
        ))}

        {/* 타이핑 인디케이터 (장식) */}
        {showTyping && (
          <div aria-hidden="true" className={`flex justify-end ${ENTER} opacity-100`}>
            <span className="flex gap-1 rounded-[15px_5px_15px_15px] bg-[#f2f4f8] px-3.5 py-[15px]">
              <i className="home-concerns-dot h-1.5 w-1.5 rounded-full bg-[#9fb0c8]" />
              <i className="home-concerns-dot h-1.5 w-1.5 rounded-full bg-[#9fb0c8]" />
              <i className="home-concerns-dot h-1.5 w-1.5 rounded-full bg-[#9fb0c8]" />
            </span>
          </div>
        )}

        {/* 부부 답장 */}
        <div className={`flex justify-end ${ENTER} ${on(6)}`}>
          <p
            className={`${BUBBLE} rounded-[15px_5px_15px_15px] bg-primary text-white shadow-[0_10px_24px_rgba(15,76,169,0.2)]`}
          >
            문제는 청소보다 ‘관리의 지속성’이었습니다.
          </p>
        </div>
      </div>
    </section>
  );
}
