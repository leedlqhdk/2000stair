import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

export type AreaPost = {
  id?: string;
  title: string;
  description?: string;
  area?: string;
  date: string;
  image: string;
  images?: string[];
  buildingType?: string;
  workScope?: string;
  workType?: string;
  blogUrl?: string;
  blogButtonLabel?: string;
};

export function useAreaPosts(area: string, fallbackPosts: AreaPost[]) {
  const query = useQuery({
    queryKey: ["area-posts", area],
    queryFn: async () => {
      const response = await fetch(`/api/area-posts?area=${encodeURIComponent(area)}&limit=24`, { cache: "no-store" });
      if (!response.ok) return [];
      return (await response.json()) as AreaPost[];
    },
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    retry: 1,
  });

  const posts = useMemo(() => {
    const notionPosts = query.data ?? [];
    return notionPosts.length > 0 ? notionPosts : fallbackPosts;
  }, [fallbackPosts, query.data]);

  return {
    posts,
    isLoading: query.isLoading,
  };
}
