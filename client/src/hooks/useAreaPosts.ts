import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

export type AreaPost = {
  id?: string;
  title: string;
  date: string;
  image: string;
  images?: string[];
};

export function useAreaPosts(area: string, fallbackPosts: AreaPost[]) {
  const query = useQuery({
    queryKey: ["area-posts", area],
    queryFn: async () => {
      const response = await fetch(`/api/area-posts?area=${encodeURIComponent(area)}&limit=24`);
      if (!response.ok) return [];
      return (await response.json()) as AreaPost[];
    },
    staleTime: 60_000,
    retry: 1,
  });

  const posts = useMemo(() => {
    const notionPosts = query.data ?? [];
    if (notionPosts.length === 0) return fallbackPosts;

    const existingKeys = new Set(
      notionPosts.map((post) => `${post.title}-${post.date}`)
    );

    const remainingFallbackPosts = fallbackPosts.filter(
      (post) => !existingKeys.has(`${post.title}-${post.date}`)
    );

    return [...notionPosts, ...remainingFallbackPosts];
  }, [fallbackPosts, query.data]);

  return {
    posts,
    isLoading: query.isLoading,
  };
}
