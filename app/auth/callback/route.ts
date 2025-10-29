import { NextRequest, NextResponse } from "next/server"

import { createSupabaseRouteClient } from "@/lib/supabase/server"

function decodeRedirectPath(value: string | null) {
  if (!value) {
    return "/"
  }

  try {
    const decoded = decodeURIComponent(value)
    return decoded.startsWith("/") ? decoded : "/"
  } catch {
    return "/"
  }
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const origin = requestUrl.origin
  const redirectTo = decodeRedirectPath(
    requestUrl.searchParams.get("redirect_to") ?? requestUrl.searchParams.get("next"),
  )
  const errorDescription = requestUrl.searchParams.get("error_description")
  const errorCode = requestUrl.searchParams.get("error")
  const providerParam = requestUrl.searchParams.get("provider")
  const provider =
    providerParam === "github" || providerParam === "google" ? providerParam : "oauth"

  const response = NextResponse.redirect(`${origin}${redirectTo}`)

  if (errorCode || errorDescription) {
    response.headers.set("Location", `${origin}/?authError=${provider}_callback`)
    return response
  }

  const code = requestUrl.searchParams.get("code")

  if (!code) {
    response.headers.set("Location", `${origin}/?authError=missing_code`)
    return response
  }

  const supabase = await createSupabaseRouteClient(response)
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    response.headers.set("Location", `${origin}/?authError=${provider}_exchange_failed`)
    return response
  }

  return response
}
