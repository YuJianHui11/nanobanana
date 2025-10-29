import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { NextResponse } from "next/server"

import { getSupabaseConfig } from "./config"

type CookiePayload = {
  name: string
  value: string
  options?: CookieOptions
}

async function getSerializedCookies() {
  const cookieStore = await cookies()
  return cookieStore.getAll().map(({ name, value }) => ({ name, value }))
}

function shouldDeleteCookie(value: string, options?: CookieOptions) {
  if (value.length === 0) {
    return true
  }

  if (options?.maxAge === 0) {
    return true
  }

  if (options?.expires && new Date(options.expires).getTime() <= 0) {
    return true
  }

  return false
}

function applyResponseCookies(response: NextResponse, cookieList: CookiePayload[]) {
  cookieList.forEach(({ name, value, options }) => {
    if (shouldDeleteCookie(value, options)) {
      response.cookies.delete(name)
      return
    }

    response.cookies.set({
      name,
      value,
      ...(options ?? {}),
    })
  })
}

export async function createSupabaseServerClient() {
  const { url, anonKey } = getSupabaseConfig()
  const cookieStore = await cookies()

  return createServerClient(url, anonKey, {
    cookies: {
      getAll: async () => await getSerializedCookies(),
      setAll: async (cookieList) => {
        cookieList.forEach(({ name, value, options }) => {
          try {
            const mutableStore = cookieStore as unknown as {
              set?: (options: { name: string; value: string } & CookieOptions) => void
              delete?: (name: string, options?: CookieOptions) => void
            }

            if (shouldDeleteCookie(value, options)) {
              mutableStore.delete?.(name, options)
              return
            }

            mutableStore.set?.({
              name,
              value,
              ...(options ?? {}),
            })
          } catch {
            // cookies() can be read-only in certain server contexts; ignore writes there
          }
        })
      },
    },
  })
}

export async function createSupabaseRouteClient(response: NextResponse) {
  const { url, anonKey } = getSupabaseConfig()

  return createServerClient(url, anonKey, {
    cookies: {
      getAll: async () => await getSerializedCookies(),
      setAll: async (cookieList) => {
        applyResponseCookies(response, cookieList)
      },
    },
  })
}
