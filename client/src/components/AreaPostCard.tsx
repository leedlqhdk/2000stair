import { Link } from "wouter";
import { CalendarDays, Images } from "lucide-react";
import { motion } from "framer-motion";
import type { AreaPost } from "@/hooks/useAreaPosts";
import { getWorkPath } from "@/lib/workSlug";

type AreaPostCardProps = {
  post: AreaPost;
  index: number;
  areaLabel?: string;
  compact?: boolean;
};

export default function AreaPostCard({ post, index, areaLabel, compact = false }: AreaPostCardProps) {
  const images = post.images?.length ? post.images : [post.image];

  return (
    <Link href={getWorkPath(post)}>
      <motion.a
        className={`group block h-full overflow-hidden border border-blue-100 bg-white text-left shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 ${
          compact ? "rounded-[0.95rem] md:rounded-[1.1rem]" : "rounded-[1.1rem] md:rounded-[1.5rem]"
        }`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: Math.min(index * 0.035, 0.28) }}
      >
        <div className={`relative overflow-hidden bg-blue-50 ${compact ? "aspect-[4/3] md:aspect-square" : "aspect-[4/3] md:aspect-[4/5]"}`}>
          <img
            src={post.image}
            alt={post.title}
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/18 to-transparent" />

          <div className={`absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/55 font-bold text-white backdrop-blur md:right-3 md:top-3 ${
            compact ? "px-1.5 py-0.5 text-[10px] md:px-2 md:text-[11px]" : "px-2 py-0.5 text-[11px] md:px-2.5 md:py-1 md:text-xs"
          }`}>
            <Images className={compact ? "h-3 w-3" : "h-3 w-3 md:h-3.5 md:w-3.5"} />
            {images.length}
          </div>

          <div className={`absolute inset-x-0 bottom-0 text-white ${compact ? "p-3 md:p-4" : "p-4 md:p-5"}`}>
            {areaLabel && (
              <p className={`font-bold text-white/85 ${compact ? "mb-1 text-[11px] md:mb-1.5 md:text-xs" : "mb-1.5 text-xs md:mb-2 md:text-sm"}`}>
                {areaLabel}
              </p>
            )}
            <h3 className={`font-extrabold leading-snug drop-shadow-sm line-clamp-2 ${
              compact ? "mb-1.5 text-sm md:mb-2 md:text-base" : "mb-2 text-base md:mb-3 md:text-lg"
            }`}>
              {post.title}
            </h3>
            <div className={`flex items-center gap-1 font-semibold text-white/88 ${compact ? "text-[11px] md:text-xs" : "text-xs md:text-sm"}`}>
              <CalendarDays className={compact ? "h-3 w-3 md:h-3.5 md:w-3.5" : "h-3.5 w-3.5 md:h-4 md:w-4"} />
              {post.date}
            </div>
          </div>
        </div>
      </motion.a>
    </Link>
  );
}
