import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  serial,
  unique,
} from "drizzle-orm/pg-core";

// =============================================================================
// Better Auth tables (users, sessions, accounts, verification)
// These are required by Better Auth. If your version expects different columns,
// regenerate them with: npx @better-auth/cli generate
// =============================================================================

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// =============================================================================
// Travel agency tables
// =============================================================================

// The destination cards: picture, name, short description, days, price.
// The "All / up to 5 days / 6+ days" filters just query the `days` column.
export const destinations = pgTable("destinations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(), // URL-friendly name, e.g. "bali-indonesia"
  text: text("text").notNull(), // short description shown on the card
  image: text("image").notNull(), // image path or URL
  alt: text("alt").notNull(), // alt text for the image
  days: integer("days").notNull(),
  price: integer("price").notNull(), // whole currency units, e.g. 1299
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// The "save" toggle on each card: one row = one user saved one destination.
// Toggling off deletes the row.
export const savedDestinations = pgTable(
  "saved_destinations",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    destinationId: integer("destination_id")
      .notNull()
      .references(() => destinations.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [unique().on(table.userId, table.destinationId)]
);

// The 3 review cards in the testimonial section.
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  review: text("review").notNull(),
  rating: integer("rating"), // optional, 1-5
  imageUrl: text("image_url"), // optional avatar
  createdAt: timestamp("created_at").defaultNow().notNull(),
});