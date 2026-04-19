import { Router } from "express";
import {
  db,
  tuitionPostsTable,
  usersTable,
  paymentsTable,
} from "@workspace/db";
import { eq, and, ilike, gte, lte, desc, count, sql, gt } from "drizzle-orm";
import { authenticate, requireRole, AuthRequest } from "../middleware/auth.js";
import { unlockLimiter } from "../middleware/rateLimiter";

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
    if (req.query.state) conditions.push(eq(tuitionPostsTable.state, req.query.state as string));

    if (req.query.timeFilter) {
      let filterDate: Date | null = null;
      switch (req.query.timeFilter) {
        case "today": {
          const d = new Date();
          d.setHours(0, 0, 0, 0);
          filterDate = d;
          break;
        }
        case "week": {
          const d = new Date();
          d.setDate(d.getDate() - 7);
          filterDate = d;
          break;
        }
        case "month": {
          const d = new Date();
          d.setMonth(d.getMonth() - 1);
          filterDate = d;
          break;
        }
        case "year": {
          const d = new Date();
          d.setFullYear(d.getFullYear() - 1);
          filterDate = d;
          break;
        }
      }
      if (filterDate) {
        conditions.push(gte(tuitionPostsTable.createdAt, filterDate));
      }
    }

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
        state: tuitionPostsTable.state,
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
      state,
      description,
      contactPhone,
    } = req.body;

    if (!title || !cls || !subjects || !medium || !mode || !address || !duration || !daysPerWeek || !monthlyFee || !contactPhone || !state) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const userId = req.user!.id;

    // Access Control Logic for Parents
    if (req.user!.role === "parent") {
      const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, userId))
        .limit(1);

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const now = new Date();
      const hasActiveParentPlan = user.parentPlanExpiry && new Date(user.parentPlanExpiry) > now;
      
      let isFreePost = false;
      const lastFreePost = user.freePostUsedAt ? new Date(user.freePostUsedAt) : null;
      
       // Check if 30 days have passed, and if the user is not suspended for suspicious device activity
      if (!user.isSuspicious) {
        if (!lastFreePost || (now.getTime() - lastFreePost.getTime()) > 30 * 24 * 60 * 60 * 1000) {
          isFreePost = true;
        }
      }

      if (!isFreePost && !hasActiveParentPlan) {
        res.status(402).json({ 
          message: user.isSuspicious ? "Suspicious activity detected. Free access blocked." : "Free usage exceeded. Upgrade to ₹99/month to post more",
          requiresParentPlan: true 
        });
        return;
      }

      if (hasActiveParentPlan && user.activePostCount >= 5) {
        res.status(403).json({ message: "You can only have 5 active posts at a time" });
        return;
      }

      // If we reach here, we can create the post
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
          state,
          description,
          contactPhone,
          createdById: userId,
        })
        .returning();

      // Update user usage atomically
      const updateData: any = {
        activePostCount: sql`${usersTable.activePostCount} + 1`
      };
      if (isFreePost) {
        updateData.freePostUsedAt = now;
      }

      await db.update(usersTable).set(updateData).where(eq(usersTable.id, userId));

      res.status(201).json({ ...post, createdByName: null });
    } else {
      // Admin creation (skip limits)
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
          state,
          description,
          contactPhone,
          createdById: userId,
        })
        .returning();
      res.status(201).json({ ...post, createdByName: null });
    }
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
        state: tuitionPostsTable.state,
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
        state: tuitionPostsTable.state,
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
    const fields = ["title", "class", "subjects", "genderPreference", "medium", "mode", "address", "state", "duration", "daysPerWeek", "monthlyFee", "description", "contactPhone", "featured"] as const;
    for (const f of fields) {
      if (req.body[f] !== undefined) {
        // duration is numeric in DB — ensure it's always stored as string
        (updates as any)[f] = f === "duration" ? String(req.body[f]) : req.body[f];
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
    
    // Decrement active post count atomically for parent
    if (post.createdById) {
      await db.update(usersTable)
        .set({
          activePostCount: sql`GREATEST(${usersTable.activePostCount} - 1, 0)`
        })
        .where(eq(usersTable.id, post.createdById));
    }

    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/posts/:id/contact", authenticate, requireRole("tutor", "admin"), unlockLimiter, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);

    if (req.user!.role !== "admin") {
      // Check for active subscription
      const [user] = await db
        .select({ 
          planType: usersTable.planType, 
          planExpiry: usersTable.planExpiry 
        })
        .from(usersTable)
        .where(eq(usersTable.id, req.user!.id))
        .limit(1);

      const hasActiveSubscription = user && 
        (user.planType === "weekly" || user.planType === "monthly") && 
        user.planExpiry && new Date(user.planExpiry) > new Date();

      if (!hasActiveSubscription) {
        const [userData] = await db
          .select({ 
            freeContactUsed: usersTable.freeContactUsed,
            contactsUnlockedCount: usersTable.contactsUnlockedCount,
            isSuspicious: usersTable.isSuspicious,
            deviceId: usersTable.deviceId
          })
          .from(usersTable)
          .where(eq(usersTable.id, req.user!.id))
          .limit(1);

        if (userData && !userData.freeContactUsed && !userData.isSuspicious) {
          // Verify that this device isn't banned from free usage by checking if another user on this device already used it
          let deviceHasUsedFree = false;
          if (userData.deviceId) {
            const [{ used }] = await db.select({ used: sql<number>`cast(count(*) as integer)` })
              .from(usersTable)
              .where(and(
                eq(usersTable.deviceId, userData.deviceId), 
                eq(usersTable.freeContactUsed, true),
                sql`${usersTable.id} != ${req.user!.id}`
              ));
            deviceHasUsedFree = used > 0;
          }

          if (!deviceHasUsedFree) {
            // Use free trial contact
            await db.update(usersTable)
              .set({ 
                freeContactUsed: true,
                contactsUnlockedCount: userData.contactsUnlockedCount + 1
              })
              .where(eq(usersTable.id, req.user!.id));
          } else {
            res.status(402).json({ 
              message: "Device already claimed free contact limit. Upgrade to continue.",
              requiresSubscription: true 
            });
            return;
          }
        } else {
          // Fallback to per-post check
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
            res.status(402).json({ 
              message: "You've used your free contact. Upgrade to continue.",
              requiresSubscription: true 
            });
            return;
          }
        }
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

router.post("/posts/:id/unlock-free", authenticate, requireRole("tutor"), unlockLimiter, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user!.id;

    const [user] = await db
      .select({ 
        freeContactUsed: usersTable.freeContactUsed,
        contactsUnlockedCount: usersTable.contactsUnlockedCount,
        deviceId: usersTable.deviceId,
        isSuspicious: usersTable.isSuspicious
      })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.isSuspicious) {
      res.status(403).json({ message: "Suspicious activity detected. Free access blocked." });
      return;
    }

    if (user.freeContactUsed) {
      res.status(403).json({ message: "Free trial already used" });
      return;
    }

    let deviceHasUsedFree = false;
    if (user.deviceId) {
      const [{ used }] = await db.select({ used: sql<number>`cast(count(*) as integer)` })
        .from(usersTable)
        .where(and(
          eq(usersTable.deviceId, user.deviceId), 
          eq(usersTable.freeContactUsed, true),
          sql`${usersTable.id} != ${userId}`
        ));
      deviceHasUsedFree = used > 0;
    }

    if (deviceHasUsedFree) {
      res.status(403).json({ message: "Device already claimed free contact." });
      return;
    }

    await db.update(usersTable)
      .set({ 
        freeContactUsed: true,
        contactsUnlockedCount: user.contactsUnlockedCount + 1
      })
      .where(eq(usersTable.id, userId));

    res.json({ message: "Contact unlocked using free trial!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
