import { Router } from "express";
import { asc } from "drizzle-orm";
import { db } from "../db/index.js";
import { testimonials } from "../db/schema.js";

export const testimonialsRouter = Router();

// GET /api/testimonials
// Returns all testimonials, in the same order as the seed data.
testimonialsRouter.get("/", async (req, res) => {
  try {
    const items = await db
      .select()
      .from(testimonials)
      .orderBy(asc(testimonials.id));

    res.json(items);
  } catch (error) {
    console.error("Failed to fetch testimonials:", error);
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
});