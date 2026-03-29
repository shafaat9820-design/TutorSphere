import pg from 'pg';
const { Client } = pg;

const DATABASE_URL = 'postgresql://neondb_owner:npg_aVJWir4DHS7c@ep-ancient-wave-anhcqprw-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function migrate() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting...');
    await client.connect();
    console.log('Connected.');
    
    // In case 'is_blocked' exists, let's rename it to 'is_banned', otherwise add the new columns
    try {
      await client.query('ALTER TABLE users RENAME COLUMN is_blocked TO is_banned;');
      console.log('Renamed is_blocked to is_banned');
    } catch (e) {
      console.log('is_blocked rename skipped (might not exist or already renamed)');
    }

    const queries = [
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS is_banned BOOLEAN NOT NULL DEFAULT false;',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS is_suspicious BOOLEAN NOT NULL DEFAULT false;',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN NOT NULL DEFAULT false;',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS device_id TEXT;',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS last_ip TEXT;',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS free_contact_used BOOLEAN NOT NULL DEFAULT false;',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS free_post_used_at TIMESTAMP;',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS contacts_unlocked_count INTEGER NOT NULL DEFAULT 0;',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS parent_plan_expiry TIMESTAMP;',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS active_post_count INTEGER NOT NULL DEFAULT 0;'
    ];
    for (const q of queries) {
      console.log('Executing: ' + q);
      await client.query(q);
    }
    console.log('Completed.');
  } catch (err) {
    console.error('Failed:', err);
  } finally {
    await client.end();
  }
}
migrate();
