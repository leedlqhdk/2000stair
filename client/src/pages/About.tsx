import { Link } from "wouter";
import { ArrowLeft, Camera, MessageCircle, Phone } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const values = [
  {
    title: "같은 사람이 방문합니다",
    text: "처음 확인한 오염 상태와 건물 특성을 기억하고 이어서 관리합니다.",
  },
  {
    title: "작업 기록을 남깁니다",
    text: "관리 전후 사진으로 멀리 있어도 현장 상태를 확인하실 수 있습니다.",
  },
  {
    title: "하청 없이 직접 합니다",
    text: "상담부터 방문, 작업 기록까지 부부가 직접 챙깁니다.",
  },
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
  부부 직영,<br />
  함께 관리합니다
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

         <section className="mb-16 md:mb-24">
  <p className="mb-3 text-sm font-extrabold text-primary">
    DIRECT MANAGEMENT
  </p>

  <h2 className="mb-5 text-2xl font-extrabold leading-snug text-foreground md:text-4xl">
    처음 왔던 사람이 다음 관리도 직접 방문해야,
    <br className="hidden md:block" />
    건물 상태를 꾸준히 볼 수 있다고 생각합니다.
  </h2>

  <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
    계단청소는 한 번 깨끗하게 만드는 것보다,
    오염이 다시 쌓이지 않도록 꾸준히 관리하는 일이 더 중요합니다.
    그래서 이천계단지기는 상담부터 작업, 기록까지 직접 챙깁니다.
  </p>
</section>
          <section className="mb-16 md:mb-24">
  <div className="mb-6">
    <p className="mb-2 text-sm font-extrabold text-primary">
      WHO WE ARE
    </p>
    <h2 className="text-2xl font-extrabold text-foreground md:text-4xl">
      현장과 기록을 나누어 꼼꼼히 봅니다
    </h2>
  </div>

  <div className="grid gap-4 md:grid-cols-2">
    <div className="relative min-h-[220px] overflow-hidden rounded-[1.5rem] bg-white border border-blue-100 shadow-sm p-6 md:p-7">
      <img
        src="/character-husband.png"
        alt="현장 관리 남편 캐릭터"
        className="absolute bottom-4 right-4 w-24 md:w-28"
        loading="lazy"
      />

      <p className="mb-2 text-xs font-extrabold tracking-[0.18em] text-primary">
        FIELD
      </p>
      <h3 className="mb-3 text-2xl font-extrabold text-foreground">
        현장관리
      </h3>
      <p className="max-w-[68%] text-sm leading-7 text-muted-foreground">
        계단, 복도, 공동현관, 유리 상태를 직접 확인하고 관리합니다.
      </p>
    </div>

    <div className="relative min-h-[220px] overflow-hidden rounded-[1.5rem] bg-white border border-blue-100 shadow-sm p-6 md:p-7">
      <img
        src="/character-wife.png"
        alt="상담 기록 아내 캐릭터"
        className="absolute bottom-4 right-4 w-24 md:w-28"
        loading="lazy"
      />

      <p className="mb-2 text-xs font-extrabold tracking-[0.18em] text-primary">
        RECORD
      </p>
      <h3 className="mb-3 text-2xl font-extrabold text-foreground">
        상담·기록
      </h3>
      <p className="max-w-[68%] text-sm leading-7 text-muted-foreground">
        문의 응대, 일정 조율, 작업 전후 사진 기록을 정리합니다.
      </p>
    </div>
  </div>
</section>

          <section className="rounded-[2rem] bg-white border border-blue-100 shadow-sm px-6 py-10 text-center md:px-10 md:py-14">
  <img
    src="/booboo.webp"
    alt="이천계단지기 부부 캐릭터"
    className="mx-auto mb-4 w-24 md:w-32"
    loading="lazy"
  />

  <h2 className="mb-3 text-2xl font-extrabold text-foreground md:text-3xl">
    사진 한 장이면 빠르게 안내드립니다
  </h2>

  <p className="mb-8 text-sm leading-7 text-muted-foreground md:text-base">
    계단, 복도, 공동현관 사진을 보내주시면 관리 가능 범위와 상담을 편하게 안내드릴게요.
  </p>

  <div className="mx-auto grid max-w-xl gap-3 sm:grid-cols-2">
    <a
      href="https://pf.kakao.com/_IiNfn/chat"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
    >
      카카오톡 문의하기
    </a>

    <a
      href="tel:01084381887"
      className="inline-flex items-center justify-center rounded-xl border border-primary/20 bg-white px-6 py-4 text-sm font-bold text-primary transition hover:bg-blue-50"
    >
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
