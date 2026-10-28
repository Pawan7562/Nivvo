# Nivvo — Hyperlocal 10-Minute Multi-Category Commerce Platform

> **"Your Neighbourhood, Delivered in 10 Minutes"** — Industry-grade quick-commerce platform connecting local boutique stores, fresh produce mandis, and artisan kitchens directly to nearby shoppers with doorstep 2-size trial and live route dispatch tracking, backed by a live PostgreSQL Database.

---

## 🗄️ Neon Cloud PostgreSQL Database Architecture

- **Project ID**: `round-bonus-71847745` (`BlinkWearFashion`)
- **Database Engine**: PostgreSQL 18
- **Region**: `aws-us-west-2`
- **Host**: `ep-curly-wind-akemmmpi-pooler.c-3.us-west-2.aws.neon.tech`
- **Pooler Connection**: SSL Mode Enabled with connection pooling

### Database Tables Schema

1. **`users` Table**:
   - `id` (SERIAL PRIMARY KEY)
   - `phone` (VARCHAR UNIQUE) — Customer phone identifier
   - `name` (VARCHAR) — Customer full name
   - `email` (VARCHAR) — Email address
   - `avatar` (TEXT) — Profile image URL
   - `created_at` (TIMESTAMP WITH TIME ZONE)

2. **`user_profiles` Table**:
   - `id` (SERIAL PRIMARY KEY)
   - `phone` (VARCHAR UNIQUE REFERENCES users)
   - `gender` (VARCHAR) — Men / Women baseline
   - `height_cm` (INT) — Height dimension
   - `weight_kg` (INT) — Weight dimension
   - `preferred_size` (VARCHAR) — AI locked fit size (`S`, `M`, `L`, `XL`, `XXL`)
   - `fit_preference` (VARCHAR) — Fitted, Regular, Boxy Oversized
   - `membership_tier` (VARCHAR) — VIP Prime Membership

3. **`orders` Table**:
   - `id` (SERIAL PRIMARY KEY)
   - `order_id` (VARCHAR UNIQUE) — e.g. `BW-982411`, `BW-110022`
   - `user_phone` (VARCHAR)
   - `status` (VARCHAR) — `Out for 10-Min Delivery`, `Delivered in 8 mins`
   - `items` (JSONB) — Full snapshot of items, sizes, quantities, and prices
   - `grand_total` (NUMERIC) — Total bill amount
   - `payment_method` (VARCHAR) — `UPI`, `Card`, `Cash on Delivery`
   - `address` (TEXT) — Delivery address
   - `dark_store` (VARCHAR) — Assigned hyperlocal dark store
   - `doorstep_trial_active` (BOOLEAN) — Free 2-size trial enabled
   - `rider_name` (VARCHAR) — Assigned rider (Rahul Sharma, 4.9 ★)
   - `rider_otp` (VARCHAR) — 4-digit security OTP (`7492`)
   - `eta_minutes` (INT) — Live countdown ETA
   - `created_at` (TIMESTAMP WITH TIME ZONE)

4. **`wishlist` Table**:
   - `id` (SERIAL PRIMARY KEY)
   - `user_phone` (VARCHAR)
   - `product_id` (VARCHAR) — e.g. `foot-1`, `acc-1`
   - `created_at` (TIMESTAMP WITH TIME ZONE)
   - `UNIQUE(user_phone, product_id)`

5. **`help_tickets` Table**:
   - `id` (SERIAL PRIMARY KEY)
   - `ticket_id` (VARCHAR UNIQUE) — e.g. `TCK-10492`
   - `user_phone` (VARCHAR)
   - `category` (VARCHAR) — 2-Size Trial, Live Rider Location, Garment Care, Refunds
   - `subject` (VARCHAR)
   - `message` (TEXT)
   - `status` (VARCHAR) — `Resolved in 2 mins`
   - `created_at` (TIMESTAMP WITH TIME ZONE)

---

## 🌐 Full-Stack API Endpoints (`http://127.0.0.1:5000`)

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | `GET` | Health check verifying live Neon PostgreSQL connection |
| `/api/profile` | `GET` | Fetches user profile, biometrics & VIP Prime status |
| `/api/profile` | `POST` | Updates profile & biometrics in Neon DB |
| `/api/orders` | `GET` | Retrieves full order history from Neon DB |
| `/api/orders` | `POST` | Places new 10-minute order & persists to Neon DB |
| `/api/orders/:orderId`| `GET` | Real-time live order dispatch tracking info |
| `/api/wishlist` | `GET` | Retrieves saved outfits from Neon DB |
| `/api/wishlist/toggle`| `POST` | Adds/removes items from wishlist in Neon DB |
| `/api/help` | `GET` | Fetches customer support tickets from Neon DB |
| `/api/help` | `POST` | Logs new 24x7 support ticket into Neon DB |

---

## 🌟 Full Suite of Sections & Interactive Features

1. **Storefront Home (`home`)**:
   - Blinkit yellow & green design tokens
   - Dynamic animated search bar with cycling placeholders
   - Native Web Audio synthesizer for bouncy cart pops and order fanfares
   - Filter by Gender (*All, Men, Women, Unisex*) and Sort (*7-Min Speed, Price, Rating*)
2. **All Departments Hub (`categories`)**:
   - Left vertical department navigation + right categorized product grid
   - Comprehensive inventory covering shirts, trousers, dresses, denims, sneakers, slides, slippers, bags, watches, and innerwear
3. **Fashion SOS Emergency Center (`sos`)**:
   - Ready-to-wear emergency wardrobe kits dispatched in 7 to 9 minutes
4. **Doorstep 2-Size Trial Studio (`trial`)**:
   - Interactive 2-size pairing simulator with automatic adjacent size dispatch (`₹0 Free`)
   - Visual 4-step doorstep try-on and instant return workflow
5. **Virtual AI Fit & Silhouette Studio (`ai-fit`)**:
   - Interactive biometric sliders (Height, Weight, Chest, Waist, Fit Preference)
   - Animated 2D silhouette rendering responding in real-time
   - 1-click Global Size Locker synced to Neon DB
6. **My Orders & Live Tracking (`orders`)**:
   - Live 10-minute animated scooter map, ticking countdown, and delivery OTP
   - Previous orders with Doorstep Trial resolution notes & GST invoices
7. **Saved Outfits & Wishlist (`wishlist`)**:
   - Heart toggle on every product card synced with Neon DB
   - 1-click **"Move All to Cart"**
8. **VIP Account & Profile (`profile`)**:
   - Profile management, VIP Prime perks, biometric measurements, and saved addresses
9. **24x7 Help Center (`help`)**:
   - 24x7 priority dispatch hotline + real support ticket logging into Neon DB

---

## 🚀 Running the Full Stack Locally

1. **Start the Express + Neon Backend Server**:
   ```bash
   npm run server
   ```
   Runs on `http://127.0.0.1:5000` connected to Neon PostgreSQL.

2. **Start the Frontend Vite Dev Server**:
   ```bash
   npm run dev
   ```
   Runs on `http://127.0.0.1:3000`.
