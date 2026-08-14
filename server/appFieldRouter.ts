import { and, asc, eq, gte, lt } from "drizzle-orm";
import { z } from "zod";
import { adminProcedure, router } from "./_core/trpc.js";
import { getDb } from "./db.js";
import { fieldRouteSettings, fieldSchedules, fieldSites } from "../drizzle/schema.js";

const coordinate = (min: number, max: number) => z.number().min(min).max(max).nullable().optional();
const dateOnly = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional();
const siteInput = z.object({ name: z.string().min(1).max(200), address: z.string().min(1), phone: z.string().max(30).optional(), status: z.enum(["inquiry", "contract_pending", "regular", "closed"]), note: z.string().optional(), latitude: coordinate(-90, 90), longitude: coordinate(-180, 180), contractStartDate: dateOnly, contractEndDate: dateOnly, weeklyFrequency: z.number().int().min(1).max(2).default(1), visitWeekdays: z.array(z.number().int().min(0).max(6)).max(2).default([]) });
const routeSettingsInput = z.object({ startAddress: z.string().max(300).optional(), startLatitude: coordinate(-90, 90), startLongitude: coordinate(-180, 180), endAddress: z.string().max(300).optional(), endLatitude: coordinate(-90, 90), endLongitude: coordinate(-180, 180) });
const checklistSchema = z.object({ items: z.record(z.string(), z.boolean()).default({}), floors: z.string().optional(), toilets: z.string().optional(), urinals: z.string().optional(), windows: z.string().optional(), dirtLevel: z.string().optional(), specialNotes: z.string().optional(), customerRequests: z.string().optional(), photos: z.array(z.string()).default([]) }).optional();
const scheduleInput = z.object({ siteId: z.number().nullable(), startAt: z.coerce.date(), type: z.enum(["regular_stairs", "regular_office", "one_time", "estimate", "special_glass"]), status: z.enum(["scheduled", "confirmed", "completed", "estimate_sent", "contracted", "canceled"]), amount: z.number().int().min(0).default(0), assignee: z.string().max(60).optional(), note: z.string().optional(), checklist: checklistSchema });
async function requireDb() { const db = await getDb(); if (!db) throw new Error("Database not available"); return db; }
function encodeChecklist(value: z.infer<typeof checklistSchema>) { return value ? JSON.stringify(value) : null; }
function encodeWeekdays(value: number[] | undefined) { return JSON.stringify(Array.from(new Set(value ?? [])).sort((a, b) => a - b)); }

export const fieldRouter = router({
  sites: adminProcedure.query(async () => { const db = await requireDb(); const rows = await db.select().from(fieldSites).orderBy(asc(fieldSites.name)); return rows.map((row) => ({ ...row, visitWeekdays: row.visitWeekdays ? JSON.parse(row.visitWeekdays) : [] })); }),
  routeSettings: adminProcedure.query(async () => { const db = await requireDb(); const [row] = await db.select().from(fieldRouteSettings).where(eq(fieldRouteSettings.id, 1)); return row ?? { id: 1, startAddress: null, startLatitude: null, startLongitude: null, endAddress: null, endLatitude: null, endLongitude: null, updatedAt: new Date() }; }),
  geocodeAddress: adminProcedure.input(z.object({ address: z.string().min(1).max(300) })).mutation(async ({ input }) => {
    const clientId = process.env.NAVER_MAPS_CLIENT_ID;
    const clientSecret = process.env.NAVER_MAPS_CLIENT_SECRET;
    if (!clientId || !clientSecret) throw new Error("네이버 지도 주소 검색 키가 아직 설정되지 않았습니다.");
    const response = await fetch(`https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(input.address)}`, { headers: { "x-ncp-apigw-api-key-id": clientId, "x-ncp-apigw-api-key": clientSecret } });
    if (!response.ok) throw new Error("주소 위치를 찾지 못했어요.");
    const body = await response.json() as { addresses?: Array<{ x: string; y: string }> };
    const result = body.addresses?.[0];
    if (!result) throw new Error("검색 결과가 없는 주소예요.");
    return { latitude: Number(result.y), longitude: Number(result.x) };
  }),
  schedules: adminProcedure.query(async () => { const db = await requireDb(); const rows = await db.select().from(fieldSchedules).orderBy(asc(fieldSchedules.startAt)); return rows.map((row) => ({ ...row, checklist: row.checklist ? JSON.parse(row.checklist) : null })); }),
  createSite: adminProcedure.input(siteInput).mutation(async ({ input }) => { const db = await requireDb(); const { visitWeekdays, ...siteData } = input; const [row] = await db.insert(fieldSites).values({ ...siteData, visitWeekdays: encodeWeekdays(visitWeekdays) }).returning(); return { ...row, visitWeekdays }; }),
  updateSite: adminProcedure.input(z.object({ id: z.number(), data: siteInput })).mutation(async ({ input }) => { const db = await requireDb(); const { visitWeekdays, ...siteData } = input.data; const [row] = await db.update(fieldSites).set({ ...siteData, visitWeekdays: encodeWeekdays(visitWeekdays), updatedAt: new Date() }).where(eq(fieldSites.id, input.id)).returning(); return { ...row, visitWeekdays }; }),
  saveRouteSettings: adminProcedure.input(routeSettingsInput).mutation(async ({ input }) => { const db = await requireDb(); const [row] = await db.insert(fieldRouteSettings).values({ id: 1, ...input, updatedAt: new Date() }).onConflictDoUpdate({ target: fieldRouteSettings.id, set: { ...input, updatedAt: new Date() } }).returning(); return row; }),
  deleteSite: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => { const db = await requireDb(); await db.update(fieldSchedules).set({ siteId: null, updatedAt: new Date() }).where(eq(fieldSchedules.siteId, input.id)); await db.delete(fieldSites).where(eq(fieldSites.id, input.id)); return { success: true }; }),
  createSchedule: adminProcedure.input(scheduleInput).mutation(async ({ input }) => { const db = await requireDb(); const [row] = await db.insert(fieldSchedules).values({ ...input, checklist: encodeChecklist(input.checklist) }).returning(); return row; }),
  updateSchedule: adminProcedure.input(z.object({ id: z.number(), data: scheduleInput })).mutation(async ({ input }) => { const db = await requireDb(); const [row] = await db.update(fieldSchedules).set({ ...input.data, checklist: encodeChecklist(input.data.checklist), updatedAt: new Date() }).where(eq(fieldSchedules.id, input.id)).returning(); return row; }),
  deleteSchedule: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => { const db = await requireDb(); await db.delete(fieldSchedules).where(eq(fieldSchedules.id, input.id)); return { success: true }; }),
  schedulesForDay: adminProcedure.input(z.object({ start: z.coerce.date(), end: z.coerce.date() })).query(async ({ input }) => { const db = await requireDb(); return db.select().from(fieldSchedules).where(and(gte(fieldSchedules.startAt, input.start), lt(fieldSchedules.startAt, input.end))).orderBy(asc(fieldSchedules.startAt)); }),
});
