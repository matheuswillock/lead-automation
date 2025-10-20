import { NextRequest, NextResponse } from 'next/server'
import { SubscriptionService } from '@/services/SubscriptionService/SubscriptionService'
import { ProfileService } from '@/services/ProfileService/ProfileService'

/**
 * API para processar pagamento e ativar assinatura
 * Por enquanto apenas simula, depois integrará com gateway de pagamento
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { supabaseId, paymentMethod, paymentData } = body

    if (!supabaseId) {
      return NextResponse.json(
        { error: 'supabaseId é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar perfil
    const profile = await ProfileService.getProfileBySupabaseId(supabaseId)

    if (!profile) {
      return NextResponse.json(
        { error: 'Perfil não encontrado' },
        { status: 404 }
      )
    }

    // TODO: Integrar com gateway de pagamento (Stripe, Mercado Pago, etc)
    // Por enquanto, apenas ativa direto
    
    // Aqui viria a lógica de:
    // 1. Processar pagamento com gateway
    // 2. Validar resposta do gateway
    // 3. Se aprovado, ativar subscription

    // Simulando aprovação de pagamento
    const paymentApproved = true

    if (!paymentApproved) {
      return NextResponse.json(
        { error: 'Pagamento não aprovado', needsPayment: true },
        { status: 402 }
      )
    }

    // Ativar assinatura
    const subscription = await SubscriptionService.activateSubscription(profile.id)

    // Buscar perfil atualizado
    const updatedProfile = await ProfileService.getProfileById(profile.id)

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
      subscription,
      message: 'Pagamento processado e assinatura ativada com sucesso!',
    }, { status: 200 })

  } catch (error: any) {
    console.error('Erro ao processar pagamento:', error)
    return NextResponse.json(
      { error: 'Erro ao processar pagamento', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * GET para verificar status do pagamento
 */
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

    const subscription = await SubscriptionService.getSubscriptionByProfileId(profile.id)

    return NextResponse.json({
      subscription,
      needsPayment: subscription?.status === 'PENDING',
      isActive: subscription?.status === 'ACTIVE',
    })

  } catch (error: any) {
    console.error('Erro ao verificar pagamento:', error)
    return NextResponse.json(
      { error: 'Erro ao verificar pagamento', details: error.message },
      { status: 500 }
    )
  }
}
