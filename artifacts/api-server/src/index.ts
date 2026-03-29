import app from "./app";
import { seedAdminAccount } from "./lib/seedAdmin";

const port = Number(process.env.API_PORT || process.env.PORT) || 5000;

const server = app.listen(port, "0.0.0.0", () => {
  console.log(`[Server] Listening on port ${port}`);
  
  // Run seed in background
  seedAdminAccount()
    .then(() => console.log("[Server] Seeding completed"))
    .catch((err) => console.error("[Server] Seeding failed:", err));
});

// Keep process from exiting
process.on('SIGINT', () => {
  server.close();
  process.exit(0);
});

// Trigger restart for database schema sync
