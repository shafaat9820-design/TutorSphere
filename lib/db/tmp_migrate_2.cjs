const pg = require('pg');

const DATABASE_URL = "postgresql://neondb_owner:npg_aVJWir4DHS7c@ep-ancient-wave-anhcqprw-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function migrate() {
  const client = new pg.Client({
    connectionString: DATABASE_URL,
  });

  try {
    await client.connect();
    console.log("Connected to database");

    // Add new columns to users table
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS free_contact_used BOOLEAN NOT NULL DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS free_post_used_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS contacts_unlocked_count INTEGER NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS parent_plan_expiry TIMESTAMP,
      ADD COLUMN IF NOT EXISTS active_post_count INTEGER NOT NULL DEFAULT 0;
    `);
    console.log("Added new columns to users table");

    // Update payment_type enum
    // Note: In Postgres, you can't easily add values to a type inside a transaction if it's used in a table.
    // But we can try ALTER TYPE.
    try {
      await client.query(`ALTER TYPE payment_type ADD VALUE IF NOT EXISTS 'parent_plan'`);
      console.log("Added 'parent_plan' to payment_type enum");
    } catch (e) {
      if (e.code === '42710') { // duplicate_object
        console.log("'parent_plan' already exists in payment_type enum");
      } else {
        throw e;
      }
    }

    console.log("Migration completed successfully");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}

migrate();
