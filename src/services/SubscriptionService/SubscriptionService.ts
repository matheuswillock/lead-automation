import { PrismaClient, SubscriptionStatus } from '@prisma/client'

const prisma = new PrismaClient()

export interface CreateSubscriptionInput {
  profileId: string
  subscriptionPlanId: string
  currentPeriodStart: Date
  currentPeriodEnd: Date
  status?: SubscriptionStatus
}

export class SubscriptionService {
  /**
   * Busca o plano Professional (único plano disponível)
   */
  static async getProfessionalPlan() {
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { name: 'Professional' },
    })

    if (!plan) {
      throw new Error('Plano Professional não encontrado. Execute o seed do banco de dados.')
    }

    return plan
  }

  /**
   * Cria uma assinatura PENDING aguardando pagamento
   * Usada quando usuário se cadastra mas ainda não pagou
   */
  static async createPendingSubscription(profileId: string) {
    const plan = await this.getProfessionalPlan()
    
    const now = new Date()
    const periodEnd = new Date()
    periodEnd.setDate(periodEnd.getDate() + 30) // 30 dias após pagamento

    const subscription = await prisma.subscription.create({
      data: {
        profileId,
        subscriptionPlanId: plan.id,
        status: 'PENDING',
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
      },
      include: {
        plan: true,
        profile: true,
      },
    })

    return subscription
  }

  /**
   * Ativa assinatura após confirmação de pagamento
   */
  static async activateSubscription(profileId: string) {
    const plan = await this.getProfessionalPlan()
    
    const now = new Date()
    const periodEnd = new Date()
    periodEnd.setDate(periodEnd.getDate() + 30) // 30 dias

    // Verificar se já existe subscription
    const existing = await prisma.subscription.findUnique({
      where: { profileId },
    })

    if (existing) {
      // Atualizar subscription existente
      return prisma.subscription.update({
        where: { profileId },
        data: {
          status: 'ACTIVE',
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
        },
        include: {
          plan: true,
          profile: true,
        },
      })
    }

    // Criar nova subscription ativa
    return prisma.subscription.create({
      data: {
        profileId,
        subscriptionPlanId: plan.id,
        status: 'ACTIVE',
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
      },
      include: {
        plan: true,
        profile: true,
      },
    })
  }

  /**
   * Verifica se a assinatura está ativa e válida
   */
  static async isSubscriptionActive(profileId: string): Promise<boolean> {
    const subscription = await prisma.subscription.findUnique({
      where: { profileId },
    })

    if (!subscription) return false
    if (subscription.status !== 'ACTIVE') return false

    const now = new Date()
    return subscription.currentPeriodEnd > now
  }

  /**
   * Ativar uma assinatura pendente usando supabaseId
   * IMPORTANTE: Recebe supabaseId (UUID do Supabase Auth), não profileId
   */
  static async activatePendingSubscription(supabaseId: string) {
    // 1. Buscar profile usando supabaseId
    const profile = await prisma.profile.findUnique({
      where: { supabaseId },
    })

    if (!profile) {
      throw new Error('Perfil não encontrado')
    }

    // 2. Buscar subscription usando o profileId correto
    const subscription = await prisma.subscription.findUnique({
      where: { profileId: profile.id },
      include: {
        plan: true,
      },
    })

    if (!subscription) {
      throw new Error('Assinatura não encontrada')
    }

    if (subscription.status !== 'PENDING') {
      throw new Error(`Assinatura não está pendente. Status atual: ${subscription.status}`)
    }

    // 3. Ativar subscription
    const now = new Date()
    const periodEnd = new Date()
    periodEnd.setDate(periodEnd.getDate() + 30) // 30 dias

    return prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'ACTIVE',
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
      },
      include: {
        plan: true,
        profile: true,
      },
    })
  }

  /**
   * Busca subscription por profileId
   */
  static async getSubscriptionByProfileId(profileId: string) {
    return prisma.subscription.findUnique({
      where: { profileId },
      include: {
        plan: true,
        profile: true,
      },
    })
  }

  /**
   * Cancela assinatura
   */
  static async cancelSubscription(profileId: string) {
    return prisma.subscription.update({
      where: { profileId },
      data: {
        status: 'CANCELLED',
      },
      include: {
        plan: true,
        profile: true,
      },
    })
  }

  /**
   * Marca assinatura como expirada
   */
  static async expireSubscription(profileId: string) {
    return prisma.subscription.update({
      where: { profileId },
      data: {
        status: 'EXPIRED',
      },
      include: {
        plan: true,
        profile: true,
      },
    })
  }

  /**
   * Renova assinatura (adiciona 30 dias)
   */
  static async renewSubscription(profileId: string) {
    const existing = await prisma.subscription.findUnique({
      where: { profileId },
    })

    if (!existing) {
      throw new Error('Assinatura não encontrada')
    }

    const newEnd = new Date(existing.currentPeriodEnd)
    newEnd.setDate(newEnd.getDate() + 30)

    return prisma.subscription.update({
      where: { profileId },
      data: {
        status: 'ACTIVE',
        currentPeriodEnd: newEnd,
      },
      include: {
        plan: true,
        profile: true,
      },
    })
  }
}
