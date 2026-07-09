import type { ReactNode } from "react";
import { motion } from "framer-motion";

// 사이트 전체에서 공용으로 쓰는 "천천히 하나씩" 등장 모션.
// 속도/간격을 여기서만 바꾸면 전 페이지에 동일하게 반영됩니다.
export const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;
export const REVEAL_DURATION = 0.7;
export const REVEAL_STAGGER = 0.16;

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** 같은 그룹 안 순서 (0,1,2...). 지정 시 순차 등장 */
  index?: number;
  delay?: number;
  y?: number;
  once?: boolean;
};

export default function Reveal({
  children,
  className,
  index = 0,
  delay = 0,
  y = 26,
  once = true,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "0px 0px -8% 0px" }}
      transition={{
        duration: REVEAL_DURATION,
        delay: delay + index * REVEAL_STAGGER,
        ease: REVEAL_EASE,
      }}
    >
      {children}
    </motion.div>
  );
}
