"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { ArrowRight } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PhoneInput } from "@/components/ui/phone-input"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  checkoutSchema,
  type CheckoutFormValues,
} from "@/lib/schemas/checkout"
import type { PackageId } from "@/lib/constants/packages"

const inputStyles =
  "bg-white! text-foreground placeholder:text-muted-foreground focus-visible:border-input focus-visible:ring-white/30"

export default function CheckoutForm({
  packageId,
}: {
  packageId: PackageId
}) {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const t = useTranslations("Checkout")
  const tValidation = useTranslations("Checkout.validation")
  const locale = useLocale()

  // Translate a validation key emitted by the schema into the localized
  // message. The schema only emits known keys, so the cast is safe at runtime.
  const translateValidation = (
    key: string | undefined
  ): string | undefined => {
    if (!key) return undefined
    return tValidation(key as Parameters<typeof tValidation>[0])
  }

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      packageId,
    },
  })

  // Kept true through the redirect so the button can't be double-submitted
  // while the browser navigates away to Stripe.
  const [redirecting, setRedirecting] = useState(false)
  const isBusy = form.formState.isSubmitting || redirecting

  async function onSubmit(data: CheckoutFormValues) {
    setSubmitError(null)
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale }),
      })

      if (!response.ok) {
        throw new Error(t("genericError"))
      }

      const { url } = (await response.json()) as { url?: string }
      if (!url) {
        throw new Error(t("genericError"))
      }

      // Redirect to Stripe's hosted checkout page.
      setRedirecting(true)
      window.location.href = url
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : t("genericError")
      setSubmitError(message)
      setRedirecting(false)
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8 rounded-2xl bg-brand-deep-red p-8 sm:p-10"
    >
      <FieldGroup>
        <div className="grid gap-7 sm:grid-cols-2">
          <Controller
            name="firstName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel
                  htmlFor="checkout-first-name"
                  className="font-bold text-white"
                >
                  {t("firstNameLabel")}
                </FieldLabel>
                <Input
                  {...field}
                  id="checkout-first-name"
                  placeholder={t("firstNamePlaceholder")}
                  autoComplete="given-name"
                  aria-invalid={fieldState.invalid}
                  className={inputStyles}
                />
                {fieldState.invalid ? (
                  <FieldError className="text-white">
                    {translateValidation(fieldState.error?.message)}
                  </FieldError>
                ) : null}
              </Field>
            )}
          />
          <Controller
            name="lastName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel
                  htmlFor="checkout-last-name"
                  className="font-bold text-white"
                >
                  {t("lastNameLabel")}
                </FieldLabel>
                <Input
                  {...field}
                  id="checkout-last-name"
                  placeholder={t("lastNamePlaceholder")}
                  autoComplete="family-name"
                  aria-invalid={fieldState.invalid}
                  className={inputStyles}
                />
                {fieldState.invalid ? (
                  <FieldError className="text-white">
                    {translateValidation(fieldState.error?.message)}
                  </FieldError>
                ) : null}
              </Field>
            )}
          />
        </div>

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel
                htmlFor="checkout-email"
                className="font-bold text-white"
              >
                {t("emailLabel")}
              </FieldLabel>
              <Input
                {...field}
                id="checkout-email"
                type="email"
                placeholder={t("emailPlaceholder")}
                autoComplete="email"
                aria-invalid={fieldState.invalid}
                className={inputStyles}
              />
              {fieldState.invalid ? (
                <FieldError className="text-white">
                  {translateValidation(fieldState.error?.message)}
                </FieldError>
              ) : null}
            </Field>
          )}
        />

        <Controller
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel
                htmlFor="checkout-phone"
                className="font-bold text-white"
              >
                {t("phoneLabel")}
              </FieldLabel>
              <PhoneInput
                {...field}
                id="checkout-phone"
                defaultCountry="GB"
                placeholder={t("phonePlaceholder")}
                autoComplete="tel"
                aria-invalid={fieldState.invalid}
                className={inputStyles}
              />
              {fieldState.invalid ? (
                <FieldError className="text-white">
                  {translateValidation(fieldState.error?.message)}
                </FieldError>
              ) : null}
            </Field>
          )}
        />
      </FieldGroup>

      <Button
        type="submit"
        size="lg"
        className="w-full cursor-pointer bg-white text-brand-deep-red hover:bg-brand-cloud"
        disabled={isBusy}
      >
        {isBusy ? (
          t("submitting")
        ) : (
          <>
            {t("submit")}
            <ArrowRight
              data-icon="inline-end"
              className="transition-transform duration-300 group-hover/button:translate-x-0.5"
            />
          </>
        )}
      </Button>

      {submitError && !isBusy ? (
        <p
          className="text-center text-sm text-white"
          role="alert"
          aria-live="assertive"
        >
          {submitError}
        </p>
      ) : null}
    </form>
  )
}
