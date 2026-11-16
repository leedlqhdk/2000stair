// 작업일지 사진 주소
// 노션에 올린 사진은 1시간짜리 서명이 붙은 주소(prod-files-secure.s3…?X-Amz-…)라 금방 만료된다.
// 그런 주소는 사이트의 고정 주소(/api/work-image?slug=…&i=…)로 바꿔 쓴다.
// 화면(WorkDetail), 검색엔진용 og:image(workSeo), 빌드 때 만드는 정적 HTML(prerender)이 같은 규칙을 쓴다.

export function isExpiringNotionImageUrl(url: string) {
  return /prod-files-secure\.s3\./.test(url) || /[?&]X-Amz-Signature=/.test(url);
}

export function getWorkImageUrl(slug: string, index = 0, siteUrl = "") {
  return `${siteUrl}/api/work-image?slug=${encodeURIComponent(slug)}${index > 0 ? `&i=${index}` : ""}`;
}

/** 글의 사진 목록을 만료되지 않는 주소로 돌려준다 (사이트에 직접 올린 사진은 그대로) */
export function stableWorkImages(post: { image: string; images?: string[] }, slug: string, siteUrl = "") {
  const images = post.images?.length ? post.images : post.image ? [post.image] : [];
  return images.map((url, index) => (isExpiringNotionImageUrl(url) ? getWorkImageUrl(slug, index, siteUrl) : url));
}
