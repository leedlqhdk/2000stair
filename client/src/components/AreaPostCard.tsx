import { CalendarDays, Images } from "lucide-react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { AreaPost } from "@/hooks/useAreaPosts";

type AreaPostCardProps = {
  post: AreaPost;
  index: number;
  areaLabel?: string;
  compact?: boolean;
};

export default function AreaPostCard({ post, index, areaLabel, compact = false }: AreaPostCardProps) {
  const images = post.images?.length ? post.images : [post.image];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.button
          type="button"
          className={`group h-full overflow-hidden border border-blue-100 bg-white text-left shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 ${
            compact ? "rounded-[1.1rem]" : "rounded-[1.5rem]"
          }`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: Math.min(index * 0.035, 0.28) }}
        >
          <div className={`relative overflow-hidden bg-blue-50 ${compact ? "aspect-[4/4]" : "aspect-[4/5]"}`}>
            <img
              src={post.image}
              alt={post.title}
              className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/18 to-transparent" />

            <div className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/55 font-bold text-white backdrop-blur ${
              compact ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
            }`}>
              <Images className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
              {images.length}
            </div>

            <div className={`absolute inset-x-0 bottom-0 text-white ${compact ? "p-4" : "p-5"}`}>
              {areaLabel && (
                <p className={`font-bold text-white/85 ${compact ? "mb-1.5 text-xs" : "mb-2 text-sm"}`}>
                  {areaLabel}
                </p>
              )}
              <h3 className={`font-extrabold leading-snug drop-shadow-sm line-clamp-2 ${
                compact ? "mb-2 text-base" : "mb-3 text-lg"
              }`}>
                {post.title}
              </h3>
              <div className={`flex items-center gap-1 font-semibold text-white/88 ${compact ? "text-xs" : "text-sm"}`}>
                <CalendarDays className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
                {post.date}
              </div>
            </div>
          </div>
        </motion.button>
      </DialogTrigger>

      <DialogContent className="max-h-[92vh] overflow-y-auto p-0 sm:max-w-4xl" showCloseButton>
        <div className="p-5 md:p-6">
          {areaLabel && (
            <p className="mb-2 text-sm font-bold text-primary">{areaLabel}</p>
          )}
          <DialogTitle className="text-xl md:text-2xl font-extrabold leading-snug">
            {post.title}
          </DialogTitle>
          <DialogDescription className="mt-2 flex items-center gap-1 text-sm">
            <CalendarDays className="h-4 w-4" />
            {post.date} · 사진 {images.length}장
          </DialogDescription>
          {post.description && (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {post.description}
            </p>
          )}
        </div>

        <div className="grid gap-3 px-3 pb-3 md:grid-cols-2 md:px-6 md:pb-6">
          {images.map((image, imageIndex) => (
            <img
              key={`${image}-${imageIndex}`}
              src={image}
              alt={`${post.title} 사진 ${imageIndex + 1}`}
              className="w-full rounded-xl border border-blue-100 bg-blue-50 object-contain"
              loading="lazy"
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
