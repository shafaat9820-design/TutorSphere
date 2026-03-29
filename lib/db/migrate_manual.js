import pg from 'pg';
import fs from 'fs';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function runMigration() {
  const sql = fs.readFileSync('./drizzle/0000_late_captain_cross.sql', 'utf8');
  const statements = sql.split('--> statement-breakpoint').map(s => s.trim()).filter(Boolean);

  for (const stmt of statements) {
    try {
      console.log(`Executing: ${stmt.substring(0, 30)}...`);
      await pool.query(stmt);
      console.log('Success');
    } catch (err) {
      if (err.code === '42710' || err.code === '42P07' || err.code === '42701') {
        // 42710: duplicate object, 42P07: duplicate table, 42701: duplicate column
        console.log('Already exists, skipping.');
      } else {
        console.log(`Error: ${err.message} (Code: ${err.code})`);
      }
    }
  }
  
  // Since we also need to ADD the missing 'phone' and 'role' to 'users' if not present:
  try {
    await pool.query(`ALTER TABLE "users" ADD COLUMN "phone" text;`);
    console.log('Added phone column');
  } catch(e) { console.log('phone column probably exists:', e.message); }
  
  try {
    await pool.query(`ALTER TABLE "users" ADD COLUMN "role" "role" DEFAULT 'parent' NOT NULL;`);
    console.log('Added role column');
  } catch(e) { console.log('role column probably exists:', e.message); }

  console.log('Migration finished');
  process.exit(0);
}

runMigration();
