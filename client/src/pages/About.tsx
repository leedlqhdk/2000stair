import { Link } from "wouter";
import { ArrowLeft, MessageCircle, Phone } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const values = [
  {
    title: "같은 사람이 봅니다",
    text: "건물 상태를 기억하고 이어서 관리합니다.",
  },
  {
    title: "사진으로 남깁니다",
    text: "관리 전후를 기록해 확인하기 쉽게 합니다.",
  },
  {
    title: "직접 관리합니다",
    text: "상담부터 방문까지 부부가 직접 챙깁니다.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
      <Navbar />

      <main>
        <section className="container max-w-6xl pt-24 pb-16 md:pt-32 md:pb-24">
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

                <p className="mb-4 text-xs font-bold tracking-[0.35em] text-primary md:text-sm">
                  ABOUT
                </p>
                <h1 className="mb-5 text-[2.4rem] font-extrabold leading-[1.18] text-foreground md:text-5xl">
                  부부 직영,<br />
                  함께 관리합니다
                </h1>
                <p className="max-w-sm text-base leading-8 text-muted-foreground md:max-w-md md:text-base">
                  상담부터 현장 관리,
                  작업 기록까지 직접 관리합니다.
                </p>
              </div>

              <div className="flex justify-center md:justify-end">
                <img
                  src="/booboo.webp"
                  alt="이천계단지기 부부 캐릭터"
                  className="w-[92vw] max-w-[420px] md:w-[360px]"
                  loading="lazy"
                />
              </div>
            </div>
          </motion.section>

          <section className="mb-14 md:mb-20">
            <p className="mb-3 text-sm font-extrabold text-primary">
              DIRECT MANAGEMENT
            </p>

            <h2 className="mb-5 text-2xl font-extrabold leading-snug text-foreground md:text-4xl">
              같은 사람이 꾸준히 봅니다
            </h2>

            <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
              계단청소는 한 번보다 꾸준함이 중요합니다. 처음 확인한 건물 상태를 기억하고 이어서 관리합니다.
            </p>
          </section>

          <section className="mb-14 overflow-hidden rounded-[2rem] border border-blue-100 bg-white p-7 shadow-sm md:mb-20 md:p-10">
            <div className="mb-7">
              <p className="mb-2 text-sm font-extrabold text-primary">
                WHO WE ARE
              </p>
              <h2 className="text-2xl font-extrabold text-foreground md:text-4xl">
                역할을 나누어 관리합니다
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-blue-100 bg-white p-7">
                <p className="mb-2 text-xs font-extrabold tracking-[0.18em] text-primary">
                  FIELD
                </p>
                <h3 className="mb-4 text-2xl font-extrabold text-foreground">
                  현장관리
                </h3>
                <p className="mb-6 text-sm leading-8 text-muted-foreground">
                  계단·복도·공동현관을 직접 확인합니다.
                </p>

                <div className="flex justify-center rounded-3xl bg-white py-4">
                  <img
                    src="/character-husband.png"
                    alt="현장 관리 남편 캐릭터"
                    className="w-40 md:w-36"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-blue-100 bg-white p-7">
                <p className="mb-2 text-xs font-extrabold tracking-[0.18em] text-primary">
                  RECORD
                </p>
                <h3 className="mb-4 text-2xl font-extrabold text-foreground">
                  상담·기록
                </h3>
                <p className="mb-6 text-sm leading-8 text-muted-foreground">
                  문의·일정·작업 사진을 정리합니다.
                </p>

                <div className="flex justify-center rounded-3xl bg-white py-4">
                  <img
                    src="/character-wife.png"
                    alt="상담 기록 아내 캐릭터"
                    className="w-40 md:w-36"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="mb-14 md:mb-20">
            <div className="mb-6">
              <p className="mb-2 text-sm font-extrabold text-primary">
                OUR STANDARD
              </p>
              <h2 className="text-2xl font-extrabold text-foreground md:text-4xl">
                저희가 지키는 기준
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {values.map((value) => (
                <div key={value.title} className="border-t border-blue-100 pt-5">
                  <h3 className="mb-2 text-lg font-extrabold text-foreground">
                    {value.title}
                  </h3>
                  <p className="text-sm leading-7 text-muted-foreground">
                    {value.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-blue-100 bg-white px-6 py-10 text-center shadow-sm md:px-10 md:py-14">
            <img
  src="/booboo2.webp"
  alt="이천계단지기 부부 캐릭터"
  className="mx-auto mb-5 w-56 md:w-48"
  loading="lazy"
/>

            <h2 className="mb-3 text-2xl font-extrabold text-foreground md:text-3xl">
              사진 한 장이면 빠르게 안내드립니다
            </h2>

            <p className="mb-8 text-sm leading-7 text-muted-foreground md:text-base">
              계단, 복도, 공동현관 사진을 보내주시면 관리 가능 범위와 상담을 안내드릴게요.
            </p>

            <div className="mx-auto grid max-w-xl gap-3 sm:grid-cols-2">
              <a
                href="https://pf.kakao.com/_IiNfn/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                카카오톡 문의하기
              </a>

              <a
                href="tel:01084381887"
                className="inline-flex items-center justify-center rounded-xl border border-primary/20 bg-white px-6 py-4 text-sm font-bold text-primary transition hover:bg-blue-50"
              >
                <Phone className="mr-2 h-4 w-4" />
                전화 문의하기
              </a>
            </div>
          </section>
        </section>
      </main>

      <Footer />
    </div>
  );
}
