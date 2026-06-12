import { ArrowRight } from "lucide-react";
import { Link z from "wouter";

const serviceCards = [
{
title: "ê³ë¨ì ê¸°ì²­ì",
subtitle: "ë¹ë¼Â·ìë£¸Â·ìê° ê³µì©ê³ë¨",
image: "/images/main-service-stair.webp",
href: "/services/stair",
},
{
title: "ì ë¦¬ì²­ì",
subtitle: "ìê°Â·ì¬ë¬´ì¤Â·ë§¤ì¥ ì ë¦¬ê´ë¦¬",
image: "/images/main-service-glass.webp",
href: "/services/glass",
},
{
title: "íì¥ì¤ì²­ì",
subtitle: "ìê°Â·ì¬ë¬´ì¤ ê³µì©íì¥ì¤",
image: "/images/main-service-restroom.webp",
href: "/services/bathroom",
},
];

export default function Services() {
return (
<div className="bg-gradient-to-b from-white via-blue-50/35 to-white">
<main className="px-4 py-10 md:px-10 md:py-24">
<section className="mx-auto max-w-6xl">
<div className="mb-7 text-center md:mb-14">
<p className="text-xs font-extrabold tracking-[0.32em] text-primary md:text-sm">
SERVICES
</p>
<h2 className="mb-2 text-2xl font-extrabold leading-[1.18] text-foreground md:mb-4 md:text-4xl">
ì´ì²ê³ë¨ì§ê¸° ìë¹ì¤
</h2>
<p className="mx-auto mt-2 max-w-xl text-xs leading-6 text-muted-foreground md:mt-4 md:text-base md:leading-7">
ì´ì² ë¹ë¼Â·ìê°Â·ìë£¸ ê³µì©ê³µê°ì ë¶ë¶ê° ì§ì  íì¸íê³  ê´ë¦¬í©ëë¤.
</p>
</div>

<div className="grid gap-3 md:grid-cols-3 md:gap-5">
{serviceCards.map((card) => (
<Link key={card.title} href={card.href}>
<a className="group relative block h-[220px] overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_8px_24px_rgba(15,76,169,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,76,169,0.14)] sm:h-[280px] md:h-[520px] md:rounded-[1.8rem] md:shadow-[0_18px_45px_rgba(15,76,169,0.10)]">
<img
src={card.image}
alt={card.title}
className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
loading="lazy"
/>

<div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/28 to-white/5" />
<div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/20 to-transparent md:h-28" />

<div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
<p className="mb-1 text-xs font-bold text-white/75 md:mb-2 md:text-sm">
{card.subtitle}
</p>

<h2 className="text-xl font-extrabold leading-tight tracking-tight text-white md:text-[2.15rem]">
{card.title}
</h2>

<div className="mt-3 flex items-center justify-between md:mt-8">
<span className="text-[10px] font-bold tracking-[0.22em] text-white/55 md:text-xs">
VIEW SERVICE
</span>

<span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-white group-hover:text-primary md:h-11 md:w-11">
<ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
</span>
</div>
</div>
</a>
</Link>
))}
</div>
</section>
</main>
</div>
);
}
