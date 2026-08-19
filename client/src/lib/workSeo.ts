import type { SeoProps } from "@/components/Seo";
import type { AreaPost } from "@/hooks/useAreaPosts";
import { getPrimaryWorkService, WORK_SERVICE_LINKS } from "@shared/workRelatedLinks";
import { getWorkSlug } from "./workSlug";

const SITE_URL = "https://2000stair.kr";

export const workAreaLabels: Record<string, string> = {
  majang: "마장면",
  daewol: "대월면",
  sindun: "신둔면",
  downtown: "이천 시내권",
  gwango: "관고동",
  changjeon: "창전동",
  jungni: "중리동",
  jeungpo: "증포동",
  bubal: "부발읍",
  baeksa: "백사면",
  gonjiam: "곤지암읍 인근",
};

export const workAreaRoutes: Record<string, string> = {
  majang: "/area/majang",
  daewol: "/area/daewol",
  sindun: "/area/sindun",
  downtown: "/areas",
  gwango: "/area/gwango",
  changjeon: "/area/changjeon",
  jungni: "/area/jungni",
  jeungpo: "/area/jeungpo",
  bubal: "/area/bubal",
  baeksa: "/area/baeksa",
  gonjiam: "/area/gonjiam",
};

export function getWorkAreaLabel(area?: string) {
  if (!area) return "이천";
  return workAreaLabels[area] ?? area;
}

function withAreaPrefix(areaLabel: string, title: string) {
  return title.includes(areaLabel) ? title : `${areaLabel} ${title}`;
}

function toAbsoluteUrl(url: string) {
  return url.startsWith("http") ? url : `${SITE_URL}${url}`;
}

export function getWorkSeo(post: AreaPost): SeoProps {
  const slug = getWorkSlug(post);
  const areaLabel = getWorkAreaLabel(post.area);
  const canonical = `${SITE_URL}/work/${slug}`;
  const service = WORK_SERVICE_LINKS[getPrimaryWorkService(post)];
  const title = `${post.title} | ${areaLabel} ${service.breadcrumbName} 작업일지 | 이천계단지기`;
  const description =
    post.description ||
    `${withAreaPrefix(areaLabel, post.title)} 현장 기록입니다. 이천계단지기가 직접 관리한 ${service.breadcrumbName} 작업 사진과 날짜를 확인할 수 있습니다.`;
  const image = toAbsoluteUrl(post.image);
  const areaPath = post.area ? workAreaRoutes[post.area] : undefined;

  const breadcrumbItems = [
    { "@type": "ListItem", position: 1, name: "홈", item: `${SITE_URL}/` },
    ...(areaPath
      ? [{ "@type": "ListItem", position: 2, name: areaLabel, item: `${SITE_URL}${areaPath}` }]
      : []),
    {
      "@type": "ListItem",
      position: areaPath ? 3 : 2,
      name: service.breadcrumbName,
      item: `${SITE_URL}${service.href}`,
    },
    { "@type": "ListItem", position: areaPath ? 4 : 3, name: post.title, item: canonical },
  ];

  return {
    title,
    description,
    canonical,
    keywords: `${areaLabel} ${service.breadcrumbName}, ${post.title}, 이천계단청소, 실제 작업일지, 청소 전후 사진`,
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
