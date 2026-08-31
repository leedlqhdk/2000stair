import { useMemo, useState } from "react";
import { Link } from "wouter";
import { MessageCircle, Phone } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import InfoPageHero from "@/components/InfoPageHero";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";

const CATEGORIES = ["전체", "청소 방법", "관리 주기", "비용·업체", "계약·견적"] as const;

type Category = (typeof CATEGORIES)[number];

function getCategory(title: string): Category {
  if (/계약|견적서|체크리스트/.test(title)) return "계약·견적";
  if (/주기|정기/.test(title)) return "관리 주기";
  if (/비용|업체|총정리|추천/.test(title)) return "비용·업체";
  return "청소 방법";
}

export default function Guide() {
  const { data, isPending } = trpc.blog.listLite.useQuery(
    { limit: 50, offset: 0 },
    { staleTime: 5 * 60_000 }
  );
  const [selected, setSelected] = useState<Category>("전체");

  const guides = useMemo(
    () =>
      (data?.posts ?? []).map((post) => ({
        id: String(post.id),
        title: post.title,
        thumbnail: post.thumbnail || "",
        category: getCategory(post.title),
        href: `/blog/${post.id}`,
      })),
    [data?.posts]
  );

  // 글이 있는 카테고리만 칩으로 노출
  const visibleCategories = useMemo(
    () => CATEGORIES.filter((category) => category === "전체" || guides.some((guide) => guide.category === category)),
    [guides]
  );

  const filtered = selected === "전체" ? guides : guides.filter((guide) => guide.category === selected);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container max-w-4xl px-5 pb-20 pt-8 md:pb-28 md:pt-12">
        <div className="mx-auto">
          <InfoPageHero
            eyebrow="STAIR CARE GUIDE"
            title={
              <>
                계단 관리의 모든 정보,
                <br />
                쉽고 정확하게 정리했습니다.
              </>
            }
            description="필요한 정보를 원하는 주제로 빠르게 찾아보세요."
          />
        </div>

        {/* 카테고리 칩 */}
        <div className="mt-6 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {visibleCategories.map((category) => {
            const isActive = selected === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelected(category)}
                aria-pressed={isActive}
                className={`flex-shrink-0 rounded-full px-4 py-2 text-xs font-extrabold transition-all md:text-sm ${
                  isActive ? "bg-primary text-white shadow-sm" : "bg-blue-50 text-primary hover:bg-primary/10"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* 글 카드 리스트 */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {isPending ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
                <Skeleton className="aspect-[4/3] w-full rounded-none" />
              </div>
            ))
          ) : filtered.length === 0 ? (
            <p className="py-12 text-center text-sm font-semibold text-muted-foreground">
              {selected === "전체" ? "등록된 관리정보가 아직 없습니다." : `${selected} 관련 글이 아직 없습니다.`}
            </p>
          ) : (
            filtered.map((guide, index) => (
              <motion.div
                key={guide.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3) }}
              >
                <Link href={guide.href}>
                  <a aria-label={`${guide.title} 정보글 보기`} className="group block overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                    <img
                      src={guide.thumbnail || "/images/blog-banner-main.png"}
                      alt={`${guide.title} 정보글 보기`}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </a>
                </Link>
              </motion.div>
            ))
          )}
        </div>

        {/* 상담 CTA */}
        <div className="mt-12 rounded-3xl bg-primary p-6 text-center text-white md:p-8">
          <h2 className="text-lg font-extrabold md:text-xl">궁금한 점이 있으신가요?</h2>
          <p className="mt-1.5 text-sm text-white/75">전화/카톡으로 빠르게 답변드릴게요.</p>
          <div className="mx-auto mt-5 grid max-w-sm grid-cols-2 gap-2.5">
            <a
              href="tel:01084381887"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-primary"
            >
              <Phone className="h-4 w-4" />
              전화문의
            </a>
            <a
              href="https://pf.kakao.com/_IiNfn/chat"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#FEE500] px-4 py-3 text-sm font-extrabold text-[#3a2929]"
            >
              <MessageCircle className="h-4 w-4" />
              카카오톡 상담
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
