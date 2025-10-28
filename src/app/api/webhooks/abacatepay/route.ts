import { NextRequest, NextResponse } from 'next/server'
import { SubscriptionService } from '@/services/SubscriptionService/SubscriptionService'
import { ProfileService } from '@/services/ProfileService/ProfileService'
import crypto from 'crypto'
import { stringFromBase64URL } from '@supabase/ssr';
import { stringify } from 'querystring';

interface AbacatePayWebhookPaidBody {
  id: string
  event: string
  data: AbacatePayWebhookPaidData
  devMode: boolean
}

interface AbacatePayWebhookPaidData {
  pixQrCode: {
    id: string
    customer: AbacatePayWebhookCustomer
    amount: number
    kind: string
    status: string
    metadata: {
      externalId: string
    }
  },
  payment: AbacatePayWebhookPayment
}

interface AbacatePayWebhookCustomer {
  id: string,
  metadata: AbacatePayWebhookCustomerMetadata
}

interface AbacatePayWebhookCustomerMetadata {
  name: string,
  cellphone: string,
  taxId: string,
  email: string,
  zipCode: string  
}

interface AbacatePayWebhookPayment {
  amount: number,
  fee: number,
  method: string
}

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
    const { searchParams } = new URL(request.url);
    const webhookSecret = searchParams.get('webhookSecret');
    const body: AbacatePayWebhookPaidBody = await request.json();

    // Validar webhookSecret enviado como parâmetro na URL
    if (!validateWebhookSecret(webhookSecret)) {
      return NextResponse.json({ error: 'Invalid webhook secret' }, { status: 401 });
    }

    const { event, data } = body;

    switch (event) {
      case 'billing.paid':
        await handleBillingPaid(data);
        break;

      case 'billing.refunded':
        await handleBillingRefunded(data);
        break;

      case 'billing.expired':
        await handleBillingExpired(data);
        break;

      default:
        // Evento não tratado - apenas registrar
        console.warn('Evento não tratado:', event);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Erro ao processar webhook:', error);
    return NextResponse.json(
      { error: 'Erro ao processar webhook', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Processa pagamento confirmado
 */
async function handleBillingPaid(body: AbacatePayWebhookPaidData) {
  try {
    const { externalId } = body.pixQrCode.metadata;

    if (!externalId) {
      console.error('externalId não encontrado no metadata')
      return
    }

    // Buscar profile
    const profile = await ProfileService.getProfileById(externalId)
    
    if (!profile) {
      console.error('Profile não encontrado:', externalId)
      return
    }

    // Ativar assinatura
    const subscription = await SubscriptionService.activateSubscription(profile.id)

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

    console.warn('Cobrança expirada para profileId:', profileId)

    // TODO: Notificar usuário sobre expiração
    // await EmailService.sendBillingExpired(profile.email)

  } catch (error) {
    console.error('Erro ao processar expiração:', error)
    throw error
  }
}

function validateWebhookSecret(webhookSecret: string | null): boolean {
  if (!webhookSecret) return false;

  const secret = process.env.ABACATEPAY_WEBHOOK_SECRET!;
  return webhookSecret === secret;
}
