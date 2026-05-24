import { Link } from "wouter";
import { ArrowLeft, ArrowRight, MessageCircle, Phone, Star } from "lucide-react";
import { motion } from "framer-motion";
import AreaPostCard from "@/components/AreaPostCard";
import { majangPosts, majangReviews } from "@/data/areas/majang";
import { useAreaPosts } from "@/hooks/useAreaPosts";

export default function MajangAreaPage() {
  const { posts } = useAreaPosts("majang", majangPosts);

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
            <p className="text-xs md:text-sm font-bold tracking-[0.35em] text-primary mb-4">
              AREA ARCHIVE
            </p>

            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold leading-[1.18] text-foreground mb-4">
                  마장면의 깨끗한 일상을 만들고 있습니다
                </h1>
                <p className="max-w-2xl text-base text-muted-foreground leading-relaxed">
                  부부가 직접, 마장면 빌라·원룸·상가 공용공간을 관리합니다.
                </p>
              </div>

              <div className="inline-flex w-fit items-center rounded-full bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm">
                최근 작업 15건
              </div>
            </div>
          </div>
        </motion.div>

        <section className="mb-12 md:mb-16">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-foreground">
                마장면 작업 기록
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                최근 작업 지역을 기준으로 업데이트됩니다.
              </p>
            </div>

            <Link href="/records?area=majang">
              <a className="hidden md:inline-flex items-center text-sm font-bold text-primary hover:opacity-80 transition">
                전체 보기
                <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {posts.map((post, index) => (
              <AreaPostCard key={`${post.title}-${post.date}-${index}`} post={post} index={index} />
            ))}
          </div>
        </section>

        <section className="mb-12 md:mb-16">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-foreground">고객 후기</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                마장면 관리 현장에서 받은 실제 피드백입니다.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {majangReviews.map((review) => (
              <div key={review} className="rounded-[1.5rem] border border-blue-100 bg-white p-6 shadow-sm">
                <div className="mb-3 flex items-center gap-1 text-yellow-400">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-base leading-relaxed text-foreground">“{review}”</p>
                <p className="mt-4 text-sm text-muted-foreground">마장면 건물주 후기</p>
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-7 text-center shadow-sm md:p-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-3">
            마장면 청소 관리가 필요하신가요?
          </h2>
          <p className="text-muted-foreground mb-8">정기관리·일회성 청소 모두 문의 가능합니다.</p>
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
