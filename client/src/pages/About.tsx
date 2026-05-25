import { Link } from "wouter";
import { ArrowLeft, Camera, CheckCircle2, ClipboardList, MessageCircle, Phone, ShieldCheck, UserRound, UsersRound } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const values = [
  "꾸준한 관리",
  "기록 남기기",
  "연락 빠르게",
  "동일한 퀄리티",
];

const workStyles = [
  {
    title: "건물 상태를 함께 봅니다",
    text: "바닥만 닦고 끝내지 않고 손이 자주 닿는 난간, 벽면, 모서리 오염까지 같이 확인합니다.",
    image: "/images/icheon-sindun-stair-cleaning.webp",
  },
  {
    title: "현장 사진으로 기록합니다",
    text: "작업 전후 상태를 사진으로 남겨 건물주님이 멀리 있어도 관리 상황을 확인할 수 있게 합니다.",
    image: "/images/icheon-daewol-stair-cleaning.webp",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
      <Navbar />

      <main>
        <section className="container max-w-6xl pt-24 pb-16 md:pt-32 md:pb-24">
          <motion.section
            className="mb-12 grid gap-8 md:mb-16 md:grid-cols-[minmax(0,1fr)_420px] md:items-center"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
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
              <h1 className="mb-5 text-3xl font-extrabold leading-[1.18] text-foreground md:text-5xl">
  하청 없이,<br />
  같은 사람이 꾸준히 관리합니다
</h1>
              <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                이천계단지기는 상담부터 현장 관리, 작업 기록까지 부부가 직접 챙기는 공용공간 관리 서비스입니다.
              </p>
            </div>

            <div className="relative min-h-[360px] md:min-h-[430px]">
              <div className="absolute bottom-0 left-0 w-[68%] rounded-[1.5rem] border border-blue-100 bg-white p-5 text-center shadow-lg">
                <img
                  src="/booboo.webp"
                  alt="이천계단지기 부부 캐릭터"
                  className="mx-auto mb-3 w-28 md:w-36"
                  loading="lazy"
                />
                <p className="text-sm font-extrabold text-primary">직접 상담하고 직접 방문합니다</p>
              </div>
            </div>
          </motion.section>

          <section className="mb-12 rounded-[1.75rem] border border-blue-100 bg-white p-7 shadow-sm md:mb-16 md:p-10">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <p className="mb-3 text-sm font-extrabold text-primary">왜 시작했는지</p>
            <h2 className="mb-4 text-2xl font-extrabold leading-snug text-foreground md:text-3xl">
              하청 구조의 한계를 느껴 직접 관리하기 시작했습니다.
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
              계단은 한 번 깨끗하게 만드는 것보다, 꾸준히 상태를 유지하는 관리가 더 중요합니다.
              <br className="hidden md:block" />
              그래서 저희는 상담부터 작업, 기록까지 직접 챙기는 방식으로 시작했습니다.
            </p>
          </section>

          <section className="mb-12 overflow-hidden rounded-[1.75rem] border border-blue-100 bg-white shadow-sm md:mb-16">
            <div className="grid md:grid-cols-[0.9fr_1.1fr]">
              <div className="bg-blue-50/60 p-7 md:p-10">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-sm">
                  <UsersRound className="h-5 w-5" />
                </div>
                <p className="mb-3 text-sm font-extrabold text-primary">부부 역할</p>
                <h2 className="text-2xl font-extrabold text-foreground md:text-3xl">현장과 운영을 나누어 꼼꼼히 봅니다</h2>
              </div>

              <div className="grid gap-4 p-7 md:grid-cols-2 md:p-10">
                <div className="relative overflow-hidden rounded-[1.25rem] border border-blue-100 bg-white p-5 shadow-sm">
                  <UserRound className="mb-4 h-6 w-6 text-primary" />
                  <img
                    src="/character-husband.png"
                    alt="현장 관리 남편 캐릭터"
                    className="absolute bottom-4 right-4 w-16 opacity-90 md:w-20"
                    loading="lazy"
                  />
                  <p className="mb-2 text-xs font-extrabold text-primary">현장관리</p>
                  <h3 className="mb-2 text-xl font-extrabold text-foreground">남편</h3>
                  <p className="max-w-[72%] text-sm leading-7 text-muted-foreground">계단, 복도, 공동현관, 유리 등 현장을 직접 확인하고 관리합니다.</p>
                </div>

                <div className="relative overflow-hidden rounded-[1.25rem] border border-blue-100 bg-white p-5 shadow-sm">
                  <ClipboardList className="mb-4 h-6 w-6 text-primary" />
                  <img
                    src="/character-wife.png"
                    alt="상담 기록 아내 캐릭터"
                    className="absolute bottom-4 right-4 w-16 opacity-90 md:w-20"
                    loading="lazy"
                  />
                  <p className="mb-2 text-xs font-extrabold text-primary">상담·기록·운영</p>
                  <h3 className="mb-2 text-xl font-extrabold text-foreground">아내</h3>
                  <p className="max-w-[72%] text-sm leading-7 text-muted-foreground">문의 응대, 일정 조율, 작업 기록 정리까지 놓치지 않게 챙깁니다.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12 md:mb-16">
            <div className="mb-5">
              <p className="mb-2 text-sm font-extrabold text-primary">우리가 중요하게 생각하는 것</p>
              <h2 className="text-2xl font-extrabold text-foreground md:text-3xl">믿을 수 있는 관리는 작은 기준에서 시작됩니다</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <div key={value} className="flex items-center gap-3 rounded-[1.25rem] border border-blue-100 bg-white p-5 shadow-sm">
                  <CheckCircle2 className="h-5 w-5 shrink-0 fill-primary text-white" />
                  <p className="font-extrabold text-foreground">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12 md:mb-16">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-sm font-extrabold text-primary">실제 작업 스타일</p>
                <img
  src="/booboo.webp"
  alt="이천계단지기 부부 캐릭터"
  className="mx-auto mb-4 w-24 md:w-32"
  loading="lazy"
/>
                <h2 className="text-2xl font-extrabold text-foreground md:text-3xl">사진으로 확인되는 관리</h2>
              </div>
              <Camera className="hidden h-7 w-7 text-primary md:block" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {workStyles.map((item) => (
                <article key={item.title} className="overflow-hidden rounded-[1.5rem] border border-blue-100 bg-white shadow-sm">
                  <img src={item.image} alt={item.title} className="h-64 w-full object-cover" loading="lazy" />
                  <div className="p-5">
                    <h3 className="mb-2 text-lg font-extrabold text-foreground">{item.title}</h3>
                    <p className="text-sm leading-7 text-muted-foreground">{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-7 text-center shadow-sm md:p-12">
            <h2 className="mb-3 text-2xl font-extrabold text-foreground md:text-3xl">사진 한 장이면 빠르게 안내드립니다</h2>
            <p className="mb-8 text-sm leading-7 text-muted-foreground md:text-base">
              계단, 복도, 공동현관 사진을 보내주시면 관리 가능 범위와 상담을 편하게 안내드릴게요.
            </p>
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

      <Footer />
    </div>
  );
}
