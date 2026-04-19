import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  numeric,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const modeEnum = pgEnum("mode", ["home", "online"]);
export const mediumEnum = pgEnum("medium", ["english", "hindi"]);
export const genderPrefEnum = pgEnum("gender_preference", [
  "male",
  "female",
  "any",
]);

export const tuitionPostsTable = pgTable("tuition_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  class: text("class").notNull(),
  subjects: text("subjects").notNull(),
  genderPreference: genderPrefEnum("gender_preference").default("any"),
  medium: mediumEnum("medium").notNull(),
  mode: modeEnum("mode").notNull(),
  address: text("address").notNull(),
  duration: numeric("duration", { precision: 4, scale: 1 }).notNull(),
  daysPerWeek: integer("days_per_week").notNull(),
  monthlyFee: integer("monthly_fee").notNull(),
  state: text("state"),
  description: text("description"),
  contactPhone: text("contact_phone").notNull(),
  featured: boolean("featured").notNull().default(false),
  createdById: integer("created_by_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPostSchema = createInsertSchema(tuitionPostsTable).omit({
  id: true,
  createdAt: true,
});

export type InsertPost = z.infer<typeof insertPostSchema>;
export type TuitionPost = typeof tuitionPostsTable.$inferSelect;
