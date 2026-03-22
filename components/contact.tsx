"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { motion } from "motion/react"
import { Send } from "lucide-react"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  subject: z.string().min(3, "Subject must be at least 3 characters."),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters.")
    .max(1000, "Message must be at most 1000 characters."),
})

type ContactFormValues = z.infer<typeof contactSchema>

export function Contact() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  const { isSubmitting, isSubmitSuccessful } = form.formState

  async function onSubmit(data: ContactFormValues) {
    // TODO: Wire up with Resend API route
    console.log(data)
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  return (
    <section id="contact" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-semibold tracking-wide text-primary">
              Get In Touch
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Ready to take the next step?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Book a free consultation and let&apos;s discuss how we can help
              you achieve your career and education goals.
            </p>

            <address className="mt-8 space-y-4 not-italic text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Email: </span>
                <a
                  href="mailto:hello@creopath.com"
                  className="transition-colors hover:text-primary"
                >
                  hello@creopath.com
                </a>
              </p>
              <p>
                <span className="font-medium text-foreground">
                  Location:{" "}
                </span>
                London, United Kingdom
              </p>
            </address>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 rounded-xl border border-border bg-card p-8"
            >
              <FieldGroup>
                <div className="grid gap-6 sm:grid-cols-2">
                  <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid || undefined}>
                        <FieldLabel htmlFor="contact-name">Name</FieldLabel>
                        <Input
                          {...field}
                          id="contact-name"
                          placeholder="Your name"
                          autoComplete="name"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid || undefined}>
                        <FieldLabel htmlFor="contact-email">Email</FieldLabel>
                        <Input
                          {...field}
                          id="contact-email"
                          type="email"
                          placeholder="you@example.com"
                          autoComplete="email"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                <Controller
                  name="subject"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid || undefined}>
                      <FieldLabel htmlFor="contact-subject">Subject</FieldLabel>
                      <Input
                        {...field}
                        id="contact-subject"
                        placeholder="How can we help?"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="message"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid || undefined}>
                      <FieldLabel htmlFor="contact-message">Message</FieldLabel>
                      <Textarea
                        {...field}
                        id="contact-message"
                        placeholder="Tell us about your goals..."
                        rows={5}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting || isSubmitSuccessful}
              >
                {isSubmitting && "Sending..."}
                {isSubmitSuccessful && "Message Sent!"}
                {!isSubmitting && !isSubmitSuccessful && (
                  <>
                    Send Message
                    <Send data-icon="inline-end" />
                  </>
                )}
              </Button>

              {isSubmitSuccessful && (
                <p
                  className="text-center text-sm text-primary"
                  role="status"
                  aria-live="polite"
                >
                  Thank you! We&apos;ll get back to you shortly.
                </p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
