export type BeforeAfterItem = {
  id: string;
  title: string;
  category: string;
  before: string;
  after: string;
  featured?: boolean;
};

export const beforeAfterItems: BeforeAfterItem[] = [
  {
    id: "majang-villa-stair-rust",
    title: "빌라 계단 바닥 녹 제거",
    category: "계단청소",
    before: "/images/opt/before-after/majang-villa-stair-rust-removal-before-1600.webp",
    after: "/images/opt/before-after/majang-villa-stair-rust-removal-after-1600.webp",
    featured: true,
  },
  {
    id: "entrance-glass",
    title: "공동현관 유리청소",
    category: "유리청소",
    before: "/images/opt/before-after/glass-clean-before01-1600.webp",
    after: "/images/opt/before-after/glass-clean-after01-1600.webp",
    featured: true,
  },
  {
    id: "fire-extinguisher",
    title: "공용부 소화전 오염 정리",
    category: "공용공간 청소",
    before: "/images/opt/before-after/fire-extinguisher-before-1600.webp",
    after: "/images/opt/before-after/fire-extinguisher-after-1600.webp",
    featured: true,
  },
  {
    id: "window-frame",
    title: "창틀 오염 정리",
    category: "계단청소",
    before: "/images/opt/before-after/railing-before-1600.webp",
    after: "/images/opt/before-after/railing-after-1600.webp",
    featured: true,
  },
  {
    id: "stair-railing",
    title: "계단 난간 아래 청소",
    category: "계단청소",
    before: "/images/opt/before-after/stair-railing-before-1600.webp",
    after: "/images/opt/before-after/stair-railing-after-1600.webp",
    featured: true,
  },
  {
    id: "bathroom-shower",
    title: "화장실 샤워 수전 청소",
    category: "화장실청소",
    before: "/images/opt/before-after/bathroom-shower-cleaning-before-1600.webp",
    after: "/images/opt/before-after/bathroom-shower-cleaning-after-1600.webp",
    featured: true,
  },
  {
    id: "stair-floor",
    title: "계단 바닥 오염 정리",
    category: "계단청소",
    before: "/images/opt/before-after/stair-before-1600.webp",
    after: "/images/opt/before-after/stair-after-1600.webp",
  },
  {
    id: "stair-cleaning-01",
    title: "공용계단 청소 사례 1",
    category: "계단청소",
    before: "/images/opt/services/stair-cleaning/icheon-stair-cleaning-before-01-1600.webp",
    after: "/images/opt/services/stair-cleaning/icheon-stair-cleaning-after-01-1600.webp",
  },
  {
    id: "villa-stair-02",
    title: "빌라 계단 청소 사례",
    category: "계단청소",
    before: "/images/opt/services/stair-cleaning/icheon-villa-stair-before-02-1600.webp",
    after: "/images/opt/services/stair-cleaning/icheon-villa-stair-after-02-1600.webp",
  },
  {
    id: "apartment-stair-03",
    title: "공동계단 청소 사례 2",
    category: "계단청소",
    before: "/images/opt/services/stair-cleaning/icheon-apartment-stair-before-03-1600.webp",
    after: "/images/opt/services/stair-cleaning/icheon-apartment-stair-after-03-1600.webp",
  },
  {
    id: "bathroom-01",
    title: "공용화장실 청소 사례 1",
    category: "화장실청소",
    before: "/images/opt/services/restroom-cleaning/bathroom-01-before-1600.webp",
    after: "/images/opt/services/restroom-cleaning/bathroom-01-after-1600.webp",
  },
  {
    id: "bathroom-02",
    title: "공용화장실 청소 사례 2",
    category: "화장실청소",
    before: "/images/opt/services/restroom-cleaning/bathroom-02-before-1600.webp",
    after: "/images/opt/services/restroom-cleaning/bathroom-02-after-1600.webp",
  },
];

// 사진은 화면 크기에 맞게 줄인 버전(public/images/opt)을 쓴다: 기본 1600px, 휴대폰용 800px, 썸네일 320px
export const beforeAfterSrcSet = (src: string) => `${src.replace("-1600.webp", "-800.webp")} 800w, ${src} 1600w`;
export const beforeAfterThumb = (src: string) => src.replace("-1600.webp", "-thumb.webp");

export const featuredBeforeAfterItems = beforeAfterItems.filter(
  (item) => item.featured,
);
