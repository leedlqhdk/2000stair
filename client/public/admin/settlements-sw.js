// Financial data and authenticated responses are never stored in Cache Storage.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", event => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", event => {
  if (event.request.mode !== "navigate") return;
  event.respondWith(fetch(event.request).catch(() => new Response(
    '<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>정산관리 · 연결 확인</title><body style="margin:0;padding:64px 24px;background:#f8fafc;color:#172554;font-family:system-ui;text-align:center"><h1>인터넷 연결을 확인해주세요</h1><p>최신 정산 내역을 확인하려면 인터넷 연결이 필요합니다.</p><a href="/admin/settlements" style="display:inline-block;padding:14px 24px;background:#3155a4;color:white;border-radius:12px">다시 열기</a></body></html>',
    { status: 503, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } }
  )));
});
