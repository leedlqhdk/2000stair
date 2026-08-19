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

export function useAllWorkPosts(queryScope = "all") {
  const query = useQuery({
    queryKey: ["area-posts", queryScope],
    queryFn: async () => {
      const response = await fetch("/api/area-posts?limit=50", { cache: "no-store" });
      if (!response.ok) return [];
      return (await response.json()) as AreaPost[];
    },
    placeholderData: fallbackWorkPosts,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchInterval: 15_000,
    retry: 1,
  });

  const posts = useMemo(() => mergeWorkPosts(query.data ?? []), [query.data]);

  return {
    posts,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
  };
}
