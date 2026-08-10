import { z } from "zod";
import { and, asc, eq, gte, lte } from "drizzle-orm";
import { protectedProcedure, router } from "./_core/trpc.js";
import { getDb } from "./db.js";
import { fieldSchedules, fieldSites } from "../drizzle/schema.js";

function requireAdmin(role: string) {
  if (role !== "admin") throw new Error("Admin access required");
}

const siteStatus = z.enum(["regular", "lead", "pending", "ended"]);
const scheduleType = z.enum(["regular", "restroom", "one", "visit", "glass"]);
const scheduleStatus = z.enum(["scheduled", "confirmed", "done", "quote_sent", "contracted", "cancelled"]);

const checklistSchema = z.object({
  items: z.array(z.string()).default([]),
  floors: z.number().nullable().optional(),
  toilets: z.number().nullable().optional(),
  urinals: z.number().nullable().optional(),
  glassCount: z.number().nullable().optional(),
  note: z.string().optional(),
}).optional();

function decodeChecklist(value: string | null) {
  if (!value) return null;
  try { return JSON.parse(value); } catch { return null; }
}

export const fieldRouter = router({
  sites: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb();
      if (!db) return [];
      return db.select().from(fieldSites).orderBy(asc(fieldSites.name));
    }),
    create: protectedProcedure.input(z.object({
      name: z.string().min(1), address: z.string().optional(), phone: z.string().optional(),
      status: siteStatus.default("lead"), note: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb(); if (!db) throw new Error("Database not available");
      const [created] = await db.insert(fieldSites).values({ ...input, address: input.address || null, phone: input.phone || null, note: input.note || null }).returning();
      return created;
    }),
    update: protectedProcedure.input(z.object({
      id: z.number(), name: z.string().min(1), address: z.string().optional(), phone: z.string().optional(),
      status: siteStatus, note: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb(); if (!db) throw new Error("Database not available");
      const { id, ...rest } = input;
      await db.update(fieldSites).set({ ...rest, address: rest.address || null, phone: rest.phone || null, note: rest.note || null, updatedAt: new Date() }).where(eq(fieldSites.id, id));
      return { success: true };
    }),
    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb(); if (!db) throw new Error("Database not available");
      await db.delete(fieldSites).where(eq(fieldSites.id, input.id));
      return { success: true };
    }),
  }),
  schedules: router({
    list: protectedProcedure.input(z.object({ from: z.date().optional(), to: z.date().optional() }).optional()).query(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb(); if (!db) return [];
      const conditions = [];
      if (input?.from) conditions.push(gte(fieldSchedules.startAt, input.from));
      if (input?.to) conditions.push(lte(fieldSchedules.startAt, input.to));
      const rows = conditions.length
        ? await db.select({ schedule: fieldSchedules, site: fieldSites }).from(fieldSchedules).leftJoin(fieldSites, eq(fieldSchedules.siteId, fieldSites.id)).where(and(...conditions)).orderBy(asc(fieldSchedules.startAt))
        : await db.select({ schedule: fieldSchedules, site: fieldSites }).from(fieldSchedules).leftJoin(fieldSites, eq(fieldSchedules.siteId, fieldSites.id)).orderBy(asc(fieldSchedules.startAt));
      return rows.map(({ schedule, site }) => ({ ...schedule, site, checklist: decodeChecklist(schedule.checklist) }));
    }),
    create: protectedProcedure.input(z.object({
      siteId: z.number(), startAt: z.date(), type: scheduleType, status: scheduleStatus.default("scheduled"),
      amount: z.number().nullable().optional(), assignee: z.string().optional(), note: z.string().optional(), checklist: checklistSchema,
    })).mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb(); if (!db) throw new Error("Database not available");
      const [created] = await db.insert(fieldSchedules).values({ ...input, amount: input.amount ?? null, assignee: input.assignee || null, note: input.note || null, checklist: input.checklist ? JSON.stringify(input.checklist) : null }).returning();
      return created;
    }),
    update: protectedProcedure.input(z.object({
      id: z.number(), siteId: z.number(), startAt: z.date(), type: scheduleType, status: scheduleStatus,
      amount: z.number().nullable().optional(), assignee: z.string().optional(), note: z.string().optional(), checklist: checklistSchema,
    })).mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb(); if (!db) throw new Error("Database not available");
      const { id, ...rest } = input;
      await db.update(fieldSchedules).set({ ...rest, amount: rest.amount ?? null, assignee: rest.assignee || null, note: rest.note || null, checklist: rest.checklist ? JSON.stringify(rest.checklist) : null, updatedAt: new Date() }).where(eq(fieldSchedules.id, id));
      return { success: true };
    }),
    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb(); if (!db) throw new Error("Database not available");
      await db.delete(fieldSchedules).where(eq(fieldSchedules.id, input.id));
      return { success: true };
    }),
  }),
});
