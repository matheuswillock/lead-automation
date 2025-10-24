import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { SubscriptionService } from '@/services/SubscriptionService/SubscriptionService'

// Admin emails permitidos - ADICIONE OS EMAILS DOS ADMINISTRADORES AQUI
const ADMIN_EMAILS: string[] = [
  // Exemplo: 'admin@theleadsfy.com',
  // 'vendedor@theleadsfy.com'
]

/**
 * POST /api/admin/subscription/lifetime
 * 
 * Endpoint para conceder assinatura vitalícia a usuários (vendedores/parceiros)
 * Requer autenticação de admin
 * 
 * Body:
 * {
 *   "profileId": "uuid-do-profile" OU "email": "email@exemplo.com"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // Service role key para admin
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Verificar autenticação
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Token de autenticação não fornecido' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 401 }
      )
    }

    // Verificar se é admin
    if (!ADMIN_EMAILS.includes(user.email || '')) {
      return NextResponse.json(
        { error: 'Acesso negado: apenas administradores podem conceder assinaturas vitalícias' },
        { status: 403 }
      )
    }

    // Obter dados do body
    const body = await request.json()
    const { profileId, email } = body

    let targetProfileId = profileId

    // Se foi fornecido email ao invés de profileId, buscar o profile
    if (email && !profileId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single()

      if (!profile) {
        return NextResponse.json(
          { error: `Usuário com email ${email} não encontrado` },
          { status: 404 }
        )
      }

      targetProfileId = profile.id
    }

    if (!targetProfileId) {
      return NextResponse.json(
        { error: 'Forneça profileId ou email do usuário' },
        { status: 400 }
      )
    }

    // Conceder assinatura vitalícia
    const subscription = await SubscriptionService.upgradeToLifetime(targetProfileId)

    // Buscar dados do usuário para resposta
    const { data: targetUser } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', targetProfileId)
      .single()

    return NextResponse.json({
      success: true,
      message: 'Assinatura vitalícia concedida com sucesso',
      data: {
        profileId: targetProfileId,
        email: targetUser?.email,
        name: targetUser?.full_name,
        subscription: {
          status: subscription.status,
          isLifetime: subscription.isLifetime,
          currentPeriodEnd: subscription.currentPeriodEnd
        }
      }
    })

  } catch (error) {
    console.error('Erro ao conceder assinatura vitalícia:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/subscription/lifetime?profileId=xxx
 * 
 * Verificar se um usuário tem assinatura vitalícia
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Verificar autenticação
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Token de autenticação não fornecido' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 401 }
      )
    }

    // Verificar se é admin
    if (!ADMIN_EMAILS.includes(user.email || '')) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    // Obter profileId da query
    const { searchParams } = new URL(request.url)
    const profileId = searchParams.get('profileId')

    if (!profileId) {
      return NextResponse.json(
        { error: 'profileId é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar status
    const isLifetime = await SubscriptionService.isLifetimeSubscription(profileId)

    // Buscar dados completos da assinatura
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('profile_id', profileId)
      .single()

    return NextResponse.json({
      profileId,
      isLifetime,
      subscription
    })

  } catch (error) {
    console.error('Erro ao verificar assinatura:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
