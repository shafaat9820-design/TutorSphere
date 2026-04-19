import { pool } from "@workspace/db";

async function run() {
  console.log("Connecting using @workspace/db pool...");
  
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

  // Note: We don't end the pool here if it's shared, but for a standalone script it's fine.
  // Actually @workspace/db pool is a singleton.
  await pool.end();
  console.log("Done checking enums.");
}

run().catch(console.error);
