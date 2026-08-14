import { MessageCircle, Phone, Star } from "lucide-react";
import AreaIntro from "@/components/AreaIntro";
import AreaTimeline from "@/components/AreaTimeline";
import { useAreaPosts, type AreaPost } from "@/hooks/useAreaPosts";

const fallbackPosts: AreaPost[] = [];

const reviews = [
"공용현관과 계단이 꾸준히 정리되니까 입주민 민원이 줄었습니다.",
"사진으로 전후 상태를 보내주셔서 관리 여부를 바로 확인할 수 있었습니다.",
];

const faqs = [
{
question: "부발읍 어느 지역까지 가능한가요?",
answer: "아미리, 무촌리, 신하리 등 부발읍 주요 생활권은 상담 가능합니다. 사진과 주소를 보내주시면 방문 가능 여부를 먼저 확인합니다.",
},
{
question: "작업 기록이 아직 없어도 상담 가능한가요?",
answer: "가능합니다. 작업 사진은 순차적으로 정리 중이며, 견적은 현재 건물 상태와 관리 범위를 기준으로 안내드립니다.",
},
{
question: "유리청소·화장실청소도 함께 가능한가요?",
answer: "네. 계단청소와 함께 공동현관 유리청소, 화장실청소도 정기관리 또는 개별로 문의하실 수 있습니다.",
},
];

export default function BubalAreaPage() {
const { posts } = useAreaPosts("bubal", fallbackPosts);

return (
<main className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
<section className="container max-w-6xl pt-24 pb-16 md:pt-32 md:pb-24">
<AreaIntro
headline="부발읍 계단청소와 공용공간 관리를 준비하고 있습니다"
description="부발읍 빌라·원룸·상가 공용공간을 하청 없이 직접 관리합니다. 작업 기록은 순차적으로 정리 중이며, 상담은 바로 가능합니다."
focus="아미리·무촌리·신하리 등 부발읍 생활권의 계단·복도·공동현관 상태를 확인하고 관리 주기를 안내합니다."
/>

<AreaTimeline areaName="부발읍" areaSlug="bubal" posts={posts} title="부발읍 작업 일지" description="부발읍 현장 사진은 정리되는 순서대로 작업 일지에 추가됩니다." emptyMessage="부발읍 작업 기록은 사진 정리 후 순서대로 추가할게요. 상담과 견적 안내는 지금도 가능합니다." />

<section className="mb-12 grid gap-4 md:grid-cols-2 md:mb-16">
{reviews.map((review) => (
<div key={review} className="rounded-[1.5rem] border border-blue-100 bg-white p-6 shadow-sm">
<div className="mb-3 flex items-center gap-1 text-yellow-400">
{Array.from({ length: 5 }).map((_, index) => (<Star key={index} className="h-4 w-4 fill-current" />))}
</div>
<p className="text-base leading-relaxed text-foreground">"{review}"</p>
<p className="mt-4 text-sm text-muted-foreground">부발읍 인근 건물 관리 피드백</p>
</div>
))}
</section>

<section className="mb-12 rounded-[1.5rem] border border-blue-100 bg-white p-6 shadow-sm md:mb-16 md:p-8">
<h2 className="mb-5 text-xl font-extrabold text-foreground md:text-2xl">자주 묻는 질문</h2>
<div className="grid gap-4 md:grid-cols-2">
{faqs.map((faq) => (
<div key={faq.question} className="rounded-2xl bg-blue-50/70 p-5">
<h3 className="mb-2 text-sm font-extrabold text-foreground">{faq.question}</h3>
<p className="text-sm leading-7 text-muted-foreground">{faq.answer}</p>
</div>
))}
</div>
</section>


<section className="overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-7 text-center shadow-sm md:p-12">
<h2 className="mb-3 text-2xl font-extrabold text-foreground md:text-3xl">부발읍 청소 관리가 필요하신가요?</h2>
<p className="mb-8 text-muted-foreground">계단·복도·공동현관 사진을 보내주시면 관리 가능 범위부터 확인해드립니다.</p>
<div className="mx-auto grid max-w-xl gap-3 sm:grid-cols-2">
<a href="https://pf.kakao.com/_IiNfn/chat" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-4 text-sm font-bold text-white transition hover:opacity-90">
<MessageCircle className="mr-2 h-4 w-4" />
카카오톡 문의하기
</a>
<a href="tel:01084381887" className="inline-flex items-center justify-center rounded-xl border border-primary/20 bg-white px-6 py-4 text-sm font-bold text-primary transition hover:bg-blue-50">
<Phone className="mr-2 h-4 w-4" />
전화 문의하기
</a>
</div>
</section>
</section>
</main>
);
}
