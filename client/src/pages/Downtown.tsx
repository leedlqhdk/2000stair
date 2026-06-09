import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, MapPin, MessageCircle, Phone, Star } from "lucide-react";
import { motion } from "framer-motion";
import AreaTimeline from "@/components/AreaTimeline";
import { useAreaPosts, type AreaPost } from "@/hooks/useAreaPosts";

const fallbackPosts: AreaPost[] = [
{ title: "ì¡ì ë ë¹ë¼ ê³ë¨ì²­ì", date: "2026.05.20", image: "/images/areas/downtown/downtown-1.jpg", area: "downtown" },
{ title: "ê´ê³ ë ìê°ê±´ë¬¼ ê´ë¦¬", date: "2026.05.18", image: "/images/areas/downtown/downtown-2.jpg", area: "downtown" },
{ title: "ê´ê³ ë ìê° ê³ë¨ ì ê¸°ì²­ì", date: "2026.05.15", image: "/images/areas/downtown/downtown-3.jpg", area: "downtown" },
{ title: "ì¡ì ë ë¹ë¼ ê³ë¨ ë°ë¥ ì ê¸°ê´ë¦¬", date: "2026.05.12", image: "/images/areas/downtown/downtown-4.jpg", area: "downtown" },
{ title: "ì°½ì ë ì°ë¦½ë¹ë¼ ê³µëíê´ ì ë¦¬ì½í", date: "2026.04.19", image: "/images/areas/downtown/downtown-5.jpg", area: "downtown" },
{ title: "ìí¥ë ìê° íì¥ì¤ ì ê¸°ê´ë¦¬", date: "2026.04.10", image: "/images/areas/downtown/downtown-6.jpg", area: "downtown" },
];

const serviceAreas = ["ì ì²´", "ê´ê³ ë", "ì°½ì ë", "ì¦í¬ë", "ì¤ë¦¬ë", "ê°ì°ë", "ìí¥ë", "ì¡ì ë", "ì¬ìë"];

const serviceCards = [
  {
    title: "ì´ì² íì§ ê´ë¦¬",
    text: "ì´ì² ìë´ê¶ ë¹ë¼Â·ìë£¸Â·ìê°ì ê³ë¨ê³¼ ê³µì©ê³µê°ì ì ê¸°ì ì¼ë¡ ê´ë¦¬í©ëë¤.",
  },
  {
    title: "íì¥ ê¸°ë¡ ì ê³µ",
    text: "ë°©ë¬¸ë§ë¤ ìì ì í ì¬ì§ì ì§ì  ì´¬ìí´ ê¸°ë¡í©ëë¤. ë©ë¦¬ ìì´ë íì¥ ìíë¥¼ íì¸íì¤ ì ììµëë¤.",
  },
  {
    title: "ë¶ë¶ ì§ì ê´ë¦¬",
    text: "ì¸ì£¼ ìì´ ë¶ë¶ê° ì§ì  ììí©ëë¤. ë´ë¹ìê° ë°ëì§ ìì ê¾¸ì¤í íì§ì ì ì§í©ëë¤.",
  },
];

const reviews = [
"ê´ë¦¬ ì í ì¬ì§ì ë³´ë´ì£¼ìì íì¸íê¸° í¸íìµëë¤. ì°ë½ë ë¹¨ë¼ì ì¢ìì´ì.",
"ì ê¸°ì ì¼ë¡ ê´ë¦¬ë°ì¼ëê¹ ê±´ë¬¼ì´ ë ë¡ì ë³´ìëë¤.",
];

export default function DowntownAreaPage() {
const { posts } = useAreaPosts("downtown", fallbackPosts);
const [selectedArea, setSelectedArea] = useState("ì ì²´");

useEffect(() => {
  document.title = "ì´ì² ìë´ê¶ ê³ë¨ì²­ì ì ë¬¸ | ì´ì²ê³ë¨ì§ê¸°";
}, []);

const filteredPosts = selectedArea === "ì ì²´"
? posts
: posts.filter((post) => post.title.includes(selectedArea));

return (
<main className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">

<section className="container max-w-6xl pt-24 pb-16 md:pt-32 md:pb-24">
<motion.div
className="mb-10 md:mb-12"
initial={{ opacity: 0, y: 28 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.65 }}
>
<Link href="/areas">
<a className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-primary hover:opacity-80 transition">
<ArrowLeft className="h-4 w-4" />
ê´ë¦¬ì§ì­ì¼ë¡ ëìê°ê¸°
</a>
</Link>

<div className="rounded-[1.5rem] border border-blue-100 bg-white p-6 shadow-sm md:p-8">
<p className="mb-4 text-xs font-bold tracking-[0.35em] text-primary md:text-sm">
AREA ARCHIVE
</p>

<h1 className="mb-4 text-3xl font-extrabold leading-[1.18] text-foreground md:text-4xl">
ì´ì² ìë´ê¶ì ê³µì©ê³µê°ì ê¾¸ì¤í ê´ë¦¬í©ëë¤
</h1>

<p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
ê´ê³ ëÂ·ì°½ì ëÂ·ì¦í¬ëì ì¤ì¬ì¼ë¡ ë¹ë¼Â·ìë£¸Â·ìê° ê³µì©ê³µê°ì ì§ì  ê´ë¦¬í©ëë¤.
</p>

<div className="mt-7 border-t border-blue-100 pt-6">
<div className="mb-4 flex items-center gap-2 text-primary">
<MapPin className="h-5 w-5" />
<h2 className="text-xl font-extrabold text-foreground md:text-2xl">
ìë´ê¶ ê´ë¦¬ ê°ë¥ ì§ì­
</h2>
</div>

<div className="flex flex-wrap gap-2">
{serviceAreas.map((area) => {
const isActive = selectedArea === area;

return (
<button
key={area}
type="button"
onClick={() => setSelectedArea(area)}
className={`rounded-full px-4 py-2 text-sm font-bold transition-all duration-200 ${
isActive
? "bg-primary text-white shadow-sm"
: "bg-blue-50 text-primary hover:bg-primary/10"
}`}
aria-pressed={isActive}
>
{area}
</button>
);
})}
</div>
</div>
</div>
</motion.div>

<section className="mb-12 grid gap-4 md:grid-cols-3 md:mb-16">
  {serviceCards.map((card) => (
    <div key={card.title} className="rounded-[1.5rem] border border-blue-100 bg-white p-6 shadow-sm">
      <p className="mb-3 text-sm font-extrabold text-primary">{card.title}</p>
      <p className="text-sm leading-7 text-muted-foreground">{card.text}</p>
    </div>
  ))}
</section>

<AreaTimeline
areaName={selectedArea === "ì ì²´" ? "ìë´ê¶" : selectedArea}
areaSlug="downtown"
posts={filteredPosts}
title={selectedArea === "ì ì²´" ? "ìë´ê¶ ìì ì¼ì§" : `${selectedArea} ìì ì¼ì§`}
description={selectedArea === "ì ì²´" ? "ê´ê³ ëÂ·ì°½ì ëÂ·ì¦í¬ë ë± ìë´ê¶ íì¥ì ë ì§ìì¼ë¡ íì¸í´ë³´ì¸ì." : `${selectedArea} íì¥ ê¸°ë¡ë§ ëª¨ì ë³´ì¬ëë¦½ëë¤.`}
emptyMessage={`${selectedArea} ìì ê¸°ë¡ì ì¬ì§ ì ë¦¬ í ììëë¡ ì¶ê°í ê²ì.`}
/>

<section className="mb-12 md:mb-16">
<div className="mb-5">
<h2 className="text-xl font-extrabold text-foreground md:text-2xl">ê³ ê° íê¸°</h2>
<p className="mt-1 text-sm text-muted-foreground">ìë´ê¶ ê´ë¦¬ íì¥ìì ë°ì í¼ëë°±ìëë¤.</p>
</div>
<div className="grid gap-4 md:grid-cols-2">
{reviews.map((review) => (
<div key={review} className="rounded-[1.5rem] border border-blue-100 bg-white p-6 shadow-sm">
<div className="mb-3 flex items-center gap-1 text-yellow-400">
{Array.from({ length: 5 }).map((_, index) => (
<Star key={index} className="h-4 w-4 fill-current" />
))}
</div>
<p className="text-base leading-relaxed text-foreground">"{review}"</p>
<p className="mt-4 text-sm text-muted-foreground">ì´ì² ìë´ê¶ ê±´ë¬¼ì£¼ íê¸°</p>
</div>
))}
</div>
</section>

<section className="overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-7 text-center shadow-sm md:p-12">
<h2 className="mb-3 text-2xl font-extrabold text-foreground md:text-3xl">ì´ì² ìë´ê¶ ì²­ì ê´ë¦¬ê° íìíì ê°ì?</h2>
<p className="mb-8 text-muted-foreground">ê´ê³ ëÂ·ì°½ì ëÂ·ì¦í¬ë ì¸ê·¼ ì ê¸°ê´ë¦¬ì ì¼íì± ì²­ì ëª¨ë ë¬¸ì ê°ë¥í©ëë¤.</p>
<div className="mx-auto grid max-w-xl gap-3 sm:grid-cols-2">
<a href="https://pf.kakao.com/_IiNfn/chat" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-4 text-sm font-bold text-white transition hover:opacity-90">
<MessageCircle className="mr-2 h-4 w-4" />
ì¹´ì¹´ì¤í¡ ë¬¸ìíê¸°
</a>
<a href="tel:01084381887" className="inline-flex items-center justify-center rounded-xl border border-primary/20 bg-white px-6 py-4 text-sm font-bold text-primary transition hover:bg-blue-50">
<Phone className="mr-2 h-4 w-4" />
ì í ë¬¸ìíê¸°
</a>
</div>
</section>
</section>
</main>
);
}
