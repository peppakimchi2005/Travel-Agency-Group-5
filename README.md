# WayFinder

A travel agency website where people can browse trips, create an account, and pay for a trip online.

## Live site

- Website: https://travel-agency-group-5-erehfpia9-travel-agency4.vercel.app/
- API: https://travel-agency-group-5.onrender.com/api/health

The API runs on Render's free plan. It goes to sleep after 15 minutes without visitors, so the first load can take up to a minute.

## Features

- Browse 6 destinations, with filters for "Up to 5 days" and "6+ days"
- A page for each destination
- Sign up, log in, and sign out
- Book a trip and pay through Stripe Checkout
- An order success page that confirms the payment
- Testimonials loaded from the database

## Tech stack

| Part | What it uses |
|---|---|
| Website (`client`) | React, Vite, Tailwind CSS, React Router |
| Server (`server`) | Node.js, Express |
| Database | PostgreSQL on Neon, with Drizzle ORM |
| Login | Better Auth |
| Payments | Stripe Checkout and webhooks |
| Hosting | Vercel (website) and Render (server) |

## How it works

1. The website (Vercel) sends every request that starts with `/api` to the server (Render).
2. The server reads and writes the database (Neon).
3. Better Auth handles logins and saves users and sessions in the database.
4. When someone clicks "Book this trip", the server creates a `pending` order and sends the person to Stripe to pay.
5. After payment, Stripe tells the server through a webhook, and the server marks the order as `paid`.

## Folder structure

```
TravelAgencyGrp5
├── client                      the website
│   ├── public/images           photos of the destinations
│   ├── vercel.json             sends /api requests to the server
│   ├── vite.config.js          does the same while developing locally
│   └── src
│       ├── App.jsx             decides which page shows
│       ├── components          Header, Hero, Tours, Testimonials, Cta, Footer,
│       │                       FavoriteToggle, DestinationDetail, Login, OrderSuccess
│       └── lib
│           ├── format.js       formats prices
│           └── auth-client.js  connects the browser to the login system
└── server                      the backend
    ├── drizzle.config.js       database settings for Drizzle
    └── src
        ├── index.js            starts the server and connects the routes
        ├── auth.js             login setup (Better Auth)
        ├── db
        │   ├── index.js        database connection
        │   ├── schema.js       all the tables
        │   ├── seed.js         fills the tables with starting data
        │   └── products.data.js  the 6 destinations
        ├── middleware
        │   └── requireAuth.js  blocks people who aren't signed in
        └── routes
            ├── products.js     destinations
            ├── testimonials.js reviews
            ├── checkout.js     starts a Stripe payment
            ├── webhook.js      receives payment results from Stripe
            └── orders.js       status of one order
```

## Database tables

- Login (Better Auth): `user`, `session`, `account`, `verification`
- Content: `destinations`, `testimonials`
- Payments: `orders`, `order_items`
- Not used yet: `saved_destinations` (favorites are only kept in the browser for now)

## Run it on your computer

You need Node.js, a Postgres database (for example a free one on Neon), and a Stripe account in test mode.

1. Install the packages:

```bash
cd client
npm install
cd ../server
npm install
```

2. Create a file called `server/.env`:

```
PORT=3000
DATABASE_URL=your Postgres connection string
BETTER_AUTH_SECRET=a long random string
BETTER_AUTH_URL=http://localhost:3000
CLIENT_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

This file is never committed to git.

3. Create the tables and add the data:

```bash
cd server
npm run db:push
npm run db:seed
```

4. Start both parts, each in its own terminal:

```bash
cd server
npm run dev
```

```bash
cd client
npm run dev
```

The website opens at http://localhost:5173 and the server runs on http://localhost:3000.

## Commands (in the server folder)

| Command | What it does |
|---|---|
| `npm run dev` | Starts the server and restarts it when files change |
| `npm start` | Starts the server (used on Render) |
| `npm run db:push` | Creates or updates the tables in the database |
| `npm run db:seed` | Fills the tables with destinations and testimonials |
| `npm run db:studio` | Opens Drizzle Studio to look at the data |

## Testing a payment

Stripe is in test mode, so no real money is used. On the Stripe page, pay with:

- Card number: `4242 4242 4242 4242`
- Expiry date: any future date
- Security code: any 3 digits