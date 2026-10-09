import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { adminProcedure, router } from "./_core/trpc.js";

const monthSchema = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);
const dateSchema = z.string().date().or(z.literal(""));
export const settlementInput = z.object({
  building: z.string().trim().min(1).max(200),
  month: monthSchema,
  billed: z.number().int().min(0).max(1_000_000_000),
  paid: z.number().int().min(0).max(1_000_000_000),
  paidAt: dateSchema,
  memo: z.string().max(2000),
});
type Property = { type: string; title?: { plain_text: string }[]; rich_text?: { plain_text: string }[]; number?: number | null; date?: { start: string } | null };
type Page = { id: string; url: string; archived?: boolean; in_trash?: boolean; parent?: { data_source_id?: string }; properties: Record<string, Property> };
const expected = { 건물명: "title", 정산월: "date", 청구금액: "number", 입금액: "number", 입금일: "date", 메모: "rich_text" };
// The shared Notion link supplied for the settlement workspace. An explicit
// environment variable still takes precedence when the page contains more
// than one database.
const DEFAULT_SETTLEMENT_PAGE_ID = "3a7f2ed8-4d17-8141-8aa7-fca9c795e297";
const configured = () => Boolean((process.env.NOTION_API_KEY || process.env.NOTION_TOKEN) && (process.env.NOTION_SETTLEMENT_DATA_SOURCE_ID || process.env.NOTION_SETTLEMENT_DATABASE_ID || DEFAULT_SETTLEMENT_PAGE_ID));

async function notion<T>(path: string, method = "GET", body?: unknown): Promise<T> {
  if (!configured()) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "노션 정산 데이터베이스 연결 설정이 필요합니다." });
  let response: Response;
  try {
    response = await fetch(`https://api.notion.com/v1/${path}`, {
      method,
      headers: { Authorization: `Bearer ${process.env.NOTION_API_KEY || process.env.NOTION_TOKEN}`, "Notion-Version": "2025-09-03", "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new TRPCError({ code: "TIMEOUT", message: "노션 응답을 확인하지 못했습니다. 저장 중이었다면 새로고침으로 내역을 확인한 후 다시 시도해주세요." });
  }
  if (!response.ok) throw new TRPCError({ code: "BAD_GATEWAY", message: response.status === 429 ? "노션 요청이 많습니다. 잠시 후 다시 시도해주세요." : "노션 연결에 실패했습니다. 연결 권한과 정산 표의 항목을 확인해주세요." });
  return response.json() as Promise<T>;
}
async function source() {
  let id = process.env.NOTION_SETTLEMENT_DATA_SOURCE_ID;
  if (!id) {
    const databaseId = process.env.NOTION_SETTLEMENT_DATABASE_ID || DEFAULT_SETTLEMENT_PAGE_ID;
    const db = await notion<{ data_sources?: { id: string }[] }>(`databases/${encodeURIComponent(databaseId)}`);
    if (!db.data_sources) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "공유한 노션 링크가 데이터베이스가 아닙니다. 정산 데이터베이스 링크를 연결해주세요." });
    if (db.data_sources.length !== 1) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "노션 표가 여러 개입니다. 정산 표의 데이터 소스 ID를 지정해주세요." });
    id = db.data_sources[0].id;
  }
  const schema = await notion<{ properties: Record<string, { type: string }> }>(`data_sources/${encodeURIComponent(id)}`);
  const missing = Object.entries(expected).filter(([name, type]) => schema.properties[name]?.type !== type).map(([name]) => name);
  if (missing.length) throw new TRPCError({ code: "PRECONDITION_FAILED", message: `노션 정산 표의 항목 이름 또는 형식을 확인해주세요: ${missing.join(", ")}` });
  return id;
}
export function parseSettlement(page: Page) {
  const p = page.properties;
  const billed = p["청구금액"].number ?? 0;
  const paid = p["입금액"].number ?? 0;
  return { id: page.id, url: page.url, building: (p["건물명"].title || []).map(t => t.plain_text).join(""), month: p["정산월"].date?.start.slice(0, 7) || "", billed, paid, outstanding: Math.max(0, billed - paid), status: paid > billed ? "초과입금" : billed === paid ? "입금완료" : paid > 0 ? "부분입금" : "미입금", paidAt: p["입금일"].date?.start.slice(0, 10) || "", memo: (p["메모"].rich_text || []).map(t => t.plain_text).join("") };
}
function properties(input: z.infer<typeof settlementInput>) {
  return { 건물명: { title: [{ text: { content: input.building } }] }, 정산월: { date: { start: `${input.month}-01` } }, 청구금액: { number: input.billed }, 입금액: { number: input.paid }, 입금일: { date: input.paidAt ? { start: input.paidAt } : null }, 메모: { rich_text: input.memo ? [{ text: { content: input.memo } }] : [] } };
}
export const settlementsRouter = router({
  list: adminProcedure.input(z.object({ month: monthSchema })).query(async ({ input }) => {
    if (!configured()) return { configured: false, rows: [] };
    const id = await source();
    const rows: ReturnType<typeof parseSettlement>[] = [];
    let cursor: string | undefined;
    do {
      const result = await notion<{ results: Page[]; has_more: boolean; next_cursor: string | null }>(`data_sources/${encodeURIComponent(id)}/query`, "POST", { page_size: 100, start_cursor: cursor, filter: { and: [{ property: "정산월", date: { on_or_after: `${input.month}-01` } }, { property: "정산월", date: { before: nextMonth(input.month) } }] }, sorts: [{ property: "건물명", direction: "ascending" }] });
      rows.push(...result.results.filter(p => !p.archived && !p.in_trash).map(parseSettlement));
      if (result.has_more && !result.next_cursor) throw new TRPCError({ code: "BAD_GATEWAY", message: "노션 목록을 모두 불러오지 못했습니다. 다시 시도해주세요." });
      cursor = result.has_more ? result.next_cursor! : undefined;
    } while (cursor);
    return { configured: true, rows };
  }),
  create: adminProcedure.input(settlementInput).mutation(async ({ input }) => {
    const id = await source();
    await notion("pages", "POST", { parent: { type: "data_source_id", data_source_id: id }, properties: properties(input) });
    return { success: true };
  }),
  update: adminProcedure.input(settlementInput.extend({ id: z.string().uuid() })).mutation(async ({ input }) => {
    const id = await source();
    const page = await notion<Page>(`pages/${input.id}`);
    if (page.parent?.data_source_id?.replace(/-/g, "") !== id.replace(/-/g, "") || page.archived || page.in_trash) throw new TRPCError({ code: "FORBIDDEN", message: "연결된 정산 표의 활성 내역만 수정할 수 있습니다." });
    await notion(`pages/${input.id}`, "PATCH", { properties: properties(input) });
    return { success: true };
  }),
});
function nextMonth(month: string) {
  const [year, m] = month.split("-").map(Number);
  return `${m === 12 ? year + 1 : year}-${String(m === 12 ? 1 : m + 1).padStart(2, "0")}-01`;
}
