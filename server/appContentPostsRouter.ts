import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc.js";

export type ContentPost = {
  id: string;
  title: string;
  summary: string;
  image: string;
  url: string;
  contentType: string;
  date: string;
};

export async function fetchContentPostsFromNotion(): Promise<ContentPost[]> {
  return [];
}

export const contentPostsRouter = router({
  featured: publicProcedure
    .input(
      z.object({
        contentType: z.string().default("정보성"),
        limit: z.number().min(1).max(12).default(3),
      })
    )
    .query(async ({ input }) => {
      const posts = await fetchContentPostsFromNotion();
      return posts
        .filter((post) => post.contentType.includes(input.contentType))
        .slice(0, input.limit);
    }),
});
