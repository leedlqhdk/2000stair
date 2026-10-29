import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { daewolPosts } from "@/data/areas/daewol";
import { downtownPosts } from "@/data/areas/downtown";
import { majangPosts } from "@/data/areas/majang";
import type { AreaPost } from "@/hooks/useAreaPosts";
import { getWorkSlug } from "@/lib/workSlug";

export const fallbackWorkPosts: AreaPost[] = [
  ...majangPosts.map((post) => ({ ...post, area: "majang" })),
  ...daewolPosts.map((post) => ({ ...post, area: "daewol" })),
  ...downtownPosts,
].sort((a, b) => b.date.localeCompare(a.date));

export function mergeWorkPosts(posts: AreaPost[] = []) {
  const seenSlugs = new Set(posts.map(getWorkSlug));
  const missingFallbackPosts = fallbackWorkPosts.filter((post) => !seenSlugs.has(getWorkSlug(post)));

  return [...posts, ...missingFallbackPosts].sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * @param live true면 작업일지 페이지처럼 15초마다 다시 불러와 새 노션 글을 바로 보여준다.
 *   홈처럼 방문자가 많은 곳은 false로 한 번만 불러와 노션 요청을 줄인다.
 */
export function useAllWorkPosts(queryScope = "all", { live = true }: { live?: boolean } = {}) {
  const query = useQuery({
    queryKey: ["area-posts", queryScope],
    queryFn: async () => {
      const response = await fetch("/api/area-posts?limit=50", { cache: "no-store" });
      if (!response.ok) return [];
      return (await response.json()) as AreaPost[];
    },
    placeholderData: fallbackWorkPosts,
    staleTime: live ? 0 : 5 * 60_000,
    refetchOnMount: live ? "always" : true,
    refetchOnWindowFocus: live,
    refetchInterval: live ? 15_000 : false,
    retry: 1,
  });

  const posts = useMemo(() => mergeWorkPosts(query.data ?? []), [query.data]);

  return {
    posts,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
  };
}
