import { Link } from "wouter";
import { ArrowLeft, ClipboardList, MessageCircle, Phone, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "하청 없이 직접 관리",
    text: "상담부터 현장 확인, 작업 기록까지 부부가 직접 챙겨 관리 기준이 흐려지지 않게 합니다.",
  },
  {
    icon: ClipboardList,
    title: "사진과 기록으로 남기는 관리",
    text: "말로만 끝나는 청소가 아니라 현장 상태와 작업 내용을 기록해 건물주님이 확인하기 쉽게 남깁니다.",
  },
  {
    icon: Sparkles,
    title: "반짝보다 꾸준함",
    text: "한 번 반짝이게 만드는 것보다 계속 깨끗하게 유지되는 상태를 더 중요하게 봅니다.",
  },
];

const roles = [
  {
    label: "현장 관리",
    name: "남편",
    text: "계단, 복도, 공동현관, 유리 등 현장 상태를 직접 보고 필요한 관리 범위를 판단합니다.",
  },
  {
    label: "상담·기록·운영",
    name: "아내",
    text: "문의 응대, 일정 조율, 작업 기록 정리를 맡아 관리 과정이 놓치지 않고 이어지도록 챙깁니다.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
      <Navbar />

      <main>
        <section className="container max-w-6xl pt-24 pb-16 md:pt-32 md:pb-24">
          <motion.div
            className="mb-10 md:mb-14"
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

            <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_320px] md:items-center">
              <div>
                <p className="mb-4 text-xs font-bold tracking-[0.35em] text-primary md:text-sm">
                  ABOUT US
                </p>
                <h1 className="mb-5 text-3xl font-extrabold leading-[1.14] text-foreground md:text-5xl">
                  이천계단지기는 부부가 직접 관리합니다
                </h1>
                <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                  청소를 맡기는 일은 단순히 깨끗함만 보는 일이 아니라고 생각합니다. 누가 오고, 어떻게 관리하고, 문제가 생기면 누가 책임지는지까지 믿을 수 있어야 합니다.
                </p>
              </div>

              <div className="rounded-[1.75rem] border border-blue-100 bg-white p-7 text-center shadow-sm">
                <img
                  src="/booboo.webp"
                  alt="이천계단지기 부부 캐릭터"
                  className="mx-auto mb-5 w-40 md:w-48"
                  loading="lazy"
                />
                <p className="text-sm font-bold text-primary">직접 상담하고 직접 관리합니다</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  처음 문의부터 작업 후 기록까지, 같은 사람이 계속 챙기는 관리가 이천계단지기의 기준입니다.
                </p>
              </div>
            </div>
          </motion.div>

          <section className="mb-12 grid gap-4 md:mb-16 md:grid-cols-3">
            {trustPoints.map((point) => {
              const Icon = point.icon;

              return (
                <div key={point.title} className="rounded-[1.5rem] border border-blue-100 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="mb-2 text-lg font-extrabold text-foreground">{point.title}</h2>
                  <p className="text-sm leading-7 text-muted-foreground">{point.text}</p>
                </div>
              );
            })}
          </section>

          <section className="mb-12 overflow-hidden rounded-[1.75rem] border border-blue-100 bg-white shadow-sm md:mb-16">
            <div className="grid gap-0 md:grid-cols-[0.85fr_1.15fr]">
              <div className="bg-blue-50/60 p-7 md:p-10">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-sm">
                  <UsersRound className="h-5 w-5" />
                </div>
                <h2 className="mb-3 text-2xl font-extrabold text-foreground md:text-3xl">부부가 나누어 맡는 일</h2>
                <p className="text-sm leading-7 text-muted-foreground md:text-base">
                  현장과 운영이 따로 놀지 않도록, 서로 확인하고 기록하며 관리합니다.
                </p>
              </div>

              <div className="grid gap-4 p-7 md:p-10">
                {roles.map((role) => (
                  <div key={role.label} className="rounded-[1.25rem] border border-blue-100 bg-white p-5 shadow-sm">
                    <p className="mb-2 text-xs font-extrabold text-primary">{role.label}</p>
                    <h3 className="mb-2 text-xl font-extrabold text-foreground">{role.name}</h3>
                    <p className="text-sm leading-7 text-muted-foreground">{role.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mb-12 rounded-[1.75rem] border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-7 shadow-sm md:mb-16 md:p-10">
            <p className="mb-3 text-sm font-extrabold text-primary">작업 철학</p>
            <h2 className="mb-4 text-2xl font-extrabold leading-snug text-foreground md:text-3xl">
              한 번 반짝이는 청소보다, 꾸준히 관리되는 상태를 만듭니다
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
              공용공간은 매일 사람이 지나가는 곳이라 금방 다시 더러워질 수 있습니다. 그래서 이천계단지기는 보여주기식 청소보다 건물의 사용량과 오염 상태에 맞춰 꾸준히 유지되는 관리를 더 중요하게 생각합니다.
            </p>
          </section>

          <section className="overflow-hidden rounded-[2rem] border border-blue-100 bg-white p-7 text-center shadow-sm md:p-12">
            <h2 className="mb-3 text-2xl font-extrabold text-foreground md:text-3xl">우리 건물도 직접 관리가 필요하신가요?</h2>
            <p className="mb-8 text-sm leading-7 text-muted-foreground md:text-base">
              건물 사진이나 현재 상태를 보내주시면 관리 가능 범위부터 편하게 안내드릴게요.
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
