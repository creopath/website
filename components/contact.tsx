"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { motion } from "motion/react"
import { Mail, MapPin, Send } from "lucide-react"
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
            <p className="text-lg font-bold tracking-wide text-brand-grey">
              Get In Touch
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-brand-deep-red sm:text-4xl">
              Ready to take the next step?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-foreground">
              Book a free consultation and let&apos;s discuss how we can help
              you achieve your career and education goals.
            </p>

            <address className="mt-10 space-y-5 not-italic">
              <div className="flex items-center gap-4">
                <Mail className="size-6 shrink-0 text-brand-deep-red" />
                <div>
                  <p className="font-heading text-sm font-semibold text-foreground">
                    Email
                  </p>
                  <a
                    href="mailto:hello@creopath.com"
                    className="text-base text-muted-foreground transition-colors hover:text-brand-deep-red"
                  >
                    hello@creopath.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="size-6 shrink-0 text-brand-deep-red" />
                <div>
                  <p className="font-heading text-sm font-semibold text-foreground">
                    Location
                  </p>
                  <p className="text-base text-muted-foreground">
                    London, United Kingdom
                  </p>
                </div>
              </div>
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
                          className="text-white font-bold"
                        >
                          Name
                        </FieldLabel>
                        <Input
                          {...field}
                          id="contact-name"
                          placeholder="Your name"
                          autoComplete="name"
                          aria-invalid={fieldState.invalid}
                          className="bg-white! text-foreground placeholder:text-muted-foreground focus-visible:border-input focus-visible:ring-white/30"
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
                          className="text-white font-bold"
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
                          className="bg-white! text-foreground placeholder:text-muted-foreground focus-visible:border-input focus-visible:ring-white/30"
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
                  name="subject"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid || undefined}>
                      <FieldLabel
                        htmlFor="contact-subject"
                        className="text-white font-bold"
                      >
                        Subject
                      </FieldLabel>
                      <Input
                        {...field}
                        id="contact-subject"
                        placeholder="How can we help?"
                        aria-invalid={fieldState.invalid}
                        className="bg-white! text-foreground placeholder:text-muted-foreground focus-visible:border-input focus-visible:ring-white/30"
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
                        className="text-white font-bold"
                      >
                        Message
                      </FieldLabel>
                      <Textarea
                        {...field}
                        id="contact-message"
                        placeholder="Tell us about your goals..."
                        rows={5}
                        aria-invalid={fieldState.invalid}
                        className="bg-white! text-foreground placeholder:text-muted-foreground focus-visible:border-input focus-visible:ring-white/30"
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
                      className="transition-transform duration-300 group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5"
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
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
