import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "청소전후", href: "#gallery", external: true },
    { label: "작업영상", href: "#shorts", external: true },
    { label: "가격안내", href: "#pricing", external: true },
    { label: "작업일지", href: "/blog", external: false },
  ];

  const openKakao = () => {
    window.open("https://pf.kakao.com/_IiNfn", "_blank");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="container max-w-7xl flex items-center justify-between h-16">
        <a href="/" className="flex items-center">
          <img
            src="/manus-storage/icheon-stair-logo-dark_474b2a76.png"
            alt="이천계단지기"
            className="h-9 w-auto"
          />
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button size="sm" onClick={openKakao}>
            카톡 상담
          </Button>
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white pb-4">
          <nav className="container flex flex-col gap-3 pt-4">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}

            <div className="pt-3 border-t border-border">
              <Button
                size="sm"
                className="w-full"
                onClick={() => {
                  openKakao();
                  setMobileOpen(false);
                }}
              >
                카톡 상담
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
