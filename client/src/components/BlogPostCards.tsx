import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

type InfoPost = {
  id: string;
  title: string;
  image: string;
  url: string;
};

type BlogPostCardsProps = {
  hideMoreLink?: boolean;
};

const fallbackInfoPosts: InfoPost[] = [
  {
    id: "naver-guide-1",
    title: "이천 빌라 계단청소 업체 선택 시 꼭 확인해야 할 점",
    image: "/images/blog-banner-main.png",
    url: "https://blog.naver.com/icheonstair/224302652052",
  },
];

export default function BlogPostCards({ hideMoreLink = false }: BlogPostCardsProps) {
  const [infoPosts, setInfoPosts] = useState<InfoPost[]>(fallbackInfoPosts);
  const visiblePosts = infoPosts.slice(0, 6);
  const scrollingPosts = visiblePosts.length > 1 ? [...visiblePosts, ...visiblePosts] : visiblePosts;

  useEffect(() => {
    let active = true;

    fetch("/api/content-posts?contentType=정보성&limit=6")
      .then(async (response) => {
        if (!response.ok) throw new Error(`Failed to load posts: ${response.status}`);
        return response.json() as Promise<{ posts?: InfoPost[] }>;
      })
      .then((data) => {
        if (!active) return;
        if (data.posts?.length) {
          setInfoPosts(data.posts.slice(0, 6));
        }
      })
      .catch((error) => {
        console.error("Failed to load featured info posts", error);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <motion.div
      className="mx-auto max-w-6xl overflow-hidden py-2"
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="flex w-max gap-3 md:gap-4"
        animate={visiblePosts.length > 1 ? { x: ["0%", "-50%"] } : { x: "0%" }}
        transition={
          visiblePosts.length > 1
            ? {
                duration: 30,
                ease: "linear",
                repeat: Infinity,
              }
            : undefined
        }
      >
        {scrollingPosts.map((post, index) => (
          <motion.a
            key={`${post.id}-${index}`}
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block w-[185px] shrink-0 overflow-hidden rounded-[1.15rem] border border-blue-100 bg-white shadow-sm sm:w-[220px] md:w-[292px] md:rounded-[1.45rem]"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: (index % visiblePosts.length) * 0.06 }}
          >
            <div className="relative aspect-square overflow-hidden bg-slate-100">
              <img
                src={post.image}
                alt={post.title}
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-primary/0 transition-all duration-300 group-hover:bg-primary" />
              <div className="absolute inset-0 flex items-center justify-center p-4 text-center md:p-5">
                <p className="max-w-[12rem] text-sm font-extrabold leading-snug text-white opacity-0 transition-all duration-300 group-hover:opacity-100 md:text-lg">
                  {post.title}
                </p>
              </div>
            </div>
          </motion.a>
        ))}
      </motion.div>

      {!hideMoreLink && (
        <div className="mt-6 flex justify-center md:justify-end">
          <a
            href="https://blog.naver.com/icheonstair"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-extrabold text-primary transition hover:translate-x-1"
          >
            블로그 더 보기
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      )}
    </motion.div>
  );
}
