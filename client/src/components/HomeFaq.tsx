import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { homeFaqs } from "@/data/faqs";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: homeFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function HomeFaq() {
  if (homeFaqs.length === 0) return null;

  return (
    <section id="home-faq" className="bg-white py-14 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="container max-w-4xl">
        <motion.div
          className="mb-7 text-center md:mb-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <p className="mb-3 text-sm font-bold tracking-[0.3em] text-primary md:mb-4">FAQ</p>
          <h2 className="text-2xl font-extrabold leading-tight text-foreground md:text-4xl">
            자주 묻는 질문
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground md:mt-4 md:text-lg">
            문의 전에 많이 궁금해하시는 내용을 모았습니다.
          </p>
        </motion.div>

        <motion.div
          className="rounded-2xl border border-blue-100 bg-white px-5 shadow-[0_12px_34px_rgba(15,23,42,0.05)] md:px-7"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.08 }}
        >
          <Accordion type="single" collapsible defaultValue={homeFaqs[0].question} className="w-full">
            {homeFaqs.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question} className="border-blue-100">
                <AccordionTrigger className="py-4 text-left text-[15px] font-extrabold leading-snug text-foreground hover:no-underline md:py-5 md:text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="max-w-3xl pb-5 pr-3 text-sm leading-6 text-muted-foreground md:text-[15px] md:leading-7">
                  {faq.answer}
                  {faq.image && (
                    <img
                      src={faq.image.src}
                      alt={faq.image.alt}
                      loading="lazy"
                      className="mt-4 w-full max-w-md rounded-2xl border border-blue-100 object-cover shadow-sm"
                    />
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <div className="mt-6 flex justify-center">
          <Link
            href="/qna"
            className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-white px-5 py-3 text-sm font-extrabold text-primary shadow-sm transition hover:border-primary/40 hover:bg-blue-50"
          >
            전체 자주 묻는 질문 보기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
