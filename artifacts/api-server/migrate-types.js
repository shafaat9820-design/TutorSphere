import pg from 'pg';
import { config } from 'dotenv';
config({ path: '../../.env' }); // To load DATABASE_URL

const { Pool } = pg;
async function migrateTypes() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    await pool.query("ALTER TYPE payment_type ADD VALUE IF NOT EXISTS 'monthly_plan'");
    console.log("Added monthly_plan to payment_type");
  } catch(e) {}
  try {
    await pool.query("ALTER TYPE payment_type ADD VALUE IF NOT EXISTS 'weekly_plan'");
    console.log("Added weekly_plan to payment_type");
  } catch(e) {}
  try {
    await pool.query("ALTER TYPE payment_type ADD VALUE IF NOT EXISTS 'parent_plan'");
    console.log("Added parent_plan to payment_type");
  } catch(e) {}
  try {
    await pool.query("ALTER TYPE plan_type ADD VALUE IF NOT EXISTS 'monthly'");
    console.log("Added monthly to plan_type");
  } catch(e) {}
  try {
    await pool.query("ALTER TYPE plan_type ADD VALUE IF NOT EXISTS 'weekly'");
    console.log("Added weekly to plan_type");
  } catch(e) {}
  
  await pool.end();
}
migrateTypes().catch(console.error);
