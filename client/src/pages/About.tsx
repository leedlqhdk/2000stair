import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import MobileAbout from "@/components/MobileAbout";
import SeoIntroSection from "@/components/SeoIntroSection";
import BlogPostCards from "@/components/BlogPostCards";

const values = [
  { title: "같은 사람이 봅니다", text: "건물 상태를 기억하고 이어서 관리합니다." },
  { title: "사진으로 남깁니다", text: "관리 전후를 기록해 확인하기 쉽게 합니다." },
  { title: "직접 관리합니다", text: "상담부터 방문까지 부부가 직접 챙깁니다." },
];

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
      <Navbar />

      <main>
        <MobileAbout />

        <section className="hidden container max-w-6xl pt-24 pb-16 md:block md:pt-32 md:pb-24">
          <motion.section
            className="mb-14 overflow-hidden rounded-[2rem] border border-blue-100 bg-white p-7 shadow-sm md:mb-20 md:p-10"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <div className="grid items-center gap-8 md:grid-cols-[0.9fr_1.1fr]">
              <div>
                <Link href="/">
                  <a className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-bold text-primary shadow-sm transition hover:border-primary/40 hover:bg-blue-50">
                    <ArrowLeft className="h-4 w-4" />
                    메인으로 돌아가기
                  </a>
                </Link>
                <p className="mb-4 text-xs font-bold tracking-[0.25em] text-primary md:text-sm">ABOUT</p>
                <h1 className="mb-5 text-[2.4rem] font-extrabold leading-[1.18] text-foreground md:text-5xl">
                  부부 직영,<br />함께 관리합니다
                </h1>
                <p className="max-w-sm text-base leading-8 text-muted-foreground md:max-w-md md:text-base">
                  계단청소는 한 번보다 꾸준함이 중요합니다. 처음 확인한 건물 상태를 기억하고 이어서 관리합니다.
                </p>
              </div>
              <div className="flex justify-center md:justify-end">
                <img src="/booboo.webp" alt="이천계단지기 부부 캐릭터" className="w-[92vw] max-w-[420px] md:w-[360px]" loading="lazy" />
              </div>
            </div>
          </motion.section>

        

          <section className="mb-14 rounded-[2rem] bg-blue-50/70 px-6 py-10 md:mb-20 md:px-10 md:py-14">
  <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
    <div className="grid grid-cols-2 gap-4 sm:gap-5">
      <div className="flex aspect-square items-center justify-center rounded-[1.7rem] border border-blue-100 bg-white p-5 shadow-sm shadow-blue-950/5">
        <img src="/character-husband.png" alt="현장 관리 남편 캐릭터" className="h-full w-full object-contain" loading="lazy" />
      </div>
      <div className="flex aspect-square items-center justify-center rounded-[1.7rem] border border-blue-100 bg-white p-5 shadow-sm shadow-blue-950/5">
        <img src="/character-wife.png" alt="상담 기록 아내 캐릭터" className="h-full w-full object-contain" loading="lazy" />
      </div>
    </div>

    <div>
      <p className="mb-3 text-sm font-extrabold tracking-[0.18em] text-primary">WHO WE ARE</p>
      <h2 className="text-3xl font-extrabold leading-tight text-foreground md:text-4xl">
        부부 직영 마스코트
      </h2>
      <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground md:text-lg md:leading-9">
        부부가 직접 관리한다는 핵심 메시지를 담은 캐릭터입니다. 현장 관리와 상담 기록을 나누어 맡는 이천계단지기의 방식을 친근하게 전달합니다.
      </p>
    </div>
  </div>
</section>

          <section className="mb-14 md:mb-20">
            <div className="mx-auto mb-7 max-w-2xl text-center">
              <p className="mb-2 text-sm font-extrabold text-primary">OUR STANDARD</p>
              <h2 className="text-2xl font-extrabold text-foreground md:text-4xl">저희가 지키는 기준</h2>
            </div>
            <div className="grid gap-6 text-center md:grid-cols-3">
              {values.map((value) => (
                <div key={value.title} className="border-t border-blue-100 pt-5">
                  <h3 className="mb-2 text-lg font-extrabold text-foreground">{value.title}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">{value.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-blue-100 bg-white px-6 py-10 shadow-sm md:px-10 md:py-14">
            <div className="mb-8 text-center">
              <img src="/booboo2.webp" alt="이천계단지기 부부 캐릭터" className="mx-auto mb-5 w-56 md:w-48" loading="lazy" />
              <p className="mb-2 text-sm font-extrabold text-primary">FIELD ARCHIVE</p>
              <h2 className="mb-3 text-2xl font-extrabold text-foreground md:text-3xl">실제 작업 기록도 확인해보세요</h2>
              <p className="text-sm leading-7 text-muted-foreground md:text-base">이천계단지기의 현장 기록은 네이버 블로그에 꾸준히 남기고 있습니다.</p>
            </div>
            <BlogPostCards />
          </section>
        </section>

        <div className="hidden md:block">
          <SeoIntroSection />
        </div>
      </main>

    </div>
  );
}
