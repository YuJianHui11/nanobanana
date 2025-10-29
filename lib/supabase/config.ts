const missingEnvMessage = (name: string) =>
  `Missing environment variable ${name}. Please update your Supabase configuration.`

export function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL
  const anonKey = process.env.SUPABASE_ANON_KEY

  if (!url) {
    throw new Error(missingEnvMessage("SUPABASE_URL"))
  }

  if (!anonKey) {
    throw new Error(missingEnvMessage("SUPABASE_ANON_KEY"))
  }

  return { url, anonKey }
}

