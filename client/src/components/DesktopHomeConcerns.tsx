import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Line = { lead: string; accent: string; tail: string; breakAfterLead?: boolean };

const lines: Line[] = [
  { lead: "매달 관리비는 나가는데", accent: "늘 그대로예요", tail: "", breakAfterLead: true },
  { lead: "다녀갔다고는 하는데", accent: "언제 왔는지 알 수가 없어요", tail: "", breakAfterLead: true },
  { lead: "바닥만 쓸고 ", accent: "창틀·난간은 그대로", tail: "예요" },
  { lead: "사람이 자주 바뀌니 ", accent: "말해도 그때뿐", tail: "이에요" },
];

const EASE = [0.22, 1, 0.36, 1] as const;
const TOTAL = lines.length + 1;
const START_DELAY = 300;
const STEP = 760;
const TYPING_MS = 950;

type Props = {
  onComplete?: () => void;
  showConclusion?: boolean;
  startDelay?: number;
};

export default function DesktopHomeConcerns({
  onComplete,
  showConclusion = true,
  startDelay = START_DELAY,
}: Props) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
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
    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (!entry?.isIntersecting) return;
        obs.disconnect();

        lines.forEach((_, index) => {
          timers.push(setTimeout(() => setShown(index + 1), startDelay + index * STEP));
        });

        const typingAt = startDelay + lines.length * STEP;
        timers.push(setTimeout(() => setTyping(true), typingAt));
        timers.push(
          setTimeout(() => {
            setTyping(false);
            setShown(TOTAL);
          }, typingAt + TYPING_MS),
        );
        timers.push(setTimeout(fire, typingAt + TYPING_MS + 350));
      },
      { threshold: 0.35 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [reduce, startDelay]);

  const anim = (visible: boolean) =>
    reduce
      ? {}
      : {
          initial: false as const,
          animate: { opacity: visible ? 1 : 0, y: visible ? 0 : 18 },
          transition: { duration: 0.46, ease: EASE },
        };

  return (
    <div ref={sectionRef} className="relative mx-auto w-full max-w-[680px] px-2 py-2 lg:px-4">
      <style>{`
        @keyframes desktop-home-concerns-blink {
          0%, 60%, 100% { opacity: .25; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-3px); }
        }
        .desktop-home-concerns-dot { animation: desktop-home-concerns-blink 1.2s infinite; }
        .desktop-home-concerns-dot:nth-child(2) { animation-delay: .18s; }
        .desktop-home-concerns-dot:nth-child(3) { animation-delay: .36s; }
        @media (prefers-reduced-motion: reduce) {
          .desktop-home-concerns-dot { animation: none; }
        }
      `}</style>

      <div className={`flex flex-col gap-5 lg:gap-6 ${showConclusion ? "min-h-[390px] lg:min-h-[440px]" : "min-h-[330px]"}`}>
        {lines.map((line, index) => (
          <motion.div
            key={line.accent}
            className="flex justify-start pl-1"
            {...anim(shown > index)}
          >
            <p className="max-w-[90%] break-keep rounded-[7px_18px_18px_18px] bg-[#f2f4f8] px-6 py-4 text-[15px] font-semibold leading-[1.6] text-foreground shadow-[0_5px_18px_rgba(15,23,42,0.04)] lg:text-[17px]">
              &ldquo;{line.lead}
              {line.breakAfterLead && <br />}
              <span className="font-extrabold text-primary">{line.accent}</span>
              {line.tail}&rdquo;
            </p>
          </motion.div>
        ))}

        {typing && !reduce && (
          <motion.div
            aria-hidden="true"
            className="flex items-start justify-end gap-2 pr-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <span className="flex gap-1 rounded-[18px_7px_18px_18px] bg-[#f2f4f8] px-4 py-[17px]">
              <i className="desktop-home-concerns-dot h-1.5 w-1.5 rounded-full bg-[#9fb0c8]" />
              <i className="desktop-home-concerns-dot h-1.5 w-1.5 rounded-full bg-[#9fb0c8]" />
              <i className="desktop-home-concerns-dot h-1.5 w-1.5 rounded-full bg-[#9fb0c8]" />
            </span>
            <img
              src="/favicon-192.png"
              alt=""
              className="h-10 w-10 shrink-0 rounded-full bg-white p-1 shadow-sm ring-1 ring-blue-100"
            />
          </motion.div>
        )}

        {showConclusion && (
          <motion.div className="flex items-start justify-end gap-3 pr-1" {...anim(shown >= TOTAL)}>
            <p className="max-w-[92%] break-keep rounded-[22px_8px_22px_22px] bg-primary px-7 py-5 text-[16px] font-extrabold leading-[1.6] text-white shadow-[0_12px_32px_rgba(15,76,169,0.24)] lg:text-[18px]">
              문제는 청소보다 ‘관리의 지속성’이었습니다.
            </p>
            <img
              src="/favicon-192.png"
              alt="이천계단지기"
              className="h-12 w-12 shrink-0 rounded-full bg-white p-1 shadow-sm ring-1 ring-blue-100"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
