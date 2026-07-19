import type { AreaPost } from "@/hooks/useAreaPosts";
import { getWorkSlug as sharedGetWorkSlug } from "@shared/workSlug";

// 슬러그 생성 로직은 shared/workSlug.ts 공용 모듈에 있다
// (api/work-og.ts, api/sitemap.ts와 동일한 슬러그를 보장하기 위함)

export function getWorkSlug(post: AreaPost) {
  return sharedGetWorkSlug(post);
}

export function getWorkPath(post: AreaPost) {
  return `/work/${getWorkSlug(post)}`;
}
