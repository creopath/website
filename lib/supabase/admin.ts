import "server-only"

import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// Minimal Database type for the tables the admin client writes, so inserts are
// type-checked against our real column shapes. (A lighter alternative to
// generating full types from Supabase.)
type Profile = {
  id: string
  first_name: string
  last_name: string
  phone: string
  address: string
  stripe_customer_id: string
  created_at: string
  updated_at: string
}
type Purchase = {
  id: string
  user_id: string | null
  plan: string
  payment_status: "paid" | "refunded"
  amount: number
  currency: string
  purchased_at: string
  expires_at: string
  stripe_checkout_session_id: string | null
}
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, "created_at" | "updated_at"> &
          Partial<Pick<Profile, "created_at" | "updated_at">>
        Update: Partial<Profile>
        Relationships: []
      }
      purchases: {
        Row: Purchase
        Insert: Omit<Purchase, "id"> & Partial<Pick<Purchase, "id">>
        Update: Partial<Purchase>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: { payment_status: "paid" | "refunded" }
    CompositeTypes: Record<string, never>
  }
}

// Supabase admin client — uses the SECRET service-role key, which bypasses Row
// Level Security. Only ever used server-side (the webhook) to create the auth
// user, profile, and purchase after a successful payment.
//
// `server-only` makes the build fail if this is ever imported into client code.
// Created lazily so importing this file during the build (before env vars exist)
// doesn't throw.
let client: SupabaseClient<Database> | null = null

export function createAdminClient() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    throw new Error("Supabase admin env vars are not set")
  }
  if (!client) {
    client = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
  }
  return client
}
