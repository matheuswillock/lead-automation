import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { StorageService } from '@/services/StorageService/StorageService'
import { cookies } from 'next/headers'

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
    
    console.log('🔐 OAuth Callback:', {
      hasUser: !!data?.user,
      provider: data?.user?.app_metadata?.provider,
      error: error?.message
    })
    
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

        // Criar profile no onboarding se for novo usuário
        try {
          const onboardingResponse = await fetch(`${origin}/api/onboarding`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              supabaseId: data.user.id,
            }),
          })
          
          const onboardingData = await onboardingResponse.json()
          console.log('📝 Onboarding response:', onboardingData)
        } catch (err) {
          console.error('❌ Erro ao criar profile:', err)
        }
      }
      
      // Verificar se o usuário já tem subscription ativa
      let redirectTo = '/checkout' // Padrão: checkout
      
      try {
        // Buscar profile e subscription status pelo supabaseId
        const profileResponse = await fetch(`${origin}/api/onboarding?supabaseId=${data.user.id}`)
        
        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          
          console.log('💳 Subscription status:', {
            userId: data.user.id,
            profileId: profileData.profile?.id,
            subscriptionActive: profileData.subscriptionActive,
            subscriptionStatus: profileData.subscription?.status
          })
          
          // Se tem subscription ativa, vai direto para generate
          if (profileData.subscriptionActive) {
            redirectTo = '/generate'
          }
        }
      } catch (err) {
        console.error('❌ Erro ao verificar subscription:', err)
        // Em caso de erro, manter o padrão (checkout)
      }
      
      console.log('✅ Redirecting to:', redirectTo)
      return NextResponse.redirect(`${origin}${redirectTo}`)
    }
  }

  // Retornar para auth em caso de erro
  console.error('❌ OAuth callback error, redirecting to /auth')
  return NextResponse.redirect(`${origin}/auth`)
}
