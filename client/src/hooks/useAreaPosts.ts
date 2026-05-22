import { trpc } from "@/lib/trpc";

export type AreaPost = {
  title: string;
  date: string;
  image: string;
};

export function useAreaPosts(area: string, fallbackPosts: AreaPost[]) {
  const query = trpc.areaPosts.list.useQuery(
    { area, limit: 24 },
    {
      staleTime: 60_000,
      retry: 1,
    }
  );

  return {
    posts: query.data && query.data.length > 0 ? query.data : fallbackPosts,
    isLoading: query.isLoading,
  };
}
