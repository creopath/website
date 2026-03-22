import Link from "next/link"

const navigation = [
  { label: "Services", href: "#services" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About", href: "#about" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-card px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link
              href="/"
              className="font-heading text-xl font-bold text-primary"
            >
              Creopath
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              AI-powered career guidance and education advisory. Helping you
              make informed decisions for your future.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <h2 className="font-heading text-sm font-semibold text-foreground">
              Navigation
            </h2>
            <ul className="mt-3 space-y-2">
              {navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-heading text-sm font-semibold text-foreground">
              Contact
            </h2>
            <address className="mt-3 space-y-2 not-italic">
              <p>
                <a
                  href="mailto:hello@creopath.com"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  hello@creopath.com
                </a>
              </p>
              <p className="text-sm text-muted-foreground">
                London, United Kingdom
              </p>
            </address>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Creopath. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
