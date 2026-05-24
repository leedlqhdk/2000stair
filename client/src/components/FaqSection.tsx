import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "청소할 때 현장에 없어도 되나요?",
    answer:
      "네, 대부분 현장에 계시지 않아도 작업 가능합니다. 출입 방법과 관리 범위만 미리 확인되면 작업 후 사진으로 상태를 정리해서 보내드립니다.",
  },
  {
    question: "엘리베이터 있는 건물은 비용이 다른가요?",
    answer:
      "건물 구조와 관리 범위에 따라 달라질 수 있습니다. 엘리베이터 내부, 복도, 계단, 현관처럼 함께 관리할 구역을 보고 알맞게 안내드립니다.",
  },
  {
    question: "작업 전후 사진도 받을 수 있나요?",
    answer:
      "가능합니다. 요청 주시면 작업 전후가 잘 보이도록 주요 구역을 촬영해 보내드리고, 정기관리 현장은 기록으로 남겨드립니다.",
  },
  {
    question: "세금계산서 발행 가능한가요?",
    answer:
      "네, 발행 가능합니다. 사업자 정보와 이메일을 알려주시면 작업 내용에 맞춰 세금계산서 발행을 도와드립니다.",
  },
];

export default function FaqSection() {
  return (
    <section id="faq" className="bg-white py-16 md:py-24">
      <div className="container max-w-5xl">
        <motion.div
          className="mb-9 md:mb-11"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <p className="mb-4 text-sm font-bold tracking-[0.32em] text-primary">
            FAQ
          </p>
          <h2 className="text-3xl font-extrabold leading-tight text-foreground md:text-5xl">
            자주 문의주시는 내용
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            문의 전에 많이 물어보시는 내용을 정리했습니다.
          </p>
        </motion.div>

        <motion.div
          className="rounded-2xl border border-blue-100 bg-white px-5 shadow-[0_12px_34px_rgba(15,23,42,0.04)] md:px-7"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.08 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.question}
                value={faq.question}
                className="border-blue-100"
              >
                <AccordionTrigger className="py-5 text-left text-base font-extrabold leading-relaxed text-foreground hover:no-underline md:py-6 md:text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-6 pr-3 text-[15px] leading-7 text-muted-foreground md:max-w-3xl md:text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
