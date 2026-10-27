import { Router } from "express";
import { and, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { orders, orderItems } from "../db/schema.js";
import { requireAuth } from "../middleware/requireAuth.js";

export const ordersRouter = Router();

// GET /api/orders/:id  -> status and items of ONE order, only if it is yours
ordersRouter.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "Invalid order id." });
    }

    const [order] = await db
      .select()
      .from(orders)
      .where(and(eq(orders.id, id), eq(orders.userId, req.user.id)));

    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id));

    res.json({
      id: order.id,
      status: order.status,
      totalAmount: order.totalAmount,
      currency: order.currency,
      paidAt: order.paidAt,
      items: items.map((i) => ({
        name: i.name,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
      })),
    });
  } catch (err) {
    next(err);
  }
});