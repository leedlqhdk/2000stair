import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Faq = {
  question: string;
  answer: string;
  image?: { src: string; alt: string };
  links?: { label: string; href: string }[];
};

const faqs: Faq[] = [
  {
    question: "관리사무소나 법인도 계약 가능한가요?",
    answer:
      "네. 관리사무소, 상가, 여러 건물을 보유한 사업자도 상담 가능합니다. 건물 수와 관리 범위를 확인한 뒤 계약서 기준으로 정기관리 조건을 안내드립니다.",
  },
  {
    question: "세금계산서 발행 가능한가요?",
    answer:
      "네. 사업자용 세금계산서 및 현금영수증 발행이 가능합니다. 견적 상담 시 필요 여부를 함께 알려주시면 거래 조건에 맞춰 안내드립니다.",
  },
  {
    question: "정기 작업보고서를 받을 수 있나요?",
    answer:
      "네. 정기관리 현장은 초도청소 후 청소 전후 사진 제공을 기준으로 안내드립니다. 관리사무소나 법인 거래처럼 증빙이 필요한 경우 보고 방식도 상담 단계에서 맞춰드립니다.",
  },
   {
    question: "계단청소 비용은 얼마인가요?",
    answer:
      "건물 층수, 세대 수, 청소 범위(계단만 / 유리·화장실 포함)에 따라 달라집니다. 사진 몇 장과 주소만 카카오톡으로 보내주시면 무료로 견적을 안내해 드립니다. 방문 견적도 부담 없이 가능합니다.",
  },
  {
    question: "견적을 받으면 꼭 계약해야 하나요?",
    answer:
      "아닙니다. 견적은 100% 무료이며, 비교 후 천천히 결정하셔도 됩니다. 영업 전화도 드리지 않습니다.",
  },
  {
    question: "계약 기간은 어떻게 되나요?",
    answer:
      "기본 2년 정기관리 계약이며, 부담스러우시면 1년 계약도 가능합니다. 정기관리는 기간이 길수록 건물 상태가 안정적으로 유지되어, 대부분의 건물주님이 2년을 선택하고 재계약으로 이어지고 있습니다.",
  },
    {
    question: "중도에 해지하면 위약금이 있나요?",
    answer:
      "별도의 위약금은 없습니다. 다만 정기관리 첫 달에는 묵은 때를 제거하는 '초벌 청소'를 일반 청소보다 훨씬 공들여 진행하는데, 이 비용을 정기계약 조건으로 받지 않고 시작합니다. 그래서 중도 해지 시에만 초벌 청소 실비 20만 원을 정산해 주시면 됩니다. 계약 기간을 채우시면 전혀 발생하지 않는 비용입니다.",
  },
  {
    question: "이천 외 지역도 가능한가요?",
    answer:
      "현재는 신둔면, 마장면, 부발읍, 증포동, 중리동, 관고동, 대월면을 중심으로 안내드립니다. 이 외 지역은 주소와 사진을 보내주시면 방문 가능 여부를 먼저 확인해드릴게요.",
  },
  {
    question: "어떤 세제를 사용하나요? 아이가 있는 빌라인데 괜찮을까요?",
    answer:
      "거주자 건강을 생각해 친환경 세제를 사용합니다. 아이나 어르신이 계신 건물에서도 안심하고 맡기실 수 있고, 독한 약품 냄새가 남지 않습니다.",
    image: {
      src: "/images/kiehl-detergents.webp",
      alt: "이천계단지기가 사용하는 독일 Kiehl 친환경 세제",
    },
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
    <section className="border-y border-blue-100 bg-white py-16 md:py-24">
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
            자주 묻는 질문
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            건물주분들이 가장 많이 문의하시는 질문입니다.
          </p>
        </motion.div>

        <motion.div
          className="rounded-2xl border border-blue-100 bg-white px-5 shadow-[0_12px_34px_rgba(15,23,42,0.04)] md:px-7"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.08 }}
        >
          <Accordion
  type="single"
  collapsible
  defaultValue={faqs[0].question}
  className="w-full"
>
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.question}
                value={faq.question}
                className="border-blue-100"
              >
                <AccordionTrigger className="py-4 text-left text-[15px] font-extrabold leading-snug text-foreground hover:no-underline md:py-5 md:text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent forceMount className="max-w-3xl pb-5 pr-3 text-sm leading-6 text-muted-foreground md:text-[15px] md:leading-7">
                  {faq.answer}
                  {faq.image && (
                    <img
                      src={faq.image.src}
                      alt={faq.image.alt}
                      loading="lazy"
                      className="mt-4 w-full max-w-md rounded-2xl border border-blue-100 object-cover shadow-sm"
                    />
                  )}
                  {faq.links && faq.links.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {faq.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-4 py-2 text-sm font-extrabold text-primary transition hover:bg-primary hover:text-white"
                        >
                          {link.label}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
