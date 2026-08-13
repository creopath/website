import { createServerClient } from "@supabase/ssr"
import type { NextRequest, NextResponse } from "next/server"

// Refreshes the Supabase auth session on each request and writes any refreshed
// auth cookies onto the response.
//
// This is designed to COMPOSE with the existing next-intl middleware: the caller
// (proxy.ts) first lets next-intl build the response (locale routing), then
// passes that same response here so Supabase can attach its cookies to it —
// rather than the two middlewares creating separate responses and clobbering
// each other's cookies.
//
// Per Supabase's guidance, we call getClaims() (which validates the token)
// immediately after creating the client, with no logic in between, so the
// session is refreshed reliably.
export async function updateSession(
  request: NextRequest,
  response: NextResponse
): Promise<NextResponse> {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Write refreshed cookies onto the next-intl response so they reach
          // the browser.
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Touch the session so an expired token gets refreshed. Do not run any code
  // between createServerClient and this call.
  await supabase.auth.getClaims()

  return response
}
