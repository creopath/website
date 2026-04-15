import { NextResponse } from "next/server"
import { Resend } from "resend"

import { contactSchema } from "@/lib/schemas/contact"

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

  const { name, email, subject, message } = parsed.data

  const resend = new Resend(process.env.RESEND_API_KEY)

  // 1. Send the admin notification (critical — must succeed)
  try {
    const { error } = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: [process.env.CONTACT_EMAIL],
      replyTo: email,
      subject: `[Creopath Contact] ${subject}`,
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px;">
          <h2 style="color: #4F2B62;">New contact form submission</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
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

  // 2. Send the confirmation to the user (best-effort — don't fail the request if this errors)
  try {
    const { error } = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: [email],
      subject: "We received your message — Creopath",
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px;">
          <h2 style="color: #4F2B62;">Thanks for reaching out, ${escapeHtml(name)}!</h2>
          <p>We've received your message and one of our team members will get back to you shortly.</p>
          <p>For your reference, here's a copy of what you sent:</p>
          <div style="background: #f7f7f7; border-left: 3px solid #4F2B62; padding: 12px 16px; margin: 16px 0;">
            <p style="margin: 0 0 8px 0;"><strong>Subject:</strong> ${escapeHtml(subject)}</p>
            <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(message)}</p>
          </div>
          <p>— The Creopath team</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0 16px 0;" />
          <p style="color: #888; font-size: 12px;">This is an automated message from noreply@creopath.com. Please do not reply to this email.</p>
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
