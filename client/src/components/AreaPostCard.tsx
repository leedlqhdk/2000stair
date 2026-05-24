import { Link } from "wouter";
import { ArrowRight, CalendarDays, Images } from "lucide-react";
import { motion } from "framer-motion";
import type { AreaPost } from "@/hooks/useAreaPosts";
import { getWorkPath } from "@/lib/workSlug";

type AreaPostCardProps = {
  post: AreaPost;
  index: number;
  areaLabel?: string;
  compact?: boolean;
};

const areaLabels: Record<string, string> = {
  majang: "마장면",
  daewol: "대월면",
  sindun: "신둔면",
  downtown: "시내권",
};

function getCardTitle(title: string, areaLabel?: string) {
  return title
    .replace(/^이천\s*/g, "")
    .replace(/\d+층\s*/g, "")
    .replace(/정기관리\s*현장/g, "정기청소")
    .replace(/정기\s*관리/g, "정기청소")
    .replace(/계단\s*정기청소/g, "계단청소")
    .replace(areaLabel ? new RegExp(`^${areaLabel}\\s*`) : /^$/g, "")
    .trim();
}

function getCardDescription(post: AreaPost, areaLabel?: string) {
  if (post.description) return post.description;

  const title = post.title;

  if (/견적/.test(title)) {
    return "사진과 동선을 기준으로 관리 범위를 확인한 현장입니다.";
  }

  if (/상가|관고/.test(title)) {
    return "출입이 많은 공용부를 중심으로 바닥 먼지와 손이 닿는 구간을 확인했습니다.";
  }

  if (/원룸|빌라/.test(title)) {
    return "입주민 이동이 많은 계단과 공동현관 주변을 중심으로 정리했습니다.";
  }

  if (/유리|현관/.test(title)) {
    return "공동현관과 유리 주변 얼룩까지 함께 확인한 관리 기록입니다.";
  }

  return `${areaLabel ?? "이천"} 현장 상태를 기준으로 관리 범위를 정리했습니다.`;
}

function getWorkBadge(post: AreaPost) {
  if (post.workType) return post.workType.split(",")[0].trim();
  if (/견적/.test(post.title)) return "현장견적";
  if (/정기/.test(post.title)) return "정기청소";
  return "계단청소";
}

function getLocationBadge(title: string, areaLabel?: string) {
  const matches = title.match(/[가-힣]+(?:리|동|면|읍|권)/g) ?? [];
  const found = matches.find((item) => item !== "이천" && item !== areaLabel);
  return found ?? areaLabel ?? "이천";
}

export default function AreaPostCard({ post, index, areaLabel, compact = false }: AreaPostCardProps) {
  const images = post.images?.length ? post.images : [post.image];
  const inferredAreaLabel = post.area ? areaLabels[post.area] : undefined;
  const displayAreaLabel = areaLabel ?? inferredAreaLabel;
  const cardTitle = getCardTitle(post.title, displayAreaLabel);
  const cardDescription = getCardDescription(post, displayAreaLabel);
  const workBadge = getWorkBadge(post);
  const locationBadge = getLocationBadge(post.title, displayAreaLabel);

  return (
    <Link href={getWorkPath(post)}>
      <motion.a
        className={`group block h-full overflow-hidden border border-blue-100 bg-white text-left shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 ${
          compact ? "rounded-[0.95rem] md:rounded-[1.1rem]" : "rounded-[1.1rem] md:rounded-[1.5rem]"
        }`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: Math.min(index * 0.035, 0.28) }}
      >
        <div className={`relative overflow-hidden bg-blue-50 ${compact ? "h-[124px] sm:h-[142px] md:h-[166px] lg:h-[178px]" : "h-[220px] md:h-[300px]"}`}>
          <img
            src={post.image}
            alt={post.title}
            className="absolute inset-0 h-full w-full object-cover object-center brightness-[1.04] contrast-[1.04] saturate-[1.08] transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />

          <div className="absolute left-2 top-2 flex flex-wrap gap-1.5 md:left-3 md:top-3">
            <span className="rounded-full bg-white/92 px-2 py-1 text-[10px] font-extrabold text-primary shadow-sm backdrop-blur md:text-[11px]">
              {workBadge}
            </span>
            <span className="rounded-full bg-black/52 px-2 py-1 text-[10px] font-extrabold text-white shadow-sm backdrop-blur md:text-[11px]">
              {locationBadge}
            </span>
          </div>

          <div className={`absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/50 font-bold text-white backdrop-blur md:right-3 md:top-3 ${
            compact ? "px-1.5 py-0.5 text-[10px] md:px-2 md:text-[11px]" : "px-2 py-0.5 text-[11px] md:px-2.5 md:py-1 md:text-xs"
          }`}>
            <Images className={compact ? "h-3 w-3" : "h-3 w-3 md:h-3.5 md:w-3.5"} />
            {images.length}
          </div>
        </div>

        <div className={`flex flex-col ${compact ? "min-h-[154px] p-3 md:min-h-[170px] md:p-4" : "min-h-[210px] p-5"}`}>
          <h3 className={`line-clamp-2 font-extrabold leading-snug text-foreground ${
            compact ? "mb-2 text-sm md:text-base" : "mb-3 text-lg"
          }`}>
            {cardTitle}
          </h3>
          <p className={`line-clamp-2 flex-1 text-muted-foreground ${
            compact ? "text-[11px] leading-4 md:text-xs md:leading-5" : "text-sm leading-6"
          }`}>
            {cardDescription}
          </p>
          <div className={`mt-3 flex items-center justify-between gap-2 ${compact ? "text-[11px] md:text-xs" : "text-sm"}`}>
            <div className="inline-flex items-center gap-1 font-semibold text-slate-400">
              <CalendarDays className={compact ? "h-3 w-3 md:h-3.5 md:w-3.5" : "h-4 w-4"} />
              {post.date}
            </div>
            <div className="inline-flex items-center gap-1 font-extrabold text-primary transition-transform duration-300 group-hover:translate-x-1">
              자세히 보기
              <ArrowRight className={compact ? "h-3 w-3 md:h-3.5 md:w-3.5" : "h-4 w-4"} />
            </div>
          </div>
        </div>
      </motion.a>
    </Link>
  );
}
