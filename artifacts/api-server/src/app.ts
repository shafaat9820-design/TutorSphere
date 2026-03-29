import express, { type Express } from "express";
import cors from "cors";
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

app.use("/api", router);

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error("[Global Error Handler] Error:", err);
  res.status(500).json({ 
    message: "Internal server error", 
    error: process.env.NODE_ENV === "development" ? err.message : undefined 
  });
});

export default app;
