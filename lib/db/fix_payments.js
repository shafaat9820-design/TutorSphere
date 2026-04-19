import pg from 'pg';
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function fix() {
  const client = await pool.connect();
  try {
    console.log("Fixing payments and applications table schema...");

    // 1. Ensure payment_status enum exists
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE "payment_status" AS ENUM('pending', 'success', 'failed');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);
    console.log("payment_status enum: OK");

    // 2. Add missing columns to payments table
    const paymentCols = [
      `ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "payment_status" "payment_status" DEFAULT 'pending' NOT NULL`,
      `ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "razorpay_order_id" text`,
      `ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "razorpay_payment_id" text`,
      `ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "amount" integer DEFAULT 4900 NOT NULL`,
      `ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "created_at" timestamp DEFAULT now() NOT NULL`,
    ];
    for (const col of paymentCols) {
      await client.query(col).catch(e => console.log("payments col:", e.message));
    }
    console.log("payments table columns: OK");

    // 3. Ensure applications table has its columns
    const appCols = [
      `ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "applied_at" timestamp DEFAULT now() NOT NULL`,
    ];
    for (const col of appCols) {
      await client.query(col).catch(e => console.log("applications col:", e.message));
    }
    console.log("applications table columns: OK");

    // 4. Ensure tuition_posts table has all required columns
    const postCols = [
      `ALTER TABLE "tuition_posts" ADD COLUMN IF NOT EXISTS "featured" boolean DEFAULT false NOT NULL`,
      `ALTER TABLE "tuition_posts" ADD COLUMN IF NOT EXISTS "created_at" timestamp DEFAULT now() NOT NULL`,
      `ALTER TABLE "tuition_posts" ADD COLUMN IF NOT EXISTS "description" text`,
      `ALTER TABLE "tuition_posts" ADD COLUMN IF NOT EXISTS "duration" numeric(4,1) NOT NULL DEFAULT 1.0`,
      `ALTER TABLE "tuition_posts" ADD COLUMN IF NOT EXISTS "days_per_week" integer NOT NULL DEFAULT 3`,
      `ALTER TABLE "tuition_posts" ADD COLUMN IF NOT EXISTS "monthly_fee" integer NOT NULL DEFAULT 5000`,
      `ALTER TABLE "tuition_posts" ADD COLUMN IF NOT EXISTS "contact_phone" text NOT NULL DEFAULT ''`,
    ];
    for (const col of postCols) {
      await client.query(col).catch(e => console.log("posts col:", e.message));
    }
    console.log("tuition_posts table columns: OK");

    // 5. Show current state of payments columns for verification
    const result = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name IN ('payments', 'applications', 'tuition_posts')
      ORDER BY table_name, column_name
    `);
    console.log("\nCurrent columns:");
    result.rows.forEach(r => console.log(`  ${r.column_name} (${r.data_type})`));

    console.log("\nAll fixes applied successfully!");
  } catch (err) {
    console.error("FATAL:", err);
  } finally {
    client.release();
    await pool.end();
  }
}
fix();
