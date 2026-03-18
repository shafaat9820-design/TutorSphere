import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const ADMIN_EMAIL = "admin@tutorconnect.com";
const ADMIN_PASSWORD = "admin123";
const ADMIN_NAME = "Admin";

export async function seedAdminAccount(): Promise<void> {
  try {
    const existing = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, ADMIN_EMAIL))
      .limit(1);

    if (existing.length > 0) {
      console.log("Admin account already exists, skipping seed.");
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    await db.insert(usersTable).values({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
    });

    console.log(`Admin account created: ${ADMIN_EMAIL}`);
  } catch (err) {
    console.error("Failed to seed admin account:", err);
  }
}
