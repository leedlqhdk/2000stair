import { motion } from "framer-motion";
import DesktopHomeConcerns from "@/components/DesktopHomeConcerns";

export default function CustomerConcernsSection() {
  return (
    <section className="border-y border-blue-100/70 bg-[#fbfdff] py-10 md:py-12">
      <div className="container max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-extrabold tracking-[0.3em] text-primary">CUSTOMER CONCERN</p>
          <h2 className="break-keep text-3xl font-extrabold leading-tight text-foreground md:text-5xl">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              기존 관리는
            </motion.span>
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              왜 아쉬웠을까요?
            </motion.span>
          </h2>
        </div>

        <div className="mx-auto mt-7 max-w-3xl md:mt-8">
          <DesktopHomeConcerns startDelay={1300} />
        </div>
      </div>
    </section>
  );
}
