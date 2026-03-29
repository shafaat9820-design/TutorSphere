import pg from 'pg';
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function migrate() {
  const client = await pool.connect();
  try {
    console.log("Adding profile columns to users table...");

    const cols = [
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "age" integer`,
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "bio" text`,
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "avatar" text`,
    ];

    for (const sql of cols) {
      await client.query(sql).catch(e => console.log("skip:", e.message));
    }

    console.log("✓ age, bio, avatar columns added (or already existed) on users table.");

    const check = await client.query(
      `SELECT column_name, data_type
       FROM information_schema.columns
       WHERE table_name = 'users'
       ORDER BY ordinal_position`
    );
    console.log("\nCurrent users columns:");
    check.rows.forEach(r => console.log(`  ${r.column_name} (${r.data_type})`));
  } catch (err) {
    console.error("FATAL:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
