import { createContext, useContext, type ReactNode } from "react";
import { MotionConfig, useReducedMotion } from "framer-motion";

const HomeMotionContext = createContext(false);
export const HOME_EASE = [0.22, 1, 0.36, 1] as const;

export function HomeMotion({ children }: { children: ReactNode }) {
  return (
    <HomeMotionContext.Provider value={true}>
      <MotionConfig reducedMotion="user" transition={{ duration: 0.65, ease: HOME_EASE }}>
        {children}
      </MotionConfig>
    </HomeMotionContext.Provider>
  );
}

// Shared sections keep their existing behavior outside the desktop home page.
export function useHomeMotion() {
  const home = useContext(HomeMotionContext);
  const reduced = useReducedMotion();
  return { home, reduced, reveal: (delay = 0, y = 24) => ({
    initial: reduced ? false as const : { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: reduced ? 0 : 0.65, delay: reduced ? 0 : delay, ease: HOME_EASE },
  }) };
}
