import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { posts, postTags } from "../drizzle/schema.js";
import { getDb } from "./db.js";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc.js";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "관리자만 접근 가능합니다." });
  }
  return next({ ctx });
});

function parsePost(post: typeof posts.$inferSelect) {
  return {
    ...post,
    images: post.images ? (JSON.parse(post.images) as unknown[]) : [],
    tags: post.tags ? (JSON.parse(post.tags) as number[]) : [],
  };
}

function stripHtml(value: string) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    // Naver markup is sometimes double-encoded (e.g. "&amp;middot;" standing
    // for the entity "&middot;"), so unescape "&amp;" before the rest.
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&lsquo;|&rsquo;/g, "'")
    .replace(/&middot;/g, "·")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&hellip;/g, "…")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x?[0-9a-f]+;/gi, (entity) => {
      const code = entity[2] === "x" || entity[2] === "X" ? parseInt(entity.slice(3, -1), 16) : parseInt(entity.slice(2, -1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : entity;
    })
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function pickMeta(html: string, property: string) {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${escaped}["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+name=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${escaped}["'][^>]*>`, "i"),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return stripHtml(match[1]);
  }
  return "";
}

function pickTitle(html: string) {
  const ogTitle = pickMeta(html, "og:title");
  if (ogTitle) return cleanNaverTitle(ogTitle);

  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "";
  return cleanNaverTitle(stripHtml(title));
}

function cleanNaverTitle(title: string) {
  return title
    .replace(/\s*:\s*네이버\s*블로그\s*$/i, "")
    .replace(/\s*-\s*Naver\s*Blog\s*$/i, "")
    .replace(/\s*\|\s*네이버\s*블로그\s*$/i, "")
    .trim();
}

function inferTitleFromUrl(url: string) {
  const known: Record<string, string> = {
    "224306730819": "여름철 빌라 계단 냄새, 물청소만으로 해결 안 되는 이유",
  };

  const id = url.match(/\/(\d{8,})/)?.[1];
  return id ? known[id] ?? `이천계단지기 관리정보 ${id}` : "이천계단지기 관리정보";
}

function pickTopic(text: string) {
  if (/냄새|악취|습기|곰팡이|장마|환기|여름철|우기/.test(text)) return "odor";
  if (/주기|몇 번|정기|관리 주기|관리텀/.test(text)) return "schedule";
  if (/유리|현관|출입문|매트/.test(text)) return "entry";
  if (/상가|사무실|방문객|업장/.test(text)) return "commercial";
  if (/빌라|원룸|다세대|공동주택/.test(text)) return "villa";
  return "general";
}

function createSeed(text: string) {
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function pickVariant<T>(items: T[], seed: number, offset = 0) {
  return items[(seed + offset) % items.length];
}

function rotateItems(items: readonly string[], seed: number) {
  if (items.length <= 1) return items;
  const pivot = seed % items.length;
  return [...items.slice(pivot), ...items.slice(0, pivot)];
}

function buildTopicSections(topic: string, title: string, description: string) {
  const sections = {
    odor: {
      lead: "냄새와 습기 문제는 눈에 띄는 먼지보다 늦게 발견되는 경우가 많아, 계단실 환경을 함께 봐야 합니다.",
      summaryTitle: "## 왜 이런 문제가 반복될까",
      summaryPoints: [
        `${description}`,
        "계단실은 환기 부족, 장마철 습기, 매트 하부 오염이 겹치면 냄새가 오래 남기 쉽습니다.",
        "표면만 한 번 닦는 방식보다 냄새가 남는 지점을 나눠 관리하는 편이 훨씬 안정적입니다.",
      ],
      checkTitle: "## 먼저 확인하면 좋은 지점",
      checks: [
        "공동현관 매트 아래와 모서리 습기 잔여감",
        "유리문 하단 레일과 프레임 주변 오염",
        "계단 코너, 논슬립 틈새, 벽면 하단 먼지 뭉침",
        "환기가 약한 계단실의 냄새 정체 구간",
      ],
      methodTitle: "## 이천계단지기가 보는 관리 포인트",
      methodBody:
        "이천계단지기는 냄새 원인을 한 가지로 단정하지 않고, 습기·먼지·생활오염이 겹치는 지점을 먼저 확인합니다. 표면 청소와 함께 냄새가 남는 구간을 나눠 관리해 공용공간 컨디션을 더 오래 유지하도록 안내합니다.",
    },
    schedule: {
      lead: "계단청소 주기는 건물 유형보다 실제 사용량과 오염 속도에 따라 달라집니다.",
      summaryTitle: "## 주기를 정할 때 먼저 볼 점",
      summaryPoints: [
        `${description}`,
        "빌라와 상가 모두 출입 빈도, 비 오는 날 유입 오염, 현관 구조에 따라 적정 주기가 달라집니다.",
        "무조건 자주 하는 것보다 오염이 쌓이는 구간과 민원 포인트를 기준으로 주기를 잡는 편이 효율적입니다.",
      ],
      checkTitle: "## 건물별 체크 포인트",
      checks: [
        "빌라는 계단 모서리, 공동현관, 우편함 주변 먼지 누적",
        "상가는 출입문 유리, 바닥 얼룩, 화장실과 입구 첫인상",
        "원룸은 손자국이 많은 손잡이, 출입문, 복도 끝 오염",
        "비 오는 날 오염이 몰리는 1층 진입부와 매트 주변",
      ],
      methodTitle: "## 이천계단지기 관리 방식",
      methodBody:
        "이천계단지기는 건물마다 같은 주기를 권하지 않습니다. 현장 사진이나 방문 확인을 바탕으로 오염 속도와 사용 패턴을 보고, 무리 없는 정기관리 주기를 먼저 제안합니다.",
    },
    entry: {
      lead: "공동현관과 유리 상태는 건물 첫인상을 좌우해서 작은 얼룩도 체감이 크게 남습니다.",
      summaryTitle: "## 출입구 관리가 중요한 이유",
      summaryPoints: [
        `${description}`,
        "유리문 손자국, 레일 하단 먼지, 현관 매트 주변 오염은 방문자가 가장 먼저 보는 구간입니다.",
        "계단만 깨끗해도 출입구가 지저분하면 전체 관리 수준이 떨어져 보일 수 있습니다.",
      ],
      checkTitle: "## 눈여겨볼 위치",
      checks: [
        "유리문 손잡이와 하단 레일",
        "현관 매트 아래 먼지와 모래 잔여물",
        "출입문 프레임 모서리와 문턱 주변 얼룩",
        "계단 첫 단과 복도 연결부의 신발 자국",
      ],
      methodTitle: "## 이천계단지기 관리 방식",
      methodBody:
        "이천계단지기는 계단과 현관을 분리해서 보지 않습니다. 출입 동선에서 먼저 눈에 띄는 구간을 함께 관리해 실제 체감이 좋아지도록 정리합니다.",
    },
    commercial: {
      lead: "상가나 소형 건물은 오염 자체보다 방문객이 받는 첫인상 관리가 더 중요할 때가 많습니다.",
      summaryTitle: "## 상가 건물에서 자주 보는 문제",
      summaryPoints: [
        `${description}`,
        "사람이 많이 드나드는 건물은 유리, 입구 바닥, 공용 화장실 주변 오염이 빠르게 누적됩니다.",
        "정기적으로 가볍게 관리하는 편이 큰 오염이 생긴 뒤 한 번에 처리하는 것보다 효율적입니다.",
      ],
      checkTitle: "## 현장에서 자주 보는 구간",
      checks: [
        "건물 입구 바닥과 문손잡이 주변 얼룩",
        "계단 난간과 손이 많이 닿는 지점",
        "공용 화장실 앞 바닥과 냄새 잔여감",
        "유리면과 안내판 주변 먼지 누적",
      ],
      methodTitle: "## 이천계단지기 관리 방식",
      methodBody:
        "이천계단지기는 방문객 동선과 민원이 생기기 쉬운 지점을 먼저 봅니다. 입구, 계단, 공용부 순서로 관리 우선순위를 잡아 상가 건물 인상이 무너지지 않도록 돕습니다.",
    },
    villa: {
      lead: "빌라와 원룸 계단은 매일 쓰는 공간이라 작은 오염도 반복되면 금방 지저분해 보입니다.",
      summaryTitle: "## 빌라 계단에서 자주 생기는 문제",
      summaryPoints: [
        `${description}`,
        "층간 이동이 많은 건물은 머리카락, 흙먼지, 광고지 부스러기 같은 생활오염이 꾸준히 쌓입니다.",
        "계단, 복도, 공동현관을 함께 관리해야 입주민이 체감하는 깔끔함이 오래갑니다.",
      ],
      checkTitle: "## 확인하면 좋은 부분",
      checks: [
        "계단 모서리와 벽면 하단 먼지 뭉침",
        "난간 손잡이와 손자국이 남기 쉬운 구간",
        "공동현관 출입문과 우편함 주변 오염",
        "복도 끝이나 창틀 하단의 먼지 누적",
      ],
      methodTitle: "## 이천계단지기 관리 방식",
      methodBody:
        "이천계단지기는 부부가 직접 현장을 확인하고, 건물별 오염 패턴에 맞춰 공용공간을 관리합니다. 계단만 빠르게 끝내는 방식보다 입주민이 자주 보는 구간을 함께 정리하는 데 집중합니다.",
    },
    general: {
      lead: "공용공간 관리는 눈에 보이는 먼지만이 아니라, 반복되는 생활오염을 얼마나 안정적으로 관리하느냐가 핵심입니다.",
      summaryTitle: "## 핵심 요약",
      summaryPoints: [
        `${description}`,
        "계단·복도·공동현관처럼 함께 쓰는 공간은 오염이 눈에 잘 보이지 않아도 냄새나 미끄럼, 먼지 문제로 이어질 수 있습니다.",
        "한 번의 물청소보다 오염이 굳기 전에 주기적으로 관리하는 방식이 더 안정적입니다.",
      ],
      checkTitle: "## 확인하면 좋은 부분",
      checks: [
        "계단 논슬립 모서리와 줄눈 틈새",
        "공동현관 매트 아래와 유리 프레임 하단",
        "난간 손잡이와 브래킷 주변",
        "환기가 부족한 계단실의 습기와 냄새 잔여감",
      ],
      methodTitle: "## 이천계단지기 관리 방식",
      methodBody:
        "이천계단지기는 부부가 직접 현장을 확인하고, 건물별 전용 걸레를 구분해 사용합니다. 친환경 세제와 탈취 작업을 함께 적용해 공용공간을 꾸준히 관리합니다.",
    },
  } as const;

  return sections[topic as keyof typeof sections] ?? sections.general;
}

function buildSeoKeywords(title: string, description: string) {
  const source = `${title} ${description}`;
  const keywords = [
    "이천계단청소",
    "이천계단지기",
    /빌라|원룸|다세대/.test(source) ? "이천빌라계단청소" : "이천공용공간청소",
    /상가|사무실|업장/.test(source) ? "이천상가청소" : "정기계단청소",
    /냄새|악취|습기|장마/.test(source) ? "계단냄새관리" : "계단청소관리정보",
    /현관|유리|출입문/.test(source) ? "공동현관청소" : "빌라공용부청소",
  ];

  return Array.from(new Set(keywords)).join(", ");
}

function buildIntro(seed: number) {
  return pickVariant([
    "네이버 블로그에 먼저 정리한 내용을 홈페이지 방문자가 빠르게 이해할 수 있도록 다시 정리한 정보글입니다.",
    "블로그에 올린 내용을 홈페이지용 관리정보 형식으로 한 번 더 정리했습니다.",
    "현장에서 자주 받는 질문에 맞춰 네이버 글 내용을 홈페이지용 정보글로 다시 풀어쓴 초안입니다.",
  ], seed);
}

function buildClosing(seed: number) {
  return pickVariant([
    "건물 사진이나 현재 고민 구간을 보내주시면, 이천계단지기가 관리 범위와 정기청소 방향을 빠르게 안내드립니다.",
    "계단, 복도, 공동현관 상태를 사진으로 보내주시면 현재 건물에 맞는 관리 방향을 빠르게 안내해드립니다.",
    "지금 건물 상태가 고민이라면 사진 몇 장만 보내주세요. 이천계단지기가 필요한 관리 범위를 현실적으로 정리해드립니다.",
  ], seed, 3);
}

function buildSubheading(seed: number, topic: string) {
  const defaults = [
    "## 현장 기준으로 보면",
    "## 실제 관리에서는 이렇게 봅니다",
    "## 이 글에서 먼저 볼 점",
  ];

  const byTopic: Record<string, string[]> = {
    odor: ["## 왜 냄새가 남는지부터 봐야 합니다", "## 냄새 문제는 보이는 먼지와 다릅니다", "## 습기와 냄새를 같이 봐야 하는 이유"],
    schedule: ["## 주기를 정할 때는 이 기준이 먼저입니다", "## 몇 번 할지보다 중요한 것", "## 정기관리 주기는 이렇게 잡습니다"],
    entry: ["## 출입구가 먼저 눈에 띄는 이유", "## 공동현관은 첫인상을 만듭니다", "## 유리와 현관을 같이 봐야 하는 이유"],
    commercial: ["## 상가 건물은 이 지점이 다릅니다", "## 방문객 동선부터 보는 이유", "## 상가 공용부는 이렇게 확인합니다"],
    villa: ["## 빌라 계단은 생활오염이 쌓입니다", "## 입주민이 먼저 체감하는 구간", "## 빌라 공용부에서 자주 보이는 부분"],
    general: defaults,
  };

  return pickVariant(byTopic[topic] ?? defaults, seed, 5);
}

function selectUniqueItems(items: readonly string[], seed: number, count: number) {
  const ordered = rotateItems(Array.from(new Set(items)), seed);
  return ordered.slice(0, count);
}

function buildCheckItems(topic: string, title: string, description: string, seed: number) {
  const source = `${title} ${description}`;
  const baseByTopic: Record<string, string[]> = {
    odor: [
      "계단실 창문 주변 결로와 습기 흔적",
      "1층 현관 매트 아래 냄새 잔여감",
      "분리수거장과 계단 입구 사이 냄새 유입",
      "환기가 약한 복도 끝 먼지와 습기",
      "비 오는 날 물기가 고이는 계단 모서리",
      "하수구나 공용 화장실 방향 악취 동선",
    ],
    schedule: [
      "일주일 뒤에도 먼지가 다시 쌓이는 구간",
      "월 2회 관리로 충분한 층과 매주 관리가 필요한 층",
      "비 오는 날 흙먼지가 몰리는 1층 진입부",
      "입주민 출입이 많은 시간대의 오염 속도",
      "정기관리 사이에 민원이 생기는 반복 지점",
      "계절이 바뀔 때 오염이 늘어나는 현관 주변",
    ],
    entry: [
      "공동현관 유리 손잡이 주변 손자국",
      "출입문 하단 레일에 낀 모래와 먼지",
      "우편함 위쪽과 광고물 주변 먼지",
      "현관 바닥 물자국과 신발 자국",
      "유리 프레임 모서리의 오래된 얼룩",
      "출입문 옆 벽면 하단의 생활오염",
    ],
    commercial: [
      "방문객이 처음 보는 입구 바닥 얼룩",
      "상가 계단 난간의 손 닿는 구간",
      "공용 화장실 앞 냄새와 바닥 오염",
      "안내판과 출입문 주변 먼지",
      "영업시간 전후로 오염이 몰리는 동선",
      "점포 앞 복도와 계단 연결부",
    ],
    villa: [
      "층마다 먼지가 몰리는 계단 코너",
      "난간 아래 브래킷과 손잡이 하단",
      "공동현관 문턱과 우편함 주변",
      "복도 끝 창틀과 벽면 하단",
      "계단참에 쌓이는 머리카락과 생활먼지",
      "분리수거 후 흙먼지가 들어오는 입구",
    ],
    general: [
      "계단 논슬립 모서리와 줄눈 틈새",
      "공동현관 매트 아래와 유리 프레임 하단",
      "난간 손잡이와 브래킷 주변",
      "환기가 부족한 계단실의 습기와 냄새 잔여감",
      "계단참 구석의 머리카락과 먼지 뭉침",
      "출입문 주변 신발 자국과 물자국",
    ],
  };

  const contextual: string[] = [];
  if (/비용|효율|직접|업체|비교|말길|맡길/.test(source)) {
    contextual.push(
      "직접 청소할 때 빠지기 쉬운 계단 모서리",
      "업체 관리 시 작업 전후 사진으로 확인할 구간",
      "도구와 세제가 따로 필요한 묵은 오염",
      "반복 작업 시간이 많이 드는 공동현관 주변"
    );
  }
  if (/화장실|변기|세면대|타일/.test(source)) {
    contextual.push(
      "공용 화장실 바닥 배수구 주변",
      "세면대 하단 물때와 거울 얼룩",
      "화장실 출입문 손잡이와 문틀",
      "냄새가 남기 쉬운 환풍구 주변"
    );
  }
  if (/유리|창문|창틀|프레임/.test(source)) {
    contextual.push(
      "유리 하단 프레임의 먼지와 물때",
      "손이 자주 닿는 유리문 중앙부",
      "창틀 레일 안쪽의 흙먼지",
      "햇빛에 더 잘 보이는 유리 얼룩"
    );
  }
  if (/상가|사무실|업장|방문객/.test(source)) {
    contextual.push(
      "방문객 동선의 첫 계단과 입구",
      "영업장 앞 복도 바닥의 발자국",
      "간판이나 안내판 주변 먼지",
      "상가 공용부 냄새가 머무는 구간"
    );
  }
  if (/빌라|원룸|다세대|공동주택/.test(source)) {
    contextual.push(
      "입주민이 매일 지나는 1층 계단참",
      "층별 우편함과 현관문 주변 먼지",
      "복도 끝 환기창 아래 먼지",
      "광고지나 택배 포장재가 쌓이는 구석"
    );
  }

  const fallback = baseByTopic.general;
  const pool = [...contextual, ...(baseByTopic[topic] ?? fallback), ...fallback];
  return selectUniqueItems(pool, seed >> 1, 4);
}

function buildNaverDraft(input: { url: string; title?: string; description?: string; image?: string }) {
  const title = cleanNaverTitle(input.title || inferTitleFromUrl(input.url));
  const description =
    input.description ||
    `${title}에 대해 이천계단지기가 실제 계단청소 현장 기준으로 정리한 관리정보입니다.`;
  const seed = createSeed(`${input.url}|${title}|${description}`);
  const topic = pickTopic(`${title} ${description}`);
  const section = buildTopicSections(topic, title, description);
  const seoTitle = `${title} | 이천계단지기`;
  const seoDescription = `${description} 이천계단지기가 현장 기준으로 관리 포인트를 정리했습니다.`.slice(0, 150);
  const seoKeywords = buildSeoKeywords(title, description);
  const orderedSummaryPoints = rotateItems(section.summaryPoints, seed);
  const orderedChecks = buildCheckItems(topic, title, description, seed);

  const content = [
    `# ${title}`,
    "",
    buildIntro(seed),
    "",
    buildSubheading(seed, topic),
    "",
    pickVariant([
      section.lead,
      `${description} 이 주제는 실제로 문의가 자주 들어오는 내용이라 기본 원리부터 같이 보는 편이 좋습니다.`,
      `${description} 단순히 한 번 청소하는 문제보다, 어떤 지점에서 반복되는지 먼저 파악해야 관리가 쉬워집니다.`,
    ], seed, 7),
    "",
    section.summaryTitle,
    ...orderedSummaryPoints.map((point) => `- ${point}`),
    "",
    section.checkTitle,
    ...orderedChecks.map((item) => `- ${item}`),
    "",
    section.methodTitle,
    pickVariant([
      section.methodBody,
      `${section.methodBody} 현장에 따라 먼저 손봐야 할 구간은 달라질 수 있어, 사진 확인 후 순서를 정하는 편이 효율적입니다.`,
      `${section.methodBody} 특히 민원이 반복되는 지점이 있다면 그 부분을 중심으로 관리 우선순위를 잡는 것이 좋습니다.`,
    ], seed, 11),
    "",
    buildClosing(seed),
    "",
    `[네이버 블로그 원문 보기](${input.url})`,
  ].join("\n");

  return {
    title,
    content,
    thumbnail: input.image || "",
    thumbnailAlt: `${title} 이천계단지기 관리정보`,
    seoTitle: seoTitle.slice(0, 90),
    seoDescription,
    seoKeywords,
  };
}

export const blogRouter = router({
  list: publicProcedure
    .input(
      z.object({
        tag: z.string().optional(),
        limit: z.number().min(1).max(50).default(12),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { posts: [], total: 0 };

      const rows = await db
        .select()
        .from(posts)
        .where(eq(posts.published, "published"))
        .orderBy(desc(posts.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      const parsed = rows.map(parsePost);
      if (!input.tag) return { posts: parsed, total: parsed.length };

      const tag = await db.select().from(postTags).where(eq(postTags.slug, input.tag)).limit(1);
      if (!tag.length) return { posts: [], total: 0 };

      const filtered = parsed.filter((post) => post.tags.includes(tag[0].id));
      return { posts: filtered, total: filtered.length };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "NOT_FOUND" });

      const result = await db.select().from(posts).where(eq(posts.id, input.id)).limit(1);
      if (!result.length) {
        throw new TRPCError({ code: "NOT_FOUND", message: "게시글을 찾을 수 없습니다." });
      }

      return parsePost(result[0]);
    }),

  tags: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(postTags).orderBy(postTags.name);
  }),

  adminList: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    const rows = await db.select().from(posts).orderBy(desc(posts.createdAt));
    return rows.map(parsePost);
  }),

  importNaverDraft: adminProcedure
    .input(z.object({ url: z.string().url("네이버 블로그 주소를 입력해주세요.") }))
    .mutation(async ({ input }) => {
      if (!input.url.includes("blog.naver.com")) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "네이버 블로그 주소만 변환할 수 있습니다." });
      }

      const match = input.url.match(/blog\.naver\.com\/([^/?#]+)\/(\d+)/);
      const [, blogId, logNo] = match ?? [];

      const candidates = [
        logNo && blogId ? `https://m.blog.naver.com/${blogId}/${logNo}` : null,
        logNo && blogId
          ? `https://blog.naver.com/PostView.naver?blogId=${blogId}&logNo=${logNo}&redirect=Dlog`
          : null,
        input.url,
      ].filter(Boolean) as string[];

      const browserHeaders = {
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "ko-KR,ko;q=0.9",
        Referer: "https://m.blog.naver.com/",
      };

      for (const candidateUrl of candidates) {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 8000);
          const response = await fetch(candidateUrl, {
            signal: controller.signal,
            headers: browserHeaders,
          });
          clearTimeout(timeout);

          if (!response.ok) continue;
          const html = await response.text();
          if (!html || html.length < 500) continue;

          const rawTitle = pickTitle(html);
          const isPostTitle =
            rawTitle &&
            !rawTitle.endsWith("블로그") &&
            rawTitle !== blogId &&
            rawTitle.length > 4;
          const title = isPostTitle ? rawTitle : inferTitleFromUrl(input.url);
          const description = pickMeta(html, "og:description") || pickMeta(html, "description");
          const validDescription = description && description.length > 20 ? description : undefined;
          const image = pickMeta(html, "og:image");

          return buildNaverDraft({ url: input.url, title, description: validDescription, image });
        } catch {
          continue;
        }
      }

      return buildNaverDraft({ url: input.url });
    }),

  create: adminProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        thumbnail: z.string().optional(),
        thumbnailAlt: z.string().optional(),
        images: z.array(z.string()).default([]),
        imageAlts: z.array(z.string()).default([]),
        tags: z.array(z.number()).default([]),
        published: z.enum(["draft", "published"]).default("draft"),
        seoTitle: z.string().max(100).optional(),
        seoDescription: z.string().max(160).optional(),
        seoKeywords: z.string().max(300).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const imageObjects = input.images.map((url, i) => ({ url, alt: input.imageAlts[i] || "" }));
      await db.insert(posts).values({
        title: input.title,
        content: input.content,
        thumbnail: input.thumbnail || null,
        thumbnailAlt: input.thumbnailAlt || null,
        images: JSON.stringify(imageObjects),
        tags: JSON.stringify(input.tags),
        published: input.published,
        authorId: ctx.user.id || 1,
        seoTitle: input.seoTitle || null,
        seoDescription: input.seoDescription || null,
        seoKeywords: input.seoKeywords || null,
      });

      const [created] = await db.select().from(posts).orderBy(desc(posts.createdAt)).limit(1);
      return created;
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        content: z.string().min(1).optional(),
        thumbnail: z.string().nullable().optional(),
        thumbnailAlt: z.string().nullable().optional(),
        images: z.array(z.string()).optional(),
        imageAlts: z.array(z.string()).optional(),
        tags: z.array(z.number()).optional(),
        published: z.enum(["draft", "published"]).optional(),
        seoTitle: z.string().max(100).nullable().optional(),
        seoDescription: z.string().max(160).nullable().optional(),
        seoKeywords: z.string().max(300).nullable().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const updateData: Record<string, unknown> = {};
      if (input.title !== undefined) updateData.title = input.title;
      if (input.content !== undefined) updateData.content = input.content;
      if (input.thumbnail !== undefined) updateData.thumbnail = input.thumbnail;
      if (input.thumbnailAlt !== undefined) updateData.thumbnailAlt = input.thumbnailAlt;
      if (input.images !== undefined) {
        const imageObjects = input.images.map((url, i) => ({ url, alt: input.imageAlts?.[i] || "" }));
        updateData.images = JSON.stringify(imageObjects);
      }
      if (input.tags !== undefined) updateData.tags = JSON.stringify(input.tags);
      if (input.published !== undefined) updateData.published = input.published;
      if (input.seoTitle !== undefined) updateData.seoTitle = input.seoTitle;
      if (input.seoDescription !== undefined) updateData.seoDescription = input.seoDescription;
      if (input.seoKeywords !== undefined) updateData.seoKeywords = input.seoKeywords;

      await db.update(posts).set(updateData).where(eq(posts.id, input.id));
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.delete(posts).where(eq(posts.id, input.id));
      return { success: true };
    }),

  createTag: adminProcedure
    .input(z.object({ name: z.string().min(1), slug: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.insert(postTags).values({ name: input.name, slug: input.slug });
      return { success: true };
    }),

  generateSeo: adminProcedure
    .input(z.object({ title: z.string().min(1), content: z.string().min(1) }))
    .mutation(({ input }) => ({
      seoTitle: `${input.title} | 이천계단지기`.slice(0, 90),
      seoDescription: input.content.replace(/[#*\[\]()`]/g, " ").replace(/\s+/g, " ").slice(0, 150),
      seoKeywords: "이천계단청소, 이천계단지기, 빌라계단청소, 원룸계단청소, 공용공간청소, 정기계단청소",
    })),

  generateAlt: adminProcedure
    .input(z.object({ imageUrl: z.string(), title: z.string().optional() }))
    .mutation(({ input }) => ({
      alt: (input.title ? `이천계단지기 ${input.title}` : "이천계단지기 계단청소 현장").slice(0, 50),
    })),

  uploadImage: adminProcedure
    .input(z.object({ filename: z.string(), mimeType: z.string(), base64: z.string() }))
    .mutation(({ input }) => ({
      url: `data:${input.mimeType};base64,${input.base64}`,
    })),
});
