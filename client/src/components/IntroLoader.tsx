import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const CURTAIN_EASE = [0.76, 0, 0.24, 1] as const;
const INTRO_FLAG = "introShown";

export function shouldShowIntro() {
  if (typeof window === "undefined") return false;
  try {
    return !window.sessionStorage.getItem(INTRO_FLAG);
  } catch {
    return false;
  }
}

type IntroLoaderProps = {
  onReveal: () => void;
  onDone: () => void;
};

export default function IntroLoader({ onReveal, onDone }: IntroLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const revealCalled = useRef(false);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(INTRO_FLAG, "1");
    } catch {
      /* ignore */
    }

    const start = performance.now();
    const DURATION = 1200;
    let raf = 0;

    const tick = (now: number) => {
      const value = Math.min(100, Math.round(((now - start) / DURATION) * 100));
      setProgress(value);
      if (value < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => setExiting(true), 250);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (exiting && !revealCalled.current) {
      revealCalled.current = true;
      onReveal();
    }
  }, [exiting, onReveal]);

  return (
    <div className="pointer-events-auto fixed inset-0 z-[100]">
      {/* 뒤따라 올라가는 파란 패널 (커튼 잔상) */}
      <motion.div
        className="absolute inset-0 bg-primary"
        animate={exiting ? { y: "-100%" } : { y: 0 }}
        transition={{ duration: 0.7, ease: CURTAIN_EASE, delay: 0.1 }}
        onAnimationComplete={() => {
          if (exiting) onDone();
        }}
      />

      {/* 메인 네이비 패널 */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center bg-[#101f3d]"
        animate={exiting ? { y: "-100%" } : { y: 0 }}
        transition={{ duration: 0.7, ease: CURTAIN_EASE }}
      >
        <motion.img
          src="/images/icheon-logo-white.png"
          alt="이천계단지기"
          className="h-10 w-auto md:h-12"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.p
          className="mt-4 text-[11px] font-bold tracking-[0.34em] text-white/45"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          ICHEON STAIR
        </motion.p>

        <div className="mt-9 h-[2px] w-44 overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-white"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 text-[11px] font-bold tabular-nums text-white/55">{progress}%</p>
      </motion.div>
    </div>
  );
}
