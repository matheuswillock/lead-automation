import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { StorageService } from '@/services/StorageService/StorageService'
import { cookies } from 'next/headers'
import { ProfileService } from '@/services/ProfileService/ProfileService'
import { SubscriptionService } from '@/services/SubscriptionService/SubscriptionService'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        
    if (!error && data.user) {
      // Verificar se é login via OAuth (Google)
      const isOAuthUser = data.user.app_metadata.provider === 'google'
      
      if (isOAuthUser) {
        // Capturar foto do Google se disponível
        const googlePhotoUrl = data.user.user_metadata.avatar_url || data.user.user_metadata.picture
        
        if (googlePhotoUrl) {
          try {
            // Download e upload da foto do Google para o Supabase Storage
            const storageAvatarUrl = await StorageService.downloadAndUploadGooglePhoto(
              googlePhotoUrl,
              data.user.id
            )
            
            if (storageAvatarUrl) {
              // Atualizar user metadata com a URL do Storage
              await supabase.auth.updateUser({
                data: {
                  avatar_url: storageAvatarUrl
                }
              })
            }
          } catch (err) {
            console.error('Erro ao processar avatar do Google:', err)
            // Continuar mesmo se falhar o upload da foto
          }
        }

        // Criar o profile diretamente: um fetch server-to-server não encaminha
        // automaticamente os cookies recém-criados pela troca OAuth.
        try {
          const existingProfile = await ProfileService.getProfileBySupabaseId(data.user.id)
          if (!existingProfile) {
            const profile = await ProfileService.createProfile({
              supabaseId: data.user.id,
              username: data.user.user_metadata?.user_name || data.user.email?.split('@')[0],
              avatarUrl: data.user.user_metadata?.avatar_url,
            })
            await SubscriptionService.createPendingSubscription(profile.id)
          }
        } catch (err) {
          console.error('❌ Erro ao criar profile:', err)
        }
      }
      
      // Verificar se o usuário já tem subscription ativa
      let redirectTo = '/checkout' // Padrão: checkout
      
      try {
        const profile = await ProfileService.getProfileBySupabaseId(data.user.id)
        if (profile && await SubscriptionService.isSubscriptionActive(profile.id)) {
          redirectTo = '/generate'
        }
      } catch (err) {
        console.error('❌ Erro ao verificar subscription:', err)
        // Em caso de erro, manter o padrão (checkout)
      }
      
      return NextResponse.redirect(`${origin}${redirectTo}`)
    }
  }

  // Retornar para auth em caso de erro
  console.error('❌ OAuth callback error, redirecting to /auth')
  return NextResponse.redirect(`${origin}/auth`)
}
