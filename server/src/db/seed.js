import { sql } from "drizzle-orm";
import { db } from "./index.js";
import { destinations, testimonials } from "./schema.js";
import { products } from "./products.data.js";

// Placeholder testimonials: replace with the ones from your design.
const testimonialData = [
  {
    name: "Sarah M.",
    review:
      "Booking was so easy and the trip was perfectly planned. I didn't have to worry about anything.",
    rating: 5,
    imageUrl: null,
  },
  {
    name: "James T.",
    review:
      "Great prices and amazing destinations. I'll definitely be booking my next holiday here.",
    rating: 5,
    imageUrl: null,
  },
  {
    name: "Elena R.",
    review:
      "The team helped me find the perfect trip for my budget. Highly recommend!",
    rating: 4,
    imageUrl: null,
  },
];

async function seed() {
  try {
    console.log("Clearing old data...");
    // RESTART IDENTITY makes ids start at 1 again, so the destinations
    // get ids 1-6 in the same order as products.data.js.
    // CASCADE also clears saved_destinations, which references destinations.
    await db.execute(
      sql`TRUNCATE TABLE saved_destinations, destinations, testimonials RESTART IDENTITY CASCADE`
    );

    console.log("Seeding destinations...");
    await db.insert(destinations).values(products);

    console.log("Seeding testimonials...");
    await db.insert(testimonials).values(testimonialData);

    console.log("Done! Database seeded.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();