import { pool } from "@workspace/db";

async function createTable() {
  try {
    console.log("Checking for enum...");
    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE "otp_type" AS ENUM ('register', 'reset');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    console.log("Creating otp_codes table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "otp_codes" (
        "id" serial PRIMARY KEY,
        "email" text NOT NULL,
        "code" text NOT NULL,
        "type" "otp_type" NOT NULL DEFAULT 'register',
        "expires_at" timestamp NOT NULL,
        "created_at" timestamp NOT NULL DEFAULT now()
      );
    `);
    console.log("Success! Table created or already exists.");
    process.exit(0);
  } catch (err: any) {
    console.error("Error creating table:", err.message);
    process.exit(1);
  }
}

createTable();
