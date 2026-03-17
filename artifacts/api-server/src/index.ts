import app from "./app";
import { seedAdminAccount } from "./lib/seedAdmin";

const port = Number(process.env["PORT"]) || 5000;

app.listen(port, async () => {
  console.log(`Server listening on port ${port}`);
  await seedAdminAccount();
});
