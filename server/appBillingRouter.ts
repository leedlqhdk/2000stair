import { TRPCError } from "@trpc/server";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { adminProcedure, router } from "./_core/trpc.js";
import { getDb } from "./db.js";
import { billingCustomers, billingMonths } from "../drizzle/schema.js";
import { NOTION_CONTRACT_DATA_SOURCE_ID, dueDateFor, planSync, schemaProblems, type NotionPage } from "./billingLogic.js";

const NOTION_VERSION = "2026-03-11";
const monthSchema = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);

async function requireDb() {
  const db = await getDb();
  if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "데이터베이스에 연결하지 못했습니다." });
  return db;
}

function notionToken() {
  // Server-only secret. Never returned to the client or logged.
  return process.env.NOTION_API_KEY || process.env.NOTION_TOKEN || "";
}

async function notion<T>(path: string, method = "GET", body?: unknown): Promise<T> {
  const token = notionToken();
  if (!token) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "노션 연결 키(NOTION_API_KEY)가 서버에 설정되지 않았습니다." });
  let response: Response;
  try {
    response = await fetch(`https://api.notion.com/v1/${path}`, {
      method,
      headers: { Authorization: `Bearer ${token}`, "Notion-Version": NOTION_VERSION, "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(20000),
    });
  } catch {
    throw new TRPCError({ code: "TIMEOUT", message: "노션 응답이 없어 동기화를 중단했습니다. 아무것도 바뀌지 않았습니다." });
  }
  if (!response.ok) {
    const message =
      response.status === 401 ? "노션 연결 키가 올바르지 않습니다." :
      response.status === 404 ? "노션 계약관리 표를 찾지 못했습니다. 연결(통합)에 '고객관리' 데이터베이스를 공유했는지 확인해주세요." :
      response.status === 429 ? "노션 요청이 많습니다. 잠시 후 다시 시도해주세요." :
      `노션 요청이 실패했습니다(${response.status}).`;
    throw new TRPCError({ code: "BAD_GATEWAY", message });
  }
  return response.json() as Promise<T>;
}

function dataSourceId() {
  return process.env.NOTION_CONTRACT_DATA_SOURCE_ID || NOTION_CONTRACT_DATA_SOURCE_ID;
}

/** Reads every page or throws — a partial list must never be treated as complete. */
async function fetchAllContracts(): Promise<NotionPage[]> {
  const id = encodeURIComponent(dataSourceId());
  const schema = await notion<{ properties: Record<string, { type: string }> }>(`data_sources/${id}`);
  const problems = schemaProblems(schema.properties || {});
  if (problems.length) throw new TRPCError({ code: "PRECONDITION_FAILED", message: `노션 계약관리 항목 이름이나 형식이 달라 동기화를 중단했습니다: ${problems.join(", ")}` });
  const pages: NotionPage[] = [];
  let cursor: string | undefined;
  for (let guard = 0; guard < 200; guard++) {
    const result = await notion<{ results: NotionPage[]; has_more: boolean; next_cursor: string | null; request_status?: { type?: string } }>(
      `data_sources/${id}/query`, "POST", { page_size: 100, ...(cursor ? { start_cursor: cursor } : {}) },
    );
    if (result.request_status?.type === "incomplete") throw new TRPCError({ code: "BAD_GATEWAY", message: "노션이 목록 일부만 돌려줘서 동기화를 중단했습니다. 아무것도 바뀌지 않았습니다." });
    pages.push(...result.results);
    if (!result.has_more) return pages;
    if (!result.next_cursor) throw new TRPCError({ code: "BAD_GATEWAY", message: "노션 목록을 끝까지 읽지 못해 동기화를 중단했습니다." });
    cursor = result.next_cursor;
  }
  throw new TRPCError({ code: "BAD_GATEWAY", message: "노션 목록이 너무 길어 동기화를 중단했습니다." });
}

export const billingRouter = router({
  status: adminProcedure.query(() => ({ notionConfigured: Boolean(notionToken()) })),

  customers: adminProcedure.query(async () => {
    const db = await requireDb();
    return db.select().from(billingCustomers).orderBy(asc(billingCustomers.name));
  }),

  month: adminProcedure.input(z.object({ month: monthSchema })).query(async ({ input }) => {
    const db = await requireDb();
    const records = await db.select().from(billingMonths).where(eq(billingMonths.month, input.month));
    const recordIds = records.map(r => r.customerId);
    const customers = await db.select().from(billingCustomers).orderBy(asc(billingCustomers.name));
    const byCustomer = new Map(records.map(r => [r.customerId, r]));
    // Active customers with a due day, plus any (even inactive) customer that already has a record this month.
    const rows = customers
      .filter(c => c.dueDay && (c.active || recordIds.includes(c.id)))
      .map(c => {
        const r = byCustomer.get(c.id);
        return {
          customerId: c.id, name: c.name, monthlyFee: c.monthlyFee, memo: c.memo || "", active: c.active,
          day: dueDateFor(input.month, c.dueDay!), dueDay: c.dueDay!,
          paid: r?.paid ?? false, paidAt: r?.paidAt ?? "", invoiceIssued: r?.invoiceIssued ?? false,
        };
      })
      .sort((a, b) => a.day - b.day || a.name.localeCompare(b.name, "ko"));
    return { rows };
  }),

  setStatus: adminProcedure.input(z.object({
    customerId: z.number().int().positive(),
    month: monthSchema,
    paid: z.boolean(),
    paidAt: z.string().date().or(z.literal("")),
    invoiceIssued: z.boolean(),
  })).mutation(async ({ input }) => {
    const db = await requireDb();
    const [customer] = await db.select({ id: billingCustomers.id }).from(billingCustomers).where(eq(billingCustomers.id, input.customerId));
    if (!customer) throw new TRPCError({ code: "NOT_FOUND", message: "고객을 찾을 수 없습니다." });
    const values = { paid: input.paid, paidAt: input.paid ? input.paidAt || null : null, invoiceIssued: input.invoiceIssued, updatedAt: new Date() };
    await db.insert(billingMonths).values({ customerId: input.customerId, month: input.month, ...values })
      .onConflictDoUpdate({ target: [billingMonths.customerId, billingMonths.month], set: values });
    return { success: true };
  }),

  syncFromNotion: adminProcedure.mutation(async () => {
    const pages = await fetchAllContracts(); // throws before any DB write if incomplete
    const db = await requireDb();
    const existing = await db.select({ id: billingCustomers.id, notionPageId: billingCustomers.notionPageId, name: billingCustomers.name, active: billingCustomers.active }).from(billingCustomers);
    const plan = planSync(existing, pages);
    const now = new Date();
    for (const row of plan.inserts) {
      await db.insert(billingCustomers).values({ notionPageId: row.notionPageId, name: row.name, monthlyFee: row.monthlyFee, dueDay: row.dueDay, memo: row.memo || null, active: true, lastSyncedAt: now })
        .onConflictDoNothing({ target: billingCustomers.notionPageId });
    }
    for (const u of plan.updates) {
      await db.update(billingCustomers).set({
        ...(u.link ? { notionPageId: u.data.notionPageId } : {}),
        name: u.data.name, monthlyFee: u.data.monthlyFee, dueDay: u.data.dueDay, memo: u.data.memo || null,
        active: true, inactiveReason: null, lastSyncedAt: now, updatedAt: now,
      }).where(eq(billingCustomers.id, u.id));
    }
    for (const d of plan.deactivate) {
      await db.update(billingCustomers).set({ active: false, inactiveReason: d.reason, lastSyncedAt: now, updatedAt: now }).where(eq(billingCustomers.id, d.id));
    }
    return {
      read: pages.length,
      added: plan.inserts.map(r => r.name),
      updated: plan.updates.filter(u => !u.link).length,
      linked: plan.updates.filter(u => u.link).map(u => u.data.name),
      deactivated: plan.deactivate.map(d => ({ name: d.name, reason: d.reason })),
      skipped: plan.skipped,
      conflicts: plan.conflicts,
    };
  }),
});

