import { NextResponse, after } from "next/server"
import type Stripe from "stripe"

import { getStripe } from "@/lib/stripe"
import { createAdminClient } from "@/lib/supabase/admin"
import { getPackage } from "@/lib/constants/packages"
import { sendConfirmationEmail } from "@/lib/email/confirmation"

// Stripe calls this endpoint when events happen. We only act on a completed
// checkout — that's the reliable trigger for creating the account (it arrives
// even if the customer closes their browser after paying).
//
// The raw body is required to verify Stripe's signature — so we read text(),
// not json().
export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set.")
    return NextResponse.json({ error: "Not configured." }, { status: 500 })
  }

  const payload = await request.text()
  const signature = request.headers.get("stripe-signature")
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 })
  }

  // 1. Verify the event really came from Stripe.
  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    )
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 })
  }

  // 2. Only handle completed checkouts; everything else is acknowledged as-is.
  if (event.type === "checkout.session.completed") {
    try {
      await fulfillCheckout(event.data.object)
    } catch (err) {
      // Return 500 so Stripe retries. fulfillCheckout is idempotent, so a retry
      // won't create duplicates.
      console.error("Failed to fulfill checkout:", err)
      return NextResponse.json({ error: "Fulfillment failed." }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true }, { status: 200 })
}

// Creates the account + profile + purchase for one paid checkout.
// Idempotent: safe to run twice for the same session (Stripe may retry).
async function fulfillCheckout(session: Stripe.Checkout.Session) {
  // Only fulfill genuinely paid sessions (Stripe's fulfillment guide requires
  // checking payment_status, not just the event type).
  if (session.payment_status === "unpaid") return

  const supabase = createAdminClient()

  // 3. Idempotency guard — if this checkout was already recorded, stop.
  const { data: existing } = await supabase
    .from("purchases")
    .select("id")
    .eq("stripe_checkout_session_id", session.id)
    .maybeSingle()
  if (existing) return

  // 4. Read the details we stashed in metadata at checkout, plus the email.
  const meta = session.metadata ?? {}
  const email = session.customer_details?.email
  const pkg = meta.packageId ? getPackage(meta.packageId) : undefined
  if (!email || !pkg) {
    throw new Error("Checkout session missing email or package metadata.")
  }

  // 5. The Stripe customer id (for linking the profile).
  const stripeCustomerId =
    typeof session.customer === "string" ? session.customer : session.customer?.id

  // 6. Create the account via invite (email only, no password) and get the
  //    set-password link. If the email already has an account (returning
  //    customer), reuse it instead.
  let userId: string
  let setPasswordLink: string | null = null

  const { data: invite, error: inviteError } =
    await supabase.auth.admin.generateLink({ type: "invite", email })

  if (invite?.user) {
    userId = invite.user.id
    setPasswordLink = invite.properties?.action_link ?? null
  } else {
    // Likely already exists — look them up.
    const { data: list } = await supabase.auth.admin.listUsers()
    const found = list?.users.find((u) => u.email === email)
    if (!found) throw inviteError ?? new Error("Could not create or find user.")
    userId = found.id
  }

  // 7. Create/update the profile. stripe_customer_id is NOT NULL in the schema,
  //    so fall back to a session-scoped placeholder if Stripe didn't attach a
  //    customer (shouldn't happen in normal checkout, but keeps the insert safe).
  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: userId,
      first_name: meta.firstName ?? "",
      last_name: meta.lastName ?? "",
      phone: meta.phone ?? "",
      address: meta.address ?? "",
      stripe_customer_id: stripeCustomerId ?? `pending_${session.id}`,
    },
    { onConflict: "id" }
  )
  if (profileError) throw profileError

  // 8. Compute expiry (purchase date + the package's duration) and record the
  //    purchase.
  const now = new Date()
  const expiresAt = new Date(now)
  expiresAt.setMonth(expiresAt.getMonth() + pkg.durationMonths)

  const { error: purchaseError } = await supabase.from("purchases").insert({
    user_id: userId,
    plan: pkg.id,
    payment_status: "paid",
    amount: session.amount_total ?? pkg.amount,
    currency: session.currency ?? "gbp",
    purchased_at: now.toISOString(),
    expires_at: expiresAt.toISOString(),
    stripe_checkout_session_id: session.id,
  })
  if (purchaseError) throw purchaseError

  // 9. Send the confirmation email (with the set-password link) AFTER the
  //    webhook responds, so Stripe gets a fast 200.
  const locale = meta.locale === "tr" ? "tr" : "en"
  after(async () => {
    await sendConfirmationEmail({
      email,
      firstName: meta.firstName ?? "",
      planId: pkg.id,
      amount: session.amount_total ?? pkg.amount,
      setPasswordLink,
      locale,
    })
  })
}
