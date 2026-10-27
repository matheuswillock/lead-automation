import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { ProfileService, type ProfileWithSubscription } from '@/services/ProfileService/ProfileService'

export async function getAuthenticatedUser() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => undefined,
      },
    },
  )

  const { data: { user }, error } = await supabase.auth.getUser()
  return error || !user ? null : user
}

export async function getAuthenticatedProfile(): Promise<ProfileWithSubscription | null> {
  const user = await getAuthenticatedUser()
  return user ? ProfileService.getProfileBySupabaseId(user.id) : null
}
