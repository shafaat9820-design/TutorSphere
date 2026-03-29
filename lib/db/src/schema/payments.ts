import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { tuitionPostsTable } from "./posts";

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "success",
  "failed",
]);

export const paymentTypeEnum = pgEnum("payment_type", [
  "post_unlock",
  "weekly_plan",
  "monthly_plan",
  "parent_plan",
]);

export const paymentsTable = pgTable("payments", {
  id: serial("id").primaryKey(),
  tutorId: integer("tutor_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  postId: integer("post_id")
    .references(() => tuitionPostsTable.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull().default(4900),
  paymentType: paymentTypeEnum("payment_type")
    .notNull()
    .default("post_unlock"),
  paymentStatus: paymentStatusEnum("payment_status")
    .notNull()
    .default("pending"),
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPaymentSchema = createInsertSchema(paymentsTable).omit({
  id: true,
  createdAt: true,
});

export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof paymentsTable.$inferSelect;
