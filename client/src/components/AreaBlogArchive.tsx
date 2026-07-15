import { ArrowRight } from "lucide-react";

type AreaBlogArchiveProps = {
  areaName?: string;
};

export default function AreaBlogArchive(_props: AreaBlogArchiveProps) {
  return (
    <div className="mb-12 flex justify-center md:mb-16">
      <a
        href="https://blog.naver.com/icheonstair"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition hover:-translate-y-0.5 hover:opacity-95"
      >
        네이버 블로그에서 작업 기록 보기
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}
