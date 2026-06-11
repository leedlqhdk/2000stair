import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc.js";

export type AreaPost = {
  id: string;
  title: string;
  area: string;
  date: string;
  image: string;
};

export async function fetchAreaPostsFromNotion(): Promise<AreaPost[]> {
  return [];
}

export const areaPostsRouter = router({
  list: publicProcedure
    .input(
      z.object({
        area: z.string().optional(),
        limit: z.number().min(1).max(50).default(12),
      })
    )
    .query(async ({ input }) => {
      const posts = await fetchAreaPostsFromNotion();
      const filtered = input.area ? posts.filter((post) => post.area === input.area) : posts;
      return filtered.slice(0, input.limit);
    }),
});
