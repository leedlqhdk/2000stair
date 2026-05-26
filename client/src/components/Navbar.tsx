import { ChevronDown, Menu, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

const serviceLinks = [
  { label: "서비스 안내", href: "/#how-it-works", sectionId: "how-it-works" },
  { label: "청소 전후", href: "/#gallery", sectionId: "gallery" },
  { label: "청소 비용", href: "/#pricing", sectionId: "pricing" },
];

const areaLinks = [
  { label: "전체 보기", href: "/areas" },
  { label: "시내권", href: "/area/downtown" },
  { label: "마장면", href: "/area/majang" },
  { label: "신둔면", href: "/area/sindun" },
  { label: "부발읍", href: "/area/bubal" },
  { label: "대월면", href: "/area/daewol" },
  { label: "백사면", href: "/area/baeksa" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location, setLocation] = useLocation();

  const openKakao = () => {
    window.open("https://pf.kakao.com/_IiNfn/chat", "_blank");
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
    setMobileOpen(false);

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
          <Link href="/about" className={linkClass}>
            소개
          </Link>

          <div className="group relative py-5">
            <button type="button" className={dropdownButtonClass} aria-haspopup="true">
              서비스
              <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
            </button>
            <div className={dropdownPanelClass}>
              {serviceLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={dropdownItemClass}
                  onClick={(event) => handleSectionClick(event, link.sectionId)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="group relative py-5">
            <button type="button" className={dropdownButtonClass} aria-haspopup="true">
              관리지역
              <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
            </button>
            <div className={dropdownPanelClass}>
              {areaLinks.map((link) => (
                <Link key={link.href} href={link.href} className={dropdownItemClass}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <Link href="/records" className={linkClass}>
            작업기록
          </Link>
        </nav>

        <button
          className="md:hidden w-10 h-10 rounded-full border border-blue-100 bg-white flex items-center justify-center"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="메뉴 열기"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-blue-100 bg-white/95 backdrop-blur-xl">
          <nav className="container py-4">
            <div className="rounded-3xl border border-blue-100 bg-blue-50/40 p-3">
              <Link
                href="/about"
                className="block rounded-2xl px-4 py-3 text-base font-bold text-foreground hover:bg-white transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                소개
              </Link>

              <div className="rounded-2xl px-4 py-3">
                <p className="mb-2 flex items-center justify-between text-base font-extrabold text-foreground">
                  서비스
                  <ChevronDown className="h-4 w-4" />
                </p>
                <div className="grid gap-1">
                  {serviceLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="rounded-xl bg-white/70 px-4 py-2.5 text-sm font-bold text-muted-foreground"
                      onClick={(event) => handleSectionClick(event, link.sectionId)}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl px-4 py-3">
                <p className="mb-2 flex items-center justify-between text-base font-extrabold text-foreground">
                  관리지역
                  <ChevronDown className="h-4 w-4" />
                </p>
                <div className="grid gap-1">
                  {areaLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-xl bg-white/70 px-4 py-2.5 text-sm font-bold text-muted-foreground"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href="/records"
                className="block rounded-2xl px-4 py-3 text-base font-bold text-foreground hover:bg-white transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                작업기록
              </Link>

              <Button
                size="lg"
                className="mt-3 w-full rounded-2xl font-bold"
                onClick={() => {
                  openKakao();
                  setMobileOpen(false);
                }}
              >
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
