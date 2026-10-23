import { sql } from "drizzle-orm";
import { db } from "./index.js";
import { destinations, testimonials } from "./schema.js";
import { products } from "./products.data.js";

const testimonialData = [
  {
    quote:
      '"WayFinder made my trip to Europe unforgettable! The itinerary was perfect and stress-free."',
    name: "Phini S., Malaysia",
  },
  {
    quote:
      '"I loved the personalized service and attention to detail. Highly recommend WayFinder!"',
    name: "Anja S., Berlin",
  },
  {
    quote:
      '"From start to finish, my experience with WayFinder was seamless and enjoyable."',
    name: "Sharon H., USA",
  },
];

async function seed() {
  try {
    console.log("Clearing old data...");
    // RESTART IDENTITY makes ids start at 1 again, so the destinations
    // get ids 1-6 in the same order as your destinations.js file.
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