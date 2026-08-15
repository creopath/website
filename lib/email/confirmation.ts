import "server-only"

import { Resend } from "resend"
import { getTranslations } from "next-intl/server"

import { getPackage, formatPackagePrice } from "@/lib/constants/packages"

type ConfirmationEmail = {
  email: string
  firstName: string
  planId: string
  amount: number // pence
  setPasswordLink: string | null
  locale: "en" | "tr"
}

// Sends the post-payment confirmation email (localized), including the
// set-password link so the client can activate their login. Best-effort: logs
// on failure rather than throwing, so a failed email never breaks fulfillment.
// Mirrors the Resend pattern used in the contact route.
export async function sendConfirmationEmail({
  email,
  firstName,
  planId,
  amount,
  setPasswordLink,
  locale,
}: ConfirmationEmail): Promise<void> {
  if (!process.env.RESEND_API_KEY || !process.env.FROM_EMAIL) {
    console.error("Missing RESEND_API_KEY / FROM_EMAIL for confirmation email.")
    return
  }

  const t = await getTranslations({
    locale,
    namespace: "CheckoutEmailConfirmation",
  })
  const tPricing = await getTranslations({ locale, namespace: "Pricing" })

  const pkg = getPackage(planId)
  const planName = pkg
    ? tPricing(
        `items.${pkg.id}.name` as Parameters<typeof tPricing>[0]
      )
    : planId
  const amountText = formatPackagePrice(amount, "GBP", locale)

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const { error } = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: [email],
      subject: t("subject"),
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px;">
          <h2 style="color: #4F2B62;">${escapeHtml(t("greeting", { name: firstName }))}</h2>
          <p>${escapeHtml(t("intro"))}</p>
          <div style="background: #f7f7f7; border-left: 3px solid #4F2B62; padding: 12px 16px; margin: 16px 0;">
            <p style="margin: 0 0 8px 0;"><strong>${escapeHtml(t("packageLabel"))}:</strong> ${escapeHtml(planName)}</p>
            <p style="margin: 0;"><strong>${escapeHtml(t("amountLabel"))}:</strong> ${escapeHtml(amountText)}</p>
          </div>
          ${
            setPasswordLink
              ? `<p>${escapeHtml(t("setPasswordIntro"))}</p>
                 <p style="margin: 20px 0;">
                   <a href="${encodeURI(setPasswordLink)}" style="display: inline-block; background: #012169; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                     ${escapeHtml(t("setPasswordButton"))}
                   </a>
                 </p>`
              : ""
          }
          <p><strong>${escapeHtml(t("nextStepsIntro"))}</strong></p>
          <p>${escapeHtml(t("nextSteps"))}</p>
          <p>${escapeHtml(t("signoff"))}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0 16px 0;" />
          <p style="color: #888; font-size: 12px;">${escapeHtml(t("noReplyNote"))}</p>
        </div>
      `,
    })
    if (error) {
      console.error("Resend error (confirmation email):", error)
    }
  } catch (err) {
    console.error("Unexpected error sending confirmation email:", err)
  }
}

// Minimal HTML escape to prevent injection into the email body.
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}
