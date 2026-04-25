"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Send } from "lucide-react"

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

export default function ContactForm() {
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
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
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string
        } | null
        throw new Error(
          payload?.error ?? "Something went wrong. Please try again."
        )
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      setSubmitError(message)
      throw error
    }
  }

  const inputStyles =
    "bg-white! text-foreground placeholder:text-muted-foreground focus-visible:border-input focus-visible:ring-white/30"

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8 rounded-2xl bg-brand-deep-red p-8 sm:p-10"
    >
      <FieldGroup>
        <div className="grid gap-7 sm:grid-cols-2">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel
                  htmlFor="contact-name"
                  className="font-bold text-white"
                >
                  Name
                </FieldLabel>
                <Input
                  {...field}
                  id="contact-name"
                  placeholder="Your name"
                  autoComplete="name"
                  aria-invalid={fieldState.invalid}
                  className={inputStyles}
                />
                {fieldState.invalid && (
                  <FieldError
                    errors={[fieldState.error]}
                    className="text-white"
                  />
                )}
              </Field>
            )}
          />
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel
                  htmlFor="contact-email"
                  className="font-bold text-white"
                >
                  Email
                </FieldLabel>
                <Input
                  {...field}
                  id="contact-email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-invalid={fieldState.invalid}
                  className={inputStyles}
                />
                {fieldState.invalid && (
                  <FieldError
                    errors={[fieldState.error]}
                    className="text-white"
                  />
                )}
              </Field>
            )}
          />
        </div>

        <Controller
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel
                htmlFor="contact-phone"
                className="font-bold text-white"
              >
                Phone{" "}
                <span className="font-normal text-white/70">(optional)</span>
              </FieldLabel>
              <PhoneInput
                {...field}
                id="contact-phone"
                defaultCountry="GB"
                placeholder="Enter phone number"
                autoComplete="tel"
                aria-invalid={fieldState.invalid}
                className={inputStyles}
              />
              {fieldState.invalid && (
                <FieldError
                  errors={[fieldState.error]}
                  className="text-white"
                />
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
                Subject
              </FieldLabel>
              <Input
                {...field}
                id="contact-subject"
                placeholder="How can we help?"
                aria-invalid={fieldState.invalid}
                className={inputStyles}
              />
              {fieldState.invalid && (
                <FieldError
                  errors={[fieldState.error]}
                  className="text-white"
                />
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
                Message
              </FieldLabel>
              <Textarea
                {...field}
                id="contact-message"
                placeholder="Tell us about your goals..."
                rows={5}
                aria-invalid={fieldState.invalid}
                className={inputStyles}
              />
              {fieldState.invalid && (
                <FieldError
                  errors={[fieldState.error]}
                  className="text-white"
                />
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
        {isSubmitting && "Sending..."}
        {isSubmitSuccessful && "Message Sent!"}
        {!isSubmitting && !isSubmitSuccessful && (
          <>
            Send Message
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
          Thank you! We&apos;ll get back to you shortly.
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
