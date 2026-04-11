# Client integration checklist

What you need from the client (or your own accounts) to integrate **payments** (Business / Team plan), **lead emails**, and the **Amazon shop** in Alignment OS.

---

## 1. Payment for the Business package (Team plan)

The app currently has a **Pricing** page and plan tiers (FREE, PRO, TEAM) in the database, but **no payment processing** is wired up yet. To accept money for the Business/Team plan you need:

### Option A: Stripe (recommended)

| What to get from the client | Where / how |
|-----------------------------|------------|
| **Stripe account** | Client signs up at [stripe.com](https://stripe.com). You need a single Stripe account (yours or the client’s). |
| **Live API keys** | Stripe Dashboard → Developers → API keys: **Publishable key** (starts with `pk_live_`) and **Secret key** (starts with `sk_live_`). Never commit the secret key; store in backend `.env` only. |
| **Product & Price IDs** | In Stripe: create a **Product** (e.g. “Alignment Index – Team plan”) and a **Price** (one-time or recurring). You’ll need the **Price ID** (e.g. `price_xxx`) to create Checkout sessions or Subscription sessions. |
| **Webhook signing secret** | Stripe Dashboard → Developers → Webhooks: add endpoint (e.g. `https://yourapi.com/api/webhooks/stripe`), select events (e.g. `checkout.session.completed`, `customer.subscription.updated`). Copy the **Signing secret** (`whsec_xxx`) into backend `.env`. |

**Backend:** Add env vars (example):

```env
STRIPE_SECRET_KEY=sk_live_xxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxx
STRIPE_TEAM_PRICE_ID=price_xxxx
```

**Frontend:** Use Stripe’s **Publishable key** (`pk_live_xxx`) only; never put the secret key in the frontend. Use [Stripe Checkout](https://stripe.com/docs/checkout) (redirect or embedded) or [Stripe Elements](https://stripe.com/docs/stripe-js) for card input. After a successful payment or subscription, your backend (via webhook or redirect) should update the user’s `plan` to `TEAM` in the database.

**Client must provide:** Stripe account access (or API keys + Price ID + webhook secret), and confirmation of pricing (e.g. monthly/yearly, amount in USD).

---

## 2. Email for leads

When someone submits their email (e.g. on the landing page), the backend can send a **welcome / next-step email**. This is already implemented using **Resend**; it only needs configuration.

### What to get from the client

| What to get | Where / how |
|-------------|------------|
| **Resend API key** | Sign up at [resend.com](https://resend.com). Dashboard → API Keys → Create. Copy the key (starts with `re_`). |
| **Sending domain (optional but recommended)** | Resend → Domains: add and verify the domain (e.g. `alignmentindex.com`) so “From” can be e.g. `hello@alignmentindex.com` instead of `onboarding@resend.dev`. |
| **From address** | The exact “From” email (e.g. `Alignment Index <hello@alignmentindex.com>`). Must be from a verified domain in Resend. |

**Backend:** In the backend `.env`:

```env
RESEND_API_KEY=re_xxxx
RESEND_FROM="Alignment Index <hello@yourdomain.com>"
```

If `RESEND_API_KEY` is not set, lead capture still works (email is stored in the DB) but no welcome email is sent. The welcome email content is in `backend/src/controllers/leadController.js` (subject, body, link to assessment); you can change copy there or make it configurable.

**Client must provide:** Resend API key, desired “From” address, and (if they want) the exact wording for the welcome email.

---

## 3. Amazon shop

The **Shop** page and nav link point users to your Amazon storefront or product page. No login is required to see Shop.

### What to get from the client

| What to get | Where / how |
|-------------|------------|
| **Amazon store or product URL** | After the client has set up [Seller Central](https://sellercentral.amazon.com) (US) and listed products (e.g. via FBA), they get either: (a) a **storefront URL** (e.g. `https://www.amazon.com/s?me=XXXXXXXXXX`), or (b) direct **product URL(s)** (e.g. `https://www.amazon.com/dp/B0XXXXXXX`). |
| **Which link to use** | Decide: one “Shop” button that goes to the storefront, or to a single main product. |

**Frontend:** In the **frontend** project, add to `.env`:

```env
VITE_AMAZON_STORE_URL=https://www.amazon.com/s?me=THEIR_SELLER_ID
```

Or a product URL:

```env
VITE_AMAZON_STORE_URL=https://www.amazon.com/dp/B0XXXXXXX
```

Restart the frontend dev server after changing env. The Shop page uses this URL for the “Shop on Amazon” button. If the variable is empty, the page shows “Coming soon” and instructions to set it.

**Client must provide:** The exact Amazon storefront URL or primary product URL they want the “Shop” button to open. They must have completed Seller Central setup and have at least one listing (see `docs/AMAZON_FBA_SELLING.md`).

---

## Summary table

| Integration      | Client provides / you need                    | Where it goes                          |
|------------------|------------------------------------------------|----------------------------------------|
| **Business payment** | Stripe account (or live keys + Price ID + webhook secret) | Backend `.env`; Stripe Dashboard for product/price and webhook |
| **Lead email**       | Resend API key; From address; optional copy   | Backend `.env` (`RESEND_API_KEY`, `RESEND_FROM`) |
| **Amazon shop**      | Amazon storefront or product URL               | Frontend `.env` (`VITE_AMAZON_STORE_URL`) |

Keep API keys and secrets only in `.env` (and in your deployment environment variables), never in the repo.
