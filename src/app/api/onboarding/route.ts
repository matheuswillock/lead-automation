import { NextRequest, NextResponse } from 'next/server'
import { ProfileService } from '@/services/ProfileService/ProfileService'
import { SubscriptionService } from '@/services/SubscriptionService/SubscriptionService'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { supabaseId, username, avatarUrl, email } = body

    if (!supabaseId) {
      return NextResponse.json(
        { error: 'supabaseId é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se o usuário já existe
    const existingProfile = await ProfileService.getProfileBySupabaseId(supabaseId)

    if (existingProfile) {
      return NextResponse.json({
        profile: existingProfile,
        isNew: false,
        message: 'Usuário já existe',
      })
    }

    // Criar novo perfil
    const profile = await ProfileService.createProfile({
      supabaseId,
      username: username || email?.split('@')[0],
      avatarUrl,
    })

    // Criar trial de 7 dias
    const subscription = await SubscriptionService.createTrialSubscription(profile.id)

    // Buscar perfil com subscription atualizada
    const updatedProfile = await ProfileService.getProfileById(profile.id)

    return NextResponse.json({
      profile: updatedProfile,
      subscription,
      isNew: true,
      message: 'Usuário criado com sucesso! Trial de 7 dias ativado.',
    }, { status: 201 })

  } catch (error: any) {
    console.error('Erro ao fazer onboarding:', error)
    return NextResponse.json(
      { error: 'Erro ao criar usuário', details: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const supabaseId = searchParams.get('supabaseId')

    if (!supabaseId) {
      return NextResponse.json(
        { error: 'supabaseId é obrigatório' },
        { status: 400 }
      )
    }

    const profile = await ProfileService.getProfileBySupabaseId(supabaseId)

    if (!profile) {
      return NextResponse.json(
        { error: 'Perfil não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se subscription está ativa
    const isActive = await SubscriptionService.isSubscriptionActive(profile.id)

    return NextResponse.json({
      profile,
      subscriptionActive: isActive,
    })

  } catch (error: any) {
    console.error('Erro ao buscar perfil:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar perfil', details: error.message },
      { status: 500 }
    )
  }
}
