import { Router } from "express";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { destinations, orders, orderItems } from "../db/schema.js";
import { requireAuth } from "../middleware/requireAuth.js";

export const checkoutRouter = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/checkout  body: { destinationId: 3 }
// The browser only says WHICH destination. The price comes from our database.
checkoutRouter.post("/", requireAuth, async (req, res, next) => {
  try {
    const destinationId = Number(req.body.destinationId);
    if (!Number.isInteger(destinationId)) {
      return res.status(400).json({ error: "destinationId is required." });
    }

    // 1. Real price from the database, never from the browser.
    const [destination] = await db
      .select()
      .from(destinations)
      .where(eq(destinations.id, destinationId));

    if (!destination) {
      return res.status(404).json({ error: "Destination not found." });
    }

    // 2. Create the order as "pending" and its item (price snapshot).
    const [order] = await db
      .insert(orders)
      .values({
        userId: req.user.id,
        totalAmount: destination.price,
        currency: "eur",
        status: "pending",
      })
      .returning();

    await db.insert(orderItems).values({
      orderId: order.id,
      destinationId: destination.id,
      name: destination.name,
      unitPrice: destination.price,
      quantity: 1,
    });

    // 3. Start the Stripe Checkout Session.
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: req.user.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: destination.price * 100, // Stripe wants cents
            product_data: { name: destination.name },
          },
        },
      ],
      metadata: { orderId: String(order.id) },
      success_url: `${process.env.CLIENT_URL}/order/success?orderId=${order.id}`,
      cancel_url: `${process.env.CLIENT_URL}/destinations/${destination.slug}`,
    });

    // 4. Link our order to the Stripe session so the webhook can find it.
    await db
      .update(orders)
      .set({ stripeSessionId: session.id })
      .where(eq(orders.id, order.id));

    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
});