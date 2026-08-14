import * as z from "zod"

// Validation messages are translation keys (localized client-side), matching the
// contact/checkout schema convention.
export const loginSchema = z.object({
  email: z.email("emailInvalid"),
  password: z.string().min(1, "passwordRequired"),
})

export type LoginFormValues = z.infer<typeof loginSchema>
