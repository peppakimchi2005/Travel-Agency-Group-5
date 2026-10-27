import express, { Router } from "express";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { orders } from "../db/schema.js";

export const webhookRouter = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/webhook  (called by Stripe, not by the browser)
webhookRouter.post(
  "/",
  express.raw({ type: "application/json" }), // Stripe needs the untouched raw body
  async (req, res) => {
    let event;

    // 1. Verify the request really came from Stripe.
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        req.headers["stripe-signature"],
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature check failed:", err.message);
      return res.status(400).send("Invalid signature");
    }

    // 2. React to the events we care about.
    try {
      if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        // Only mark paid if Stripe says the money was actually received.
        if (session.payment_status === "paid") {
          await db
            .update(orders)
            .set({
              status: "paid",
              paidAt: new Date(),
              stripePaymentIntentId: session.payment_intent,
            })
            .where(eq(orders.id, Number(session.metadata.orderId)));
        }
      }

      if (event.type === "checkout.session.expired") {
        const session = event.data.object;
        await db
          .update(orders)
          .set({ status: "expired" })
          .where(eq(orders.id, Number(session.metadata.orderId)));
      }

      // 3. Tell Stripe we received it.
      res.json({ received: true });
    } catch (err) {
      console.error("Webhook handler error:", err);
      res.status(500).send("Webhook handler failed");
    }
  }
);