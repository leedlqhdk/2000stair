import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "하청 없이 직접 관리하시나요?",
    answer:
      "네. 이천계단지기는 외주나 하청 없이 부부가 직접 현장을 관리하고 있습니다. 처음 상담부터 작업, 관리까지 직접 진행하기 때문에 건물 상태를 더 꼼꼼하게 확인하고 꾸준히 관리해드릴 수 있습니다.",
  },
  {
    question: "엘리베이터 있는 건물은 추가금 있나요?",
    answer:
      "아니요. 추가금 발생하지 않습니다. 이천계단지기는 계단뿐 아니라 공동현관, 복도, 엘리베이터 내부까지 함께 관리해드립니다. 공동현관 유리코팅 또한 포함입니다.",
  },
  {
    question: "작업 전후 사진도 받을 수 있나요?",
    answer:
      "가능합니다. 요청 주시면 작업 전후가 잘 보이도록 주요 구역을 촬영해 보내드리고, 정기관리 현장은 기록으로 남겨드립니다.",
  },
  {
    question: "세금계산서 발행 가능한가요?",
    answer:
      "네, 발행 가능합니다. 카카오톡 채널로 문의 주신 후 사업자 정보와 이메일을 알려주시면 작업 내용에 맞춰 세금계산서 발행을 도와드립니다.",
  },
  {
    question: "정기관리 주기는 어떻게 정하나요?",
    answer:
      "건물 이용량, 층수, 오염 정도를 보고 주 1회, 주 2회, 월 관리 중에서 맞춰 안내드립니다. 처음에는 현장 상태를 보고 무리 없는 주기로 제안드립니다.",
  },
  {
    question: "세제는 안전한 제품을 사용하나요?",
    answer:
      "네. 이천계단지기는 친환경 해외수입 세제를 사용해 공용공간을 관리합니다. 입주민이 오가는 계단과 복도인 만큼 냄새와 자극은 줄이고, 오염 제거력은 살리는 방식으로 작업합니다.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function FaqSection() {
  return (
    <section className="border-y border-blue-100 bg-gradient-to-b from-blue-50/45 via-white to-blue-50/25 py-16 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="container max-w-5xl">
        <motion.div
          id="faq"
          className="mb-9 scroll-mt-24 md:mb-11 md:scroll-mt-28"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <p className="mb-4 text-sm font-bold tracking-[0.32em] text-primary">
            FAQ
          </p>
          <h2 className="text-[26px] font-extrabold leading-tight text-foreground md:text-[28px]">
            자주 문의주시는 내용
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
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
                <AccordionTrigger className="py-4 text-left text-[15px] font-extrabold leading-snug text-foreground hover:no-underline md:py-5 md:text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="max-w-3xl pb-5 pr-3 text-sm leading-6 text-muted-foreground md:text-[15px] md:leading-7">
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
