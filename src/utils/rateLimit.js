import { rateLimit } from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  max: 5,
  message:
    "Too many requests created from this IP, please try again after 15 minutes",
});
