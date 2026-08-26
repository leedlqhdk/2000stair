export type WorkPostLike = {
  title: string;
  description?: string;
  buildingType?: string;
  workScope?: string;
  workType?: string;
};

export type WorkServiceKey = "stair" | "glass" | "bathroom" | "office";

export type WorkRelatedLink = {
  href: string;
  label: string;
};

export const WORK_SERVICE_LINKS: Record<WorkServiceKey, WorkRelatedLink & { breadcrumbName: string }> = {
  stair: {
    href: "/services/stair",
    label: "계단청소 범위·주기·비용 안내",
    breadcrumbName: "계단청소",
  },
  glass: {
    href: "/services/glass",
    label: "유리청소 범위·관리방법 안내",
    breadcrumbName: "유리청소",
  },
  bathroom: {
    href: "/services/bathroom",
    label: "공용화장실 청소·정기관리 안내",
    breadcrumbName: "화장실청소",
  },
  office: {
    href: "/services/office",
    label: "사무실·상가 정기청소 안내",
    breadcrumbName: "사무실청소",
  },
};

function getWorkSearchText(post: WorkPostLike) {
  return [post.title, post.description, post.buildingType, post.workScope, post.workType]
    .filter(Boolean)
    .join(" ");
}

export function getPrimaryWorkService(post: WorkPostLike): WorkServiceKey {
  const primaryText = [post.title, post.workScope, post.workType]
    .filter(Boolean)
    .join(" ");
  const text = getWorkSearchText(post);

  if (/화장실|욕실|변기|세면대|수전|배수구|악취/.test(primaryText)) {
    return "bathroom";
  }

  if (/유리|창문|창틀|코팅|출입문|전면/.test(primaryText)) {
    return "glass";
  }

  if (/사무실|오피스|탕비실|책상|휴지통/.test(primaryText)) {
    return "office";
  }

  if (/계단|복도|공동현관|정기관리|정기청소/.test(primaryText)) {
    return "stair";
  }

  if (/견적/.test(primaryText)) {
    return "stair";
  }

  if (/화장실|욕실|변기|세면대|수전|배수구|악취/.test(text)) {
    return "bathroom";
  }

  if (/사무실|오피스|탕비실|책상|휴지통/.test(text)) {
    return "office";
  }

  if (/유리청소|창문청소|창틀|유리코팅|전면\s*유리/.test(text)) {
    return "glass";
  }

  return "stair";
}

export function getWorkRelatedLinks(
  post: WorkPostLike,
  { areaLabel, areaHref }: { areaLabel: string; areaHref: string }
): WorkRelatedLink[] {
  const primaryService = getPrimaryWorkService(post);
  const primaryServiceLink = WORK_SERVICE_LINKS[primaryService];
  const links: WorkRelatedLink[] = [
    { href: areaHref, label: `${areaLabel} 계단청소 안내` },
    { href: primaryServiceLink.href, label: primaryServiceLink.label },
  ];

  if (primaryService !== "stair") {
    links.push({ href: WORK_SERVICE_LINKS.stair.href, label: "계단 정기관리 안내" });
  }

  links.push({ href: "/records", label: "다른 실제 작업일지 보기" });

  return links.filter((link, index, array) => array.findIndex((item) => item.href === link.href) === index);
}
