"use client"

import { useTransition } from "react"
import { Globe } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { usePathname, useRouter } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"

type Variant = "default" | "menu"

export default function LanguageSwitcher({
  variant = "default",
}: {
  variant?: Variant
}) {
  const locale = useLocale()
  const t = useTranslations("LanguageSwitcher")
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const handleSwitch = (next: (typeof routing.locales)[number]) => {
    if (next === locale) return
    startTransition(() => {
      router.replace(pathname, { locale: next })
    })
  }

  if (variant === "menu") {
    return (
      <div
        role="group"
        aria-label={t("label")}
        className="inline-flex items-center gap-1 rounded-md border border-foreground/10 bg-white/40 p-1"
      >
        {routing.locales.map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => handleSwitch(code)}
            disabled={isPending}
            aria-current={code === locale ? "true" : undefined}
            className={`rounded-sm px-2.5 py-1 text-sm font-semibold uppercase transition-colors ${
              code === locale
                ? "bg-foreground text-background"
                : "text-foreground/70 hover:text-foreground"
            }`}
          >
            {code}
          </button>
        ))}
      </div>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("label")}
          className="cursor-pointer"
        >
          <Globe />
          <span className="sr-only">{t("label")}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-40 p-1">
        <ul className="flex flex-col">
          {routing.locales.map((code) => (
            <li key={code}>
              <button
                type="button"
                onClick={() => handleSwitch(code)}
                disabled={isPending}
                aria-current={code === locale ? "true" : undefined}
                className={`flex w-full items-center justify-between rounded-sm px-3 py-2 text-sm transition-colors ${
                  code === locale
                    ? "bg-muted font-semibold text-foreground"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground"
                }`}
              >
                <span>{t(code)}</span>
                <span className="text-xs uppercase opacity-60">{code}</span>
              </button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  )
}
