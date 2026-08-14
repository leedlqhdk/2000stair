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
};

export default function DesktopHomeConcerns({ onComplete }: Props) {
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
          timers.push(setTimeout(() => setShown(index + 1), START_DELAY + index * STEP));
        });

        const typingAt = START_DELAY + lines.length * STEP;
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
  }, [reduce]);

  const anim = (visible: boolean) =>
    reduce
      ? {}
      : {
          initial: false as const,
          animate: { opacity: visible ? 1 : 0, y: visible ? 0 : 18 },
          transition: { duration: 0.46, ease: EASE },
        };

  return (
    <div ref={sectionRef} className="relative mx-auto w-full max-w-[520px] px-2 py-2 lg:px-4">
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

      <motion.div
        className="mb-5"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.15, ease: EASE }}
      >
        <p className="text-xs font-extrabold tracking-[0.17em] text-primary">BUILDING OWNER'S VOICE</p>
        <h2 className="mt-2 font-['GmarketSans'] text-[1.55rem] font-extrabold leading-snug text-foreground lg:text-[1.8rem]">
          혹시, 이런 고민 있으신가요?
        </h2>
      </motion.div>

      <div className="flex min-h-[390px] flex-col gap-2.5 lg:min-h-[420px]">
        {lines.map((line, index) => (
          <motion.div
            key={line.accent}
            className={`flex ${index % 2 === 1 ? "justify-end pr-3" : "justify-start pl-1"}`}
            {...anim(shown > index)}
          >
            <p className="max-w-[88%] break-keep rounded-[7px_18px_18px_18px] bg-[#f2f4f8] px-5 py-3.5 text-[14px] font-semibold leading-[1.6] text-foreground shadow-[0_5px_18px_rgba(15,23,42,0.04)] lg:text-[15px]">
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

        <motion.div className="flex items-start justify-end gap-2 pr-1" {...anim(shown >= TOTAL)}>
          <p className="max-w-[86%] break-keep rounded-[18px_7px_18px_18px] bg-primary px-5 py-3.5 text-[14px] font-extrabold leading-[1.6] text-white shadow-[0_10px_28px_rgba(15,76,169,0.2)] lg:text-[15px]">
            문제는 청소보다 ‘관리의 지속성’이었습니다.
          </p>
          <img
            src="/favicon-192.png"
            alt="이천계단지기"
            className="h-10 w-10 shrink-0 rounded-full bg-white p-1 shadow-sm ring-1 ring-blue-100"
          />
        </motion.div>
      </div>
    </div>
  );
}
