import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { InsertUser, users } from "../drizzle/schema.js";
import { ENV } from "./_core/env.js";

let _db: ReturnType<typeof drizzle> | null = null;
let _schemaReady = false;

async function ensureSchema(db: ReturnType<typeof drizzle>) {
  if (_schemaReady) return;

  await db.execute(sql`DO $$ BEGIN CREATE TYPE "role" AS ENUM ('user', 'admin'); EXCEPTION WHEN duplicate_object THEN null; END $$;`);
  await db.execute(sql`DO $$ BEGIN CREATE TYPE "serviceType" AS ENUM ('in_person', 'non_contact'); EXCEPTION WHEN duplicate_object THEN null; END $$;`);
  await db.execute(sql`DO $$ BEGIN CREATE TYPE "status" AS ENUM ('pending', 'contacted', 'confirmed', 'canceled'); EXCEPTION WHEN duplicate_object THEN null; END $$;`);
  await db.execute(sql`DO $$ BEGIN CREATE TYPE "published" AS ENUM ('draft', 'published'); EXCEPTION WHEN duplicate_object THEN null; END $$;`);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "users" (
      "id" serial PRIMARY KEY,
      "openId" varchar(64) NOT NULL UNIQUE,
      "name" text,
      "email" varchar(320),
      "loginMethod" varchar(64),
      "role" "role" NOT NULL DEFAULT 'user',
      "createdAt" timestamp NOT NULL DEFAULT now(),
      "updatedAt" timestamp NOT NULL DEFAULT now(),
      "lastSignedIn" timestamp NOT NULL DEFAULT now()
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "quote_requests" (
      "id" serial PRIMARY KEY,
      "userId" integer,
      "name" varchar(100) NOT NULL,
      "phone" varchar(20) NOT NULL,
      "email" varchar(320),
      "address" text NOT NULL,
      "serviceType" "serviceType" NOT NULL,
      "planId" varchar(32) NOT NULL,
      "message" text,
      "status" "status" NOT NULL DEFAULT 'pending',
      "createdAt" timestamp NOT NULL DEFAULT now(),
      "updatedAt" timestamp NOT NULL DEFAULT now()
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "post_tags" (
      "id" serial PRIMARY KEY,
      "name" varchar(50) NOT NULL UNIQUE,
      "slug" varchar(60) NOT NULL UNIQUE,
      "createdAt" timestamp NOT NULL DEFAULT now()
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "posts" (
      "id" serial PRIMARY KEY,
      "title" varchar(200) NOT NULL,
      "content" text NOT NULL,
      "thumbnail" text,
      "thumbnail_alt" varchar(200),
      "images" text,
      "tags" text,
      "published" "published" NOT NULL DEFAULT 'draft',
      "authorId" integer NOT NULL,
      "createdAt" timestamp NOT NULL DEFAULT now(),
      "seo_title" varchar(100),
      "seo_description" varchar(160),
      "seo_keywords" varchar(300),
      "updatedAt" timestamp NOT NULL DEFAULT now()
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "reviews" (
      "id" serial PRIMARY KEY,
      "platform" varchar(50) NOT NULL,
      "dot_color" varchar(20) NOT NULL DEFAULT '#35b957',
      "score" varchar(10) NOT NULL DEFAULT '5.0',
      "quote" text NOT NULL,
      "detail" varchar(100) NOT NULL DEFAULT '',
      "url" text NOT NULL,
      "sort_order" integer NOT NULL DEFAULT 0,
      "createdAt" timestamp NOT NULL DEFAULT now(),
      "updatedAt" timestamp NOT NULL DEFAULT now()
    )
  `);

  _schemaReady = true;
}

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const sqlClient = neon(process.env.DATABASE_URL);
      _db = drizzle(sqlClient);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }

  if (_db) {
    await ensureSchema(_db);
  }

  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}


export async function updateLastSignedIn(userId: number, date: Date): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update lastSignedIn: database not available");
    return;
  }
  try {
    await db.update(users).set({ lastSignedIn: date, updatedAt: date }).where(eq(users.id, userId));
  } catch (error) {
    console.error("[Database] Failed to update lastSignedIn:", error);
    // Non-critical: don't throw, just log
  }
}
