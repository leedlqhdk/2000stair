import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import type { NavGroup } from "@/data/navMenu";

type FullScreenMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups: NavGroup[];
  /** 상단 메뉴가 스크롤로 줄어든 상태 — 로고·닫기 버튼 위치를 상단 메뉴와 맞춘다 */
  compact: boolean;
  /** ☰ 버튼 색: 어두운 배경 위(투명 상단 바)에서는 흰색 */
  tone?: "light" | "dark";
};

// 데스크톱 전체 메뉴: ☰ 버튼을 누르면 화면 전체를 덮는 어두운 메뉴가 위에서 내려온다.
export default function FullScreenMenu({ open, onOpenChange, groups, compact, tone = "light" }: FullScreenMenuProps) {
  const [location] = useLocation();
  const close = () => onOpenChange(false);

  const subLinkClass = (href: string) =>
    `inline-block text-[15px] font-medium transition-colors hover:text-white ${
      location === href ? "text-white" : "text-white/55"
    }`;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Trigger asChild>
        <button
          type="button"
          className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300 ${
            tone === "dark" ? "text-white hover:bg-white/10" : "text-slate-700 hover:bg-blue-50 hover:text-primary"
          }`}
          aria-label="전체 메뉴 열기"
        >
          <Menu className="h-6 w-6" />
        </button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[80]" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="full-menu fixed inset-0 z-[81] overflow-y-auto bg-slate-950 text-white outline-none"
        >
          <DialogPrimitive.Title className="sr-only">전체 메뉴</DialogPrimitive.Title>

          <div className="full-menu-body container max-w-7xl">
            <div className={`flex items-center justify-between ${compact ? "h-14" : "h-16"}`}>
              <Link href="/" onClick={close} aria-label="이천계단지기 홈으로 이동" className="flex items-center">
                <img
                  src="/images/icheon-logo-white-1200.png"
                  alt="이천계단지기"
                  className={`w-auto max-w-[190px] object-contain ${compact ? "h-10" : "h-11"}`}
                />
              </Link>
              <DialogPrimitive.Close asChild>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="전체 메뉴 닫기"
                >
                  <X className="h-6 w-6" />
                </button>
              </DialogPrimitive.Close>
            </div>

            <nav aria-label="전체 메뉴" className="grid grid-cols-5 gap-x-8 pb-20 pt-[9vh] lg:gap-x-12">
              {groups.map((group) => (
                <div key={group.label} className="min-w-0">
                  {group.href ? (
                    <Link
                      href={group.href}
                      onClick={close}
                      aria-current={location === group.href ? "page" : undefined}
                      className="font-['GmarketSans'] text-xl font-bold text-white transition-colors hover:text-white/70 lg:text-[1.375rem]"
                    >
                      {group.label}
                    </Link>
                  ) : (
                    <p className="font-['GmarketSans'] text-xl font-bold text-white lg:text-[1.375rem]">{group.label}</p>
                  )}

                  <div className="mt-5 h-px bg-white/15" />

                  {group.items.length > 0 && (
                    <ul
                      className={`mt-6 ${
                        group.items.length > 6 ? "grid grid-cols-2 gap-x-4 gap-y-3.5" : "flex flex-col gap-3.5"
                      }`}
                    >
                      {group.items.map((item) => (
                        <li key={item.label}>
                          {item.href.startsWith("http") ? (
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={close}
                              className={subLinkClass(item.href)}
                            >
                              {item.label}
                            </a>
                          ) : (
                            <Link
                              href={item.href}
                              onClick={close}
                              aria-current={location === item.href ? "page" : undefined}
                              className={subLinkClass(item.href)}
                            >
                              {item.label}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
