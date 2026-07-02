import { useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import AreaPostCard from "@/components/AreaPostCard";
import Navbar from "@/components/Navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { daewolPosts } from "@/data/areas/daewol";
import { downtownPosts } from "@/data/areas/downtown";
import { majangPosts } from "@/data/areas/majang";
import type { AreaPost } from "@/hooks/useAreaPosts";

const areaLabels: Record<string, string> = {
  majang: "마장면",
  daewol: "대월면",
  sindun: "신둔면",
  gwango: "관고동",
  changjeon: "창전동",
  jungni: "중리동",
  jeungpo: "증포동",
};

const areaRoutes: Record<string, string> = {
  majang: "/area/majang",
  daewol: "/area/daewol",
  sindun: "/area/sindun",
  gwango: "/area/gwango",
  changjeon: "/area/changjeon",
  jungni: "/area/jungni",
  jeungpo: "/area/jeungpo",
};

const fallbackPosts: AreaPost[] = [
  ...majangPosts.map((post) => ({ ...post, area: "majang" })),
  ...daewolPosts.map((post) => ({ ...post, area: "daewol" })),
  ...downtownPosts,
].sort((a, b) => b.date.localeCompare(a.date));

function useAllAreaPosts() {
  return useQuery({
    queryKey: ["area-posts", "all-records"],
    queryFn: async () => {
      const response = await fetch("/api/area-posts?limit=50", { cache: "no-store" });
      if (!response.ok) return [];
      return (await response.json()) as AreaPost[];
    },
    placeholderData: fallbackPosts,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchInterval: 15_000,
    retry: 1,
  });
}

function goToRecords(area: string) {
  window.location.href = area === "all" ? "/records" : areaRoutes[area] ?? "/records";
}

export default function Records() {
  const { data, isPending } = useAllAreaPosts();
  const selectedArea = new URLSearchParams(window.location.search).get("area") ?? "all";

  useEffect(() => {
    if (selectedArea !== "all" && areaRoutes[selectedArea]) {
      window.location.replace(areaRoutes[selectedArea]);
    }
  }, [selectedArea]);

  if (selectedArea !== "all" && areaRoutes[selectedArea]) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
        <Navbar />
      </div>
    );
  }

  const selectedAreaName = areaLabels[selectedArea] ?? "전체";
  const notionPosts = data ?? [];
  const allPosts = notionPosts.length > 0 ? notionPosts : fallbackPosts;
  const posts = selectedArea === "all"
    ? allPosts
    : allPosts.filter((post) => post.area === selectedArea);

  const filterButtonClass = (area: string) =>
    `relative z-20 rounded-full border px-5 py-2.5 text-sm font-extrabold shadow-sm transition-all duration-300 hover:-translate-y-0.5 ${
      selectedArea === area
        ? "border-primary bg-primary text-white shadow-lg shadow-primary/25"
        : "border-blue-100 bg-white text-primary hover:border-primary/30 hover:bg-blue-50 hover:shadow-md"
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
      <Navbar />
      <main>
        <section className="container max-w-6xl pt-24 pb-16 md:pt-32 md:pb-24">
          <motion.div
            className="mb-9 rounded-[1.5rem] border border-blue-100 bg-white p-6 shadow-sm md:mb-10 md:p-8"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <Link href="/areas">
              <a className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:opacity-80">
                <ArrowLeft className="h-4 w-4" />
                관리지역으로 돌아가기
              </a>
            </Link>

            <p className="mb-4 text-xs font-bold tracking-[0.35em] text-primary md:text-sm">
              FIELD RECORDS
            </p>
            <h1 className="mb-5 text-3xl font-extrabold leading-[1.12] text-foreground md:text-4xl">
              {selectedArea === "all" ? "전체 작업 기록" : `${selectedAreaName} 작업 기록`}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              {selectedArea === "all"
                ? "노션 작업일지를 기준으로 등록된 이천 지역 관리 기록을 한 번에 확인할 수 있습니다."
                : `${selectedAreaName}에 등록된 작업 기록만 모아서 확인할 수 있습니다.`}
            </p>
          </motion.div>

          <div className="relative z-20 mb-8 flex flex-wrap gap-2.5 md:mb-9">
            <button type="button" onClick={() => goToRecords("all")} className={filterButtonClass("all")}>
              전체
            </button>
            {Object.entries(areaLabels).map(([slug, label]) => (
              <button key={slug} type="button" onClick={() => goToRecords(slug)} className={filterButtonClass(slug)}>
                {label}
              </button>
            ))}
          </div>

          {isPending ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="overflow-hidden rounded-[0.95rem] border border-blue-100 bg-white md:rounded-[1.1rem]">
                  <Skeleton className="h-[124px] w-full sm:h-[142px] md:h-[166px] lg:h-[178px]" />
                  <div className="p-3 md:p-4">
                    <Skeleton className="mb-2 h-4 w-4/5" />
                    <Skeleton className="mb-4 h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
              {posts.map((post, index) => (
                <AreaPostCard
                  key={`${post.area}-${post.title}-${post.date}-${index}`}
                  post={post}
                  index={index}
                  areaLabel={post.area ? areaLabels[post.area] ?? post.area : undefined}
                  compact
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-blue-100 bg-white p-8 text-center text-sm font-semibold text-muted-foreground shadow-sm">
              아직 {selectedAreaName}에 등록된 작업 기록이 없습니다.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
