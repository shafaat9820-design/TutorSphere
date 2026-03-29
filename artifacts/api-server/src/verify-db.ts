import { db, otpCodesTable } from "@workspace/db";

async function verifyTable() {
  try {
    console.log("Checking otp_codes table...");
    const result = await db.select().from(otpCodesTable).limit(1);
    console.log("Table exists! Result count:", result.length);
    process.exit(0);
  } catch (err: any) {
    console.error("Error checking table:", err.message);
    process.exit(1);
  }
}

verifyTable();
