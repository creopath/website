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

  // Send the email via Resend
  const resend = new Resend(process.env.RESEND_API_KEY)
  try {
    const { data, error } = await resend.emails.send({
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
      console.error("Resend error:", error)
      return NextResponse.json(
        { error: "Failed to send email. Please try again later." },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, id: data?.id }, { status: 200 })
  } catch (err) {
    console.error("Unexpected error sending email:", err)
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    )
  }
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
