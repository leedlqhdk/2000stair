import { ChevronDown, Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import FullScreenMenu from "@/components/FullScreenMenu";
import { navGroups, type NavGroup } from "@/data/navMenu";

// 데스크톱 전체 메뉴는 홈을 맨 앞에 둔다 (모바일 메뉴는 홈을 따로 그린다)
const desktopGroups: NavGroup[] = [{ label: "홈", href: "/", items: [] }, ...navGroups];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMobileIndex, setOpenMobileIndex] = useState<number | null>(null);
  const [location, setLocation] = useLocation();
  const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 20);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  const [fullMenuOpen, setFullMenuOpen] = useState(false);

  // 페이지가 바뀌면 전체 메뉴를 닫는다
  useEffect(() => {
    setFullMenuOpen(false);
  }, [location]);

  const openKakao = () => {
    window.open("https://pf.kakao.com/_IiNfn/chat", "_blank");
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setOpenMobileIndex(null);
  };

  const toggleMobileMenu = () => {
    const nextOpen = !mobileOpen;
    setMobileOpen(nextOpen);
    if (nextOpen) setOpenMobileIndex(null);
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSectionClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    sectionId?: string
  ) => {
    if (!sectionId) return;
    event.preventDefault();
    closeMobileMenu();
    if (location !== "/") {
      setLocation("/");
      window.setTimeout(() => scrollToSection(sectionId), 120);
      return;
    }
    scrollToSection(sectionId);
    window.history.replaceState(null, "", "/");
  };

  return (
    <header
  className={`sticky top-0 z-50 transition-all duration-300 ${
    scrolled
      ? "border-b border-slate-200 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.06)]"
      : "border-b border-slate-100 bg-white"
  }`}
>
      <div
  className={`container max-w-7xl flex items-center justify-between transition-all duration-300 ${
    scrolled ? "h-14" : "h-16"
  }`}
>
        <a href="/" className="flex items-center" aria-label="이천계단지기 홈으로 이동">
          <img
            src="/images/icheon-logo-main-1200.png"
            alt="이천계단지기"
            className={`w-auto max-w-[190px] object-contain transition-all duration-300 ${
  scrolled ? "h-9 md:h-10" : "h-10 md:h-11"
}`}
          />
        </a>

        {/* 데스크톱 상단에는 로고와 ☰ 버튼만 두고, 메뉴는 전체화면 메뉴에서 보여준다 */}
        <div className="hidden md:flex">
          <FullScreenMenu open={fullMenuOpen} onOpenChange={setFullMenuOpen} groups={desktopGroups} compact={scrolled} />
        </div>

        <button
          className="md:hidden w-10 h-10 rounded-full border border-blue-100 bg-white flex items-center justify-center"
          onClick={toggleMobileMenu}
          aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-blue-100 bg-white/95 backdrop-blur-xl">
          <nav className="container py-4">
            <div className="rounded-3xl border border-blue-100 bg-blue-50/40 p-3">
              <Link href="/" className="block rounded-2xl px-4 py-3 text-base font-bold text-foreground hover:bg-white transition-colors" onClick={closeMobileMenu}>
                홈
              </Link>

              {navGroups.map((group, idx) =>
                group.href ? (
                  <Link key={group.label} href={group.href} className="block rounded-2xl px-4 py-3 text-base font-extrabold text-foreground hover:bg-white transition-colors" onClick={closeMobileMenu}>
                    {group.label}
                  </Link>
                ) : (
                <div key={group.label} className="rounded-2xl px-4 py-3">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between text-base font-extrabold text-foreground"
                    onClick={() => setOpenMobileIndex(openMobileIndex === idx ? null : idx)}
                    aria-expanded={openMobileIndex === idx}
                  >
                    {group.label}
                    <ChevronDown className={`h-4 w-4 transition-transform ${openMobileIndex === idx ? "rotate-180" : ""}`} />
                  </button>
                  {openMobileIndex === idx && (
                    <div className={`mt-2 grid gap-1 ${group.label === "관리지역" ? "grid-cols-2" : ""}`}>
                      {group.items.map((item) =>
                        item.sectionId ? (
                          <a key={item.label} href={item.href} className="rounded-xl bg-white/70 px-4 py-2.5 text-sm font-bold text-muted-foreground" onClick={(e) => handleSectionClick(e, item.sectionId)}>
                            {item.label}
                          </a>
                        ) : item.href.startsWith('http') ? (
                          <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-white/70 px-4 py-2.5 text-sm font-bold text-muted-foreground" onClick={closeMobileMenu}>
                            {item.label}
                          </a>
                        ) : (
                          <Link key={item.label} href={item.href} className="rounded-xl bg-white/70 px-4 py-2.5 text-sm font-bold text-muted-foreground" onClick={closeMobileMenu}>
                            {item.label}
                          </Link>
                        )
                      )}
                    </div>
                  )}
                </div>
                )
              )}


            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
