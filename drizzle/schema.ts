import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const quoteRequests = mysqlTable("quote_requests", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  name: varchar("name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 320 }),
  address: text("address").notNull(),
  serviceType: mysqlEnum("serviceType", ["in_person", "non_contact"]).notNull(),
  planId: varchar("planId", { length: 32 }).notNull(),
  message: text("message"),
  status: mysqlEnum("status", ["pending", "contacted", "confirmed", "canceled"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type QuoteRequest = typeof quoteRequests.$inferSelect;
export type InsertQuoteRequest = typeof quoteRequests.$inferInsert;

export const postTags = mysqlTable("post_tags", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  slug: varchar("slug", { length: 60 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type PostTag = typeof postTags.$inferSelect;
export type InsertPostTag = typeof postTags.$inferInsert;

export const posts = mysqlTable("posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  thumbnail: text("thumbnail"),
  thumbnailAlt: varchar("thumbnail_alt", { length: 200 }),
  images: text("images"),       // JSON array of {url, alt} objects
  tags: text("tags"),           // JSON array of tag ids
  published: mysqlEnum("published", ["draft", "published"]).default("draft").notNull(),
  authorId: int("authorId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  seoTitle: varchar("seo_title", { length: 100 }),
  seoDescription: varchar("seo_description", { length: 160 }),
  seoKeywords: varchar("seo_keywords", { length: 300 }),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Post = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;
