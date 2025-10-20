import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface CreateSubscriptionInput {
  profileId: string
  subscriptionPlanId: string
  currentPeriodStart: Date
  currentPeriodEnd: Date
}

export class SubscriptionService {
  /**
   * Cria uma nova assinatura para um perfil
   */
  static async createSubscription(input: CreateSubscriptionInput) {
    const subscription = await prisma.subscription.create({
      data: {
        profileId: input.profileId,
        subscriptionPlanId: input.subscriptionPlanId,
        status: true,
        currentPeriodStart: input.currentPeriodStart,
        currentPeriodEnd: input.currentPeriodEnd,
      },
      include: {
        plan: true,
        profile: true,
      },
    })

    return subscription
  }

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
   * Ativa trial de 7 dias para novo usuário
   */
  static async createTrialSubscription(profileId: string) {
    const plan = await this.getProfessionalPlan()
    
    const now = new Date()
    const trialEnd = new Date()
    trialEnd.setDate(trialEnd.getDate() + 7) // 7 dias de trial

    return this.createSubscription({
      profileId,
      subscriptionPlanId: plan.id,
      currentPeriodStart: now,
      currentPeriodEnd: trialEnd,
    })
  }

  /**
   * Ativa assinatura paga (30 dias)
   */
  static async activatePaidSubscription(profileId: string) {
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
          status: true,
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
        },
        include: {
          plan: true,
          profile: true,
        },
      })
    }

    // Criar nova subscription
    return this.createSubscription({
      profileId,
      subscriptionPlanId: plan.id,
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
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
    if (!subscription.status) return false

    const now = new Date()
    return subscription.currentPeriodEnd > now
  }

  /**
   * Cancela assinatura
   */
  static async cancelSubscription(profileId: string) {
    return prisma.subscription.update({
      where: { profileId },
      data: {
        status: false,
      },
      include: {
        plan: true,
        profile: true,
      },
    })
  }
}
