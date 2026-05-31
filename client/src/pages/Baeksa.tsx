import { Link } from "wouter";
import { ArrowLeft, CheckCircle2, MessageCircle, Phone, Star } from "lucide-react";
import { motion } from "framer-motion";
import AreaTimeline from "@/components/AreaTimeline";
import { useAreaPosts, type AreaPost } from "@/hooks/useAreaPosts";

const fallbackPosts: AreaPost[] = [];

const serviceCards = [
  {
    title: "관리 대상",
    text: "백사면 빌라, 다세대, 원룸, 상가 건물의 계단·복도·공동현관을 관리합니다.",
  },
  {
    title: "청소 범위",
    text: "계단 바닥, 난간, 공동현관, 유리문, 우편함 주변처럼 눈에 잘 띄는 공용부를 확인합니다.",
  },
  {
    title: "진행 방식",
    text: "건물 사진을 먼저 확인한 뒤 오염도, 층수, 관리 주기에 맞춰 작업 범위를 안내합니다.",
  },
];

const reviews = [
  "건물 입구와 계단이 정리되니 첫인상이 훨씬 좋아졌습니다.",
  "정기적으로 관리 방향을 알려주셔서 믿고 맡길 수 있었습니다.",
];

const faqs = [
  {
    question: "백사면도 정기관리 가능한가요?",
    answer: "가능합니다. 모전리, 조읍리, 현방리 등 백사면 주요 지역은 주소와 사진 확인 후 관리 가능 여부를 안내드립니다.",
  },
  {
    question: "작업 전 방문 견적이 필요한가요?",
    answer: "사진만으로 1차 안내가 가능하고, 오염도나 범위 확인이 필요한 경우 방문 일정을 조율합니다.",
  },
];

export default function BaeksaAreaPage() {
  const { posts } = useAreaPosts("baeksa", fallbackPosts);

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

          <div className="overflow-hidden rounded-[1.75rem] border border-blue-100 bg-white shadow-sm">
            <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="p-6 md:p-8">
                <p className="mb-4 text-xs font-bold tracking-[0.35em] text-primary md:text-sm">
                  AREA ARCHIVE
                </p>
                <h1 className="mb-4 text-3xl font-extrabold leading-[1.18] text-foreground md:text-4xl">
                  백사면 작업 기록과 공용공간 관리를 준비하고 있습니다
                </h1>
                <p className="max-w-2xl text-base leading-8 text-muted-foreground">
                  백사면 빌라·원룸·상가 공용공간 관리 기록을 정리하고 있습니다. 작업 기록은 업데이트 중이며, 상담과 견적 안내는 바로 가능합니다.
                </p>
              </div>
              <div className="border-t border-blue-100 bg-blue-50/70 p-6 lg:border-l lg:border-t-0 md:p-8">
                <p className="text-sm font-extrabold text-primary">상담 전 보내주시면 좋은 사진</p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                  <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />계단과 복도 전체</li>
                  <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />공동현관과 유리문</li>
                  <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />먼지·얼룩이 많은 구간</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        <section className="mb-12 grid gap-4 md:grid-cols-3 md:mb-16">
          {serviceCards.map((card) => (
            <div key={card.title} className="rounded-[1.5rem] border border-blue-100 bg-white p-6 shadow-sm">
              <p className="mb-3 text-sm font-extrabold text-primary">{card.title}</p>
              <p className="text-sm leading-7 text-muted-foreground">{card.text}</p>
            </div>
          ))}
        </section>

        <AreaTimeline
          areaName="백사면"
          areaSlug="baeksa"
          posts={posts}
          title="백사면 작업 일지"
          description="백사면 현장 사진은 정리되는 순서대로 작업 일지에 추가됩니다."
          emptyMessage="백사면 작업 기록은 사진 정리 후 순서대로 추가할게요. 상담과 견적 안내는 지금도 가능합니다."
        />

        <section className="mb-12 grid gap-4 md:grid-cols-2 md:mb-16">
          {reviews.map((review) => (
            <div key={review} className="rounded-[1.5rem] border border-blue-100 bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-center gap-1 text-yellow-400">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-base leading-relaxed text-foreground">“{review}”</p>
              <p className="mt-4 text-sm text-muted-foreground">백사면 인근 건물 관리 피드백</p>
            </div>
          ))}
        </section>

        <section className="mb-12 rounded-[1.5rem] border border-blue-100 bg-white p-6 shadow-sm md:mb-16 md:p-8">
          <h2 className="mb-5 text-xl font-extrabold text-foreground md:text-2xl">자주 묻는 질문</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl bg-blue-50/70 p-5">
                <h3 className="mb-2 text-sm font-extrabold text-foreground">{faq.question}</h3>
                <p className="text-sm leading-7 text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-7 text-center shadow-sm md:p-12">
          <h2 className="mb-3 text-2xl font-extrabold text-foreground md:text-3xl">백사면 청소 관리가 필요하신가요?</h2>
          <p className="mb-8 text-muted-foreground">계단·복도·공동현관 사진을 보내주시면 관리 가능 범위부터 확인해드립니다.</p>
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
