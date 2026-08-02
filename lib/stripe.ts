import "server-only"

import Stripe from "stripe"

// Server-only Stripe client. The `server-only` import makes the build fail if
// this module is ever pulled into a Client Component, keeping the secret key
// off the browser. The SDK pins its own API version, so we don't set one here.
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
