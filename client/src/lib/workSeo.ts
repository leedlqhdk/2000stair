import type { SeoProps } from "@/components/Seo";
import type { AreaPost } from "@/hooks/useAreaPosts";
import { getWorkSlug } from "./workSlug";

const SITE_URL = "https://2000stair.kr";

export const workAreaLabels: Record<string, string> = {
  majang: "마장면",
  daewol: "대월면",
  sindun: "신둔면",
  downtown: "시내권",
  bubal: "부발읍",
  baeksa: "백사면",
};

export const workAreaRoutes: Record<string, string> = {
  majang: "/area/majang",
  daewol: "/area/daewol",
  sindun: "/area/sindun",
  downtown: "/area/downtown",
  bubal: "/area/bubal",
  baeksa: "/area/baeksa",
};

export function getWorkAreaLabel(area?: string) {
  if (!area) return "이천";
  return workAreaLabels[area] ?? area;
}

function toAbsoluteUrl(url: string) {
  return url.startsWith("http") ? url : `${SITE_URL}${url}`;
}

export function getWorkSeo(post: AreaPost): SeoProps {
  const slug = getWorkSlug(post);
  const areaLabel = getWorkAreaLabel(post.area);
  const canonical = `${SITE_URL}/work/${slug}`;
  const title = `${post.title} | ${areaLabel} 계단청소 작업일지 | 이천계단지기`;
  const description =
    post.description ||
    `${areaLabel} ${post.title} 현장 기록입니다. 이천계단지기가 직접 관리한 계단청소 작업 사진과 날짜를 확인할 수 있습니다.`;
  const image = toAbsoluteUrl(post.image);
  const areaPath = post.area ? workAreaRoutes[post.area] : undefined;

  const breadcrumbItems = [
    { "@type": "ListItem", position: 1, name: "홈", item: `${SITE_URL}/` },
    ...(areaPath
      ? [{ "@type": "ListItem", position: 2, name: areaLabel, item: `${SITE_URL}${areaPath}` }]
      : []),
    { "@type": "ListItem", position: areaPath ? 3 : 2, name: post.title, item: canonical },
  ];

  return {
    title,
    description,
    canonical,
    keywords: `${areaLabel} 계단청소, ${post.title}, 이천계단청소, 빌라계단청소, 상가계단청소`,
    image,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "ImageObject",
        "@id": `${canonical}#image`,
        contentUrl: image,
        url: canonical,
        name: post.title,
        description,
        datePublished: post.date.replace(/\./g, "-"),
        creator: { "@id": `${SITE_URL}/#business` },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: breadcrumbItems,
      },
    ],
  };
}
