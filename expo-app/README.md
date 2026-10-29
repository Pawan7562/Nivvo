# Nivvo Delivery Partner (Rider) Mobile App

Production-grade, offline-resilient mobile application built for **Nivvo** delivery partners in Indiranagar, Bengaluru. Engineered for fast, one-handed outdoor usage on patchy mobile internet, featuring 10–18 minute delivery routing and 10-minute doorstep footwear try-on verification.

---

## Tech Stack & Architecture

- **Framework**: React Native + Expo (SDK 58) + TypeScript (strict mode)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (`src/store/useRiderStore.ts` & `src/store/orderStateMachine.ts`)
- **Server State & Data Fetching**: [TanStack React Query](https://tanstack.com/query) (`@tanstack/react-query`)
- **Styling & Design System**: Custom tokens (`#1F4230` Forest Green, `#C6F432` Lime, `#F4F5EE` Canvas), rounded 20px cards, 44px+ touch targets, dark/light mode switching, and safe area insets.

---

## Directory Structure

```
expo-app/
├── src/
│   ├── types/
│   │   └── index.ts                 # Partner, Vehicle, Hub, JobOffer, Order, Earning, Milestone, Payout, Ticket, etc.
│   ├── theme/
│   │   ├── colors.ts                # Light & Dark color tokens (Forest green, lime, surface, alerts)
│   │   └── index.ts                 # Typography, spacing, radius, 44px touch targets
│   ├── store/
│   │   ├── useRiderStore.ts         # Zustand global store (duty status, active order, earnings, offline queue)
│   │   └── orderStateMachine.ts     # Deterministic state machine for 6 delivery stages & PIN/checklist validation
│   ├── data/
│   │   └── mockData.ts              # Indiranagar Hub #14, Ather 450X EV, try-on orders, milestones, busy zones
│   ├── components/
│   │   ├── Card.tsx                 # 20px rounded card with theme support
│   │   ├── Tabs.tsx                 # Segmented pill switcher with badges
│   │   ├── BottomSheet.tsx          # Swipe/tap dismissible bottom sheet modal
│   │   ├── Toast.tsx                # Auto-dismissing floating alert banner
│   │   ├── StatusPill.tsx           # Subtle status badge with indicator dot
│   │   ├── ProgressSteps.tsx        # 4-stage stepper (Assigned → Picked up → On route → Delivered)
│   │   └── KeypadPIN.tsx            # Accessible numeric keypad for 4-digit doorstep PIN verification
│   ├── screens/
│   │   ├── DutyScreen.tsx           # 1. DUTY: Header, toggle switch, EV strip, stats ribbon, 20s offers, busy zones
│   │   ├── OrdersScreen.tsx         # 2. ORDERS: Live trip / Delivered, SOS, Delay, in-app map/ETA, try-on checklist, PIN
│   │   ├── EarningsScreen.tsx       # 3. EARNINGS: Today/Week/Month, breakdown, milestones, IMPS instant payout, weekly chart
│   │   ├── SupportScreen.tsx        # 4. SUPPORT: 24/7 Dispatch hotline, 4 topic chips, fast ticket form (<30s), FAQs
│   │   └── ProfileScreen.tsx        # 5. PROFILE: KPIs, customer compliments, EV scooter, KYC, hub manager contact
│   └── navigation/
│       └── BottomTabNav.tsx         # 5 bottom tabs: Duty · Orders · Earnings · Support · Profile
├── App.tsx                          # Root container with React Query Provider, Status bar, Toast & Tabs
├── app.json                         # Expo configuration (bundle ID com.nivvo.app, orientation portrait)
└── tsconfig.json                    # Strict TypeScript configuration
```

---

## Business Rules & Workflow

1. **Job Offers Expiration**:
   - Offers include a live 20-second countdown (`JobOffer.secondsRemaining`).
   - If not accepted within 20 seconds or declined, dispatch automatically re-queues the offer to the next eligible partner in the Indiranagar dark store zone.
2. **Doorstep Try-On (10-Minute Rule)**:
   - For footwear and select garments, customers receive 2 sizes (e.g., UK 7 & UK 8).
   - Riders wait up to 10 minutes at the doorstep while the customer test fits.
   - The delivery stage cannot be marked complete until the **"Returned pair inspected and sealed"** checkbox is verified.
3. **Customer 4-Digit PIN Delivery**:
   - Deliveries require entering the customer's secret 4-digit PIN (default mock: `4829`) on the high-contrast numeric keypad.
   - Zero physical cash is collected on UPI/Prepaid orders.
4. **Instant Earnings & Wallet Crediting**:
   - Earnings (`Base Pay + Surge + Try-On Waiting Bonus + 100% Tips`) credit immediately upon delivery.
   - Partners can initiate instant IMPS withdrawals to their registered UPI ID (`aarav@okhdfcbank`) at any time.
5. **Offline Queueing**:
   - Critical events (status updates, location checks, ticket submissions) are queued locally in `offlineQueue` during network dead-zones and automatically synchronized once connectivity returns.

---

## Order State Machine

The order lifecycle strictly transitions through 6 stages:

```
[assigned] 
   └── CTA: "Start trip to shop" 
       ▼
[reaching_shop] 
   └── Verification: All pickup item codes marked verified
       └── CTA: "Confirm all items picked up" 
           ▼
[picked_up] 
   └── CTA: "Start delivery route" 
       ▼
[on_the_way] 
   └── Navigation: In-app route map & external maps fallback
       └── CTA: "I've arrived at doorstep" 
           ▼
[arrived_dropoff] 
   └── Validation: 10-minute try-on seal checklist checked
   └── Verification: Correct 4-digit customer PIN entered
       ▼
[delivered] 
   └── Action: Triggers earnings celebration modal & wallet balance update
```

---

## Backend Endpoints Specification (REST & WebSocket)

When connecting the real backend, the following endpoints are expected:

### 1. Delivery Partner & Duty
- `GET /api/partners/me` - Fetch partner profile, hub assignment, EV status, and KPI scorecard.
- `POST /api/partners/duty/toggle` - Toggle online/offline status. Payload: `{ is_online: boolean, lat: number, lng: number }`.
- `GET /api/partners/busy-zones` - Fetch demand hotspots and active surge multipliers around Indiranagar.

### 2. Job Offers & Orders
- `WS /ws/partner/offers` - WebSocket feed streaming new incoming orders with 20s TTL and auto-expiry.
- `POST /api/partners/orders/:id/accept` - Accept incoming job offer.
- `POST /api/partners/orders/:id/decline` - Decline job offer. Payload: `{ reason: string }`.
- `POST /api/partners/orders/:id/pickups/:pickId/verify` - Verify scanned dark store barcode/shelf code.
- `POST /api/partners/orders/:id/stage` - Advance order stage. Payload: `{ stage: string, lat: number, lng: number }`.
- `POST /api/partners/orders/:id/complete` - Complete delivery. Payload: `{ pin: string, return_pair_inspected: boolean }`.
- `POST /api/partners/orders/:id/delay` - Report traffic or weather delay. Payload: `{ reason: string }`.

### 3. Earnings & Instant Payouts
- `GET /api/partners/earnings?period=today|week|month` - Fetch earnings breakdown and trip ledger.
- `GET /api/partners/milestones` - Fetch daily/weekly surge incentive targets.
- `POST /api/partners/payouts/withdraw` - Initiate IMPS instant payout. Payload: `{ amount: number, upi_id: string }`.
- `GET /api/partners/earnings/statement.pdf` - Download official GST settlement statement.

### 4. Support, Tickets & SOS
- `GET /api/partners/tickets` - List partner support tickets and resolution statuses.
- `POST /api/partners/tickets` - Open new support ticket. Payload: `{ category: string, subject: string, description: string }`.
- `POST /api/partners/sos` - High-priority emergency broadcast transmitting GPS coordinates to dark store hub and emergency responders.

---

## How to Run & Test

```bash
# 1. Navigate to the expo directory
cd expo-app

# 2. Start the Expo development server
npx expo start

# 3. Typecheck
npx tsc --noEmit
```
