import { pgTable, text, serial, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const otpTypeEnum = pgEnum("otp_type", ["register", "reset"]);

export const otpCodesTable = pgTable("otp_codes", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  code: text("code").notNull(),
  type: otpTypeEnum("type").notNull().default("register"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
