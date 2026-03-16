import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { tuitionPostsTable } from "./posts";

export const applicationsTable = pgTable("applications", {
  id: serial("id").primaryKey(),
  tutorId: integer("tutor_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  postId: integer("post_id")
    .notNull()
    .references(() => tuitionPostsTable.id, { onDelete: "cascade" }),
  appliedAt: timestamp("applied_at").notNull().defaultNow(),
});

export const insertApplicationSchema = createInsertSchema(
  applicationsTable
).omit({ id: true, appliedAt: true });

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applicationsTable.$inferSelect;
