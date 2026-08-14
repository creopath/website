import "server-only"

import Stripe from "stripe"

// Server-only Stripe client. The `server-only` import makes the build fail if
// this module is ever pulled into a Client Component, keeping the secret key
// off the browser. The SDK pins its own API version, so we don't set one here.
//
// The client is created lazily (not at module load) so that importing this file
// during the build — before env vars are available — doesn't throw. The key is
// only required when a request actually uses Stripe.
let client: Stripe | null = null

export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set")
  }
  if (!client) {
    client = new Stripe(process.env.STRIPE_SECRET_KEY)
  }
  return client
}
