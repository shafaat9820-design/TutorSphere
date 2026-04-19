import { Router } from "express";
import {
  db,
  applicationsTable,
  usersTable,
  tuitionPostsTable,
} from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { authenticate, requireRole, AuthRequest } from "../middleware/auth.js";

const router = Router();

router.post("/applications", authenticate, requireRole("tutor"), async (req: AuthRequest, res) => {
  try {
    const { postId } = req.body;
    if (!postId) {
      res.status(400).json({ message: "postId is required" });
      return;
    }

    const [existing] = await db
      .select({ id: applicationsTable.id })
      .from(applicationsTable)
      .where(
        and(
          eq(applicationsTable.tutorId, req.user!.id),
          eq(applicationsTable.postId, postId)
        )
      )
      .limit(1);

    if (existing) {
      res.status(409).json({ message: "Already applied to this post" });
      return;
    }

    const [app] = await db
      .insert(applicationsTable)
      .values({ tutorId: req.user!.id, postId })
      .returning();

    res.status(201).json({
      ...app,
      tutorName: null,
      tutorEmail: null,
      postTitle: null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/applications/my", authenticate, async (req: AuthRequest, res) => {
  try {
    const apps = await db
      .select({
        id: applicationsTable.id,
        tutorId: applicationsTable.tutorId,
        postId: applicationsTable.postId,
        tutorName: usersTable.name,
        tutorEmail: usersTable.email,
        postTitle: tuitionPostsTable.title,
        appliedAt: applicationsTable.appliedAt,
      })
      .from(applicationsTable)
      .leftJoin(usersTable, eq(applicationsTable.tutorId, usersTable.id))
      .leftJoin(tuitionPostsTable, eq(applicationsTable.postId, tuitionPostsTable.id))
      .where(eq(applicationsTable.tutorId, req.user!.id));

    res.json(apps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/applications/post/:postId", authenticate, async (req: AuthRequest, res) => {
  try {
    const postId = Number(req.params.postId);

    const [post] = await db
      .select({ createdById: tuitionPostsTable.createdById })
      .from(tuitionPostsTable)
      .where(eq(tuitionPostsTable.id, postId))
      .limit(1);

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    if (post.createdById !== req.user!.id && req.user!.role !== "admin") {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    const apps = await db
      .select({
        id: applicationsTable.id,
        tutorId: applicationsTable.tutorId,
        postId: applicationsTable.postId,
        tutorName: usersTable.name,
        tutorEmail: usersTable.email,
        postTitle: tuitionPostsTable.title,
        appliedAt: applicationsTable.appliedAt,
      })
      .from(applicationsTable)
      .leftJoin(usersTable, eq(applicationsTable.tutorId, usersTable.id))
      .leftJoin(tuitionPostsTable, eq(applicationsTable.postId, tuitionPostsTable.id))
      .where(eq(applicationsTable.postId, postId));

    res.json(apps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
