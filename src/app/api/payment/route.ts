import { NextRequest, NextResponse } from 'next/server'
import { SubscriptionService } from '@/services/SubscriptionService/SubscriptionService'
import { AbacatePayService } from '@/services/AbacatePayService/AbacatePayService'
import { getAuthenticatedProfile } from '@/lib/supabase/authenticated-profile'
import { z } from 'zod'

const paymentBodySchema = z.object({
  customer: z.object({
    name: z.string().trim().min(1),
    email: z.string().email(),
    cellphone: z.string().trim().min(1),
    taxId: z.string().trim().min(1),
  }),
})

/**
 * API para processar pagamento via AbacatePay (PIX)
 */
export async function POST(request: NextRequest) {
  try {
    const body = paymentBodySchema.parse(await request.json())
    const { customer } = body
    const profile = await getAuthenticatedProfile()
    if (!profile) return NextResponse.json({ error: 'Não autenticado ou perfil não encontrado' }, { status: 401 })

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

    // Retornar dados da cobrança (incluindo QR Code PIX)
    return NextResponse.json({
      success: true,
      billing: paymentQrCodeResponse.data,
      message: 'Cobrança PIX criada com sucesso!',
    }, { status: 200 })

  } catch (error: any) {
    console.error('Erro ao processar pagamento:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados de pagamento inválidos' }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Erro ao processar pagamento' },
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
    const billingId = searchParams.get('billingId')
    const profile = await getAuthenticatedProfile()
    if (!profile) return NextResponse.json({ error: 'Não autenticado ou perfil não encontrado' }, { status: 401 })

    if (billingId) {
      // Verificar status do QR Code PIX na AbacatePay
      const result = await AbacatePayService.checkPixStatus(billingId)
      
      if (!result.success || !result.data) {
        return NextResponse.json(
          { error: 'Erro ao verificar cobrança', details: result.error },
          { status: 500 }
        )
      }

      if (result.data.metadata?.externalId !== profile.id) {
        return NextResponse.json({ error: 'Cobrança não pertence ao usuário autenticado' }, { status: 403 })
      }

      return NextResponse.json({
        billing: result.data,
        isPaid: result.data.status === 'PAID',
      })
    }

    if (!billingId) {
      const subscription = await SubscriptionService.getSubscriptionByProfileId(profile.id)

      return NextResponse.json({
        subscription,
        needsPayment: subscription?.status === 'PENDING',
        isActive: subscription?.status === 'ACTIVE',
      })
    }

    return NextResponse.json(
      { error: 'billingId é obrigatório' },
      { status: 400 }
    )

  } catch (error: any) {
    console.error('Erro ao verificar pagamento:', error)
    return NextResponse.json(
      { error: 'Erro ao verificar pagamento' },
      { status: 500 }
    )
  }
}
