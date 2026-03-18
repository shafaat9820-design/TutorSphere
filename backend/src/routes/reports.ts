import { Router } from "express";
import { db, reportsTable } from "@workspace/db";
import { authenticate, AuthRequest } from "../middleware/auth.js";

const router = Router();

router.post("/reports", authenticate, async (req: AuthRequest, res) => {
  try {
    const { type, targetId, reason } = req.body;
    if (!type || !targetId || !reason) {
      res.status(400).json({ message: "type, targetId and reason are required" });
      return;
    }
    if (!["post", "user"].includes(type)) {
      res.status(400).json({ message: "type must be post or user" });
      return;
    }

    await db.insert(reportsTable).values({
      reporterId: req.user!.id,
      type,
      targetId,
      reason,
    });

    res.status(201).json({ message: "Report submitted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
