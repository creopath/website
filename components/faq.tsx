"use client"

import { motion } from "motion/react"
import { useTranslations } from "next-intl"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { faqIds } from "@/lib/constants/faqs"

export default function FAQ() {
  const t = useTranslations("FAQ")

  return (
    <section id="faq" className="px-4 py-24">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-2xl bg-brand-purple px-8 pb-8 pt-12 sm:px-12 sm:pb-12 lg:px-16 lg:pb-16"
        >
          <div className="text-center">
            <p className="text-lg font-bold tracking-wide text-brand-red">
              {t("eyebrow")}
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-white sm:text-4xl">
              {t("title")}
            </h2>
            <p className="mx-auto text-lg mt-4 max-w-xl text-white/70">
              {t("description")}
            </p>
          </div>

          <div className="mt-12">
            <Accordion type="single" collapsible>
              {faqIds.map((id) => (
                <AccordionItem key={id} value={id}>
                  <AccordionTrigger className="text-left font-heading text-base font-medium text-white **:data-[slot=accordion-trigger-icon]:text-white">
                    {t(`questions.${id}.question`)}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-white/70">
                    {t(`questions.${id}.answer`)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
