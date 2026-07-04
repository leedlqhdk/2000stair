import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { trackConversion } from "@/lib/analytics";
import { OFFICIAL_CHANNELS } from "@/components/ChannelLinks";

type BlogPost = {
  title: string;
  link: string;
  date: string;
  summary: string;
};

function useLatestBlogPosts() {
  return useQuery({
    queryKey: ["blog-rss"],
    queryFn: async () => {
      const response = await fetch("/api/blog-rss?limit=3");
      if (!response.ok) return [];
      const data = (await response.json()) as { posts?: BlogPost[] };
      return data.posts ?? [];
    },
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
}

function PostCard({ post, location, fluid = false }: { post: BlogPost; location: string; fluid?: boolean }) {
  return (
    <a
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackConversion("review_click", { location, label: post.title })}
      className={`flex flex-col rounded-2xl border border-blue-100 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.04)] transition hover:border-blue-300 hover:shadow-md active:scale-[0.99] ${
        fluid ? "w-full" : "w-[250px] shrink-0 md:w-auto"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#03c75a]">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#03c75a] text-[10px] font-black text-white">
            N
          </span>
          블로그
        </span>
        {post.date ? <span className="text-xs font-bold text-muted-foreground">{post.date}</span> : null}
      </div>
      <p className="mb-2 line-clamp-2 text-[15px] font-extrabold leading-snug text-foreground">{post.title}</p>
      {post.summary ? (
        <p className="mb-3 line-clamp-2 text-[13px] font-medium leading-relaxed text-muted-foreground">
          {post.summary}
        </p>
      ) : null}
      <span className="mt-auto inline-flex items-center gap-1 text-xs font-bold text-primary">
        글 보러가기
        <ArrowRight className="h-3 w-3" />
      </span>
    </a>
  );
}

export default function LatestBlogPosts({
  variant = "desktop",
}: {
  variant?: "desktop" | "mobile" | "timeline";
}) {
  const { data } = useLatestBlogPosts();
  const posts = (data ?? []).slice(0, 3);

  if (posts.length === 0) return null;

  const blogChannel = OFFICIAL_CHANNELS[0];
  const daangnChannel = OFFICIAL_CHANNELS[1];

  // PC 메인 페이지용: 옅은 파란 배경 위 흰 카드 안에 날짜 타임라인으로 표시
  if (variant === "timeline") {
    return (
      <section className="bg-blue-50/60 py-16 md:py-24">
        <motion.div
          className="container max-w-6xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-10 text-center">
            <p className="mb-2 text-xs font-extrabold tracking-[0.28em] text-primary">LATEST NEWS</p>
            <h3 className="text-2xl font-extrabold leading-tight text-foreground md:text-3xl">
              <span className="text-primary">최신 소식</span> 확인하기
            </h3>
            <p className="mt-2.5 text-sm text-muted-foreground md:text-base">
              현장 작업 이야기를 공식 채널에서 바로 확인하세요
            </p>
          </div>

          <div className="mx-auto max-w-4xl rounded-[2rem] bg-white p-8 shadow-[0_4px_24px_rgba(15,23,42,0.05)] md:p-12">
            {posts.map((post, index) => (
              <div key={post.link} className="grid grid-cols-[96px_minmax(0,1fr)] gap-5 md:grid-cols-[120px_minmax(0,1fr)] md:gap-8">
                <p className="pt-0.5 text-sm font-bold text-slate-500 md:text-base">{post.date}</p>
                <div
                  className={`relative pl-7 md:pl-8 ${index < posts.length - 1 ? "pb-10 md:pb-12" : ""} ${
                    index < posts.length - 1
                      ? "before:absolute before:left-[5px] before:top-3 before:h-full before:w-px before:bg-blue-100"
                      : ""
                  }`}
                >
                  <span className="absolute left-0 top-[5px] h-[11px] w-[11px] rounded-full bg-primary" />
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackConversion("review_click", { location: "home_latest_posts", label: post.title })}
                    className="group block"
                  >
                    <h4 className="text-lg font-extrabold leading-snug text-foreground transition-colors group-hover:text-primary md:text-xl">
                      {post.title}
                    </h4>
                    {post.summary ? (
                      <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
                        {post.summary}
                      </p>
                    ) : null}
                    <span className="mt-3.5 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                      글 보러가기
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3.5">
            <a
              href={blogChannel.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackConversion("review_click", { location: "home_latest_posts", label: "블로그 전체보기" })}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-white transition hover:opacity-90"
            >
              네이버 블로그 전체보기
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={daangnChannel.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackConversion("review_click", { location: "home_latest_posts", label: "당근마켓" })}
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-primary shadow-[0_2px_10px_rgba(15,23,42,0.05)] transition hover:bg-blue-50"
            >
              당근마켓에서 보기
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </section>
    );
  }

  if (variant === "mobile") {
    return (
      <section className="py-7">
        <div className="mb-5 flex items-center justify-between px-5">
          <h2 className="font-['GmarketSans'] text-lg font-extrabold text-foreground">최신 소식</h2>
          <a
            href={blogChannel.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-bold text-muted-foreground"
          >
            전체보기 →
          </a>
        </div>
        <div className="flex gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {posts.map((post) => (
            <PostCard key={post.link} post={post} location="mobile_latest_posts" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <motion.div
      className="mx-auto max-w-5xl"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="mb-8 text-center">
        <p className="mb-2 text-xs font-extrabold tracking-[0.28em] text-primary">LATEST NEWS</p>
        <h3 className="text-2xl font-extrabold leading-tight text-foreground md:text-3xl">
          블로그 <span className="text-primary">최신 소식</span>
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground">현장 작업 이야기를 공식 채널에서 바로 확인하세요</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.link} post={post} location="latest_posts" fluid />
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <a
          href={blogChannel.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackConversion("review_click", { location: "home_latest_posts", label: "블로그 전체보기" })}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
        >
          네이버 블로그 전체보기
          <ArrowRight className="h-4 w-4" />
        </a>
        <a
          href={daangnChannel.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackConversion("review_click", { location: "home_latest_posts", label: "당근마켓" })}
          className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-6 py-3 text-sm font-bold text-primary transition hover:bg-blue-50"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#ff6f0f] text-[10px] font-black text-white">
            당
          </span>
          당근마켓에서 보기
        </a>
      </div>
    </motion.div>
  );
}
