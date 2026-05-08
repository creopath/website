import * as z from "zod"
import { isValidPhoneNumber } from "libphonenumber-js"

// Validation messages are stored as translation keys (not English strings).
// The client form translates them via next-intl at render time.
// On the server, schema validation acts as defense-in-depth — the API returns
// a generic 400; users only see translated messages from the client validator.
export const contactSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "firstNameTooShort")
    .max(50, "firstNameTooLong"),
  lastName: z
    .string()
    .trim()
    .min(2, "lastNameTooShort")
    .max(50, "lastNameTooLong"),
  email: z.email("emailInvalid"),
  phone: z
    .string()
    .refine(isValidPhoneNumber, { error: "phoneInvalid" })
    .or(z.literal("")),
  subject: z.string().min(3, "subjectTooShort"),
  message: z.string().min(10, "messageTooShort").max(1000, "messageTooLong"),
})

export type ContactFormValues = z.infer<typeof contactSchema>
