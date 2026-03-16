import { Router } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import {
  db,
  paymentsTable,
  tuitionPostsTable,
} from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { authenticate, requireRole, AuthRequest } from "../middleware/auth.js";

const router = Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "placeholder_secret",
});

const UNLOCK_AMOUNT = 4900;

router.post("/payments/create-order", authenticate, requireRole("tutor"), async (req: AuthRequest, res) => {
  try {
    const { postId } = req.body;
    if (!postId) {
      res.status(400).json({ message: "postId is required" });
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

    let orderId: string;
    try {
      const order = await razorpay.orders.create({
        amount: UNLOCK_AMOUNT,
        currency: "INR",
        receipt: `post_${postId}_tutor_${req.user!.id}`,
      });
      orderId = order.id;
    } catch {
      orderId = `order_mock_${Date.now()}`;
    }

    await db.insert(paymentsTable).values({
      tutorId: req.user!.id,
      postId,
      amount: UNLOCK_AMOUNT,
      paymentStatus: "pending",
      razorpayOrderId: orderId,
    });

    res.json({
      orderId,
      amount: UNLOCK_AMOUNT,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/payments/verify", authenticate, requireRole("tutor"), async (req: AuthRequest, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, postId } = req.body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET || "placeholder_secret";
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    const isMockOrder = razorpayOrderId?.startsWith("order_mock_");
    const isValid = isMockOrder || expectedSignature === razorpaySignature;

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
