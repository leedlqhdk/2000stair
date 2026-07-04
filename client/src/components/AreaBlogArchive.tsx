import { ArrowRight } from "lucide-react";
import BlogPostCards from "@/components/BlogPostCards";

type AreaBlogArchiveProps = {
  areaName: string;
};

export default function AreaBlogArchive({ areaName }: AreaBlogArchiveProps) {
  return (
    <section className="mb-12 rounded-[1.75rem] border border-blue-100 bg-white p-6 shadow-sm md:mb-16 md:p-8">
      <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-xs font-extrabold tracking-[0.3em] text-primary md:text-sm">
            FIELD ARCHIVE
          </p>
          <h2 className="text-2xl font-extrabold text-foreground md:text-3xl">
            {areaName} 작업 기록
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
            실제 현장 기록은 네이버 블로그에 꾸준히 남기고 있습니다.
          </p>
        </div>
        <a
          href="https://blog.naver.com/icheonstair"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:opacity-90"
        >
          블로그 전체보기
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
      <BlogPostCards hideMoreLink />
    </section>
  );
}
