ALTER TABLE "field_sites" ADD COLUMN IF NOT EXISTS "contractStartDate" varchar(10);
ALTER TABLE "field_sites" ADD COLUMN IF NOT EXISTS "contractEndDate" varchar(10);
ALTER TABLE "field_sites" ADD COLUMN IF NOT EXISTS "weeklyFrequency" integer NOT NULL DEFAULT 1;
ALTER TABLE "field_sites" ADD COLUMN IF NOT EXISTS "visitWeekdays" text;
