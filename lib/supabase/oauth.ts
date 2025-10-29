import { NextRequest, NextResponse } from "next/server"

import { createSupabaseRouteClient } from "./server"

type SupportedProvider = "google" | "github"

function sanitizeRedirectPath(path: string | null) {
  if (!path || !path.startsWith("/")) {
    return "/"
  }

  return path
}

function buildRedirectPath(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const redirectParam =
    requestUrl.searchParams.get("redirect_to") ?? requestUrl.searchParams.get("next")

  return sanitizeRedirectPath(redirectParam)
}

export function createOAuthSignInHandler(provider: SupportedProvider) {
  return async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const origin = requestUrl.origin
    const desiredRedirect = buildRedirectPath(request)

    const response = NextResponse.redirect(origin)
    const supabase = await createSupabaseRouteClient(response)

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${origin}/auth/callback?redirect_to=${encodeURIComponent(desiredRedirect)}&provider=${encodeURIComponent(provider)}`,
      },
    })

    if (error || !data?.url) {
      response.headers.set("Location", `${origin}/?authError=${provider}_sign_in`)
      return response
    }

    response.headers.set("Location", data.url)
    return response
  }
}
