import { ChevronDown, Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import FullScreenMenu from "@/components/FullScreenMenu";
import { navGroups, type NavGroup } from "@/data/navMenu";
import { useDarkSectionBehind } from "@/hooks/useDarkSectionBehind";

// 데스크톱 전체 메뉴는 홈을 맨 앞에 둔다 (모바일 메뉴는 홈을 따로 그린다)
const desktopGroups: NavGroup[] = [{ label: "홈", href: "/", items: [] }, ...navGroups];

type NavbarProps = {
  /** PC에서 상단 바를 투명하게 띄우고, 뒤 배경(data-nav-theme="dark")에 따라 로고·버튼 색을 바꾼다 */
  overlay?: boolean;
};

export default function Navbar({ overlay = false }: NavbarProps) {
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
  // 투명 상단 바 바로 뒤(상단 바 세로 가운데)가 어두운 섹션이면 흰 로고·흰 버튼으로 바꾼다
  // 첫 화면 사진이 어두우므로 처음엔 어둡게 시작한다
  const onDark = useDarkSectionBehind(() => 28, { enabled: overlay, initial: overlay });

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
  } ${overlay ? "md:fixed md:inset-x-0 md:border-transparent md:bg-transparent md:shadow-none" : ""}`}
>
      <div
  className={`container max-w-7xl flex items-center justify-between transition-all duration-300 ${
    scrolled ? "h-14" : "h-16"
  }`}
>
        <a href="/" className="relative flex min-h-11 items-center" aria-label="이천계단지기 홈으로 이동">
          <img
            src="/images/icheon-logo-main-1200.png"
            alt="이천계단지기"
            className={`w-auto max-w-[190px] object-contain transition-all duration-300 ${
  scrolled ? "h-9 md:h-10" : "h-10 md:h-11"
} ${overlay && onDark ? "md:opacity-0" : ""}`}
          />
          {overlay && (
            // 어두운 배경 위에서 보이는 흰 로고 (PC 전용)
            <img
              src="/images/icheon-logo-white-1200.png"
              alt=""
              aria-hidden="true"
              // 모바일에서는 숨겨져 있으므로 받지 않도록 lazy
              loading="lazy"
              className={`absolute left-0 top-1/2 hidden w-auto max-w-[190px] -translate-y-1/2 object-contain transition-all duration-300 md:block ${
                scrolled ? "h-10" : "h-11"
              } ${onDark ? "opacity-100" : "opacity-0"}`}
            />
          )}
        </a>

        {/* 데스크톱 상단에는 로고와 ☰ 버튼만 두고, 메뉴는 전체화면 메뉴에서 보여준다 */}
        <div className="hidden md:flex">
          <FullScreenMenu
            open={fullMenuOpen}
            onOpenChange={setFullMenuOpen}
            groups={desktopGroups}
            compact={scrolled}
            tone={overlay && onDark ? "dark" : "light"}
          />
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
