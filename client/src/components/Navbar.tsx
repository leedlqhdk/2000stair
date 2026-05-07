import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import type { User } from "../../../drizzle/schema";
import { useLocation } from "wouter";

interface NavbarProps {
  isAuthenticated: boolean;
  user: User | null | undefined;
  onLogout: () => void;
}

export default function Navbar({ isAuthenticated, user, onLogout }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [, setLocation] = useLocation();

  const navLinks = [
    { label: "서비스 소개", href: "#how-it-works" },
    { label: "플랜", href: "#pricing" },
    { label: "견적 신청", href: "#quote-form" },
    { label: "블로그", href: "#blog-reviews" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <a href="/" className="flex items-center">
          <img
            src="/manus-storage/icheon-stair-logo-dark_474b2a76.png"
            alt="이천계단지기"
            className="h-9 w-auto"
          />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/my-quotes")}
              >
                내 견적
              </Button>
              <span className="text-sm text-muted-foreground">
                {user?.name || user?.email || "회원"}
              </span>
              <Button variant="outline" size="sm" onClick={onLogout}>
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => (window.location.href = getLoginUrl())}
              >
                로그인
              </Button>
              <Button
                size="sm"
                onClick={() => document.getElementById("quote-form")?.scrollIntoView({ behavior: "smooth" })}
              >
                무료 견적
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white pb-4">
          <nav className="container flex flex-col gap-3 pt-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="flex gap-2 pt-3 border-t border-border">
              {isAuthenticated ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => { setLocation("/my-quotes"); setMobileOpen(false); }}
                  >
                    내 견적
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={onLogout}>
                    로그아웃
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => (window.location.href = getLoginUrl())}
                  >
                    로그인
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      document.getElementById("quote-form")?.scrollIntoView({ behavior: "smooth" });
                      setMobileOpen(false);
                    }}
                  >
                    무료 견적
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
