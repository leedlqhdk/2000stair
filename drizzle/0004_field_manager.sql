CREATE TABLE IF NOT EXISTS "field_sites" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar(160) NOT NULL,
  "address" text,
  "phone" varchar(30),
  "status" varchar(20) DEFAULT 'lead' NOT NULL,
  "note" text,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "field_schedules" (
  "id" serial PRIMARY KEY NOT NULL,
  "siteId" integer NOT NULL,
  "startAt" timestamp NOT NULL,
  "type" varchar(24) DEFAULT 'regular' NOT NULL,
  "status" varchar(24) DEFAULT 'scheduled' NOT NULL,
  "amount" integer,
  "assignee" varchar(80),
  "note" text,
  "checklist" text,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "field_schedules" ADD CONSTRAINT "field_schedules_siteId_field_sites_id_fk" FOREIGN KEY ("siteId") REFERENCES "public"."field_sites"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
