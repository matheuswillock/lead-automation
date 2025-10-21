import { NextRequest, NextResponse } from 'next/server'
import { SubscriptionService } from '@/services/SubscriptionService/SubscriptionService'
import { ProfileService } from '@/services/ProfileService/ProfileService'

/**
 * Webhook da AbacatePay para notificações de pagamento
 * 
 * Eventos que podem ser recebidos:
 * - billing.paid - Cobrança foi paga
 * - billing.refunded - Cobrança foi reembolsada
 * - billing.expired - Cobrança expirou
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('Webhook AbacatePay recebido:', body)

    const { event, data } = body

    // Validar webhook (em produção, verificar assinatura)
    // const signature = request.headers.get('x-abacatepay-signature')
    // if (!validateSignature(signature, body)) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    // }

    switch (event) {
      case 'billing.paid':
        await handleBillingPaid(data)
        break
      
      case 'billing.refunded':
        await handleBillingRefunded(data)
        break
      
      case 'billing.expired':
        await handleBillingExpired(data)
        break
      
      default:
        console.log('Evento não tratado:', event)
    }

    return NextResponse.json({ received: true })

  } catch (error: any) {
    console.error('Erro ao processar webhook:', error)
    return NextResponse.json(
      { error: 'Erro ao processar webhook', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * Processa pagamento confirmado
 */
async function handleBillingPaid(data: any) {
  try {
    const { metadata, id: billingId } = data
    const { profileId } = metadata

    if (!profileId) {
      console.error('profileId não encontrado no metadata')
      return
    }

    // Buscar profile
    const profile = await ProfileService.getProfileById(profileId)
    
    if (!profile) {
      console.error('Profile não encontrado:', profileId)
      return
    }

    // Ativar assinatura
    const subscription = await SubscriptionService.activateSubscription(profile.id)

    console.log('Assinatura ativada com sucesso:', subscription.id)
    console.log('Billing ID:', billingId)

    // TODO: Enviar email de confirmação para o usuário
    // await EmailService.sendSubscriptionActivated(profile.email, subscription)

  } catch (error) {
    console.error('Erro ao processar pagamento:', error)
    throw error
  }
}

/**
 * Processa reembolso
 */
async function handleBillingRefunded(data: any) {
  try {
    const { metadata } = data
    const { profileId } = metadata

    if (!profileId) {
      console.error('profileId não encontrado no metadata')
      return
    }

    // Cancelar assinatura
    const profile = await ProfileService.getProfileById(profileId)
    
    if (!profile || !profile.subscription) {
      console.error('Profile ou subscription não encontrado')
      return
    }

    await SubscriptionService.cancelSubscription(profile.subscription.id)

    console.log('Assinatura cancelada por reembolso')

    // TODO: Enviar email de notificação
    // await EmailService.sendSubscriptionRefunded(profile.email)

  } catch (error) {
    console.error('Erro ao processar reembolso:', error)
    throw error
  }
}

/**
 * Processa expiração de cobrança
 */
async function handleBillingExpired(data: any) {
  try {
    const { metadata } = data
    const { profileId } = metadata

    if (!profileId) {
      console.error('profileId não encontrado no metadata')
      return
    }

    console.log('Cobrança expirada para profileId:', profileId)

    // TODO: Notificar usuário sobre expiração
    // await EmailService.sendBillingExpired(profile.email)

  } catch (error) {
    console.error('Erro ao processar expiração:', error)
    throw error
  }
}
