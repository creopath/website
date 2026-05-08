"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Send } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PhoneInput } from "@/components/ui/phone-input"
import { Textarea } from "@/components/ui/textarea"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { contactSchema, type ContactFormValues } from "@/lib/schemas/contact"

const inputStyles =
  "bg-white! text-foreground placeholder:text-muted-foreground focus-visible:border-input focus-visible:ring-white/30"

export default function ContactForm() {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const t = useTranslations("ContactForm")
  const tValidation = useTranslations("ContactForm.validation")
  const locale = useLocale()

  // Translate a validation key emitted by the schema (e.g. "firstNameTooShort")
  // into the localized message. The schema only emits known keys, so the cast
  // is safe at runtime.
  const translateValidation = (
    key: string | undefined
  ): string | undefined => {
    if (!key) return undefined
    return tValidation(key as Parameters<typeof tValidation>[0])
  }

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  })

  const { isSubmitting, isSubmitSuccessful } = form.formState

  async function onSubmit(data: ContactFormValues) {
    setSubmitError(null)
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale }),
      })

      if (!response.ok) {
        throw new Error(t("genericError"))
      }
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : t("genericError")
      setSubmitError(message)
      throw error
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
                  htmlFor="contact-first-name"
                  className="font-bold text-white"
                >
                  {t("firstNameLabel")}
                </FieldLabel>
                <Input
                  {...field}
                  id="contact-first-name"
                  placeholder={t("firstNamePlaceholder")}
                  autoComplete="given-name"
                  aria-invalid={fieldState.invalid}
                  className={inputStyles}
                />
                {fieldState.invalid && (
                  <FieldError className="text-white">
                    {translateValidation(fieldState.error?.message)}
                  </FieldError>
                )}
              </Field>
            )}
          />
          <Controller
            name="lastName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel
                  htmlFor="contact-last-name"
                  className="font-bold text-white"
                >
                  {t("lastNameLabel")}
                </FieldLabel>
                <Input
                  {...field}
                  id="contact-last-name"
                  placeholder={t("lastNamePlaceholder")}
                  autoComplete="family-name"
                  aria-invalid={fieldState.invalid}
                  className={inputStyles}
                />
                {fieldState.invalid && (
                  <FieldError className="text-white">
                    {translateValidation(fieldState.error?.message)}
                  </FieldError>
                )}
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
                htmlFor="contact-email"
                className="font-bold text-white"
              >
                {t("emailLabel")}
              </FieldLabel>
              <Input
                {...field}
                id="contact-email"
                type="email"
                placeholder={t("emailPlaceholder")}
                autoComplete="email"
                aria-invalid={fieldState.invalid}
                className={inputStyles}
              />
              {fieldState.invalid && (
                <FieldError className="text-white">
                  {translateValidation(fieldState.error?.message)}
                </FieldError>
              )}
            </Field>
          )}
        />

        <Controller
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel
                htmlFor="contact-phone"
                className="font-bold text-white"
              >
                {t("phoneLabel")}{" "}
                <span className="font-normal text-white/70">
                  {t("phoneOptional")}
                </span>
              </FieldLabel>
              <PhoneInput
                {...field}
                id="contact-phone"
                defaultCountry="GB"
                placeholder={t("phonePlaceholder")}
                autoComplete="tel"
                aria-invalid={fieldState.invalid}
                className={inputStyles}
              />
              {fieldState.invalid && (
                <FieldError className="text-white">
                  {translateValidation(fieldState.error?.message)}
                </FieldError>
              )}
            </Field>
          )}
        />

        <Controller
          name="subject"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel
                htmlFor="contact-subject"
                className="font-bold text-white"
              >
                {t("subjectLabel")}
              </FieldLabel>
              <Input
                {...field}
                id="contact-subject"
                placeholder={t("subjectPlaceholder")}
                aria-invalid={fieldState.invalid}
                className={inputStyles}
              />
              {fieldState.invalid && (
                <FieldError className="text-white">
                  {translateValidation(fieldState.error?.message)}
                </FieldError>
              )}
            </Field>
          )}
        />

        <Controller
          name="message"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel
                htmlFor="contact-message"
                className="font-bold text-white"
              >
                {t("messageLabel")}
              </FieldLabel>
              <Textarea
                {...field}
                id="contact-message"
                placeholder={t("messagePlaceholder")}
                rows={5}
                aria-invalid={fieldState.invalid}
                className={inputStyles}
              />
              {fieldState.invalid && (
                <FieldError className="text-white">
                  {translateValidation(fieldState.error?.message)}
                </FieldError>
              )}
            </Field>
          )}
        />
      </FieldGroup>

      <Button
        type="submit"
        size="lg"
        className="w-full cursor-pointer bg-white text-brand-deep-red hover:bg-brand-cloud"
        disabled={isSubmitting || isSubmitSuccessful}
      >
        {isSubmitting && t("submitting")}
        {isSubmitSuccessful && t("submitSuccess")}
        {!isSubmitting && !isSubmitSuccessful && (
          <>
            {t("submit")}
            <Send
              data-icon="inline-end"
              className="transition-transform duration-300 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5"
            />
          </>
        )}
      </Button>

      {isSubmitSuccessful && (
        <p
          className="text-center text-sm text-white"
          role="status"
          aria-live="polite"
        >
          {t("successMessage")}
        </p>
      )}

      {submitError && !isSubmitting && (
        <p
          className="text-center text-sm text-white"
          role="alert"
          aria-live="assertive"
        >
          {submitError}
        </p>
      )}
    </form>
  )
}
