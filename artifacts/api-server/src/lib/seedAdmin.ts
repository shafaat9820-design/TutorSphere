import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "tutorsphereofficial@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin@9654";
const ADMIN_NAME = process.env.ADMIN_NAME || "System Administrator";

export async function seedAdminAccount(): Promise<void> {
  try {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    
    // Check if admin exists
    const [existing] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.role, "admin"))
      .limit(1);

    if (existing) {
      // If admin exists, update email, name and password to ensure it matches the new requirement
      await db.update(usersTable)
        .set({ 
          email: ADMIN_EMAIL, 
          password: hashedPassword,
          name: ADMIN_NAME
        })
        .where(eq(usersTable.id, existing.id));
      console.log(`Admin account updated: ${ADMIN_EMAIL}`);
    } else {
      // Otherwise create new
      await db.insert(usersTable).values({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin",
      });
      console.log(`Admin account created: ${ADMIN_EMAIL}`);
    }
  } catch (err) {
    console.error("Failed to seed admin account:", err);
  }
}
