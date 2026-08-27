import { Link } from "wouter";
import { ArrowLeft, MessageCircle, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import FaqSection from "@/components/FaqSection";
import InfoPageHero from "@/components/InfoPageHero";

export default function Qna() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        <section className="container max-w-4xl px-5 pb-12 pt-8 md:pb-16 md:pt-12">
          <InfoPageHero
            eyebrow="QNA"
            title={<>자주 묻는 질문을<br />먼저 정리해두었습니다</>}
            description="정기관리, 작업 범위, 초도청소 후 청소 전후 사진 제공, 세금계산서처럼 문의 전 많이 물어보시는 내용을 모았습니다."
          />
          <div className="mt-6">
            <Link href="/">
              <a className="inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:translate-x-0.5">
                <ArrowLeft className="h-4 w-4" />
                메인으로 돌아가기
              </a>
            </Link>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
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
          </div>
        </section>

        <FaqSection />
      </main>

    </div>
  );
}
