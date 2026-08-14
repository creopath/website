import "server-only"

import { createClient } from "@/lib/supabase/server"

// Returns the verified logged-in user, or null. Uses getClaims() per Supabase's
// guidance — it validates the auth token, unlike getSession() which must never
// be trusted in server code. Safe to call from Server Components and route
// handlers to protect pages/data.
export async function getAuthUser() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) return null
  return data.claims
}

export async function isLoggedIn() {
  return (await getAuthUser()) !== null
}
