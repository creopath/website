"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"

// Result shape returned to the client form. On success the form redirects;
// on failure it shows `error` (a translation key the form localizes).
export type AuthResult = { error: string } | { error: null }

export async function login(
  email: string,
  password: string
): Promise<AuthResult> {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    // Don't leak whether the email exists — return one generic key.
    return { error: "invalidCredentials" }
  }

  // Refresh any cached pages that depend on auth state (e.g. the header).
  revalidatePath("/", "layout")
  return { error: null }
}

export async function logout(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
}
