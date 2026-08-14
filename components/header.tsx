import HeaderNav from "@/components/header-nav"
import { isLoggedIn } from "@/lib/auth/user"

// Server component: reads auth state once, then renders the interactive nav.
// Call sites just use <Header /> — no prop threading needed.
export default async function Header() {
  const loggedIn = await isLoggedIn()
  return <HeaderNav loggedIn={loggedIn} />
}
