import { useQuery } from "@tanstack/react-query";

export type AreaPost = {
  title: string;
  date: string;
  image: string;
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

  return {
    posts: query.data && query.data.length > 0 ? query.data : fallbackPosts,
    isLoading: query.isLoading,
  };
}
