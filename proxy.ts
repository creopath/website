import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

export default createMiddleware(routing)

export const config = {
  // Match all pathnames except for:
  // - /api, /_next, /_vercel, /trpc
  // - Files with extensions (e.g. favicon.ico, sitemap.xml)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
}
