import { NextResponse } from "next/server"
import { hasLocale } from "next-intl"

import { getStripe } from "@/lib/stripe"
import { checkoutSchema } from "@/lib/schemas/checkout"
import { getPackage } from "@/lib/constants/packages"
import { routing } from "@/i18n/routing"

export async function POST(request: Request) {
  // Base URL for the Stripe redirect targets. Required.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (!siteUrl) {
    console.error("NEXT_PUBLIC_SITE_URL is not set.")
    return NextResponse.json(
      { error: "Server is not configured for checkout." },
      { status: 500 }
    )
  }

  // Parse and validate the request body.
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const parsed = checkoutSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 })
  }

  const { firstName, lastName, email, phone, address, packageId } = parsed.data

  // Resolve the Stripe Price ID server-side from the package the client picked.
  // The browser only ever sends a packageId — never a price or Price ID — so the
  // amount charged can't be tampered with.
  const pkg = getPackage(packageId)
  if (!pkg) {
    return NextResponse.json({ error: "Unknown package." }, { status: 400 })
  }
  const priceId = process.env[pkg.priceIdEnv]
  if (!priceId) {
    console.error(`Missing Stripe Price env var: ${pkg.priceIdEnv}`)
    return NextResponse.json(
      { error: "This package is not available for purchase right now." },
      { status: 500 }
    )
  }

  // Localise the return URLs and the Stripe-hosted checkout page.
  const rawLocale =
    typeof body === "object" && body !== null && "locale" in body
      ? (body as { locale?: unknown }).locale
      : undefined
  const locale = hasLocale(routing.locales, rawLocale)
    ? rawLocale
    : routing.defaultLocale
  const localePrefix = locale === routing.defaultLocale ? "" : `/${locale}`

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      // Always create a Stripe Customer (one-off payments are "guest" by
      // default). This guarantees session.customer is a real cus_… id that the
      // webhook stores on the profile — one person, one Stripe customer.
      customer_creation: "always",
      // Stripe needs the email to prefill checkout and send its receipt.
      customer_email: email,
      // Metadata is our own private note bag that Stripe hands back to our
      // webhook after payment. We carry the signup details here so the webhook
      // can create the account + profile. This is NOT "billing data for Stripe"
      // — Stripe never uses these fields; they're just passed through to us.
      // (No password is ever included — the client sets that themselves later.)
      metadata: {
        packageId,
        locale,
        firstName,
        lastName,
        phone,
        address,
      },
      success_url: `${siteUrl}${localePrefix}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}${localePrefix}/checkout/cancelled`,
    })

    if (!session.url) {
      console.error("Stripe session created without a URL.")
      return NextResponse.json(
        { error: "Could not start checkout. Please try again." },
        { status: 500 }
      )
    }

    return NextResponse.json({ url: session.url }, { status: 200 })
  } catch (err) {
    console.error("Stripe checkout session error:", err)
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 500 }
    )
  }
}
