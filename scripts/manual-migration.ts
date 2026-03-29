import pg from "pg";
const { Client } = pg;

const DATABASE_URL = "postgresql://neondb_owner:npg_aVJWir4DHS7c@ep-ancient-wave-anhcqprw-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function migrate() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log("Connecting to database...");
    await client.connect();
    console.log("Connected.");

    console.log("Running migrations on 'users' table...");
    
    // Add columns one by one if they don't exist
    const queries = [
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS is_banned BOOLEAN NOT NULL DEFAULT false;`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS is_suspicious BOOLEAN NOT NULL DEFAULT false;`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN NOT NULL DEFAULT false;`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS device_id TEXT;`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS last_ip TEXT;`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS free_contact_used BOOLEAN NOT NULL DEFAULT false;`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS free_post_used_at TIMESTAMP;`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS contacts_unlocked_count INTEGER NOT NULL DEFAULT 0;`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS parent_plan_expiry TIMESTAMP;`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS active_post_count INTEGER NOT NULL DEFAULT 0;`,
    ];

    for (const q of queries) {
      console.log(`Executing: ${q}`);
      await client.query(q);
    }

    console.log("Migrations completed successfully.");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}

migrate();
