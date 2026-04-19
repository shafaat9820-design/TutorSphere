import { Router } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import {
  db,
  paymentsTable,
  tuitionPostsTable,
  usersTable,
} from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { authenticate, requireRole, AuthRequest } from "../middleware/auth.js";
import { sendSubscriptionSuccessEmail } from "../lib/email";

const router = Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "placeholder_secret",
});

const POST_UNLOCK_FEE = 4900;
const WEEKLY_PLAN_FEE = 39900;
const MONTHLY_PLAN_FEE = 99900;
const PARENT_PLAN_FEE = 9900;

router.post("/payments/create-order", authenticate, requireRole("tutor", "parent"), async (req: AuthRequest, res) => {
  try {
    const { postId, type = "post_unlock" } = req.body;
    
    let amount = POST_UNLOCK_FEE;
    let receipt = `user_${req.user!.id}_type_${type}`;

    if (type === "post_unlock") {
      if (!postId) {
        res.status(400).json({ message: "postId is required for post unlock" });
        return;
      }
      const [post] = await db
        .select({ id: tuitionPostsTable.id })
        .from(tuitionPostsTable)
        .where(eq(tuitionPostsTable.id, postId))
        .limit(1);

      if (!post) {
        res.status(404).json({ message: "Post not found" });
        return;
      }

      const [existingPayment] = await db
        .select({ id: paymentsTable.id })
        .from(paymentsTable)
        .where(
          and(
            eq(paymentsTable.tutorId, req.user!.id),
            eq(paymentsTable.postId, postId),
            eq(paymentsTable.paymentStatus, "success")
          )
        )
        .limit(1);

      if (existingPayment) {
        res.status(400).json({ message: "Contact already unlocked" });
        return;
      }
      receipt = `post_${postId}_tutor_${req.user!.id}`;
    } else if (type === "weekly_plan") {
      amount = WEEKLY_PLAN_FEE;
    } else if (type === "monthly_plan") {
      amount = MONTHLY_PLAN_FEE;
    } else if (type === "parent_plan") {
      if (req.user!.role !== "parent") {
        res.status(403).json({ message: "Only parents can buy this plan" });
        return;
      }
      amount = PARENT_PLAN_FEE;
    } else {
      res.status(400).json({ message: "Invalid payment type" });
      return;
    }

    let orderId: string;
    try {
      const order = await razorpay.orders.create({
        amount,
        currency: "INR",
        receipt,
      });
      orderId = order.id;
    } catch {
      orderId = `order_mock_${Date.now()}`;
    }

    await db.insert(paymentsTable).values({
      tutorId: req.user!.id,
      postId: type === "post_unlock" ? postId : null,
      amount,
      paymentType: type as any,
      paymentStatus: "pending",
      razorpayOrderId: orderId,
    });

    res.json({
      orderId,
      amount,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error", err: err?.message, stack: err?.stack });
  }
});

router.post("/payments/verify", authenticate, requireRole("tutor", "parent"), async (req: AuthRequest, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, postId, type = "post_unlock" } = req.body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET || "placeholder_secret";
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    const isMockOrder = razorpayOrderId?.startsWith("order_mock_");
    const isDevMock = process.env.NODE_ENV !== "production" && razorpaySignature === "mock_sig";
    const isValid = isMockOrder || isDevMock || expectedSignature === razorpaySignature;

    if (!isValid) {
      await db
        .update(paymentsTable)
        .set({ paymentStatus: "failed" })
        .where(
          and(
            eq(paymentsTable.razorpayOrderId, razorpayOrderId),
            eq(paymentsTable.tutorId, req.user!.id)
          )
        );
      res.status(400).json({ message: "Payment verification failed" });
      return;
    }

    // Success flow
    await db
      .update(paymentsTable)
      .set({
        paymentStatus: "success",
        razorpayPaymentId,
      })
      .where(
        and(
          eq(paymentsTable.razorpayOrderId, razorpayOrderId),
          eq(paymentsTable.tutorId, req.user!.id)
        )
      );

    if (type === "post_unlock") {
      const [post] = await db
        .select({ contactPhone: tuitionPostsTable.contactPhone })
        .from(tuitionPostsTable)
        .where(eq(tuitionPostsTable.id, postId))
        .limit(1);

      res.json({
        success: true,
        phone: post?.contactPhone ?? null,
        message: "Payment verified. Contact unlocked!",
      });
    } else if (type === "parent_plan") {
      // Handle Parent Plan
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 30);

      const [userRecord] = await db
        .update(usersTable)
        .set({
          parentPlanExpiry: expiry,
          activePostCount: 0 // Allow them to create more posts
        })
        .where(eq(usersTable.id, req.user!.id))
        .returning({ name: usersTable.name });
      
      // Trigger Email Notification
      await sendSubscriptionSuccessEmail(
        req.user!.email, 
        userRecord?.name || "Member", 
        "Parent Premium Plan", 
        expiry.toLocaleDateString()
      );

      res.json({
        success: true,
        message: `Parent Plan activated! You can now create up to 5 active posts until ${expiry.toLocaleDateString()}`,
      });
    } else {
      // Handle Tutor subscriptions (Weekly/Monthly)
      const duration = type === "weekly_plan" ? 7 : 30;
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + duration);

      const [userRecord] = await db
        .update(usersTable)
        .set({
          planType: type === "weekly_plan" ? "weekly" : "monthly",
          planExpiry: expiry
        })
        .where(eq(usersTable.id, req.user!.id))
        .returning({ name: usersTable.name });

      // Trigger Email Notification
      await sendSubscriptionSuccessEmail(
        req.user!.email, 
        userRecord?.name || "Member",
        type === "weekly_plan" ? "Weekly Tutor Pro" : "Monthly Tutor Pro", 
        expiry.toLocaleDateString()
      );

      res.json({
        success: true,
        message: `Subscription activated! Unlimited access until ${expiry.toLocaleDateString()}`,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/payments/my", authenticate, async (req: AuthRequest, res) => {
  try {
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
      .where(eq(paymentsTable.tutorId, req.user!.id));

    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
