"use client"

import { motion } from "motion/react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Who is Creopath for?",
    answer:
      "Creopath is for anyone looking to make informed career and education decisions — whether you're a student planning to study in the UK, a professional considering a career change, or someone seeking guidance on skill development and global opportunities.",
  },
  {
    question: "Do I need to be in the UK to use your services?",
    answer:
      "Not at all. We work with clients from around the world, including India, Turkey, and many other countries. Our consultations are conducted online, so you can access our guidance from anywhere.",
  },
  {
    question: "What does the free consultation include?",
    answer:
      "During your free consultation, we'll discuss your goals, background, and aspirations. We'll give you an honest assessment of your options and outline how we can help you move forward.",
  },
  {
    question: "How is Creopath different from other consultancies?",
    answer:
      "We combine personalised, one-on-one advisory with AI-powered insights to give you data-driven recommendations. As a small team, you'll work directly with the people guiding your journey — no generic advice, no being passed between departments.",
  },
  {
    question: "What services do you offer for study abroad?",
    answer:
      "We provide end-to-end support including university selection, application guidance, personal statement review, visa process support, and pre-departure preparation for students planning to study in the UK.",
  },
  {
    question: "How much do your services cost?",
    answer:
      "We offer a free initial consultation. After that, our pricing depends on the scope of services you need. We'll provide a clear breakdown during your first call — no hidden fees or surprises.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="border-y border-border bg-card px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm font-semibold tracking-wide text-primary">
            FAQ
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Have a different question? Reach out to us through our contact form
            below.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-12"
        >
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-heading text-base font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
