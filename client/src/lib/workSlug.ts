import type { AreaPost } from "@/hooks/useAreaPosts";

const replacements: Array<[RegExp, string]> = [
  [/이천/g, "icheon"],
  [/마장면|마장/g, "majang"],
  [/대월면|대월/g, "daewol"],
  [/신둔면|신둔/g, "sindun"],
  [/시내권|시내/g, "downtown"],
  [/부발읍|부발/g, "bubal"],
  [/송정동|송정/g, "songjeong-dong"],
  [/관고동|관고/g, "gwango-dong"],
  [/창전동|창전/g, "changjeon-dong"],
  [/증포동|증포/g, "jeungpo-dong"],
  [/중리동|중리/g, "jungni-dong"],
  [/갈산동|갈산/g, "galsan-dong"],
  [/안흥동|안흥/g, "anheung-dong"],
  [/사음동|사음/g, "saeum-dong"],
  [/양촌사거리|양촌/g, "yangchon"],
  [/오천교|오천리|오천/g, "ocheon"],
  [/덕평로|덕평/g, "deokpyeong"],
  [/수광리|수광/g, "sugwang-ri"],
  [/원룸건물|원룸/g, "one-room"],
  [/연립빌라|빌라/g, "villa"],
  [/상가건물|상가/g, "commercial"],
  [/공용공간/g, "common-area"],
  [/공용복도|복도/g, "hallway"],
  [/공동현관|현관/g, "entrance"],
  [/창틀/g, "window-frame"],
  [/유리코팅/g, "glass-coating"],
  [/유리관리|유리/g, "glass"],
  [/먼지/g, "dust"],
  [/제거/g, "removal"],
  [/바닥/g, "floor"],
  [/계단청소/g, "stair-cleaning"],
  [/계단/g, "stair"],
  [/정기청소/g, "regular-cleaning"],
  [/정기관리/g, "regular-maintenance"],
  [/청소/g, "cleaning"],
  [/관리/g, "maintenance"],
  [/견적/g, "estimate"],
];

const areaPrefix: Record<string, string> = {
  majang: "majang",
  daewol: "daewol",
  sindun: "sindun",
  downtown: "downtown",
};

function normalizeDate(date: string) {
  return date.replace(/[^0-9]/g, "").slice(0, 8);
}

function toEnglishSlug(value: string) {
  let slug = value.toLowerCase();

  replacements.forEach(([pattern, replacement]) => {
    slug = slug.replace(pattern, ` ${replacement} `);
  });

  return slug
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

export function getWorkSlug(post: AreaPost) {
  const titleSlug = toEnglishSlug(post.title);
  const area = post.area ? areaPrefix[post.area] ?? toEnglishSlug(post.area) : "icheon";
  const date = normalizeDate(post.date);
  const baseSlug = titleSlug.startsWith(area) ? titleSlug : `${area}-${titleSlug}`;

  return [baseSlug, date].filter(Boolean).join("-");
}

export function getWorkPath(post: AreaPost) {
  return `/work/${getWorkSlug(post)}`;
}
