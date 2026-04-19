const pg = require('pg');

const { Pool } = pg;

async function run() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("No envurl");
  console.log("Connecting...");
  const pool = new Pool({ connectionString: url });
  
  const columns = [
    "ADD COLUMN IF NOT EXISTS is_verified boolean NOT NULL DEFAULT false",
    "ADD COLUMN IF NOT EXISTS device_id text",
    "ADD COLUMN IF NOT EXISTS last_ip text",
    "ADD COLUMN IF NOT EXISTS is_suspicious boolean NOT NULL DEFAULT false"
  ];
  for (const c of columns) {
    try {
      await pool.query(`ALTER TABLE users ${c}`);
      console.log(`Executed: ${c}`);
    } catch (err) {
      console.log(`Error doing ${c}:`, err.message);
    }
  }

  await pool.end();
  console.log("Done adding columns.");
}

run().catch(console.error);
