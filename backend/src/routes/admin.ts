import { Router } from "express";
import {
  db,
  usersTable,
  tuitionPostsTable,
  paymentsTable,
  reportsTable,
} from "@workspace/db";
import { eq, count, sum, desc, sql, ilike, and } from "drizzle-orm";
import { authenticate, requireRole, AuthRequest } from "../middleware/auth.js";

const router = Router();

const adminOnly = [authenticate, requireRole("admin")];

router.get("/admin/dashboard", ...adminOnly, async (_req, res) => {
  try {
    const [[{ totalUsers }], [{ totalTutors }], [{ totalParents }], [{ totalPosts }], [{ totalPayments }], [{ totalRevenue }]] = await Promise.all([
      db.select({ totalUsers: count() }).from(usersTable),
      db.select({ totalTutors: count() }).from(usersTable).where(eq(usersTable.role, "tutor")),
      db.select({ totalParents: count() }).from(usersTable).where(eq(usersTable.role, "parent")),
      db.select({ totalPosts: count() }).from(tuitionPostsTable),
      db.select({ totalPayments: count() }).from(paymentsTable).where(eq(paymentsTable.paymentStatus, "success")),
      db.select({ totalRevenue: sum(paymentsTable.amount) }).from(paymentsTable).where(eq(paymentsTable.paymentStatus, "success")),
    ]);

    res.json({
      totalUsers,
      totalTutors,
      totalParents,
      totalPosts,
      totalPayments,
      totalRevenue: Number(totalRevenue) || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/admin/users", ...adminOnly, async (req: AuthRequest, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    const conditions: any[] = [];
    if (req.query.role) conditions.push(eq(usersTable.role, req.query.role as any));
    if (req.query.search) {
      const s = `%${req.query.search}%`;
      conditions.push(sql`(${usersTable.name} ILIKE ${s} OR ${usersTable.email} ILIKE ${s})`);
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ total }] = await db.select({ total: count() }).from(usersTable).where(where);
    const users = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        phone: usersTable.phone,
        role: usersTable.role,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .where(where)
      .orderBy(desc(usersTable.createdAt))
      .limit(limit)
      .offset(offset);

    res.json({
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/admin/users/:id", ...adminOnly, async (req, res) => {
  try {
    await db.delete(usersTable).where(eq(usersTable.id, Number(req.params.id)));
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/admin/posts", ...adminOnly, async (req: AuthRequest, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    const [{ total }] = await db.select({ total: count() }).from(tuitionPostsTable);
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
      .orderBy(desc(tuitionPostsTable.createdAt))
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

router.patch("/admin/posts/:id/featured", ...adminOnly, async (req, res) => {
  try {
    const { featured } = req.body;
    await db
      .update(tuitionPostsTable)
      .set({ featured: Boolean(featured) })
      .where(eq(tuitionPostsTable.id, Number(req.params.id)));
    res.json({ message: "Post updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/admin/payments", ...adminOnly, async (req: AuthRequest, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    const [{ total }] = await db.select({ total: count() }).from(paymentsTable);
    const [{ totalRevenue }] = await db
      .select({ totalRevenue: sum(paymentsTable.amount) })
      .from(paymentsTable)
      .where(eq(paymentsTable.paymentStatus, "success"));

    const payments = await db
      .select({
        id: paymentsTable.id,
        tutorId: paymentsTable.tutorId,
        postId: paymentsTable.postId,
        postTitle: tuitionPostsTable.title,
        amount: paymentsTable.amount,
        paymentStatus: paymentsTable.paymentStatus,
        razorpayOrderId: paymentsTable.razorpayOrderId,
        razorpayPaymentId: paymentsTable.razorpayPaymentId,
        createdAt: paymentsTable.createdAt,
      })
      .from(paymentsTable)
      .leftJoin(tuitionPostsTable, eq(paymentsTable.postId, tuitionPostsTable.id))
      .orderBy(desc(paymentsTable.createdAt))
      .limit(limit)
      .offset(offset);

    res.json({
      payments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      totalRevenue: Number(totalRevenue) || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/admin/reports", ...adminOnly, async (req: AuthRequest, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    const [{ total }] = await db.select({ total: count() }).from(reportsTable);
    const reports = await db
      .select({
        id: reportsTable.id,
        reporterId: reportsTable.reporterId,
        reporterName: usersTable.name,
        type: reportsTable.type,
        targetId: reportsTable.targetId,
        reason: reportsTable.reason,
        createdAt: reportsTable.createdAt,
      })
      .from(reportsTable)
      .leftJoin(usersTable, eq(reportsTable.reporterId, usersTable.id))
      .orderBy(desc(reportsTable.createdAt))
      .limit(limit)
      .offset(offset);

    res.json({
      reports,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/admin/reports/:id", ...adminOnly, async (req, res) => {
  try {
    await db.delete(reportsTable).where(eq(reportsTable.id, Number(req.params.id)));
    res.json({ message: "Report deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/admin/analytics", ...adminOnly, async (_req, res) => {
  try {
    const dailyRegistrations = await db.execute(sql`
      SELECT DATE(created_at)::text as date, COUNT(*)::int as count
      FROM users
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    const revenueByDay = await db.execute(sql`
      SELECT DATE(created_at)::text as date, SUM(amount)::int as revenue
      FROM payments
      WHERE payment_status = 'success' AND created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    const topSubjects = await db.execute(sql`
      SELECT subjects as subject, COUNT(*)::int as count
      FROM tuition_posts
      GROUP BY subjects
      ORDER BY count DESC
      LIMIT 10
    `);

    const topLocations = await db.execute(sql`
      SELECT address as location, COUNT(*)::int as count
      FROM tuition_posts
      GROUP BY address
      ORDER BY count DESC
      LIMIT 10
    `);

    res.json({
      dailyRegistrations: dailyRegistrations.rows,
      revenueByDay: revenueByDay.rows,
      topSubjects: topSubjects.rows,
      topLocations: topLocations.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
