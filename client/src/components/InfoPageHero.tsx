import type { ReactNode } from "react";
import { motion } from "framer-motion";

type InfoPageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  variant?: "blue" | "plain";
};

export default function InfoPageHero({ eyebrow, title, description, variant = "blue" }: InfoPageHeroProps) {
  const isPlain = variant === "plain";

  return (
    <motion.div
      className={`relative overflow-hidden rounded-3xl border p-7 md:p-10 ${
        isPlain
          ? "border-blue-100 bg-white text-foreground"
          : "border-transparent bg-gradient-to-br from-primary to-blue-800 text-white"
      }`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
    >
      {!isPlain && <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10" />}
      {!isPlain && <div className="pointer-events-none absolute -bottom-14 right-16 h-36 w-36 rounded-full bg-white/5" />}
      <p className={`mb-3 text-xs font-extrabold tracking-[0.28em] ${isPlain ? "text-primary" : "text-white/60"}`}>
        {eyebrow}
      </p>
      <h1 className="break-keep text-2xl font-extrabold leading-snug md:text-3xl">{title}</h1>
      <p className={`mt-3 text-sm leading-relaxed md:text-base ${isPlain ? "text-muted-foreground" : "text-white/80"}`}>
        {description}
      </p>
    </motion.div>
  );
}
