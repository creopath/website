import { NextResponse } from "next/server"
import { Resend } from "resend"
import { parsePhoneNumberFromString } from "libphonenumber-js"
import { hasLocale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { contactSchema } from "@/lib/schemas/contact"
import { routing } from "@/i18n/routing"

export async function POST(request: Request) {
  // Ensure required environment variables are set
  if (
    !process.env.RESEND_API_KEY ||
    !process.env.CONTACT_EMAIL ||
    !process.env.FROM_EMAIL
  ) {
    console.error("Missing required environment variables for contact form.")
    return NextResponse.json(
      { error: "Server is not configured to send emails." },
      { status: 500 }
    )
  }

  // Parse and validate the request body
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    )
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid form data.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    )
  }

  // Pick up the user's locale from the request body so we can localise the
  // confirmation email. Falls back to the default locale.
  const rawLocale =
    typeof body === "object" && body !== null && "locale" in body
      ? (body as { locale?: unknown }).locale
      : undefined
  const locale = hasLocale(routing.locales, rawLocale)
    ? rawLocale
    : routing.defaultLocale

  const { firstName, lastName, email, phone, subject, message } = parsed.data
  const formattedPhone = phone
    ? (parsePhoneNumberFromString(phone)?.formatInternational() ?? phone)
    : ""

  const resend = new Resend(process.env.RESEND_API_KEY)

  // 1. Send the admin notification (critical — must succeed). English only.
  try {
    const { error } = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: [process.env.CONTACT_EMAIL],
      replyTo: email,
      subject: `[Creopath Contact] ${subject}`,
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px;">
          <h2 style="color: #4F2B62;">New contact form submission</h2>
          <p><strong>First name:</strong> ${escapeHtml(firstName)}</p>
          <p><strong>Last name:</strong> ${escapeHtml(lastName)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          ${formattedPhone ? `<p><strong>Phone:</strong> ${escapeHtml(formattedPhone)}</p>` : ""}
          <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          <p><strong>Locale:</strong> ${escapeHtml(locale)}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
          <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
        </div>
      `,
    })

    if (error) {
      console.error("Resend error (admin notification):", error)
      return NextResponse.json(
        { error: "Failed to send email. Please try again later." },
        { status: 500 }
      )
    }
  } catch (err) {
    console.error("Unexpected error sending admin notification:", err)
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    )
  }

  // 2. Send the localised confirmation to the user (best-effort).
  const t = await getTranslations({
    locale,
    namespace: "EmailUserConfirmation",
  })

  try {
    const { error } = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: [email],
      subject: t("subject"),
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px;">
          <h2 style="color: #4F2B62;">${escapeHtml(t("greeting", { name: firstName }))}</h2>
          <p>${escapeHtml(t("intro"))}</p>
          <p>${escapeHtml(t("referenceIntro"))}</p>
          <div style="background: #f7f7f7; border-left: 3px solid #4F2B62; padding: 12px 16px; margin: 16px 0;">
            <p style="margin: 0 0 8px 0;"><strong>${escapeHtml(t("subjectLabel"))}:</strong> ${escapeHtml(subject)}</p>
            ${formattedPhone ? `<p style="margin: 0 0 8px 0;"><strong>${escapeHtml(t("phoneLabel"))}:</strong> ${escapeHtml(formattedPhone)}</p>` : ""}
            <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(message)}</p>
          </div>
          <p>${escapeHtml(t("signoff"))}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0 16px 0;" />
          <p style="color: #888; font-size: 12px;">${escapeHtml(t("noReplyNote"))}</p>
        </div>
      `,
    })

    if (error) {
      console.error("Resend error (user confirmation):", error)
    }
  } catch (err) {
    console.error("Unexpected error sending user confirmation:", err)
  }

  return NextResponse.json({ success: true }, { status: 200 })
}

// Minimal HTML escape to prevent injection into the email body
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}
