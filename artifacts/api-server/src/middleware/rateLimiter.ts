import rateLimit from "express-rate-limit";

// Enable trust proxy in Express root app logic if behind load balancer (e.g. Render)
// app.set('trust proxy', 1);

// General requests: 100 per 15 mins
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests from this IP, please try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth requests (login/register): 5 per 1 min
export const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: { message: "Too many authentication attempts, please try again after a minute" },
  standardHeaders: true,
  legacyHeaders: false,
});

// OTP requests: 3 per 1 min
export const otpLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 3,
  message: { message: "Too many OTP requests, please wait a minute" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Unlock operations: 5 per hour
export const unlockLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { message: "Too many unlocks from this IP. Rate limit reached." },
  standardHeaders: true,
  legacyHeaders: false,
});
