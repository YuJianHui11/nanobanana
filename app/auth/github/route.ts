import { createOAuthSignInHandler } from "@/lib/supabase/oauth"

export const GET = createOAuthSignInHandler("github")
