ALTER TABLE "field_sites" ADD COLUMN IF NOT EXISTS "latitude" real;
ALTER TABLE "field_sites" ADD COLUMN IF NOT EXISTS "longitude" real;
CREATE TABLE IF NOT EXISTS "field_route_settings" (
  "id" integer PRIMARY KEY DEFAULT 1,
  "startAddress" text,
  "startLatitude" real,
  "startLongitude" real,
  "endAddress" text,
  "endLatitude" real,
  "endLongitude" real,
  "updatedAt" timestamp NOT NULL DEFAULT now()
);
