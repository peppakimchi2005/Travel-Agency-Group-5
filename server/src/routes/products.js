import { Router } from "express";
import { asc, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { destinations } from "../db/schema.js";

export const productsRouter = Router();

// GET /api/products
// Returns all destinations, in the same order as your seed data.
productsRouter.get("/", async (req, res) => {
  try {
    const products = await db
      .select()
      .from(destinations)
      .orderBy(asc(destinations.id));

    res.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET /api/products/:slug
// Returns one destination, e.g. /api/products/bali-indonesia
productsRouter.get("/:slug", async (req, res) => {
  try {
    const [product] = await db
      .select()
      .from(destinations)
      .where(eq(destinations.slug, req.params.slug));

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Failed to fetch product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});