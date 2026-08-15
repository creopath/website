# Accounts & Payments — How It Works

This document records the decisions behind Creopath's payment and client-account
system. It's the "why," written in plain language, so anyone (technical or not)
can understand how the system behaves. Update it when decisions change.

---

## The big picture

Two systems store data, each doing what it's best at:

- **Stripe** — handles money: payments, receipts, refunds.
- **Supabase** (our database) — handles accounts: who the client is, what plan
  they bought, and when it expires.

They're linked by a single reference (`stripe_customer_id`) so we can match a
person in our database to their customer record in Stripe.

---

## Who gets an account

**Only paying customers get an account.** There is no standalone "sign up" page.
An account is created *as part of* buying a plan.

- No purchase → no account.
- Payment succeeds → account is created.
- Payment fails → no account is created.

---

## Who does what

There are two people in this system — the **customer** and **Ceren** (the owner).
A key principle: **we only build the customer-facing side.** Almost everything
Ceren needs is already provided by the **Stripe dashboard**, so we don't build an
admin panel.

### The customer — what they can do (we build this)

- **Buy a plan** and get an account created in the process.
- **Log in / log out.**
- **Reset password** (forgot password) and **change password.**
- **See their plan** on the account page — plan name, price, start date, expiry,
  and whether it's active.
- **Edit their personal details** (name, phone).
- **Get a receipt** — via Stripe (see "Manage billing" below).
- **Delete their account.**

Notably, **cancel/change plan is *not* a self-service button** — the customer
emails Ceren, who handles it in Stripe. The customer just sees the result (plan
gone) on their account page.

### Ceren — what she needs (mostly the Stripe dashboard)

| What Ceren needs | Where she does it |
|------------------|-------------------|
| See all customers | Stripe dashboard → Customers |
| See a customer's full purchase history | Stripe dashboard → click the customer |
| See all payments / income / payouts | Stripe dashboard → Payments / Balance |
| Refund or cancel a purchase | Stripe dashboard → Refund button |
| Change a package's price | Stripe dashboard → Product catalog |
| Keep customer & payment records | Stored automatically by Stripe |
| Manually adjust a client's plan/expiry (rare, for manual upgrades) | Edit the `purchases` row in Supabase's table editor |

So Ceren's day-to-day is **the Stripe dashboard**. The only thing outside it is the
occasional manual plan/expiry tweak in Supabase — which is rare and can be done
directly in the table editor for now.

### Billing / receipts

Handled by **Stripe** — we don't build a billing UI ourselves.

- **Automatic email receipt** — enabled in the Stripe dashboard, so every customer
  is emailed a receipt (proof of purchase) the moment they pay.
- **"Manage billing" button** on the account page → generates a one-time secure
  link to *that customer's* **Stripe Customer Portal**, where they can view and
  download all their receipts (PDFs) and payment history anytime. It's Stripe's
  hosted page; we only provide the button (built with their `stripe_customer_id`).
- **No invoices** — a receipt is sufficient proof of purchase for a one-off
  payment. If a client ever needs a formal invoice (e.g. for tax), Ceren can
  generate one manually in Stripe.

Ceren manages refunds and views all payments in the Stripe dashboard.

---

## The data model

The same three things — **customers, packages, purchases** — exist in both
systems, but each system stores the slice it's responsible for. We keep **Stripe
minimal**: the only things our app sends to Stripe are the customer's **email**
and the **price ID** (which package). Everything else on the Stripe side, Stripe
generates itself.

### Stripe side (the money)

**Customers**
| Field | Who sets it |
|-------|-------------|
| Customer id (`cus_...`) | Stripe |
| Email | **We pass** |
| Created date | Stripe |
| Linked payments (history) | Stripe |

**Payments**
| Field | Who sets it |
|-------|-------------|
| Product / Price (which package) | **We pass** (the price ID) |
| Quantity (always 1) | **We pass** |
| Amount | Stripe (from the price) |
| Currency | Stripe |
| Status (succeeded / failed / refunded) | Stripe |
| Customer link (`cus_...`) | Stripe |
| Date / time | Stripe |
| Card details (brand, last 4) | Stripe |
| Receipt | Stripe |
| Fees (Stripe's cut) | Stripe |
| Refund info | Stripe |

> We do **not** send name, phone, address, or saved cards to Stripe — those stay
> in Supabase. Online billing only needs email + card; an address is only for
> formal invoices / tax, which we're not doing.

**Packages** (created once in the Stripe dashboard, not at checkout)
- Product: name, product id (`prod_...`), **metadata `duration_months`**
- Price: amount, currency (GBP), one-off, price id (`price_...`)

> **Duration lives in Stripe** as product metadata (`duration_months`), so Ceren
> controls name, price, **and** duration herself — all in the Stripe dashboard, no
> developer needed. On a successful payment, our webhook reads `duration_months`
> and sets the purchase's `expires_at` = purchase date + that many months. The
> expiry is then **frozen** on the purchase, so if Ceren later changes a package's
> duration, past purchases keep their original expiry.

### Supabase side (the accounts)

| Table | Holds | Managed by |
|-------|-------|------------|
| `auth.users` | login (email, password) | Supabase (automatic) |
| `profiles` | name, phone, **address**, `stripe_customer_id` | us |
| `purchases` | plan, amount, expiry date, `payment_status`, Stripe refs | us |

> The **address** is stored in Supabase only (not sent to Stripe), kept for
> records — e.g. Home Office / client documentation.

**Why keep a `purchases` table at all (instead of just reading Stripe)?** Two
reasons Stripe can't cover:
> 1. **Frozen record.** Each purchase stores its own `amount` and `expires_at`, so
>    if Ceren later changes a package's price or duration, past purchases keep the
>    real figures from when they were bought. Reading live from Stripe would
>    re-compute against *current* settings and silently rewrite history.
> 2. **The user link + expiry.** Stripe knows a *Stripe customer* paid; it doesn't
>    know our accounts, and it never computes an expiry date. The `purchases` row
>    ties a payment to our user and holds the computed `expires_at` — neither of
>    which exists in Stripe.
> It also lets the customer see their own purchase **history** on the account page
> without calling Stripe on every load.

**Two different statuses — handled two different ways:**

- **Subscription status (active / expired)** is **NOT stored** — it's computed by
  checking `expires_at > now()`. Always correct, nothing to keep updated.
- **Payment status (paid / refunded)** **IS stored** as `payment_status` on
  `purchases`. It defaults to `paid`, and Stripe's refund webhook sets it to
  `refunded`. We store this because a refund can't be worked out from the expiry
  date — the date doesn't change when Ceren refunds, so without this field a
  refunded (but not-yet-expired) plan would wrongly still look active.

So a plan counts as the **current active plan** only if:
`payment_status = 'paid'` **AND** `expires_at > now()`.

Other notes:
- Email lives in `auth.users` only (not duplicated into `profiles`).

### The one link between them

`profiles.stripe_customer_id` connects a person in our database to their customer
record in Stripe. That single reference is how the two systems stay tied together.

**Amount vs Price:** a payment stores both *which* package (a reference to the
price) **and** the *amount actually charged*. They're usually identical, but if a
price changes later, the payment keeps the real figure that was paid at the time.

---

## Buying a plan — the flow

**Passwords are never collected at checkout, never handled by us, never sent to
Stripe.** The account is created (email only) after payment, and the client sets
their own password directly with Supabase via a secure link. This keeps sensitive
credentials entirely between the client and Supabase.

### New customer (no account yet)

1. Picks a plan → goes to checkout.
2. Enters personal details: first name, last name, email, phone, address —
   **no password**.
3. Pays on Stripe's secure page.
4. On success, the webhook creates (in code): the Stripe customer, the auth
   account (email only, no password), the profile, and the purchase.
5. The confirmation email contains a **secure "set your password" link**
   (a Supabase-generated link). The client clicks it, sets a password directly
   with Supabase, then logs in normally on the login page.

If the email already has an account, we tell them to log in first (below).

### Returning customer (already has an account)

1. Logs in first (via the login page), then picks a plan → checkout.
2. Personal details are **pre-filled** — they review/edit if anything changed
   (edits saved back to their profile).
3. Pays. A new purchase row is added; their existing Stripe customer is reused.
   No new account or password step — they already have one.

> Why no password at checkout: the account is created by the webhook *after*
> payment, and the webhook must never receive a password (Stripe can't carry it,
> and we don't want to store it). So the client sets their password themselves,
> after payment, straight with Supabase. Industry-standard for "pay → get access".

---

## How "the account is created only after payment" works

No password is involved at checkout, so there's nothing sensitive to hold:

- **Checkout** collects only email + personal details (no password) and passes
  them to the payment step.
- **Payment succeeds** → the webhook creates the account (email only), profile,
  Stripe customer, and purchase.
- **Payment fails** → nothing is created; no account.
- **Password** is set later by the client themselves, via a secure Supabase link
  in the confirmation email — never collected, held, or seen by us.

So the "account only after payment" rule holds naturally, and the delicate part
(the password) is delegated entirely to Supabase.

---

## How Stripe tells us a payment succeeded (webhooks)

We don't rely on the customer returning to our site (they might close the tab).
Instead, Stripe **calls our server directly** when a payment succeeds — this is a
"webhook". Our server listens at `/api/webhooks/stripe` and, on that signal,
creates the account + purchase. The webhook is the reliable, trusted trigger.

The same mechanism handles refunds: when Ceren refunds a payment in Stripe,
Stripe fires a refund webhook, and our server marks that purchase cancelled.

---

## Showing the current plan on the account page

The account page reads the `purchases` table for the logged-in user:

> Of this user's purchases that are still paid (`payment_status = 'paid'`) and
> haven't expired (`expires_at > now()`), take the one expiring latest — that's
> their current plan.

- A result → show plan name + "active until <date>".
- No result → show "no active plan" + a button to buy.

No call to Stripe is needed to show this — it's read from our own database, which
is why we store the plan and expiry locally.

---

## Cancelling / refunds

1. Client emails Ceren to cancel.
2. Ceren refunds the payment in the Stripe dashboard (her only action).
3. Stripe fires a refund webhook → our server marks that purchase as refunded.
4. The account page then shows no active plan.

There's no self-service "cancel" button — cancellations are handled by Ceren,
which is normal for a small, high-touch service.

---

## Deleting an account (GDPR)

If a client asks to be deleted:

- Their **personal data** (login, name, phone) is deleted.
- Their **purchase record** is kept but anonymised (the person is detached from
  it), because UK tax law requires retaining financial records (~6 years).

---

## Open decisions (for Ceren & Nikhil — not blocking the build)

These are business/policy choices, not technical ones. We'll build with sensible
defaults and refine once answered:

1. **Repeat purchases** — when a client buys again, does the new plan **extend**
   their remaining time, **replace** it, or **stack**? (Default for now: the
   latest purchase wins.)
2. **Refund policy** — full / partial / time-limited? Needs to be written into the
   terms & refund page the site requires anyway.
3. **Upgrades mid-plan** — handled manually by Ceren (one-off payments have no
   automatic upgrade). She charges the difference in Stripe and we update the
   client's plan/expiry.
4. **Data retention** — confirm with an accountant how long payment records must
   be kept and exactly what an account deletion removes.

---

## Cost reminders

- **Stripe** — no monthly fee; a per-transaction cut only (UK: ~1.5% + 20p
  domestic, higher for international cards).
- **Supabase** — free while building; budget **Pro (~$25/mo) at launch**, because
  free projects pause after 7 days idle (fine for dev, not for a live site).
