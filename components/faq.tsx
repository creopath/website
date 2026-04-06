"use client"

import { motion } from "motion/react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { faqs } from "@/lib/constants/faqs"

export default function FAQ() {
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
              FAQ
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-white sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mx-auto text-lg mt-4 max-w-xl text-white/70">
              Have a different question? Reach out to us through our contact
              form below.
            </p>
          </div>

          <div className="mt-12">
            <Accordion type="single" collapsible>
              {faqs.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question}>
                  <AccordionTrigger className="text-left font-heading text-base font-medium text-white **:data-[slot=accordion-trigger-icon]:text-white">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-white/70">
                    {faq.answer}
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
