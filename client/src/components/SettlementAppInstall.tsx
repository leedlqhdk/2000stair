import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function SettlementAppInstall() {
  const [prompt, setPrompt] = useState<InstallEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [online, setOnline] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const manifest = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');
    const previous = manifest?.getAttribute("href");
    manifest?.setAttribute("href", "/admin/settlements.webmanifest");
    const title = document.title;
    document.title = "정산관리 | 이천계단지기";
    const media = window.matchMedia("(display-mode: standalone)");
    const standalone = () => setInstalled(media.matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
    const connection = () => setOnline(navigator.onLine);
    const available = (event: Event) => { event.preventDefault(); setPrompt(event as InstallEvent); };
    const completed = () => { setInstalled(true); setPrompt(null); };
    standalone();
    connection();
    window.addEventListener("beforeinstallprompt", available);
    window.addEventListener("appinstalled", completed);
    window.addEventListener("online", connection);
    window.addEventListener("offline", connection);
    media.addEventListener("change", standalone);
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/admin/settlements-sw.js", { scope: "/admin/", updateViaCache: "none" }).catch(() => setMessage("앱 설치 준비에 실패했습니다. 새로고침 후 다시 시도해주세요."));
    return () => {
      if (previous) manifest?.setAttribute("href", previous);
      document.title = title;
      window.removeEventListener("beforeinstallprompt", available);
      window.removeEventListener("appinstalled", completed);
      window.removeEventListener("online", connection);
      window.removeEventListener("offline", connection);
      media.removeEventListener("change", standalone);
    };
  }, []);
  async function install() {
    if (!prompt) return;
    setBusy(true);
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      setMessage(choice.outcome === "accepted" ? "설치 후 홈 화면에서 정산관리를 열어주세요." : "나중에 브라우저 메뉴에서 설치할 수 있습니다.");
    } catch { setMessage("브라우저 메뉴에서 홈 화면에 추가해주세요."); }
    finally { setBusy(false); setPrompt(null); }
  }
  return <aside className="border-b border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-950">
    <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
      <div>{!online ? <p role="alert">인터넷이 끊겼습니다. 연결 후 새로고침하여 최신 정산 내역을 확인해주세요.</p> : installed ? <p>정산관리 앱 · 온라인</p> : <><p className="font-semibold">홈 화면에서 정산관리를 바로 열어보세요</p><p className="mt-1 text-xs">아이폰: Safari 공유 → 홈 화면에 추가 · 안드로이드: Chrome 메뉴 → 앱 설치 또는 홈 화면에 추가</p></>}{message && <p role="status" className="mt-1">{message}</p>}</div>
      {!installed && prompt && <Button onClick={install} disabled={busy}>{busy ? "설치 중…" : "앱 설치"}</Button>}
    </div>
  </aside>;
}
