import { CalendarDays, Images } from "lucide-react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { AreaPost } from "@/hooks/useAreaPosts";

type AreaPostCardProps = {
  post: AreaPost;
  index: number;
};

export default function AreaPostCard({ post, index }: AreaPostCardProps) {
  const images = post.images?.length ? post.images : [post.image];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.button
          type="button"
          className="group h-full overflow-hidden rounded-[1.5rem] border border-blue-100 bg-white text-left shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: index * 0.06 }}
        >
          <div className="relative overflow-hidden bg-blue-50">
            <img
              src={post.image}
              alt={post.title}
              className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">
              <Images className="h-3.5 w-3.5" />
              {images.length}
            </div>
          </div>

          <div className="p-5">
            <h3 className="text-lg font-extrabold leading-snug text-foreground mb-3">
              {post.title}
            </h3>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              {post.date}
            </div>
          </div>
        </motion.button>
      </DialogTrigger>

      <DialogContent className="max-h-[92vh] overflow-y-auto p-0 sm:max-w-4xl" showCloseButton>
        <div className="p-5 md:p-6">
          <DialogTitle className="text-xl md:text-2xl font-extrabold leading-snug">
            {post.title}
          </DialogTitle>
          <DialogDescription className="mt-2 flex items-center gap-1 text-sm">
            <CalendarDays className="h-4 w-4" />
            {post.date} · 사진 {images.length}장
          </DialogDescription>
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
