"use client"

import { motion } from "motion/react"
import { Mail, MapPin } from "lucide-react"
import { useTranslations } from "next-intl"

import ContactForm from "@/components/contact-form"

export default function Contact() {
  const t = useTranslations("Contact")

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
            <p className="text-lg font-bold tracking-wide">{t("eyebrow")}</p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-brand-deep-red sm:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-4 text-lg leading-relaxed">{t("description")}</p>

            <address className="mt-10 space-y-5 not-italic">
              <div className="flex items-center gap-4">
                <Mail className="size-6 shrink-0 text-brand-deep-red" />
                <div>
                  <p className="font-heading text-sm font-semibold">
                    {t("emailLabel")}
                  </p>
                  <a
                    href="mailto:info@creopath.com"
                    className="text-base text-muted-foreground transition-colors hover:text-brand-deep-red"
                  >
                    info@creopath.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="size-6 shrink-0 text-brand-deep-red" />
                <div>
                  <p className="font-heading text-sm font-semibold">
                    {t("locationLabel")}
                  </p>
                  <p className="text-base text-muted-foreground">
                    {t("locationValue")}
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
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
