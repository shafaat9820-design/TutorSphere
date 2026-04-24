import { db, usersTable } from "./lib/db/src";

async function listUsers() {
  const allUsers = await db.select().from(usersTable);
  console.log(JSON.stringify(allUsers, null, 2));
  process.exit(0);
}

listUsers().catch(err => {
  console.error(err);
  process.exit(1);
});
