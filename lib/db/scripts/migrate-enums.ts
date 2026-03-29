import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '../../.env') });
const { Pool } = pg;

async function run() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("No envurl");
  console.log("Connecting...");
  const pool = new Pool({ connectionString: url });
  
  const types = ["monthly_plan", "weekly_plan", "parent_plan"];
  for (const t of types) {
    try {
      await pool.query(`ALTER TYPE payment_type ADD VALUE IF NOT EXISTS '${t}'`);
      console.log(`Added ${t} to payment_type enum!`);
    } catch (err: any) {
      console.log(`Error adding ${t}:`, err.message);
    }
  }

  const plans = ["monthly", "weekly"];
  for (const p of plans) {
    try {
      await pool.query(`ALTER TYPE plan_type ADD VALUE IF NOT EXISTS '${p}'`);
      console.log(`Added ${p} to plan_type enum!`);
    } catch (err: any) {
      console.log(`Error adding ${p}:`, err.message);
    }
  }

  await pool.end();
  console.log("Done checking enums.");
}

run().catch(console.error);
