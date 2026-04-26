import * as z from "zod"
import { isValidPhoneNumber } from "libphonenumber-js"

export const contactSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters.")
    .max(50, "First name must be at most 50 characters."),
  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters.")
    .max(50, "Last name must be at most 50 characters."),
  email: z.email("Please enter a valid email address."),
  phone: z
    .string()
    .refine(isValidPhoneNumber, { error: "Please enter a valid phone number." })
    .or(z.literal("")),
  subject: z.string().min(3, "Subject must be at least 3 characters."),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters.")
    .max(1000, "Message must be at most 1000 characters."),
})

export type ContactFormValues = z.infer<typeof contactSchema>
