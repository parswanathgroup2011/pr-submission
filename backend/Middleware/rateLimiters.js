const rateLimit = require("express-rate-limit");

const message = (text) => ({ message: text, success: false });

// Brute-force protection for credential checks.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: message("Too many login attempts. Please try again in 15 minutes."),
});

// Each request sends an email, so this is throttled harder than login.
const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: message("Too many OTP requests. Please try again in an hour."),
});

// Limits OTP guessing from a single address; the per-user attempt counter in
// AuthController handles guessing spread across addresses.
const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: message("Too many reset attempts. Please try again in 15 minutes."),
});

const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: message("Too many signup attempts. Please try again later."),
});

module.exports = {
  loginLimiter,
  forgotPasswordLimiter,
  resetPasswordLimiter,
  signupLimiter,
};
