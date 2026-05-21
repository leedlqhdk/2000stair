import { Menu, X, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "서비스 소개", href: "/#how-it-works", external: true },
    { label: "청소 전후", href: "/#gallery", external: true },
    { label: "관리 지역", href: "/blog", external: false },
    { label: "청소 비용", href: "/#pricing", external: true },
  ];

  const openKakao = () => {
    window.open("https://pf.kakao.com/_IiNfn", "_blank");
  };

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

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
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
              {navLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block rounded-2xl px-4 py-3 text-base font-bold text-foreground hover:bg-white transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block rounded-2xl px-4 py-3 text-base font-bold text-foreground hover:bg-white transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              )}

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
