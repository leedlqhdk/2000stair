import { motion } from "framer-motion";

export default function OwnerStory() {
  return (
    <section className="py-20 md:py-28 bg-secondary/20">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-3xl p-8 md:p-14 shadow-sm border border-border"
        >
          <div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            부부직영 이야기
          </div>

          <h2 className="text-3xl md:text-4xl font-bold leading-tight text-foreground mb-8">
            왜 직접 관리하려고 했을까요?
          </h2>

          <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
            <p>
              건물 청소는 한 번보다 꾸준함이 더 중요하다고 생각했습니다.
            </p>

            <p>
              담당자가 자주 바뀌거나 하청 구조가 반복되면,
              결국 건물 상태가 일정하게 유지되기 어렵다고 느꼈습니다.
            </p>

            <p>
              그래서 이천계단지기는 외주 없이 부부가 직접 방문해
              계단, 공동현관, 유리, 공용공간을 관리하고 있습니다.
            </p>

            <p>
              건물주님이 매번 신경 쓰지 않아도
              "늘 깔끔하게 유지되는 상태"를 만드는 게 목표입니다.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
