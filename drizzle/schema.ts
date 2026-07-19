import { integer, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);
export const serviceTypeEnum = pgEnum("serviceType", ["in_person", "non_contact"]);
export const quoteStatusEnum = pgEnum("status", ["pending", "contacted", "confirmed", "canceled"]);
export const publishedEnum = pgEnum("published", ["draft", "published"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const quoteRequests = pgTable("quote_requests", {
  id: serial("id").primaryKey(),
  userId: integer("userId"),
  name: varchar("name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 320 }),
  address: text("address").notNull(),
  serviceType: serviceTypeEnum("serviceType").notNull(),
  planId: varchar("planId", { length: 32 }).notNull(),
  message: text("message"),
  status: quoteStatusEnum("status").default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type QuoteRequest = typeof quoteRequests.$inferSelect;
export type InsertQuoteRequest = typeof quoteRequests.$inferInsert;

export const postTags = pgTable("post_tags", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  slug: varchar("slug", { length: 60 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type PostTag = typeof postTags.$inferSelect;
export type InsertPostTag = typeof postTags.$inferInsert;

// 메인·서비스 페이지에 노출되는 고객 후기 (관리자 페이지에서 관리)
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  platform: varchar("platform", { length: 50 }).notNull(),
  dotColor: varchar("dot_color", { length: 20 }).default("#35b957").notNull(),
  score: varchar("score", { length: 10 }).default("5.0").notNull(),
  quote: text("quote").notNull(),
  detail: varchar("detail", { length: 100 }).default("").notNull(),
  url: text("url").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  thumbnail: text("thumbnail"),
  thumbnailAlt: varchar("thumbnail_alt", { length: 200 }),
  images: text("images"),
  tags: text("tags"),
  published: publishedEnum("published").default("draft").notNull(),
  authorId: integer("authorId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  seoTitle: varchar("seo_title", { length: 100 }),
  seoDescription: varchar("seo_description", { length: 160 }),
  seoKeywords: varchar("seo_keywords", { length: 300 }),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type Post = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;
