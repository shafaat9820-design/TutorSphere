import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db, pool, usersTable, otpCodesTable } from "@workspace/db";
import { eq, and, gt, lt, sql } from "drizzle-orm";
import { authenticate, AuthRequest } from "../middleware/auth";
import { sendOTPEmail } from "../lib/email";
import { authLimiter, otpLimiter } from "../middleware/rateLimiter";

async function checkDeviceSuspicion(deviceId: string | undefined): Promise<boolean> {
  if (!deviceId) return false;
  // If >2 accounts on same device
  const [{ count }] = await db
    .select({ count: sql<number>`cast(count(*) as integer)` })
    .from(usersTable)
    .where(eq(usersTable.deviceId, deviceId));
  
  return count >= 2;
}

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "tutorconnect_secret_key_2024";

console.log("[AuthRoutes] Loaded");

// ─── Generate & Send OTP ────────────────
router.post("/auth/otp/send", otpLimiter, async (req, res) => {
  try {
    const { email, type = "register" } = req.body;
    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    // Check if user already exists for registration
    if (type === "register") {
      const [existing] = await db
        .select({ id: usersTable.id })
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1);
      if (existing) {
        res.status(409).json({ message: "Email already in use" });
        return;
      }
    } else if (type === "reset") {
      // Check if user exists for password reset
      const [user] = await db
        .select({ id: usersTable.id })
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1);
      if (!user) {
        res.status(404).json({ message: "No account found with this email" });
        return;
      }
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Clean up expired OTPs for this email first
    await db.delete(otpCodesTable).where(
      and(
        eq(otpCodesTable.email, email),
        lt(otpCodesTable.expiresAt, new Date())
      )
    );

    // Store in DB
    await db.insert(otpCodesTable).values({
      email,
      code,
      type: type as any,
      expiresAt,
    });

    // Send via Brevo
    await sendOTPEmail(email, code, type as any);

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("[POST /auth/otp/send] Error:", err);
    res.status(500).json({ message: "Failed to send OTP email" });
  }
});

// ─── Verify OTP ────────────────
router.post("/auth/otp/verify", otpLimiter, async (req, res) => {
  try {
    const { email, code, type = "register" } = req.body;
    if (!email || !code) {
      res.status(400).json({ message: "Email and OTP code are required" });
      return;
    }

    const [record] = await db
      .select()
      .from(otpCodesTable)
      .where(
        and(
          eq(otpCodesTable.email, email),
          eq(otpCodesTable.code, code),
          eq(otpCodesTable.type, type as any),
          gt(otpCodesTable.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!record) {
      res.status(401).json({ message: "Invalid or expired OTP code" });
      return;
    }

    res.json({ message: "OTP verified correctly" });
  } catch (err) {
    console.error("[POST /auth/otp/verify] Error:", err);
    res.status(500).json({ message: "Verification failed" });
  }
});

// ─── Update Profile  ────────────────
router.patch("/auth/profile", authenticate, async (req: AuthRequest, res) => {
  try {
    const { name, phone, age, bio, avatar } = req.body;
    if (!name || !name.trim()) {
      res.status(400).json({ message: "Name is required" });
      return;
    }

    const updateData: Record<string, any> = { name: name.trim() };
    if (phone !== undefined) updateData.phone = phone || null;
    if (age !== undefined) updateData.age = age ? Number(age) : null;
    if (bio !== undefined) updateData.bio = bio || null;
    if (avatar !== undefined) updateData.avatar = avatar || null;

    const [updated] = await db
      .update(usersTable)
      .set(updateData)
      .where(eq(usersTable.id, req.user!.id))
      .returning();

    if (!updated) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      role: updated.role,
      age: updated.age ?? null,
      bio: updated.bio ?? null,
      avatar: updated.avatar ?? null,
      planType: updated.planType,
      planExpiry: updated.planExpiry,
      freeContactUsed: updated.freeContactUsed,
      freePostUsedAt: updated.freePostUsedAt,
      contactsUnlockedCount: updated.contactsUnlockedCount,
      parentPlanExpiry: updated.parentPlanExpiry,
      activePostCount: updated.activePostCount,
      createdAt: updated.createdAt,
    });
  } catch (err) {
    console.error("[PATCH /auth/profile] Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── Reset Password  ────────────────
router.post("/auth/reset-password", async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      res.status(400).json({ message: "Email, code, and new password are required" });
      return;
    }

    // Verify OTP
    const [record] = await db
      .select()
      .from(otpCodesTable)
      .where(
        and(
          eq(otpCodesTable.email, email),
          eq(otpCodesTable.code, code),
          eq(otpCodesTable.type, "reset"),
          gt(otpCodesTable.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!record) {
      res.status(401).json({ message: "Invalid or expired OTP code" });
      return;
    }

    // Find and update user
    const [user] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await db
      .update(usersTable)
      .set({ password: hashed })
      .where(eq(usersTable.id, user.id));

    // Delete OTP record
    await db.delete(otpCodesTable).where(eq(otpCodesTable.id, record.id));

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("[POST /auth/reset-password] Error:", err);
    res.status(500).json({ message: "Failed to reset password" });
  }
});

router.post("/auth/register", authLimiter, async (req, res) => {
  try {
    const { name, email, password, phone, role, otpCode } = req.body;
    const deviceId = req.headers["x-device-id"] as string | undefined;
    const lastIP = req.ip || req.socket.remoteAddress || "0.0.0.0";
    if (!name || !email || !password || !phone || !role || !otpCode) {
      res.status(400).json({ message: "All fields are required including OTP verification" });
      return;
    }

    // 1. Verify OTP
    const [record] = await db
      .select()
      .from(otpCodesTable)
      .where(
        and(
          eq(otpCodesTable.email, email),
          eq(otpCodesTable.code, otpCode),
          eq(otpCodesTable.type, "register"),
          gt(otpCodesTable.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!record) {
      res.status(401).json({ message: "Invalid or expired OTP" });
      return;
    }

    // 2. Check if email exists (re-confirm)
    const [existingEmail] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (existingEmail) {
      res.status(409).json({ message: "Email already in use" });
      return;
    }

    // 3. Create User
    const hashed = await bcrypt.hash(password, 10);
    const isSuspicious = await checkDeviceSuspicion(deviceId);

    const [user] = await db
      .insert(usersTable)
      .values({ 
        name, 
        email, 
        password: hashed, 
        phone, 
        role,
        isVerified: true,
        deviceId,
        lastIP,
        isSuspicious
      })
      .returning();

    // 4. Delete OTP code record after use
    await db.delete(otpCodesTable).where(eq(otpCodesTable.id, record.id));

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        planType: user.planType,
        planExpiry: user.planExpiry,
        freeContactUsed: user.freeContactUsed,
        freePostUsedAt: user.freePostUsedAt,
        contactsUnlockedCount: user.contactsUnlockedCount,
        parentPlanExpiry: user.parentPlanExpiry,
        activePostCount: user.activePostCount,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("[REGISTER ERROR]", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/auth/login", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    const deviceId = req.headers["x-device-id"] as string | undefined;
    const lastIP = req.ip || req.socket.remoteAddress || "0.0.0.0";
    
    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    console.log("[LOGIN] Attempt for email:", email);
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (!user) {
      console.log("[LOGIN] User not found:", email);
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      console.log("[LOGIN] Invalid password for:", email);
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isSuspicious = await checkDeviceSuspicion(deviceId);

    await db.update(usersTable)
      .set({ 
        deviceId: deviceId || user.deviceId, 
        lastIP,
        isSuspicious: user.isSuspicious || isSuspicious // keep suspicious if already flagged
      })
      .where(eq(usersTable.id, user.id));

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("[LOGIN] Success for user ID:", user.id);
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        planType: user.planType,
        planExpiry: user.planExpiry,
        freeContactUsed: user.freeContactUsed,
        freePostUsedAt: user.freePostUsedAt,
        contactsUnlockedCount: user.contactsUnlockedCount,
        parentPlanExpiry: user.parentPlanExpiry,
        activePostCount: user.activePostCount,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("[LOGIN ERROR]", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/auth/me", authenticate, async (req: AuthRequest, res) => {
  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, req.user!.id))
      .limit(1);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      age: user.age ?? null,
      bio: user.bio ?? null,
      avatar: user.avatar ?? null,
      planType: user.planType,
      planExpiry: user.planExpiry,
      freeContactUsed: user.freeContactUsed,
      freePostUsedAt: user.freePostUsedAt,
      contactsUnlockedCount: user.contactsUnlockedCount,
      parentPlanExpiry: user.parentPlanExpiry,
      activePostCount: user.activePostCount,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

