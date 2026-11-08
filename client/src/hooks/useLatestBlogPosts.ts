import { useQuery } from "@tanstack/react-query";

export type BlogPost = {
  title: string;
  link: string;
  date: string;
  summary: string;
};

/** 네이버 블로그 RSS 최신 글 (모바일 홈 '최신 소식'과 PC 홈 타임라인이 같은 캐시를 함께 쓴다) */
export function useLatestBlogPosts() {
  return useQuery({
    queryKey: ["blog-rss"],
    queryFn: async () => {
      const response = await fetch("/api/blog-rss?limit=8");
      if (!response.ok) return [];
      const data = (await response.json()) as { posts?: BlogPost[] };
      return data.posts ?? [];
    },
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
}
