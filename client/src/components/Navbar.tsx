import { ChevronDown, Menu, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

type DropdownItem = {
  label: string;
  href: string;
  sectionId?: string;
};

type NavGroup = {
  label: string;
  items: DropdownItem[];
};

const navGroups: NavGroup[] = [
  {
    label: "서비스",
    items: [
      { label: "계단청소", href: "/#how-it-works", sectionId: "how-it-works" },
      { label: "유리청소", href: "/#how-it-works", sectionId: "how-it-works" },
      { label: "화장실청소", href: "/#how-it-works", sectionId: "how-it-works" },
      { label: "사무실청소", href: "/#how-it-works", sectionId: "how-it-works" },
    ],
  },
  {
    label: "청소현장",
    items: [
      { label: "시내권", href: "/area/downtown" },
      { label: "신둔면", href: "/area/sindun" },
      { label: "마장면", href: "/area/majang" },
      { label: "부발읍", href: "/area/bubal" },
      { label: "대월면", href: "/area/daewol" },
    ],
  },
  {
    label: "정보센터",
    items: [
      { label: "블로그", href: "https://blog.naver.com/icheonstair" },
      { label: "정보글", href: "/areas" },
      { label: "자주묻는질문", href: "/qna" },
    ],
  },
  {
    label: "회사소개",
    items: [
      { label: "이천계단지기 소개", href: "/about" },
      { label: "부부 운영 이야기", href: "/about" },
      { label: "실제 고객후기", href: "/qna" },
    ],
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMobileIndex, setOpenMobileIndex] = useState<number | null>(null);
  const [location, setLocation] = useLocation();

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
  const dropdownPanelClass = "invisible absolute left-1/2 top-full z-50 mt-3 min-w-44 -translate-x-1/2 rounded-2xl border border-blue-100 bg-white p-2 opacity-0 shadow-xl shadow-blue-950/10 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100";
  const dropdownItemClass = "block rounded-xl px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-blue-50 hover:text-primary";

  return (
    <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/85 backdrop-blur-xl">
      <div className="container max-w-7xl flex items-center justify-between h-16">
        <a href="/" className="flex items-center" aria-label="이천계단지기 홈으로 이동">
          <img
            src="/images/icheon-logo-main.png"
            alt="이천계단지기"
            className="h-10 md:h-11 w-auto max-w-[190px] object-contain"
          />
        </a>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className={linkClass}>홈</Link>

          {navGroups.map((group) => (
            <div key={group.label} className="group relative py-5">
              <button type="button" className={dropdownButtonClass} aria-haspopup="true">
                {group.label}
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              <div className={dropdownPanelClass}>
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
          ))}

          <Button size="sm" className="rounded-full font-bold" onClick={openKakao}>
            <MessageCircle className="w-4 h-4 mr-1.5" />
            카톡 상담
          </Button>
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

              {navGroups.map((group, idx) => (
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
                    <div className="mt-2 grid gap-1">
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
              ))}

              <Button size="lg" className="mt-3 w-full rounded-2xl font-bold" onClick={() => { openKakao(); closeMobileMenu(); }}>
                <MessageCircle className="w-4 h-4 mr-2" />
                카톡 상담
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
