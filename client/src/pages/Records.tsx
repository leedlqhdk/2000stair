import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import AreaPostCard from "@/components/AreaPostCard";
import Navbar from "@/components/Navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { daewolPosts } from "@/data/areas/daewol";
import { majangPosts } from "@/data/areas/majang";
import type { AreaPost } from "@/hooks/useAreaPosts";

const areaLabels: Record<string, string> = {
  majang: "마장면",
  daewol: "대월면",
  sindun: "신둔면",
  downtown: "시내권",
};

const downtownPosts: AreaPost[] = [
  {
    title: "송정동 빌라 계단청소",
    date: "2026.05.20",
    image: "/images/areas/downtown/downtown-1.jpg",
    area: "downtown",
  },
  {
    title: "관고동 상가건물 관리",
    date: "2026.05.18",
    image: "/images/areas/downtown/downtown-2.jpg",
    area: "downtown",
  },
  {
    title: "관고동 상가 계단 정기청소",
    date: "2026.05.15",
    image: "/images/areas/downtown/downtown-3.jpg",
    area: "downtown",
  },
  {
    title: "송정동 빌라 계단 바닥 정기관리",
    date: "2026.05.12",
    image: "/images/areas/downtown/downtown-4.jpg",
    area: "downtown",
  },
  {
    title: "창전동 연립빌라 공동현관 유리코팅",
    date: "2026.04.19",
    image: "/images/areas/downtown/downtown-5.jpg",
    area: "downtown",
  },
  {
    title: "안흥동 빌라 정기관리",
    date: "2026.04.10",
    image: "/images/areas/downtown/downtown-6.jpg",
    area: "downtown",
  },
];

const fallbackPosts: AreaPost[] = [
  ...majangPosts.map(post => ({ ...post, area: "majang" })),
  ...daewolPosts.map(post => ({ ...post, area: "daewol" })),
  ...downtownPosts,
].sort((a, b) => b.date.localeCompare(a.date));

function useAllAreaPosts() {
  return useQuery({
    queryKey: ["area-posts", "all-records"],
    queryFn: async () => {
      const response = await fetch("/api/area-posts?limit=50");
      if (!response.ok) return [];
      return (await response.json()) as AreaPost[];
    },
    staleTime: 60_000,
    retry: 1,
  });
}

export default function Records() {
  const { data, isLoading } = useAllAreaPosts();
  const notionPosts = data ?? [];
  const notionKeys = new Set(
    notionPosts.map(post => `${post.title}-${post.date}`)
  );
  const posts = [
    ...notionPosts,
    ...fallbackPosts.filter(
      post => !notionKeys.has(`${post.title}-${post.date}`)
    ),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
      <Navbar />
      <main>
        <section className="container max-w-6xl pt-24 pb-16 md:pt-32 md:pb-24">
          <motion.div
            className="mb-10 rounded-[1.5rem] border border-blue-100 bg-white p-6 shadow-sm md:p-8"
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

            <p className="mb-4 text-xs font-bold tracking-[0.35em] text-primary md:text-sm">
              FIELD RECORDS
            </p>
            <h1 className="mb-4 text-3xl font-extrabold leading-[1.12] text-foreground md:text-4xl">
              전체 작업 기록
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
              노션 작업일지와 기존 이천 지역 관리 기록을 한 번에 확인할 수
              있습니다.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-[1.5rem] border border-blue-100 bg-white"
                >
                  <Skeleton className="h-56 w-full" />
                  <div className="p-5">
                    <Skeleton className="mb-3 h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
              {posts.map((post, index) => (
                <AreaPostCard
                  key={`${post.area}-${post.title}-${post.date}-${index}`}
                  post={post}
                  index={index}
                  areaLabel={
                    post.area ? (areaLabels[post.area] ?? post.area) : undefined
                  }
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
