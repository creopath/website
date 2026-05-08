import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["en", "tr"],
  defaultLocale: "en",
  // English at root (creopath.com/), Turkish at /tr
  localePrefix: "as-needed",
  // Predictable URLs: don't auto-redirect based on browser language or cookie.
  // The user explicitly chooses a locale via the language switcher; visiting
  // creopath.com/ always shows English, /tr always shows Turkish.
  localeDetection: false,
  localeCookie: false,
})
