import { SubscriptionService } from "@/services/SubscriptionService/SubscriptionService"
import { getAuthenticatedProfile } from '@/lib/supabase/authenticated-profile'

export async function POST(request: Request) {
  const profile = await getAuthenticatedProfile()
  if (!profile?.supabaseId) return new Response('Não autenticado ou perfil não encontrado', { status: 401 })

  const result = await SubscriptionService.activatePendingSubscription(profile.supabaseId)

  if (!result) {
    return new Response('Assinatura não encontrada ou não está pendente', { status: 404 })
  }

  return Response.json({ 
    success: true, 
    subscription: result,
    message: 'Assinatura ativada com sucesso!' 
  }, { status: 200 })
}
