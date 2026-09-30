import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/data/faqs";


export default function FaqSection() {
  return (
    <section className="border-y border-blue-100 bg-white py-16 md:py-24">

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
