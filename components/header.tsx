import { Button } from "@/components/ui/button"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { HeaderAuthActions } from "@/components/header-auth-actions"

async function getSessionUser() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return session?.user ?? null
}

function getUserDisplayName(user: Awaited<ReturnType<typeof getSessionUser>>) {
  if (!user) {
    return null
  }

  return (
    (typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name) ||
    user.email ||
    null
  )
}

export async function Header() {
  const user = await getSessionUser()
  const displayName = getUserDisplayName(user)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🍌</span>
          <span className="text-xl font-bold text-foreground">Nano Banana</span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <a
            href="#editor"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Image Editor
          </a>
          <a
            href="#showcase"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Showcase
          </a>
          <a
            href="#testimonials"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Reviews
          </a>
          <a
            href="#faq"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <HeaderAuthActions displayName={displayName} isAuthenticated={Boolean(user)} />
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            asChild
          >
            <a href="#editor">Launch Now</a>
          </Button>
        </div>
      </div>
    </header>
  )
}
