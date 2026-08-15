import * as z from "zod"
import { isValidPhoneNumber } from "libphonenumber-js"

import { packageIds } from "@/lib/constants/packages"

// Validation messages are stored as translation keys (not English strings).
// The client form translates them via next-intl at render time. On the server,
// schema validation acts as defense-in-depth — the API returns a generic 400.
// Mirrors the contact schema's approach; see lib/schemas/contact.ts.
export const checkoutSchema = z.object({
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
  // Phone is required for checkout (unlike the optional contact-form phone) —
  // advisors need a reliable way to reach paying clients.
  phone: z.string().refine(isValidPhoneNumber, { error: "phoneInvalid" }),
  // Address is stored in the profile (records / documentation). Required.
  address: z
    .string()
    .trim()
    .min(5, "addressTooShort")
    .max(200, "addressTooLong"),
  // Constrained to known package IDs. The server never trusts a price or Stripe
  // Price ID from the client — only this ID, which it maps to a Price server-side.
  packageId: z.enum(packageIds, {
    error: "packageInvalid",
  }),
})

export type CheckoutFormValues = z.infer<typeof checkoutSchema>
