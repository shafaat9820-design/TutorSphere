import { Router } from "express";
import {
  db,
  tuitionPostsTable,
  usersTable,
  paymentsTable,
} from "@workspace/db";
import { eq, and, ilike, gte, lte, desc, count, sql } from "drizzle-orm";
import { authenticate, requireRole, AuthRequest } from "../middleware/auth.js";

const router = Router();

router.get("/posts", async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const offset = (page - 1) * limit;

    const conditions: any[] = [];

    if (req.query.search) {
      const s = `%${req.query.search}%`;
      conditions.push(
        sql`(${tuitionPostsTable.title} ILIKE ${s} OR ${tuitionPostsTable.subjects} ILIKE ${s} OR ${tuitionPostsTable.address} ILIKE ${s})`
      );
    }
    if (req.query.class) conditions.push(ilike(tuitionPostsTable.class, `%${req.query.class}%`));
    if (req.query.subject) conditions.push(ilike(tuitionPostsTable.subjects, `%${req.query.subject}%`));
    if (req.query.location) conditions.push(ilike(tuitionPostsTable.address, `%${req.query.location}%`));
    if (req.query.mode) conditions.push(eq(tuitionPostsTable.mode, req.query.mode as any));
    if (req.query.medium) conditions.push(eq(tuitionPostsTable.medium, req.query.medium as any));
    if (req.query.genderPreference) conditions.push(eq(tuitionPostsTable.genderPreference, req.query.genderPreference as any));
    if (req.query.minFee) conditions.push(gte(tuitionPostsTable.monthlyFee, Number(req.query.minFee)));
    if (req.query.maxFee) conditions.push(lte(tuitionPostsTable.monthlyFee, Number(req.query.maxFee)));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ total }] = await db
      .select({ total: count() })
      .from(tuitionPostsTable)
      .where(where);

    const posts = await db
      .select({
        id: tuitionPostsTable.id,
        title: tuitionPostsTable.title,
        class: tuitionPostsTable.class,
        subjects: tuitionPostsTable.subjects,
        genderPreference: tuitionPostsTable.genderPreference,
        medium: tuitionPostsTable.medium,
        mode: tuitionPostsTable.mode,
        address: tuitionPostsTable.address,
        duration: tuitionPostsTable.duration,
        daysPerWeek: tuitionPostsTable.daysPerWeek,
        monthlyFee: tuitionPostsTable.monthlyFee,
        description: tuitionPostsTable.description,
        featured: tuitionPostsTable.featured,
        createdById: tuitionPostsTable.createdById,
        createdByName: usersTable.name,
        createdAt: tuitionPostsTable.createdAt,
      })
      .from(tuitionPostsTable)
      .leftJoin(usersTable, eq(tuitionPostsTable.createdById, usersTable.id))
      .where(where)
      .orderBy(desc(tuitionPostsTable.featured), desc(tuitionPostsTable.createdAt))
      .limit(limit)
      .offset(offset);

    res.json({
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/posts", authenticate, requireRole("parent", "admin"), async (req: AuthRequest, res) => {
  try {
    const {
      title,
      class: cls,
      subjects,
      genderPreference,
      medium,
      mode,
      address,
      duration,
      daysPerWeek,
      monthlyFee,
      description,
      contactPhone,
    } = req.body;

    if (!title || !cls || !subjects || !medium || !mode || !address || !duration || !daysPerWeek || !monthlyFee || !contactPhone) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const [post] = await db
      .insert(tuitionPostsTable)
      .values({
        title,
        class: cls,
        subjects,
        genderPreference: genderPreference || "any",
        medium,
        mode,
        address,
        duration: String(duration),
        daysPerWeek,
        monthlyFee,
        description,
        contactPhone,
        createdById: req.user!.id,
      })
      .returning();

    res.status(201).json({
      ...post,
      createdByName: null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/posts/my", authenticate, async (req: AuthRequest, res) => {
  try {
    const posts = await db
      .select({
        id: tuitionPostsTable.id,
        title: tuitionPostsTable.title,
        class: tuitionPostsTable.class,
        subjects: tuitionPostsTable.subjects,
        genderPreference: tuitionPostsTable.genderPreference,
        medium: tuitionPostsTable.medium,
        mode: tuitionPostsTable.mode,
        address: tuitionPostsTable.address,
        duration: tuitionPostsTable.duration,
        daysPerWeek: tuitionPostsTable.daysPerWeek,
        monthlyFee: tuitionPostsTable.monthlyFee,
        description: tuitionPostsTable.description,
        featured: tuitionPostsTable.featured,
        createdById: tuitionPostsTable.createdById,
        createdByName: usersTable.name,
        createdAt: tuitionPostsTable.createdAt,
      })
      .from(tuitionPostsTable)
      .leftJoin(usersTable, eq(tuitionPostsTable.createdById, usersTable.id))
      .where(eq(tuitionPostsTable.createdById, req.user!.id))
      .orderBy(desc(tuitionPostsTable.createdAt));

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/posts/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [post] = await db
      .select({
        id: tuitionPostsTable.id,
        title: tuitionPostsTable.title,
        class: tuitionPostsTable.class,
        subjects: tuitionPostsTable.subjects,
        genderPreference: tuitionPostsTable.genderPreference,
        medium: tuitionPostsTable.medium,
        mode: tuitionPostsTable.mode,
        address: tuitionPostsTable.address,
        duration: tuitionPostsTable.duration,
        daysPerWeek: tuitionPostsTable.daysPerWeek,
        monthlyFee: tuitionPostsTable.monthlyFee,
        description: tuitionPostsTable.description,
        featured: tuitionPostsTable.featured,
        createdById: tuitionPostsTable.createdById,
        createdByName: usersTable.name,
        createdAt: tuitionPostsTable.createdAt,
      })
      .from(tuitionPostsTable)
      .leftJoin(usersTable, eq(tuitionPostsTable.createdById, usersTable.id))
      .where(eq(tuitionPostsTable.id, id))
      .limit(1);

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/posts/:id", authenticate, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    const [post] = await db
      .select()
      .from(tuitionPostsTable)
      .where(eq(tuitionPostsTable.id, id))
      .limit(1);

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    if (post.createdById !== req.user!.id && req.user!.role !== "admin") {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    const updates: Partial<typeof post> = {};
    const fields = ["title", "class", "subjects", "genderPreference", "medium", "mode", "address", "duration", "daysPerWeek", "monthlyFee", "description", "contactPhone", "featured"] as const;
    for (const f of fields) {
      if (req.body[f] !== undefined) {
        (updates as any)[f] = req.body[f];
      }
    }

    const [updated] = await db
      .update(tuitionPostsTable)
      .set(updates as any)
      .where(eq(tuitionPostsTable.id, id))
      .returning();

    res.json({ ...updated, createdByName: null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/posts/:id", authenticate, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    const [post] = await db
      .select()
      .from(tuitionPostsTable)
      .where(eq(tuitionPostsTable.id, id))
      .limit(1);

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    if (post.createdById !== req.user!.id && req.user!.role !== "admin") {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    await db.delete(tuitionPostsTable).where(eq(tuitionPostsTable.id, id));
    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/posts/:id/contact", authenticate, requireRole("tutor", "admin"), async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);

    if (req.user!.role !== "admin") {
      const [payment] = await db
        .select({ id: paymentsTable.id })
        .from(paymentsTable)
        .where(
          and(
            eq(paymentsTable.tutorId, req.user!.id),
            eq(paymentsTable.postId, id),
            eq(paymentsTable.paymentStatus, "success")
          )
        )
        .limit(1);

      if (!payment) {
        res.status(402).json({ message: "Payment required to unlock contact" });
        return;
      }
    }

    const [post] = await db
      .select({ contactPhone: tuitionPostsTable.contactPhone })
      .from(tuitionPostsTable)
      .where(eq(tuitionPostsTable.id, id))
      .limit(1);

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    res.json({ phone: post.contactPhone });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
