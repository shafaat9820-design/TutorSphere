import { pgTable, text, serial, pgEnum, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const roleEnum = pgEnum("role", ["admin", "tutor", "parent"]);
export const planTypeEnum = pgEnum("plan_type", ["none", "weekly", "monthly"]);

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phone: text("phone"),
  role: roleEnum("role").notNull().default("parent"),
  age: integer("age"),
  bio: text("bio"),
  avatar: text("avatar"),
  planType: planTypeEnum("plan_type").notNull().default("none"),
  planExpiry: timestamp("plan_expiry"),
  
  // Free Trial System
  freeContactUsed: boolean("free_contact_used").notNull().default(false),
  freePostUsedAt: timestamp("free_post_used_at"),
  contactsUnlockedCount: integer("contacts_unlocked_count").notNull().default(0),
  
  // Parent Monetization
  parentPlanExpiry: timestamp("parent_plan_expiry"),
  activePostCount: integer("active_post_count").notNull().default(0),
  
  // Anti-Cheat & Security
  isVerified: boolean("is_verified").notNull().default(false),
  deviceId: text("device_id"),
  lastIP: text("last_ip"),
  isSuspicious: boolean("is_suspicious").notNull().default(false),
  isBanned: boolean("is_banned").notNull().default(false),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
