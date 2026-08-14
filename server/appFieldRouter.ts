import { and, asc, eq, gte, lt } from "drizzle-orm";
import { z } from "zod";
import { adminProcedure, router } from "./_core/trpc.js";
import { getDb } from "./db.js";
import { fieldSchedules, fieldSites } from "../drizzle/schema.js";

const siteInput = z.object({ name: z.string().min(1).max(200), address: z.string().min(1), phone: z.string().max(30).optional(), status: z.enum(["inquiry", "contract_pending", "regular", "closed"]), note: z.string().optional() });
const checklistSchema = z.object({ items: z.record(z.string(), z.boolean()).default({}), floors: z.string().optional(), toilets: z.string().optional(), urinals: z.string().optional(), windows: z.string().optional(), dirtLevel: z.string().optional(), specialNotes: z.string().optional(), customerRequests: z.string().optional(), photos: z.array(z.string()).default([]) }).optional();
const scheduleInput = z.object({ siteId: z.number().nullable(), startAt: z.coerce.date(), type: z.enum(["regular_stairs", "regular_office", "one_time", "estimate", "special_glass"]), status: z.enum(["scheduled", "confirmed", "completed", "estimate_sent", "contracted", "canceled"]), amount: z.number().int().min(0).default(0), assignee: z.string().max(60).optional(), note: z.string().optional(), checklist: checklistSchema });
async function requireDb() { const db = await getDb(); if (!db) throw new Error("Database not available"); return db; }
function encodeChecklist(value: z.infer<typeof checklistSchema>) { return value ? JSON.stringify(value) : null; }

export const fieldRouter = router({
  sites: adminProcedure.query(async () => { const db = await requireDb(); return db.select().from(fieldSites).orderBy(asc(fieldSites.name)); }),
  schedules: adminProcedure.query(async () => { const db = await requireDb(); const rows = await db.select().from(fieldSchedules).orderBy(asc(fieldSchedules.startAt)); return rows.map((row) => ({ ...row, checklist: row.checklist ? JSON.parse(row.checklist) : null })); }),
  createSite: adminProcedure.input(siteInput).mutation(async ({ input }) => { const db = await requireDb(); const [row] = await db.insert(fieldSites).values(input).returning(); return row; }),
  updateSite: adminProcedure.input(z.object({ id: z.number(), data: siteInput })).mutation(async ({ input }) => { const db = await requireDb(); const [row] = await db.update(fieldSites).set({ ...input.data, updatedAt: new Date() }).where(eq(fieldSites.id, input.id)).returning(); return row; }),
  deleteSite: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => { const db = await requireDb(); await db.update(fieldSchedules).set({ siteId: null, updatedAt: new Date() }).where(eq(fieldSchedules.siteId, input.id)); await db.delete(fieldSites).where(eq(fieldSites.id, input.id)); return { success: true }; }),
  createSchedule: adminProcedure.input(scheduleInput).mutation(async ({ input }) => { const db = await requireDb(); const [row] = await db.insert(fieldSchedules).values({ ...input, checklist: encodeChecklist(input.checklist) }).returning(); return row; }),
  updateSchedule: adminProcedure.input(z.object({ id: z.number(), data: scheduleInput })).mutation(async ({ input }) => { const db = await requireDb(); const [row] = await db.update(fieldSchedules).set({ ...input.data, checklist: encodeChecklist(input.data.checklist), updatedAt: new Date() }).where(eq(fieldSchedules.id, input.id)).returning(); return row; }),
  deleteSchedule: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => { const db = await requireDb(); await db.delete(fieldSchedules).where(eq(fieldSchedules.id, input.id)); return { success: true }; }),
  schedulesForDay: adminProcedure.input(z.object({ start: z.coerce.date(), end: z.coerce.date() })).query(async ({ input }) => { const db = await requireDb(); return db.select().from(fieldSchedules).where(and(gte(fieldSchedules.startAt, input.start), lt(fieldSchedules.startAt, input.end))).orderBy(asc(fieldSchedules.startAt)); }),
});
