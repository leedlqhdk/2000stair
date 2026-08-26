import { ChevronDown, Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

type DropdownItem = {
  label: string;
  href: string;
  sectionId?: string;
};

type NavGroup = {
  label: string;
  href?: string;
  items: DropdownItem[];
};

const navGroups: NavGroup[] = [
  {
    label: "소개",
    href: "/about",
    items: [],
  },
  {
    label: "관리지역",
    items: [
      { label: "관고동", href: "/area/gwango" },
      { label: "창전동", href: "/area/changjeon" },
      { label: "중리동", href: "/area/jungni" },
      { label: "증포동", href: "/area/jeungpo" },
      { label: "부발읍", href: "/area/bubal" },
      { label: "신둔면", href: "/area/sindun" },
      { label: "백사면", href: "/area/baeksa" },
      { label: "마장면", href: "/area/majang" },
      { label: "대월면", href: "/area/daewol" },
      { label: "곤지암읍", href: "/area/gonjiam" },
    ],
  },
  {
    label: "청소서비스",
    items: [
      { label: "계단청소", href: "/services/stair" },
      { label: "사무실청소", href: "/services/office" },
      { label: "유리청소", href: "/services/glass" },
      { label: "화장실청소", href: "/services/bathroom" },
      
    ],
  },
  {
    label: "작업정보",
    items: [
      { label: "청소 전후", href: "/before-after" },
      { label: "자주 묻는 질문", href: "/qna" },
      { label: "정보글", href: "/guide" },
      { label: "공식블로그", href: "https://blog.naver.com/icheonstair" },
    ],
  },
  
];

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

  const linkClass = "text-sm font-semibold text-muted-foreground hover:text-primary transition-colors";
  const dropdownButtonClass = "inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors group-hover:text-primary";
  const dropdownPanelBaseClass =
  "invisible absolute top-full z-50 mt-4 min-w-52 rounded-3xl border border-blue-100/70 bg-white/95 p-3 opacity-0 backdrop-blur-xl shadow-[0_20px_60px_rgba(15,23,42,0.12)] transition-all duration-300 group-hover:visible group-hover:opacity-100";
  // 마지막 메뉴는 화면 오른쪽 끝에 있어 중앙 정렬 패널이 화면 밖으로 넘쳐 가로 스크롤을 만들므로 오른쪽 정렬
  const dropdownPanelClass = `${dropdownPanelBaseClass} left-1/2 -translate-x-1/2`;
  const dropdownPanelRightClass = `${dropdownPanelBaseClass} right-0`;
  const dropdownItemClass = "block rounded-xl px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-blue-50 hover:text-primary";

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
            src="/images/icheon-logo-main.png"
            alt="이천계단지기"
            className={`w-auto max-w-[190px] object-contain transition-all duration-300 ${
  scrolled ? "h-9 md:h-10" : "h-10 md:h-11"
}`}
          />
        </a>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className={linkClass}>홈</Link>

          {navGroups.map((group, idx) =>
            group.href ? (
              <Link key={group.label} href={group.href} className={linkClass}>
                {group.label}
              </Link>
            ) : (
            <div key={group.label} className="group relative py-5">
              <button type="button" className={dropdownButtonClass} aria-haspopup="true">
                {group.label}
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              <div
                className={`${idx === navGroups.length - 1 ? dropdownPanelRightClass : dropdownPanelClass} ${
                  group.label === "관리지역" ? "grid min-w-80 grid-cols-2 gap-1" : ""
                }`}
              >
                {group.items.map((item) =>
                  item.sectionId ? (
                    <a key={item.label} href={item.href} className={dropdownItemClass} onClick={(e) => handleSectionClick(e, item.sectionId)}>
                      {item.label}
                    </a>
                  ) : item.href.startsWith('http') ? (
                    <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className={dropdownItemClass}>
                      {item.label}
                    </a>
                  ) : (
                    <Link key={item.label} href={item.href} className={dropdownItemClass}>
                      {item.label}
                    </Link>
                  )
                )}
              </div>
            </div>
            )
          )}


        </nav>

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
