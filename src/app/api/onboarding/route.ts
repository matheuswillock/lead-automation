import { NextRequest, NextResponse } from 'next/server'
import { ProfileService } from '@/services/ProfileService/ProfileService'
import { SubscriptionService } from '@/services/SubscriptionService/SubscriptionService'
import { getAuthenticatedProfile, getAuthenticatedUser } from '@/lib/supabase/authenticated-profile'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, avatarUrl, email } = body
    const user = await getAuthenticatedUser()
    if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    // Verificar se o usuário já existe
    const existingProfile = await ProfileService.getProfileBySupabaseId(user.id)

    if (existingProfile) {
      return NextResponse.json({
        profile: existingProfile,
        isNew: false,
        message: 'Usuário já existe',
      })
    }

    // Criar novo perfil
    const profile = await ProfileService.createProfile({
      supabaseId: user.id,
      username: username || email?.split('@')[0],
      avatarUrl,
    })

    // Criar assinatura PENDING (aguardando pagamento)
    const subscription = await SubscriptionService.createPendingSubscription(profile.id)

    // Buscar perfil com subscription atualizada
    const updatedProfile = await ProfileService.getProfileById(profile.id)

    return NextResponse.json({
      profile: updatedProfile,
      subscription,
      isNew: true,
      needsPayment: true,
      message: 'Usuário criado com sucesso! Complete o pagamento para ativar sua assinatura.',
    }, { status: 201 })

  } catch (error: any) {
    console.error('Erro ao fazer onboarding:', error)
    return NextResponse.json(
      { error: 'Erro ao criar usuário' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const profile = await getAuthenticatedProfile()

    if (!profile) {
      return NextResponse.json(
        { error: 'Não autenticado ou perfil não encontrado' },
        { status: 401 }
      )
    }

    // Verificar se subscription está ativa
    const isActive = await SubscriptionService.isSubscriptionActive(profile.id)

    return NextResponse.json({
      profile: {
        id: profile.id,
        supabaseId: profile.supabaseId,
        username: profile.username,
        avatarUrl: profile.avatarUrl,
        createdAt: profile.createdAt,
      },
      subscription: profile.subscription ? {
        id: profile.subscription.id,
        status: profile.subscription.status,
        isLifetime: (profile.subscription as any).isLifetime || false,
        currentPeriodEnd: profile.subscription.currentPeriodEnd,
        createdAt: (profile.subscription as any).createdAt,
        plan: {
          name: profile.subscription.plan.name,
          price: profile.subscription.plan.price,
          description: profile.subscription.plan.description,
        },
      } : null,
      subscriptionActive: isActive,
    })

  } catch (error: any) {
    console.error('Erro ao buscar perfil:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar perfil' },
      { status: 500 }
    )
  }
}
