import express, { type Express } from "express";
import cors from "cors";
import path from "path";
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

// Explicit 404 for missing API routes
app.use("/api", (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// Determine the path to the frontend build directory
const frontendPath = path.resolve(process.cwd(), "artifacts/tutorconnect/dist/public");
console.log(`[Server] Static files root: ${frontendPath}`);

// Serve static files from the frontend build directory
app.use(express.static(frontendPath));

// Serve index.html for any other request (SPA routing)
app.get("*", (req, res) => {
  const indexPath = path.resolve(frontendPath, "index.html");
  
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error(`[Server] Error serving index.html from ${indexPath}:`, err);
      // Fallback response instead of crashing
      res.status(404).send("Frontend build not found. Please check build logs.");
    }
  });
});

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  // Prevent Express from dumping its entire source code
  const status = err.status || 500;
  const message = err.message || "Internal server error";
  
  console.error(`[Global Error Handler] ${status} - ${message}`);
  
  if (!res.headersSent) {
    res.status(status).json({ 
      message: "Internal server error", 
      error: process.env.NODE_ENV === "development" ? message : undefined 
    });
  }
});

export default app;
