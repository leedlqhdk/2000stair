import { Link } from "wouter";
import { ArrowLeft, MessageCircle, Phone, Star } from "lucide-react";
import { motion } from "framer-motion";
import AreaTimeline from "@/components/AreaTimeline";
import { daewolPosts, daewolReviews } from "@/data/areas/daewol";
import { useAreaPosts } from "@/hooks/useAreaPosts";

export default function DaewolAreaPage() {
  const { posts } = useAreaPosts("daewol", daewolPosts);

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
            <a className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-primary hover:opacity-80 transition">
              <ArrowLeft className="h-4 w-4" />
              관리지역으로 돌아가기
            </a>
          </Link>

          <div className="rounded-[1.5rem] border border-blue-100 bg-white p-6 shadow-sm md:p-8">
            <p className="mb-4 text-xs font-bold tracking-[0.35em] text-primary md:text-sm">
              AREA ARCHIVE
            </p>
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="mb-4 text-3xl font-extrabold leading-[1.18] text-foreground md:text-4xl">
                  대월면의 공용공간을 꾸준히 관리합니다
                </h1>
                <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
                  부부가 직접, 대월면 빌라·원룸·상가 공용공간을 관리합니다.
                </p>
              </div>
              <div className="inline-flex w-fit items-center rounded-full bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm">
                최근 작업 {posts.length}건
              </div>
            </div>
          </div>
        </motion.div>

        <AreaTimeline
          areaName="대월면"
          areaSlug="daewol"
          posts={posts}
          title="대월면 작업 일지"
          description="대월면에서 진행한 작업들을 날짜순으로 확인해보세요."
        />

        <section className="mb-12 md:mb-16">
          <div className="mb-5">
            <h2 className="text-xl font-extrabold text-foreground md:text-2xl">고객 후기</h2>
            <p className="mt-1 text-sm text-muted-foreground">대월면 관리 현장에서 받은 실제 피드백입니다.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {daewolReviews.map((review) => (
              <div key={review} className="rounded-[1.5rem] border border-blue-100 bg-white p-6 shadow-sm">
                <div className="mb-3 flex items-center gap-1 text-yellow-400">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-base leading-relaxed text-foreground">“{review}”</p>
                <p className="mt-4 text-sm text-muted-foreground">대월면 건물주 후기</p>
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-7 text-center shadow-sm md:p-12">
          <h2 className="mb-3 text-2xl font-extrabold text-foreground md:text-3xl">대월면 청소 관리가 필요하신가요?</h2>
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
