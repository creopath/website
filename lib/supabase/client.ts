import { createBrowserClient } from "@supabase/ssr"

// Supabase client for browser (Client Component) code — the login/signup forms.
// Uses the publishable key, which is safe in the browser because Row Level
// Security controls what data each user can actually read or write.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
