import { SubscriptionService } from "@/services/SubscriptionService/SubscriptionService"

export async function POST(request: Request) {
  const { profileId } = await request.json()

  const result = await SubscriptionService.activatePendingSubscription(profileId)

  if (!result) {
    return new Response('Assinatura não encontrada ou não está pendente', { status: 404 })
  }

  return Response.json({ 
    success: true, 
    subscription: result,
    message: 'Assinatura ativada com sucesso!' 
  }, { status: 200 })
}
