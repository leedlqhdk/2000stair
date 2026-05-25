import { Link } from "wouter";
import { ArrowLeft, MessageCircle, Phone } from "lucide-react";
import { motion } from "framer-motion";

export default function BaeksaAreaPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
      <section className="container max-w-6xl pt-24 pb-16 md:pt-32 md:pb-24">
        <motion.div
          className="mb-8 md:mb-10"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <Link href="/areas">
            <a className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:opacity-80">
              <ArrowLeft className="h-4 w-4" />
              관리지역으로 돌아가기
            </a>
          </Link>

          <div className="rounded-[1.5rem] border border-blue-100 bg-white p-6 shadow-sm md:p-8">
            <p className="mb-4 text-xs font-bold tracking-[0.35em] text-primary md:text-sm">
              AREA ARCHIVE
            </p>
            <h1 className="mb-4 text-3xl font-extrabold leading-[1.18] text-foreground md:text-4xl">
              백사면 작업 기록
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
              백사면 빌라·원룸·상가 공용공간 관리 기록을 준비하고 있습니다.
            </p>
          </div>
        </motion.div>

        <section className="mb-12 md:mb-16">
          <div className="rounded-[1.5rem] border border-blue-100 bg-white p-8 text-center shadow-sm md:p-10">
            <img
              src="/booboo.webp"
              alt="이천계단지기 부부 캐릭터"
              className="mx-auto mb-4 w-28 md:w-36"
              loading="lazy"
            />
            <p className="text-base font-extrabold text-foreground md:text-lg">업데이트 중입니다.</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              백사면 작업 기록은 사진 정리 후 순서대로 추가할게요.
            </p>
          </div>
        </section>

        <section className="overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-7 text-center shadow-sm md:p-12">
          <h2 className="mb-3 text-2xl font-extrabold text-foreground md:text-3xl">백사면 청소 관리가 필요하신가요?</h2>
          <p className="mb-8 text-muted-foreground">정기관리·일회성 청소 모두 문의 가능합니다.</p>
          <div className="mx-auto grid max-w-xl gap-3 sm:grid-cols-2">
            <a href="https://pf.kakao.com/_IiNfn/chat" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-4 text-sm font-bold text-white transition hover:opacity-90">
              <MessageCircle className="mr-2 h-4 w-4" />
              카카오톡 문의하기
            </a>
            <a href="tel:01084381887" className="inline-flex items-center justify-center rounded-xl border border-primary/20 bg-white px-6 py-4 text-sm font-bold text-primary transition hover:bg-blue-50">
              <Phone className="mr-2 h-4 w-4" />
              전화 문의하기
            </a>
          </div>
        </section>
      </section>
    </main>
  );
}
