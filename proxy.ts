import createMiddleware from "next-intl/middleware"
import type { NextRequest } from "next/server"

import { routing } from "./i18n/routing"
import { updateSession } from "./lib/supabase/middleware"

const handleI18n = createMiddleware(routing)

export default async function proxy(request: NextRequest) {
  // 1. next-intl handles locale routing and builds the response.
  const response = handleI18n(request)
  // 2. Supabase refreshes the auth session and attaches its cookies to that
  //    same response, so locale routing and session refresh coexist.
  return updateSession(request, response)
}

export const config = {
  // Match all pathnames except for:
  // - /api, /_next, /_vercel, /trpc
  // - Files with extensions (e.g. favicon.ico, sitemap.xml)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
}
