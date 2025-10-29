import { NextRequest, NextResponse } from "next/server"

import { createSupabaseRouteClient } from "@/lib/supabase/server"

function sanitizeRedirect(value: string | null) {
  if (!value) {
    return "/"
  }

  const decoded = (() => {
    try {
      return decodeURIComponent(value)
    } catch {
      return "/"
    }
  })()

  return decoded.startsWith("/") ? decoded : "/"
}

export async function POST(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const origin = requestUrl.origin
  const formData = await request.formData().catch(() => null)
  const redirectParam =
    (formData?.get("redirect_to") as string | null | undefined) ??
    requestUrl.searchParams.get("redirect_to")
  const redirectPath = sanitizeRedirect(redirectParam ?? null)
  const baseRedirectUrl = new URL(redirectPath, origin).toString()

  const response = NextResponse.redirect(baseRedirectUrl, { status: 303 })
  const supabase = await createSupabaseRouteClient(response)
  const { error } = await supabase.auth.signOut({ scope: "local" })

  if (error) {
    response.headers.set("Location", `${origin}/?authError=signout_failed`)
  }

  return response
}
