import { NextRequest, NextResponse } from 'next/server'
import { SubscriptionService } from '@/services/SubscriptionService/SubscriptionService'
import { ProfileService } from '@/services/ProfileService/ProfileService'
import { AbacatePayService } from '@/services/AbacatePayService/AbacatePayService'

/**
 * API para processar pagamento via AbacatePay (PIX)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { supabaseId, customer } = body

    if (!supabaseId) {
      return NextResponse.json(
        { error: 'supabaseId é obrigatório' },
        { status: 400 }
      )
    }

    if (!customer || !customer.name || !customer.email) {
      return NextResponse.json(
        { error: 'Dados do cliente são obrigatórios (name, email)' },
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

    // Buscar plano
    const plan = await SubscriptionService.getProfessionalPlan()

    // Criar qrCode pix via AbacatePay
    const paymentQrCodeResponse = await AbacatePayService.createQrCodePix(
      {
        amount: Math.round(Number(plan.price) * 100), // convert to cents
        expiresIn: 900, // 15 minutos
        description: plan.description || 'Assinatura Professional',
        customer: {
          name: customer.name,
          cellphone: customer.cellphone,
          email: customer.email,
          taxId: customer.taxId,
          profileId: profile.id,
        },
        metadata: {
          externalId: profile.id,
        }
      }
    )

    if (!paymentQrCodeResponse.success) {
      return NextResponse.json(
        { error: 'Erro ao criar cobrança', details: paymentQrCodeResponse.error },
        { status: 500 }
      )
    }

    console.log('Cobrança PIX criada com sucesso: ', JSON.stringify(paymentQrCodeResponse.data))


    // Retornar dados da cobrança (incluindo QR Code PIX)
    return NextResponse.json({
      success: true,
      billing: paymentQrCodeResponse.data,
      message: 'Cobrança PIX criada com sucesso!',
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
    const billingId = searchParams.get('billingId')

    if (billingId) {
      // Verificar status do QR Code PIX na AbacatePay
      const result = await AbacatePayService.checkPixStatus(billingId)
      
      if (!result.success || !result.data) {
        return NextResponse.json(
          { error: 'Erro ao verificar cobrança', details: result.error },
          { status: 500 }
        )
      }

      return NextResponse.json({
        billing: result.data,
        isPaid: result.data.status === 'PAID',
      })
    }

    if (supabaseId) {
      // Verificar subscription do usuário
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
    }

    return NextResponse.json(
      { error: 'supabaseId ou billingId é obrigatório' },
      { status: 400 }
    )

  } catch (error: any) {
    console.error('Erro ao verificar pagamento:', error)
    return NextResponse.json(
      { error: 'Erro ao verificar pagamento', details: error.message },
      { status: 500 }
    )
  }
}
