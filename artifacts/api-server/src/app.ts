import express, { type Express } from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes";

const app: Express = express();

app.use(
  cors({
    origin: process.env.NODE_ENV === "production" 
      ? (process.env.FRONTEND_URL || false) 
      : "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes first
app.use("/api", router);

// Determine the path to the frontend build directory
const frontendPath = path.resolve(process.cwd(), "artifacts/tutorconnect/dist");
console.log(`[Server] Serving frontend from: ${frontendPath}`);
app.use(express.static(frontendPath));

// Serve index.html for any other request (SPA routing)
app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ message: "API route not found" });
  }
  return res.sendFile(path.resolve(frontendPath, "index.html"));
});

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error("[Global Error Handler] Error:", err);
  res.status(500).json({ 
    message: "Internal server error", 
    error: process.env.NODE_ENV === "development" ? err.message : undefined 
  });
});

export default app;
