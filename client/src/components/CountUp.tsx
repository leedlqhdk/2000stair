import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";

const NUMBER_RE = /[\d,]+(?:\.\d+)?/;

type CountUpProps = {
  value: string;
  className?: string;
  duration?: number;
};

// "21,600+", "5.0", "90%", "5년+" 같은 문자열에서 숫자만 0→목표로 굴려주고
// 앞뒤 텍스트(접두/접미)와 콤마·소수 자릿수는 그대로 유지합니다.
export default function CountUp({ value, className, duration = 1.2 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px 0px" });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const match = value.match(NUMBER_RE);
    if (!match) {
      el.textContent = value;
      return;
    }

    const raw = match[0];
    const prefix = value.slice(0, match.index);
    const suffix = value.slice((match.index ?? 0) + raw.length);
    const hasComma = raw.includes(",");
    const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
    const target = parseFloat(raw.replace(/,/g, ""));

    const render = (n: number) => {
      const fixed = decimals ? n.toFixed(decimals) : String(Math.round(n));
      const formatted = hasComma ? Number(fixed).toLocaleString("ko-KR") : fixed;
      el.textContent = `${prefix}${formatted}${suffix}`;
    };

    if (!inView) {
      render(0);
      return;
    }

    const controls = animate(0, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: render,
    });

    return () => controls.stop();
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
