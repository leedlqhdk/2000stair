import type { ReactNode } from "react";
import { Check, ExternalLink } from "lucide-react";

// 정보글 본문 공용 렌더러
// 관리자 페이지에서 올린 마크다운 느낌의 본문(## 소제목, - 목록, **굵게**, 링크)을
// 실제 페이지와 동일하게 렌더링한다. BlogDetail(상세)과 AdminBlogEdit(미리보기)에서 사용.

function decodeEntities(text: string) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&amp;/g, "&");
}

function NaverBlogButton({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-[#03c75a] px-5 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(3,199,90,0.32)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(3,199,90,0.42)] active:scale-95 md:gap-2.5 md:px-7 md:text-[15px]"
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white text-[13px] font-black text-[#03c75a]">
        N
      </span>
      네이버 블로그에서 자세히 보기
      <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  );
}

// 본문 인라인: URL 링크 + **굵게** 처리
function renderInline(text: string) {
  const nodes: ReactNode[] = [];
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  text.split(urlRegex).forEach((part, i) => {
    if (/^https?:\/\//.test(part)) {
      const cleanUrl = part.replace(/[.,!?;:)"']+$/, "");
      nodes.push(
        <a
          key={`url-${i}`}
          href={cleanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-primary underline decoration-blue-200 underline-offset-4 transition hover:decoration-primary"
        >
          {cleanUrl.includes("blog.naver.com")
            ? "네이버 블로그 글 보기"
            : cleanUrl.length > 50
            ? cleanUrl.slice(0, 50) + "..."
            : cleanUrl}
        </a>
      );
      return;
    }

    part.split(/(\*\*[^*]+\*\*)/g).forEach((seg, j) => {
      if (!seg) return;
      if (/^\*\*[^*]+\*\*$/.test(seg)) {
        nodes.push(
          <strong key={`b-${i}-${j}`} className="font-bold text-foreground">
            {seg.slice(2, -2)}
          </strong>
        );
      } else {
        nodes.push(<span key={`t-${i}-${j}`}>{seg}</span>);
      }
    });
  });

  return nodes;
}

export function renderPostContent(raw: string) {
  // [라벨](URL) 마크다운 링크와 괄호로 감싼 URL은 URL만 별도 줄로 분리 → 버튼으로 렌더링
  const content = decodeEntities(raw)
    .replace(/\[[^\]]*\]\s*\(\s*(https?:\/\/[^\s)]+)\s*\)/g, "\n$1\n")
    .replace(/\(\s*(https?:\/\/[^\s)]+)\s*\)/g, "\n$1\n");

  const blocks: ReactNode[] = [];
  let listItems: string[] = [];
  let paraLines: string[] = [];

  const flushList = () => {
    if (listItems.length === 0) return;
    blocks.push(
      <ul
        key={`ul-${blocks.length}`}
        className="my-5 space-y-3 rounded-2xl border border-blue-100 bg-blue-50/50 p-5"
      >
        {listItems.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-[15px] leading-7 text-gray-700 md:text-base">
            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Check className="h-3 w-3 text-primary" strokeWidth={3} />
            </span>
            <span>{renderInline(item)}</span>
          </li>
        ))}
      </ul>
    );
    listItems = [];
  };

  const flushPara = () => {
    if (paraLines.length === 0) return;
    blocks.push(
      <p
        key={`p-${blocks.length}`}
        className="my-4 whitespace-pre-wrap text-[15px] leading-8 text-gray-700 md:text-base"
      >
        {renderInline(paraLines.join("\n"))}
      </p>
    );
    paraLines = [];
  };

  for (const line of content.split("\n")) {
    const trimmed = line.trim();

    // 소제목 (## / ###)
    const headingMatch = trimmed.match(/^(#{2,})\s+(.*)$/);
    if (headingMatch) {
      flushList();
      flushPara();
      blocks.push(
        <h2
          key={`h-${blocks.length}`}
          className="mb-4 mt-9 flex items-center gap-2.5 text-lg font-extrabold text-foreground first:mt-0 md:text-xl"
        >
          <span className="h-5 w-1 shrink-0 rounded-full bg-primary" />
          {headingMatch[2]}
        </h2>
      );
      continue;
    }

    // 목록 (- / – / •)
    const listMatch = trimmed.match(/^[-–•]\s+(.*)$/);
    if (listMatch) {
      flushPara();
      listItems.push(listMatch[1]);
      continue;
    }

    // 단독 줄 URL → 네이버는 큰 버튼, 그 외는 링크
    if (/^https?:\/\/\S+$/.test(trimmed)) {
      flushList();
      flushPara();
      const cleanUrl = trimmed.replace(/[.,!?;:)"']+$/, "");
      blocks.push(
        <div key={`link-${blocks.length}`} className="my-8 flex justify-center">
          {cleanUrl.includes("blog.naver.com") ? (
            <NaverBlogButton url={cleanUrl} />
          ) : (
            <a
              href={cleanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-6 py-3 text-sm font-bold text-primary transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-md"
            >
              <ExternalLink className="h-4 w-4" />
              링크 열기
            </a>
          )}
        </div>
      );
      continue;
    }

    // 링크 라벨만 남은 줄([네이버 블로그 원문 보기] 등)은 표시하지 않음
    if (trimmed === "" || /^\[[^\]]*\]$/.test(trimmed)) {
      flushList();
      flushPara();
      continue;
    }

    flushList();
    paraLines.push(line);
  }

  flushList();
  flushPara();

  return blocks;
}

export default function PostContent({ content }: { content: string }) {
  return <>{renderPostContent(content)}</>;
}
