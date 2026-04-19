import { db, pool } from "./src/index.js";
import { migrate } from "drizzle-orm/node-postgres/migrator";

async function run() {
  console.log("Running migrations...");
  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Migrated successfully");
  } catch (err) {
    console.error("Migration failed:", err);
  }
  await pool.end();
  process.exit(0);
}

run();
