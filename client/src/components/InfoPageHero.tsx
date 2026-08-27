import type { ReactNode } from "react";
import { motion } from "framer-motion";

type InfoPageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
};

export default function InfoPageHero({ eyebrow, title, description }: InfoPageHeroProps) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-blue-800 p-7 text-white md:p-10"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-14 right-16 h-36 w-36 rounded-full bg-white/5" />
      <p className="mb-3 text-xs font-extrabold tracking-[0.28em] text-white/60">{eyebrow}</p>
      <h1 className="break-keep text-2xl font-extrabold leading-snug md:text-3xl">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-white/80 md:text-base">{description}</p>
    </motion.div>
  );
}
