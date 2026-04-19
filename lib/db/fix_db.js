import pg from 'pg';
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function fix() {
  try {
    console.log("Starting DB fix...");
    // Create types safely
    await pool.query(`CREATE TYPE "role" AS ENUM('admin', 'tutor', 'parent');`).catch(e => console.log("Role enum:", e.message));
    await pool.query(`CREATE TYPE "gender_preference" AS ENUM('male', 'female', 'any');`).catch(e => console.log("Gender enum:", e.message));
    await pool.query(`CREATE TYPE "medium" AS ENUM('english', 'hindi');`).catch(e => console.log("Medium enum:", e.message));
    await pool.query(`CREATE TYPE "mode" AS ENUM('home', 'online');`).catch(e => console.log("Mode enum:", e.message));
    await pool.query(`CREATE TYPE "payment_status" AS ENUM('pending', 'success', 'failed');`).catch(e => console.log("Payment enum:", e.message));
    await pool.query(`CREATE TYPE "report_type" AS ENUM('post', 'user');`).catch(e => console.log("Report enum:", e.message));

    // Add missing user columns
    await pool.query(`ALTER TABLE "users" ADD COLUMN "phone" text;`).catch(e => console.log("Phone col:", e.message));
    await pool.query(`ALTER TABLE "users" ADD COLUMN "role" "role" DEFAULT 'parent' NOT NULL;`).catch(e => console.log("Role col:", e.message));
    
    // Create missing tables exactly as Drizzle kit wants them
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "tuition_posts" (
        "id" serial PRIMARY KEY NOT NULL,
        "title" text NOT NULL,
        "class" text NOT NULL,
        "subjects" text NOT NULL,
        "gender_preference" "gender_preference" DEFAULT 'any',
        "medium" "medium" NOT NULL,
        "mode" "mode" NOT NULL,
        "address" text NOT NULL,
        "duration" numeric(4, 1) NOT NULL,
        "days_per_week" integer NOT NULL,
        "monthly_fee" integer NOT NULL,
        "description" text,
        "contact_phone" text NOT NULL,
        "featured" boolean DEFAULT false NOT NULL,
        "created_by_id" integer NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `).catch(e => console.log("tuition_posts:", e.message));

    await pool.query(`
      CREATE TABLE IF NOT EXISTS "applications" (
        "id" serial PRIMARY KEY NOT NULL,
        "tutor_id" integer NOT NULL,
        "post_id" integer NOT NULL,
        "applied_at" timestamp DEFAULT now() NOT NULL
      );
    `).catch(e => console.log("applications:", e.message));

    await pool.query(`
      CREATE TABLE IF NOT EXISTS "payments" (
        "id" serial PRIMARY KEY NOT NULL,
        "tutor_id" integer NOT NULL,
        "post_id" integer NOT NULL,
        "amount" integer DEFAULT 4900 NOT NULL,
        "payment_status" "payment_status" DEFAULT 'pending' NOT NULL,
        "razorpay_order_id" text,
        "razorpay_payment_id" text,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `).catch(e => console.log("payments:", e.message));

    await pool.query(`
      CREATE TABLE IF NOT EXISTS "reports" (
        "id" serial PRIMARY KEY NOT NULL,
        "reporter_id" integer NOT NULL,
        "type" "report_type" NOT NULL,
        "target_id" integer NOT NULL,
        "reason" text NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `).catch(e => console.log("reports:", e.message));

    console.log("Database fixed successfully!");
  } catch (err) {
    console.error("FATAL ERROR:", err);
  } finally {
    await pool.end();
  }
}
fix();
