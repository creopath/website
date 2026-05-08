import type { MetadataRoute } from "next"

import { routing } from "@/i18n/routing"

const baseUrl = "https://creopath.com"

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((locale) => [
            locale,
            locale === routing.defaultLocale
              ? baseUrl
              : `${baseUrl}/${locale}`,
          ])
        ),
      },
    },
    ...routing.locales
      .filter((locale) => locale !== routing.defaultLocale)
      .map((locale) => ({
        url: `${baseUrl}/${locale}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.9,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [
              l,
              l === routing.defaultLocale ? baseUrl : `${baseUrl}/${l}`,
            ])
          ),
        },
      })),
  ]
}
