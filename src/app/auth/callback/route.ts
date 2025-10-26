import { createClient } from '@/lib/supabase/client'
import { NextResponse } from 'next/server'
import { StorageService } from '@/services/StorageService/StorageService'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/generate'

  if (code) {
    const supabase = createClient()
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

        // Criar profile no onboarding se for novo usuário
        try {
          await fetch(`${origin}/api/onboarding`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              supabaseId: data.user.id,
            }),
          })
        } catch (err) {
          console.error('Erro ao criar profile:', err)
        }
      }
      
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Retornar para auth em caso de erro
  return NextResponse.redirect(`${origin}/auth`)
}
