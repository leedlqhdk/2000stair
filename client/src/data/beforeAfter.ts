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
    before: "/images/before-after/majang-villa-stair-rust-removal-before.webp",
    after: "/images/before-after/majang-villa-stair-rust-removal-after.webp",
    featured: true,
  },
  {
    id: "entrance-glass",
    title: "공동현관 유리청소",
    category: "유리청소",
    before: "/images/before-after/glass-clean-before01.webp",
    after: "/images/before-after/glass-clean-after01.webp",
    featured: true,
  },
  {
    id: "fire-extinguisher",
    title: "공용부 소화전 오염 정리",
    category: "공용공간 청소",
    before: "/images/before-after/fire-extinguisher-before.webp",
    after: "/images/before-after/fire-extinguisher-after.webp",
    featured: true,
  },
  {
    id: "window-frame",
    title: "창틀 오염 정리",
    category: "계단청소",
    before: "/images/before-after/railing-before.webp",
    after: "/images/before-after/railing-after.webp",
    featured: true,
  },
  {
    id: "stair-railing",
    title: "계단 난간 아래 청소",
    category: "계단청소",
    before: "/images/before-after/stair-railing-before.webp",
    after: "/images/before-after/stair-railing-after.webp",
    featured: true,
  },
  {
    id: "bathroom-shower",
    title: "화장실 샤워 수전 청소",
    category: "화장실청소",
    before: "/images/before-after/bathroom-shower-cleaning-before.webp",
    after: "/images/before-after/bathroom-shower-cleaning-after.webp",
    featured: true,
  },
  {
    id: "stair-floor",
    title: "계단 바닥 오염 정리",
    category: "계단청소",
    before: "/images/before-after/stair-before.webp",
    after: "/images/before-after/stair-after.webp",
  },
  {
    id: "stair-cleaning-01",
    title: "공용계단 청소 사례 1",
    category: "계단청소",
    before: "/images/services/stair-cleaning/icheon-stair-cleaning-before-01.webp",
    after: "/images/services/stair-cleaning/icheon-stair-cleaning-after-01.webp",
  },
  {
    id: "villa-stair-02",
    title: "빌라 계단 청소 사례",
    category: "계단청소",
    before: "/images/services/stair-cleaning/icheon-villa-stair-before-02.webp",
    after: "/images/services/stair-cleaning/icheon-villa-stair-after-02.webp",
  },
  {
    id: "apartment-stair-03",
    title: "공동계단 청소 사례 2",
    category: "계단청소",
    before: "/images/services/stair-cleaning/icheon-apartment-stair-before-03.webp",
    after: "/images/services/stair-cleaning/icheon-apartment-stair-after-03.webp",
  },
  {
    id: "bathroom-01",
    title: "공용화장실 청소 사례 1",
    category: "화장실청소",
    before: "/images/services/restroom-cleaning/bathroom-01-before.webp",
    after: "/images/services/restroom-cleaning/bathroom-01-after.webp",
  },
  {
    id: "bathroom-02",
    title: "공용화장실 청소 사례 2",
    category: "화장실청소",
    before: "/images/services/restroom-cleaning/bathroom-02-before.webp",
    after: "/images/services/restroom-cleaning/bathroom-02-after.webp",
  },
];

export const featuredBeforeAfterItems = beforeAfterItems.filter(
  (item) => item.featured,
);
