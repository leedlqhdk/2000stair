import { Link } from "wouter";
import { ArrowLeft, MessageCircle, Phone } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FaqSection from "@/components/FaqSection";

export default function Qna() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
      <Navbar />

      <main>
        <section className="container max-w-6xl pt-24 pb-8 md:pt-32 md:pb-12">
          <motion.div
            className="overflow-hidden rounded-[2rem] border border-blue-100 bg-white p-7 shadow-sm md:p-10"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <Link href="/">
              <a className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-bold text-primary shadow-sm transition hover:border-primary/40 hover:bg-blue-50">
                <ArrowLeft className="h-4 w-4" />
                메인으로 돌아가기
              </a>
            </Link>

            <p className="mb-4 text-xs font-bold tracking-[0.25em] text-primary md:text-sm">
              QNA
            </p>
            <h1 className="mb-5 text-[2.4rem] font-extrabold leading-[1.18] text-foreground md:text-5xl">
              자주 묻는 질문을<br />
              먼저 정리해두었습니다
            </h1>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground">
              정기관리, 작업 범위, 사진 기록, 세금계산서처럼 문의 전 많이 물어보시는 내용을 모았습니다.
              더 궁금한 부분은 사진과 함께 보내주시면 빠르게 안내드릴게요.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://pf.kakao.com/_IiNfn/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                카톡 문의
              </a>
              <a
                href="tel:01084381887"
                className="inline-flex items-center justify-center rounded-xl border border-blue-100 bg-white px-5 py-3 text-sm font-bold text-primary"
              >
                <Phone className="mr-2 h-4 w-4" />
                전화 문의
              </a>
            </div>
          </motion.div>
        </section>

        <FaqSection />
      </main>

      <Footer />
    </div>
  );
}
